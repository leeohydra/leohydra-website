import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

// Duplicate protection: in-memory store (key -> timestamp of first submission)
const recentSubmissions = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 60 * 1000; // 60 seconds

function duplicateKey(body: {
  email: string;
  intent: string;
  message: string;
}): string {
  const normalized = [
    (body.email || "").trim().toLowerCase(),
    (body.intent || "").trim(),
    (body.message || "").trim(),
  ].join("|");
  return normalized;
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, ts] of recentSubmissions.entries()) {
    if (now - ts > DUPLICATE_WINDOW_MS) {
      recentSubmissions.delete(key);
    }
  }
}

function humanReadableIntent(intent: string): string {
  switch (intent) {
    case "ARTWORK_INQUIRY":
      return "Artwork Inquiry";
    case "CATALOGUE_REQUEST":
      return "Catalogue Request";
    case "PROJECT_REQUEST":
      return "Project Request";
    case "GENERAL_CONTACT":
      return "General Contact";
    default:
      return intent;
  }
}

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    country?: string;
    message?: string;
    intent?: string;
    artworkSlug?: string;
    artworkTitle?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const { name, email, country, message, intent, artworkTitle } = body;

  // Validate required fields
  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }
  const MESSAGE_MAX_LENGTH = 150;  // Maximum length of the message , this number is visible on frontend near the message input field, 
                                  // to change the limit reduce the same variable from the routes.ts file in contact folder
  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }
  if (message.trim().length > MESSAGE_MAX_LENGTH) {
    return NextResponse.json(
      { error: "Message must be 250 characters or fewer. Please shorten your message." },
      { status: 400 }
    );
  }
  if (!intent || typeof intent !== "string" || !intent.trim()) {
    return NextResponse.json(
      { error: "Intent is required" },
      { status: 400 }
    );
  }

  const key = duplicateKey({ email: email.trim(), intent: intent.trim(), message: message.trim() });
  cleanupOldEntries();
  const existing = recentSubmissions.get(key);
  const now = Date.now();
  if (existing != null && now - existing < DUPLICATE_WINDOW_MS) {
    return NextResponse.json({ success: true, duplicate: true });
  }
  recentSubmissions.set(key, now);

  // Persist lead before sending email
  const { data: lead, error: insertError } = await supabase
    .from("leads")
    .insert({
      name: name.trim(),
      email: email.trim(),
      country: country != null && String(country).trim() ? String(country).trim() : null,
      message: message.trim(),
      intent: intent.trim(),
      artwork_title: artworkTitle != null && String(artworkTitle).trim() ? String(artworkTitle).trim() : null,
      email_sent: false,
    })
    .select("id")
    .single();

  if (insertError || !lead?.id) {
    recentSubmissions.delete(key);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    );
  }

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Contact <onboarding@resend.dev>";

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 }
    );
  }
  if (!toEmail) {
    return NextResponse.json(
      { error: "Recipient email not configured" },
      { status: 500 }
    );
  }

  const subject = `New inquiry — ${humanReadableIntent(intent)}`;


  const textBody = [
    "Name: " + name.trim(),
    "Email: " + email.trim(),
    "Country: " + (country != null && String(country).trim() ? String(country).trim() : "—"),
    "Intent: " + humanReadableIntent(intent),
    ...(artworkTitle?.trim() ? ["Artwork title: " + artworkTitle.trim()] : []),
    "",
    "Message:",
    message.trim(),
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject,
      text: textBody,
    });

    if (error) {
      recentSubmissions.delete(key);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 500 }
      );
    }

    await supabase
      .from("leads")
      .update({ email_sent: true })
      .eq("id", lead.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    recentSubmissions.delete(key);
    const message = err instanceof Error ? err.message : "Failed to send email";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
