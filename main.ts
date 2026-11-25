// Fortune Cookie for the Liquidated Trader — make.fun program/v1 entry.
//
// Writes one fortune cookie line for a crypto trader who has just been
// liquidated to /output/entry.txt. Deterministic: no input, no clock, no
// network, no randomness — every run writes the exact same bytes.
//
// The line is built as an oracle opening ("A great fortune awaits you")
// whose second half turns the word "fortune" against the trader: the
// fortune in question is the money the exchange already took. Rueful,
// warm, and aimed at the loss itself — never at the trader.

import { mkdirSync, writeFileSync } from "node:fs";

const FORTUNE =
  "A great fortune awaits you, just not the one the exchange already collected on your behalf.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_WORDS = 20;
const MAX_CHARS = 160;

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function validate(text: string): void {
  if (text.length < 1 || text.length > MAX_CHARS) {
    throw new Error(`entry must be 1-${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const words = wordCount(text);
  if (words > MAX_WORDS) {
    throw new Error(`entry must be at most ${MAX_WORDS} words, got ${words}`);
  }
}

validate(FORTUNE);
mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, FORTUNE, "utf8");
console.log(`wrote ${FORTUNE.length} chars, ${wordCount(FORTUNE)} words to ${OUTPUT_PATH}`);
