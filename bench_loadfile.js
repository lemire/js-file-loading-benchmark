"use strict";

import { bench, run } from "mitata";
import { existsSync, createWriteStream, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
let filename = 'README.md'
console.log("UTF-8 load");
bench(filename, () => {
  const file_content = readFileSync(filename, "utf-8");
  return file_content.length;
});
console.log("Raw load");
bench(filename, () => {
  const file_content = readFileSync(filename);
  return file_content.length;
});


await run();
