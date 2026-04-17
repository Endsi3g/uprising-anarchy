import { NextRequest, NextResponse } from "next/server";
import { askAssistant } from "@/lib/ai/claude";

export async function POST(req: NextRequest) {
  const { question, context } = await req.json();
  if (!question)
    return NextResponse.json({ error: "question requise" }, { status: 400 });
  try {
    const answer = await askAssistant(question, context);
    return NextResponse.json({ answer });
  } catch (e) {
    return NextResponse.json(
      { error: "IA indisponible", details: String(e) },
      { status: 500 }
    );
  }
}
