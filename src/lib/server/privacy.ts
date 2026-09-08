import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
export function secureEqual(actual: string, expected: string) {
  return timingSafeEqual(
    createHash("sha256").update(actual).digest(),
    createHash("sha256").update(expected).digest(),
  );
}
export function ownerHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
export function newOwnerToken() {
  return randomBytes(32).toString("hex");
}
function encryptionKey() {
  const key = process.env.CASE_ENCRYPTION_KEY;
  if (!key || !/^[a-fA-F0-9]{64}$/.test(key))
    throw new Error("ENCRYPTION_NOT_CONFIGURED");
  return Buffer.from(key, "hex");
}
export function encryptCase(value: unknown, context: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from(context));
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), "utf8"),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((p) => p.toString("base64"))
    .join(".");
}
export function decryptCase(value: string, context: string): unknown {
  const parts = value.split(".");
  if (parts.length !== 3) throw new Error("INVALID_CIPHERTEXT");
  const [iv, tag, encrypted] = parts.map((p) => Buffer.from(p, "base64"));
  const cipher = createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  cipher.setAAD(Buffer.from(context));
  cipher.setAuthTag(tag);
  return JSON.parse(
    Buffer.concat([cipher.update(encrypted), cipher.final()]).toString("utf8"),
  );
}
