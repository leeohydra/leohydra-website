"use client";

import { useState } from "react";

interface ContactFormProps {
  intent: "GENERAL_CONTACT" | "ARTWORK_INQUIRY" | "CATALOGUE_REQUEST" | "PROJECT_REQUEST";
  artworkSlug?: string;
  artworkTitle?: string;
}


export default function ContactForm({ intent, artworkSlug, artworkTitle }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder submit handler
    console.log("Form submitted:", {
      ...formData,
      intent,
      artworkSlug,
      artworkTitle,
    });
    
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get context display text
  const getContextText = () => {
    if (intent === "ARTWORK_INQUIRY" && artworkTitle) {
      return `Artwork Inquiry: ${artworkTitle}`;
    } else if (intent === "CATALOGUE_REQUEST") {
      return "Catalogue Request";
    } else if (intent === "PROJECT_REQUEST") {
      return "Project / Custom Print Request";
    }
    return "General Contact";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Context field - Visible and non-editable */}
      {(intent !== "GENERAL_CONTACT") && (
        <div>
          <label htmlFor="context" className="sr-only">
            Context
          </label>
          <input
            type="text"
            id="context"
            name="context"
            value={getContextText()}
            readOnly
            className="w-full px-4 py-3 bg-white border border-[#d4c9b8] text-[#475569] cursor-not-allowed text-sm"

          />
        </div>
      )}

      {/* Hidden fields for form processing */}
      <input
        type="hidden"
        name="context"
        value={getContextText()}
      />
      {artworkSlug && (
        <input
          type="hidden"
          name="artworkSlug"
          value={artworkSlug}
        />
      )}

      {/* Name and Email Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Name"
            className="w-full px-4 py-3 bg-white border border-[#d4c9b8] text-[#0f172a] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c2d3f] transition-colors text-sm"

            
          />
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="E-mail"
            className="w-full px-4 py-3 bg-white border border-[#d4c9b8] text-[#0f172a] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c2d3f] transition-colors text-sm"

          />
        </div>
      </div>

      {/* Country Field */}
      <div>
        <label htmlFor="country" className="sr-only">
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          placeholder="Country"
          className="w-full px-4 py-3 bg-white border border-[#d4c9b8] text-[#0f172a] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c2d3f] transition-colors text-sm"

        />
      </div>

      {/* Message Textarea */}
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Message"
          className="w-full px-4 py-3 bg-white border border-[#d4c9b8] text-[#0f172a] placeholder:text-[#64748b] focus:outline-none focus:border-[#7c2d3f] transition-colors text-sm"

        />
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full px-8 py-3 bg-[#7c2d3f] text-[#fefcf8] font-medium text-sm tracking-wide hover:bg-[#8b2635] transition-colors"
        >
          Send message
        </button>
      </div>
    </form>
  );
}
