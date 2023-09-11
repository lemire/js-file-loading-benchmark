"use strict";

import { bench, run } from "mitata";
import { existsSync, createWriteStream, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
let filename = 'README.md'
bench(filename, () => {
  const file_content = readFileSync(filename, "utf-8");
  return file_content.length;
});

await run();
