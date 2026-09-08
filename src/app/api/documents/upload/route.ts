import { apiRoute, HttpError, readBody } from "@/lib/server/http";
import { extractPdf } from "@/services/documents/pdf";
export const runtime = "nodejs";
export const maxDuration = 20;
export const POST = apiRoute("document", async (request) => {
  const body = await readBody(request, 2_100_000);
  const parsedRequest = new Request(request.url, {
    method: "POST",
    headers: { "content-type": request.headers.get("content-type") ?? "" },
    body: Buffer.from(body),
  });
  let form: FormData;
  try {
    form = await parsedRequest.formData();
  } catch {
    throw new HttpError(400, "INVALID_FORM");
  }
  const file = form.get("file");
  if (!(file instanceof File)) throw new HttpError(400, "FILE_REQUIRED");
  if (file.size > 2_000_000) throw new HttpError(413, "FILE_TOO_LARGE");
  if (file.type.startsWith("image/"))
    return Response.json({
      status: "IMAGE_OCR_NOT_CONFIGURED",
      analysisAvailable: false,
      textExtractionAvailable: false,
    });
  if (!["application/pdf", "text/plain"].includes(file.type))
    throw new HttpError(415, "UNSUPPORTED_FILE");
  let text = "";
  let truncated = false;
  let pages: number | undefined;
  if (file.type === "application/pdf") {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-")
      throw new HttpError(415, "INVALID_PDF");
    const result = await extractPdf(bytes);
    text = result.text;
    truncated = result.truncated;
    pages = result.pages;
  } else {
    const full = await file.text();
    if (full.includes("\u0000")) throw new HttpError(415, "INVALID_TEXT");
    text = full.trim().slice(0, 16000);
    truncated = full.trim().length > 16000;
  }
  return Response.json({
    fileName: file.name,
    status: text
      ? file.type === "application/pdf"
        ? "PDF_TEXT_EXTRACTED"
        : "TEXT_EXTRACTED"
      : "PDF_REQUIRES_OCR",
    extractedText: text || null,
    truncated,
    pages,
    textExtractionAvailable: Boolean(text),
    analysisAvailable: false,
    confirmationRequired: true,
  });
});
