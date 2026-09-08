import { getDocumentProxy, extractText } from "unpdf";
process.once("message", async (message) => {
  let pdf;
  try {
    pdf = await getDocumentProxy(
      new Uint8Array(Buffer.from(message.data, "base64")),
    );
    if (pdf.numPages > 20) throw new Error("PDF_PAGE_LIMIT");
    const result = await extractText(pdf, { mergePages: true });
    const text = result.text.trim();
    process.send({
      text: text.slice(0, 16000),
      truncated: text.length > 16000,
      pages: pdf.numPages,
    });
  } catch {
    process.send({ error: "PDF_UNREADABLE" });
  } finally {
    if (pdf) await pdf.destroy();
    process.disconnect();
  }
});
