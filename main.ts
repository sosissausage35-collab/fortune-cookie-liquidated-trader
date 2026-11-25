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
//
// Validation is a table of single-purpose rules: each rule returns an
// error message or null, and `validate` runs them all in order, so a new
// constraint is one new rule instead of another branch inside a monolith.

import { mkdirSync, writeFileSync } from "node:fs";

const FORTUNE =
  "A great fortune awaits you, just not the one the exchange already collected on your behalf.";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_WORDS = 20;
const MAX_CHARS = 160;

type Rule = (text: string) => string | null;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const checkNotEmpty: Rule = (text) =>
  text.length < 1 ? "entry must not be empty" : null;

const checkMaxChars: Rule = (text) =>
  text.length > MAX_CHARS
    ? `entry must be at most ${MAX_CHARS} characters, got ${text.length}`
    : null;

const checkNotWhitespaceOnly: Rule = (text) =>
  text.trim().length === 0 ? "entry must not be only white space" : null;

const checkNoSurroundingWhitespace: Rule = (text) =>
  text !== text.trim()
    ? "entry must not start or end with white space"
    : null;

const checkSingleLine: Rule = (text) =>
  text.includes("\n") || text.includes("\r")
    ? "entry must be a single line"
    : null;

const checkMaxWords: Rule = (text) => {
  const words = countWords(text);
  return words > MAX_WORDS
    ? `entry must be at most ${MAX_WORDS} words, got ${words}`
    : null;
};

const checkEndsWithPunctuation: Rule = (text) =>
  /[.!?]$/.test(text)
    ? null
    : "entry must end with terminal punctuation (. ! ?)";

const RULES: Rule[] = [
  checkNotEmpty,
  checkMaxChars,
  checkNotWhitespaceOnly,
  checkNoSurroundingWhitespace,
  checkSingleLine,
  checkMaxWords,
  checkEndsWithPunctuation,
];

function validate(text: string): void {
  for (const rule of RULES) {
    const problem = rule(text);
    if (problem !== null) {
      throw new Error(problem);
    }
  }
}

validate(FORTUNE);
mkdirSync("/output", { recursive: true });
writeFileSync(OUTPUT_PATH, FORTUNE, "utf8");
console.log(`wrote ${FORTUNE.length} chars, ${countWords(FORTUNE)} words to ${OUTPUT_PATH}`);
