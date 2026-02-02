"use client";

import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";
import { artworks } from "@/lib/artworks";

export default function OriginalArtworks() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefcf8] via-[#faf8f3] to-[#f5f3ed]">
      <div className="container-artwork py-20 lg:py-32">
        {/* Artwork List - Content Adaptive Spacing */}
        <div className="mt-8 lg:mt-8 space-y-40 mb-32">

          {artworks.map((artwork, index) => (
            <ArtworkCard key={artwork.slug} artwork={artwork} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center pt-8 pb-16">
          <div className="text-center">
            <Link 
              href="/request-catalogue" 
              className="inline-block px-10 py-4 bg-[#7c2d3f] text-[#fefcf8] font-medium text-sm tracking-wide hover:bg-[#8b2635] transition-all duration-300 border border-[#7c2d3f] hover:shadow-lg"
            >
              Request Catalogue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
