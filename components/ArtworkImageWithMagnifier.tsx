"use client";

import { useEffect, useRef, useState } from "react";
import { lastKnownMousePosition } from "@/lib/mousePosition";

const ZOOM = 7.5;
const LENS_SIZE = 180;
const LENS_DELAY = 80;
const MAGNIFIER_MIN_WIDTH_PX = 768;

interface ArtworkImageWithMagnifierProps {
  src: string;
  alt: string;
}

export default function ArtworkImageWithMagnifier({ src, alt }: ArtworkImageWithMagnifierProps) {
  const [showLens, setShowLens] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enable magnifier only on viewports >= MAGNIFIER_MIN_WIDTH_PX (not mobile).
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${MAGNIFIER_MIN_WIDTH_PX}px)`);
    const handler = () => setMagnifierEnabled(mq.matches);
    setMagnifierEnabled(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // On mount (e.g. after navigating from listing), if the mouse is already over
  // the image, show the lens so zoom works without moving the cursor. Only when magnifier enabled.
  useEffect(() => {
    if (!magnifierEnabled) return;
    const el = containerRef.current;
    if (!el) return;
    const checkMouseInside = () => {
      const rect = el.getBoundingClientRect();
      const { x, y } = lastKnownMousePosition;
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        setCursor({
          x: x - rect.left,
          y: y - rect.top,
        });
        setShowLens(true);
      }
    };
    const raf = requestAnimationFrame(checkMouseInside);
    const t = setTimeout(checkMouseInside, 150);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [magnifierEnabled]);

  return (
    <div
      ref={containerRef}
      className="relative w-full inline-block"
      onMouseEnter={() => {
        if (!magnifierEnabled) return;
        timeoutRef.current = setTimeout(() => setShowLens(true), LENS_DELAY);
      }}
      onMouseLeave={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setShowLens(false);
      }}
      onMouseMove={(e) => {
        if (!magnifierEnabled || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setCursor({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-auto max-w-full block"
        draggable={false}
      />

      {magnifierEnabled && showLens && containerRef.current && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: cursor.x - LENS_SIZE / 2,
            top: cursor.y - LENS_SIZE / 2,
            borderRadius: "50%",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${ZOOM * 100}%`,
            backgroundPosition: `
              ${(cursor.x / containerRef.current.clientWidth) * 100}% 
              ${(cursor.y / containerRef.current.clientHeight) * 100}%
            `,
            WebkitMaskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            maskImage:
              "radial-gradient(circle, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.18)",
            animation: "lensPop 600ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
          }}
        />
      )}
    </div>
  );
}
