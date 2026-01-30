import ContactForm from "@/components/ContactForm";
import NewsletterForm from "@/components/NewsletterForm";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fefcf8] via-[#faf8f3] to-[#f5f3ed]">

      {/* Newsletter Section - Full Width Dark */}
      <section className="bg-[#0f172a] mt-8 lg:mt-8 py-16 lg:py-20 animate-slide-up">


        <div className="container-reading mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <p className="text-sm text-[#cbd5e1] uppercase tracking-wider font-light">
              Keep me updated
            </p>
            <h2 className="text-4xl lg:text-5xl font-light text-[#fefcf8] tracking-tight">
              Newsletter
            </h2>
            <p className="text-[#94a3b8] leading-relaxed max-w-md mx-auto">
              Join our mail list to be the first to know all our releases, events and
              exhibitions.
            </p>
            
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* Contact Section - Full Width Light */}
      <section className="py-12 lg:py-16 animate-slide-up" style={{ animationDelay: "0.1s" }}>

        <div className="container-reading mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-light text-[#0f172a] tracking-tight">
                Contact
              </h2>
            </div>
            <ContactForm intent="GENERAL_CONTACT" />
          </div>
        </div>
      </section>
    </div>
  );
}
