import { NextRequest, NextResponse } from "next/server";
import { extractText, getDocumentProxy } from "unpdf";

export const runtime = "nodejs";

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

    const extractedText = await extractReadableText(file);
    const isTextFile = Boolean(extractedText);
    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    return NextResponse.json({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      status: getUploadStatus(file.type, extractedText),
      extractedText,
      textExtractionAvailable: isTextFile,
      analysisAvailable: false,
      message: buildUploadMessage({ extractedText, isPdf, isImage }),
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "文件上传失败" },
      { status: 500 }
    );
  }
}

async function extractReadableText(file: File) {
  if (file.type === "text/plain") {
    return normalizeExtractedText(await file.text());
  }

  if (file.type === "application/pdf") {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const { text } = await extractText(pdf, { mergePages: true });

    return normalizeExtractedText(text);
  }

  return null;
}

function normalizeExtractedText(text: string) {
  const normalized = text.replace(/\s+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return normalized.length > 0 ? normalized.slice(0, 16000) : null;
}

function getUploadStatus(fileType: string, extractedText: string | null) {
  if (extractedText && fileType === "application/pdf") return "PDF_TEXT_EXTRACTED";
  if (extractedText) return "TEXT_EXTRACTED";
  if (fileType === "application/pdf") return "PDF_REQUIRES_OCR";
  if (fileType.startsWith("image/")) return "IMAGE_OCR_NOT_CONFIGURED";
  return "UNSUPPORTED_ANALYSIS";
}

function buildUploadMessage({
  extractedText,
  isPdf,
  isImage,
}: {
  extractedText: string | null;
  isPdf: boolean;
  isImage: boolean;
}) {
  if (extractedText && isPdf) {
    return "已从 PDF 提取可复制文本。下一步可以接入工资单/合同字段结构化和规则分析；扫描版 PDF 仍需要 OCR。";
  }

  if (extractedText) {
    return "已成功提取文本，但规则分析和证据结构化还未接入。";
  }

  if (isPdf) {
    return "这个 PDF 没有可复制文本，可能是扫描件。需要启用并评估 OCR 后才能自动读取。";
  }

  if (isImage) {
    return "图片 OCR 尚未启用。为了避免误读工资、日期或 ABN，当前不会假装已经完成识别。";
  }

  return "暂不支持这个文件的深度分析。请先改用文字描述，或上传纯文本内容。";
}
