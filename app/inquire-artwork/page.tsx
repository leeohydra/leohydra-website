"use client";

import { useSearchParams } from "next/navigation";
import ContactForm from "@/components/ContactForm";

export default function InquireArtwork() {
  const searchParams = useSearchParams();
  const artworkSlug = searchParams.get("artwork") || "unknown";
  const artworkTitle = searchParams.get("title") || null;

  return (
    <div className="min-h-screen">
      <div className="container-reading py-20 lg:py-24 space-y-20">
        <div className="animate-fade-in">
          <h1>Inquire About Artwork</h1>
        </div>
        <div className="animate-slide-up">
          <ContactForm 
            intent="ARTWORK_INQUIRY" 
            artworkSlug={artworkSlug}
            artworkTitle={artworkTitle || undefined}
          />
        </div>
      </div>
    </div>
  );
}
