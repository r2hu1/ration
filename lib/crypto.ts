import { webcrypto } from "crypto";
const crypto = webcrypto;

const enc = new TextEncoder();
const dec = new TextDecoder();

const SECRET = process.env.BETTER_AUTH_SECRET;
if (!SECRET) throw new Error("BETTER_AUTH_SECRET is missing from environment");

async function deriveKey(salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encrypt(text: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(text),
  );

  const buffer = new Uint8Array([
    ...salt,
    ...iv,
    ...new Uint8Array(ciphertext),
  ]);
  return Buffer.from(buffer).toString("base64");
}

export async function decrypt(encrypted: string): Promise<string> {
  const data = new Uint8Array(Buffer.from(encrypted, "base64"));
  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ciphertext = data.slice(28);

  const key = await deriveKey(salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );
  return dec.decode(plaintext);
}
