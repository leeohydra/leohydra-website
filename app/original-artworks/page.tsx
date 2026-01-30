"use client";

import Link from "next/link";
import ArtworkCard from "@/components/ArtworkCard";

const artworks = [
  {
    slug: "fractured_spectrum",
    // image: "https://via.placeholder.com/400x400",
    image: "/artworks/fractured_spectrum.jpg",

    status: "Available",
    year: "2024",
    title: "Fractured Spectrum",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "prisoner-of-the-sun",
    // image: "https://via.placeholder.com/400x400",
    image: "/artworks/pots.jpg",
    status: "Sold",
    year: "2023",
    title: "Prisoner Of The Sun",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "theg",
    // image: "https://via.placeholder.com/400x400",
    image: "/artworks/theG.jpg",
    status: "Available",
    year: "2024",
    title: "The G",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "artwork-4",
    image: "https://via.placeholder.com/400x400",
    status: "Reserved",
    year: "2022",
    title: "Artwork Four",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "artwork-5",
    image: "https://via.placeholder.com/400x400",
    status: "Available",
    year: "2025",
    title: "Artwork Five",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "artwork-6",
    image: "https://via.placeholder.com/400x400",
    status: "Sold",
    year: "2021",
    title: "Artwork Six",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
];

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
