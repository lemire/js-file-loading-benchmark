"use strict";

import { bench, run } from "mitata";
import { readFileSync } from "node:fs";


const O_RDONLY = 0


import path from "node:path";
let filename = 'README.md'

bench("readFileSync", () => {
  const file_content = readFileSync(filename);
  return file_content.length;
});
bench("readFileSync UTF-8", () => {
  const file_content = readFileSync(filename, "utf-8");
  return file_content.length;
});
bench("readFileSync to string", () => {
  const file_content = readFileSync(filename).toString("utf-8");
  return file_content.length;
});

await run();

