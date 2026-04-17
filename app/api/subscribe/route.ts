import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { sendWelcomeEmail } from "@/lib/resend";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if duplicate
    const existing = await db.query.subscribers.findFirst({
      where: eq(subscribers.email, email),
    });

    if (existing) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    // Add to DB
    await db.insert(subscribers).values({ email });

    // Send email via Resend
    await sendWelcomeEmail(email);

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
