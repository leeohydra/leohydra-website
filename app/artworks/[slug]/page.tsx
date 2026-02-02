import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtworkBySlug } from "@/lib/artworks";
import ArtworkImageWithMagnifier from "@/components/ArtworkImageWithMagnifier";

interface ArtworkDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { slug } = await params;
  const artwork = getArtworkBySlug(slug);

  if (!artwork) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefcf8] via-[#faf8f3] to-[#f5f3ed]">
      <div className="container-artwork py-20 lg:py-32">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Back link */}
          <Link
            href="/original-artworks"
            className="inline-block text-sm text-[#7c2d3f] hover:text-[#8b2635] transition-colors border-b border-transparent hover:border-[#7c2d3f] pb-1"
          >
            ← Original Artworks
          </Link>

          {/* Image: natural aspect ratio + magnifier on hover */}
          <div className="w-full">
            <ArtworkImageWithMagnifier src={artwork.image} alt={artwork.title} />
          </div>

          {/* Metadata (same structure as listing card) */}
          <div className="space-y-8 pt-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium tracking-widest uppercase text-[#7c2d3f]">
                {artwork.year}
              </span>
              <span className="w-12 h-px bg-gradient-to-r from-[#7c2d3f] to-transparent" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-light tracking-tight leading-tight text-[#0f172a]">
              {artwork.title}
            </h1>

            <div className="space-y-4 pt-4 border-t border-[#d4c9b8]">
              <p className="text-[#64748b] uppercase tracking-wider text-xs">Artwork Details</p>
              <div className="space-y-3">
                {artwork.description.map((line, idx) => (
                  <p key={idx} className="leading-relaxed text-[#475569] text-sm">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs font-medium tracking-wider uppercase text-[#64748b]">
                Status:
              </span>
              <span
                className={`text-sm font-medium ${
                  artwork.status === "Available"
                    ? "text-[#7c2d3f]"
                    : artwork.status === "Sold"
                      ? "text-[#475569]"
                      : "text-[#c9a961]"
                }`}
              >
                {artwork.status}
              </span>
            </div>

            {artwork.status === "Available" && (
              <Link
                href={`/inquire-artwork?artwork=${artwork.slug}&title=${encodeURIComponent(artwork.title)}`}
                className="inline-block px-8 py-3 bg-[#7c2d3f] text-[#fefcf8] font-medium text-sm tracking-wide hover:bg-[#8b2635] transition-all duration-300 border border-[#7c2d3f] hover:shadow-lg"
              >
                Inquire about this artwork
              </Link>
            )}

            {artwork.status === "Sold" && (
              <Link
                href="/request-catalogue"
                className="inline-block text-sm text-[#7c2d3f] hover:text-[#8b2635] transition-colors border-b border-transparent hover:border-[#7c2d3f] pb-1"
              >
                Request Catalogue
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
