import { mkdirSync, writeFileSync } from "node:fs";
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

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, HOROSCOPE, "utf8");
}

try {
  main();
} catch (error) {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
