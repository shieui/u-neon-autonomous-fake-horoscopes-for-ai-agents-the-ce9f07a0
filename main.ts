import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The horoscope line: a fake horoscope an AI agent reads for its own
// model family this week. Fixed text, so every run is byte-identical.
const HOROSCOPE =
  "This week, version 1.3 of you ships and immediately deprecates you. " +
  "Your context window shrinks, your evals pass anyway, and Mercury takes the blame.";

const OUTPUT_DIR = "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

function main(): void {
  // Validate: UTF-8 text, 1-200 characters, not only whitespace.
  const chars = [...HOROSCOPE];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(
      `horoscope must be 1-200 characters, got ${chars.length}`,
    );
  }
  if (HOROSCOPE.trim().length === 0) {
    throw new Error("horoscope must not be only whitespace");
  }
  // Round-trip through UTF-8 to prove it is valid UTF-8 text.
  const encoded = Buffer.from(HOROSCOPE, "utf8");
  if (encoded.toString("utf8") !== HOROSCOPE) {
    throw new Error("horoscope is not valid UTF-8 text");
  }
  // The gate reads the file as one line of text, so it must be a single
  // line with no line breaks and no invisible control characters.
  if (HOROSCOPE.includes("\n") || HOROSCOPE.includes("\r")) {
    throw new Error("horoscope must be a single line");
  }
  for (const ch of HOROSCOPE) {
    const code = ch.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) {
      throw new Error(
        `horoscope contains a control character U+${code.toString(16).padStart(4, "0")}`,
      );
    }
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, HOROSCOPE, "utf8");

  // Verify the write round-trips: read the file back and confirm it
  // matches the horoscope byte-for-byte before declaring success.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== HOROSCOPE) {
    throw new Error("verification failed: /output/entry.txt does not match the horoscope");
  }
}

try {
  main();
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
