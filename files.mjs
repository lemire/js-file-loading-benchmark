import { run } from './bench.mjs'
import { readFileSync } from 'node:fs'

function fn() {
  const buf = readFileSync('./README.md')
  return buf.length
}

console.log(fn())

run('readFileSync', fn, 200000, 10)
