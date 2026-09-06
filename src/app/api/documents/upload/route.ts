import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "text/plain",
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const extractedText = file.type === "text/plain" ? await file.text() : null;

    return NextResponse.json({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      status: extractedText ? "EXTRACTED" : "UPLOADED",
      extractedText,
      analysisAvailable: Boolean(extractedText),
      message: extractedText
        ? "Text extracted successfully. Rule-based document analysis is the next implementation step."
        : "File received. PDF/image OCR and document analysis are not enabled in this MVP yet.",
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Document upload failed" },
      { status: 500 }
    );
  }
}
