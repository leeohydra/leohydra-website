"use client";

import { useEffect } from "react";
import { lastKnownMousePosition } from "@/lib/mousePosition";

export default function MousePositionTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      lastKnownMousePosition.x = e.clientX;
      lastKnownMousePosition.y = e.clientY;
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);
  return null;
}
