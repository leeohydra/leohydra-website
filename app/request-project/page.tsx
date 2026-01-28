import ContactForm from "@/components/ContactForm";

export default function RequestProject() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-reading py-20 lg:py-24 space-y-20">
        {/* Page Title */}
        <div className="animate-fade-in">
          <h1 className="text-4xl font-semibold tracking-tight">
            Request Project
          </h1>
        </div>

        {/* Intro / Custom Print Explanation */}
        <div className="max-w-2xl space-y-6 animate-slide-up">
          <h2 className="text-xl font-medium">
            Looking for a specific size?
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Sometimes a space calls for a very specific presence. If the available
            print sizes do not quite fit your requirements, we can work together
            on a custom solution.
          </p>

          <p className="text-gray-600 leading-relaxed">
            We regularly handle custom print requests, including larger-than-usual
            formats. Our team will guide you toward the most suitable option based
            on your space, vision, and technical constraints.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Use the form below to describe your project or custom print request.
            Please include any relevant details such as preferred dimensions,
            placement environment, or reference works.
          </p>
        </div>

        {/* Inquiry Form */}
        <div className="animate-slide-up">
        <ContactForm intent="PROJECT_REQUEST" />

        </div>
      </div>
    </div>
  );
}
