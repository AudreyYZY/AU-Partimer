import { spawn } from "node:child_process";
import path from "node:path";
import { HttpError } from "@/lib/server/http";

type Extraction = { text: string; truncated: boolean; pages: number };
let active = 0;
export function extractPdf(data: Uint8Array): Promise<Extraction> {
  if (active >= 2) return Promise.reject(new HttpError(429, "DOCUMENT_BUSY"));
  active++;
  return new Promise((resolve, reject) => {
    let child: ReturnType<typeof spawn>;
    try {
      child = spawn(
        process.execPath,
        [
          "--max-old-space-size=128",
          path.join(process.cwd(), "scripts/pdf-worker.mjs"),
        ],
        {
          stdio: ["ignore", "ignore", "ignore", "ipc"],
          env: { NODE_ENV: process.env.NODE_ENV, PATH: process.env.PATH },
        },
      );
    } catch {
      active--;
      reject(new HttpError(422, "PDF_UNREADABLE"));
      return;
    }
    let done = false;
    const finish = (error?: Error, result?: Extraction) => {
      if (done) return;
      done = true;
      clearTimeout(timeout);
      active--;
      child.kill();
      if (error) reject(error);
      else resolve(result!);
    };
    const timeout = setTimeout(
      () => finish(new HttpError(422, "PDF_PROCESSING_LIMIT")),
      10000,
    );
    child.on("message", (message: Extraction & { error?: string }) => {
      if (message.error) finish(new HttpError(422, "PDF_UNREADABLE"));
      else finish(undefined, message);
    });
    child.on("error", () => finish(new HttpError(422, "PDF_UNREADABLE")));
    child.on("exit", () => {
      if (!done) finish(new HttpError(422, "PDF_UNREADABLE"));
    });
    child.send!(
      { data: Buffer.from(data).toString("base64") },
      (error: Error | null) => {
        if (error) finish(new HttpError(422, "PDF_UNREADABLE"));
      },
    );
  });
}
