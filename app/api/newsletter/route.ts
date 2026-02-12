export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  // Contact From must be a verified domain in Resend to deliver to any other addresses 
  // Using onboarding@resend.dev only delivers to Resend test addresses, not to real inboxes.
  // so before the website goes live verify the domain and use it in the .env.local file


  console.log("CONTACT_FROM_EMAIL:", process.env.CONTACT_FROM_EMAIL);
  console.log("RESEND_API_KEY EXISTS:", !!process.env.RESEND_API_KEY);

  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!fromEmail) {
    return NextResponse.json({ error: "Sender not configured" }, { status: 500 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email: email.toLowerCase(), source: "contact_page" });
  
  console.error("NEWSLETTER INSERT ERROR:", insertError);

  const alreadyExists = insertError?.code === "23505";
  if (insertError && !alreadyExists) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  const subject = "You're subscribed — LeoHydra";
  const textBody = `Thank you for subscribing.
You'll receive studio updates, releases, and exhibitions from time to time.

— LeoHydra`;

  const { error: sendError } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject,
    text: textBody,
  });

  if (sendError) {
  console.error("RESEND SEND ERROR:", sendError);
  return NextResponse.json(
    { error: sendError.message || "Failed to send confirmation" },
    { status: 500 }
  );
}


  return NextResponse.json({ success: true });
}
