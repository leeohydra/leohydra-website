import ContactForm from "@/components/ContactForm";

export default function RequestCatalogue() {
  return (
    <div className="min-h-screen">
      <div className="container-reading py-20 lg:py-24 space-y-20">
        <div className="animate-fade-in">
          <h1>Request Catalogue</h1>
        </div>
        <div className="animate-slide-up">
        <ContactForm intent="CATALOGUE_REQUEST" />

        </div>
      </div>
    </div>
  );
}
