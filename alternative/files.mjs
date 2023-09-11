import { run } from './bench.mjs'
import { readFileSync } from 'node:fs'

function fn() {
  const buf = readFileSync('./README.md')
  return buf.length
}

console.log(fn())

run('readFileSync', fn, 200000, 10)

console.log("UTF-8:")

function utf8fn() {
  const buf = readFileSync('./README.md', 'UTF-8')
  return buf.length
}

console.log(utf8fn())

run('readFileSync', utf8fn, 200000, 10)
