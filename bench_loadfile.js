"use strict";

import { bench, run } from "mitata";
import { readFileSync } from "node:fs";


const O_RDONLY = 0

import { openSync, fstatSync, readSync, closeSync } from "node:fs";
function readFile (path, flags = O_RDONLY) {
  const stat = new Uint8Array(160)
  const stat32 = new Uint32Array(stat.buffer)
  const fd = openSync(path, flags)
  let r = fstatSync(fd, stat)
  const size = r.size
  const buf = Buffer.allocUnsafe(size)//new Uint8Array(size)
  let off = 0
  let len = readSync(fd, buf, size)
  while (len > 0) {
    off += len
    if (off === size) break
    len = readSync(fd, buf, size)
  }
  off += len
  r = closeSync(fd)
  return buf
}


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
  const file_content = readFileSync(filename).toString();
  return file_content.length;
});


bench("JavaScript load", () => {
  const file_content = readFile(filename);
  return file_content.length;
});
bench("JavaScript load to UTF-8", () => {
  const file_content = readFile(filename).toString();
  return file_content.length;
});
for(var i = 0; i < 30; i++) {
  await run();
}
