// Small valid, synthetic PDF. It contains no user or employer data.
export function samplePdf() {
  const stream =
    "BT /F1 12 Tf 72 720 Td (Synthetic pay quote 35 AUD per hour) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Length " + stream.length + " >>\nstream\n" + stream + "\nendstream",
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(body));
    body += index + 1 + " 0 obj\n" + object + "\nendobj\n";
  });
  const xref = Buffer.byteLength(body);
  body += "xref\n0 6\n0000000000 65535 f \n";
  body += offsets
    .slice(1)
    .map((offset) => String(offset).padStart(10, "0") + " 00000 n \n")
    .join("");
  body +=
    "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n" + xref + "\n%%EOF\n";
  return Buffer.from(body);
}
