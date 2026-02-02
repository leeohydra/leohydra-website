"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Artwork } from "@/lib/artworks";

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
}

export default function ArtworkCard({ artwork, index }: ArtworkCardProps) {
  /* --------------------------------
     Intersection animation
  -------------------------------- */
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Alternate layout for visual interest
  const isAlternate = index % 2 === 1;

  const imageDelay = index * 0.1;
  const textDelay = index * 0.1 + 0.08;

  return (
    <div
      ref={cardRef}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
    >

      {/* --------------------------------
          Image (staggered reveal + hover overlay)
      -------------------------------- */}
      <div
        className={`${isVisible ? "animate-slide-up" : "opacity-0"} ${
          isAlternate ? "lg:col-start-7 lg:col-end-13 lg:order-last" : "lg:col-start-1 lg:col-end-7"
        }`}
        style={{ animationDelay: `${imageDelay}s` }}
      >
        <Link
          href={`/artworks/${artwork.slug}`}
          className="group relative w-full aspect-[4/5] bg-gradient-to-br from-[#0f172a] to-[#1e293b] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_rgba(124,45,63,0.15)] block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c2d3f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f3] focus-visible:rounded-sm"
          style={{
            border: "1px solid rgba(212, 201, 184, 0.2)",
          }}
          aria-label={`View ${artwork.title}`}
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            draggable={false}
          />
          {/* Hover overlay: "View artwork" */}
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#0f172a]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-hidden
          >
            <span className="text-[#fefcf8] text-xs tracking-[0.2em] uppercase font-medium">
              View artwork
            </span>
          </div>
        </Link>
      </div>

      {/* --------------------------------
          Text column (staggered reveal)
      -------------------------------- */}
      <div
        className={`max-w-lg space-y-8 lg:px-8 ${isVisible ? "animate-slide-up" : "opacity-0"} ${
          isAlternate ? "lg:col-start-1 lg:col-end-6 lg:order-first" : "lg:col-start-7 lg:col-end-13"
        }`}
        style={{ animationDelay: `${textDelay}s` }}
      >
        <div className={`flex items-center gap-4 lg:flex-col gap-2 ${
          isAlternate ? "lg:items-end" : "lg:items-start"
        }`}>
          <span className="text-xs font-medium tracking-widest uppercase text-[#7c2d3f]">
            {artwork.year}
          </span>
          <span className={`hidden lg:block h-px bg-gradient-to-r ${
            isAlternate 
              ? "w-12 from-transparent to-[#7c2d3f]" 
              : "w-12 from-[#7c2d3f] to-transparent"
          }`}></span>
        </div>

        <h2 className={`text-3xl lg:text-4xl font-light tracking-tight leading-tight text-[#0f172a] ${
          isAlternate ? "lg:text-right" : ""
        }`}>
          <Link
            href={`/artworks/${artwork.slug}`}
            className="hover:text-[#7c2d3f] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c2d3f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f3] focus-visible:rounded-sm rounded-sm"
          >
            {artwork.title}
          </Link>
        </h2>

        <div className={`space-y-4 pt-4 border-t border-[#d4c9b8] ${
          isAlternate ? "lg:text-right" : ""
        }`}>
          <p className="meta-text text-[#64748b] uppercase tracking-wider text-xs">Artwork Details</p>
          <div className="space-y-3">
            {artwork.description.map((line, idx) => (
              <p key={idx} className="leading-relaxed text-[#475569] text-sm">
                {line}
              </p>
            ))}
          </div>
        </div>

        <div className={`flex items-center gap-3 pt-2 ${
          isAlternate ? "lg:justify-end" : ""
        }`}>
          <span className="text-xs font-medium tracking-wider uppercase text-[#64748b]">Status:</span>
          <span className={`text-sm font-medium ${
            artwork.status === "Available" 
              ? "text-[#7c2d3f]" 
              : artwork.status === "Sold"
              ? "text-[#475569]"
              : "text-[#c9a961]"
          }`}>
            {artwork.status}
          </span>
        </div>

        {artwork.status === "Available" && (
          <Link
            href={`/inquire-artwork?artwork=${artwork.slug}&title=${encodeURIComponent(artwork.title)}`}
            className={`inline-block w-full lg:w-auto px-8 py-3 bg-[#7c2d3f] text-[#fefcf8] font-medium text-sm tracking-wide hover:bg-[#8b2635] transition-all duration-300 border border-[#7c2d3f] hover:shadow-lg text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c2d3f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f3] ${
              isAlternate ? "lg:ml-auto" : ""
            }`}
          >
            Inquire about this artwork
          </Link>
        )}

        {artwork.status === "Sold" && (
          <Link
            href="/request-catalogue"
            className={`inline-block text-sm text-[#7c2d3f] hover:text-[#8b2635] transition-colors border-b border-transparent hover:border-[#7c2d3f] pb-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7c2d3f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf8f3] rounded-sm ${
              isAlternate ? "lg:ml-auto" : ""
            }`}
          >
            Request Catalogue
          </Link>
        )}
      </div>
    </div>
  );
}
