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
      return NextResponse.json({ error: "没有上传文件" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "暂不支持这个文件类型" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "文件大小需要小于 10MB" },
        { status: 400 }
      );
    }

    const extractedText = file.type === "text/plain" ? await file.text() : null;
    const isTextFile = Boolean(extractedText);

    return NextResponse.json({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      status: isTextFile ? "TEXT_EXTRACTED" : "UNSUPPORTED_ANALYSIS",
      extractedText,
      textExtractionAvailable: isTextFile,
      analysisAvailable: false,
      message: extractedText
        ? "已成功提取文本，但规则分析和证据结构化还未接入。"
        : "暂不支持 PDF/图片 OCR 和深度文件分析。请先改用文字描述，或上传纯文本内容。",
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "文件上传失败" },
      { status: 500 }
    );
  }
}
