"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSuccess(false);
        return;
      }
      setSuccess(true);
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-6">
      <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
        <label className="sr-only" htmlFor="newsletter-email">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 bg-[#1e293b] border border-[#334155] text-[#fefcf8] placeholder:text-[#64748b] focus:outline-none focus:border-[#475569] transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-[#7c2d3f] text-[#fefcf8] font-medium text-sm tracking-wide hover:bg-[#8b2635] transition-colors"
        >
          {isSubmitting ? "Subscribing…" : "Subscribe"}
        </button>
      </div>
      {success && (
        <p className="text-sm text-[#94a3b8] text-center mt-3 max-w-lg mx-auto">
          Thank you. You're subscribed.
        </p>
      )}
    </form>
  );
}
