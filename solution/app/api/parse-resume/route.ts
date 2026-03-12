import { NextRequest, NextResponse } from "next/server";
import { parseResumeSkills } from "@/lib/resumeParser";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // pdf-parse v1.1.1 — loaded dynamically to ensure Node.js runtime resolution
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (
      buffer: Buffer
    ) => Promise<{ text: string; numpages: number }>;

    const formData = await request.formData();
    const file = formData.get("resume") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please attach a PDF with key 'resume'." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    // Read file into a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text using pdf-parse
    const data = await pdfParse(buffer);
    const rawText = data.text;

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from the PDF. Try a text-based PDF." },
        { status: 422 }
      );
    }

    // Detect skills
    const skills = parseResumeSkills(rawText);

    return NextResponse.json({
      skills,
      pageCount: data.numpages,
      characterCount: rawText.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[parse-resume]", message);
    return NextResponse.json(
      { error: `Failed to parse resume: ${message}` },
      { status: 500 }
    );
  }
}
