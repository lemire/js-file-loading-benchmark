const AD = '\u001b[0m' // ANSI Default
const AG = '\u001b[32m' // ANSI Green
const AY = '\u001b[33m' // ANSI Yellow

const colors = { AD, AG, AY }

function pad (v, size, precision = 0) {
  return v.toFixed(precision).padStart(size, ' ')
}

function findmem (str) {
  const space = ' '
  let spaces = 0
  let last = 0
  while (spaces < 24) {
    const i = str.indexOf(space, last)
    if (i > 0) {
      if (spaces++ === 23) return (Number(str.slice(last, i)) * 4096) / 1024
      last = i + 1
    } else {
      break
    }
  }
}

const decoder = new TextDecoder()

async function wrap_mem_usage () {
  if (globalThis.Deno) {
    return () => Math.floor((Number((new TextDecoder()).decode(Deno.readFileSync('/proc/self/stat')).split(' ')[23]) * 4096)  / (1024))
  }
  if (globalThis.Bun) {
    const fs = require('node:fs')
    return () => Math.floor((Number((new TextDecoder()).decode(fs.readFileSync('/proc/self/stat')).split(' ')[23]) * 4096)  / (1024))
  }
  if (globalThis.process) {
    const { readFileSync } = await import('node:fs')
    return () => Math.floor((Number((new TextDecoder()).decode(readFileSync('/proc/self/stat')).split(' ')[23]) * 4096)  / (1024))
  }
  if (globalThis.spin) {
    const { pread, open } = spin.fs
    const O_RDONLY = 0
    const fd = open(`/proc/self/stat`, O_RDONLY)
    const buf = spin.ptr(new Uint8Array(1024))
    function readUsage () {
      if (pread(fd, buf, 1024, 0) > 0) return findmem(decoder.decode(buf))
      return 0
    }
    return readUsage
  }
  if (globalThis.just) {
    return () => Math.floor(Number(just.memoryUsage().rss)  / 1024)
  }
}

const mem = await wrap_mem_usage()

function formatNanos (nanos) {
  if (nanos >= 1000000000) return `${AY}sec/iter${AD} ${pad((nanos / 1000000000), 10, 2)}`
  if (nanos >= 1000000) return `${AY}ms/iter${AD} ${pad((nanos / 1000000), 10, 2)}`
  if (nanos >= 1000) return `${AY}μs/iter${AD} ${pad((nanos / 1000), 10, 2)}`
  return `${AY}ns/iter${AD} ${pad(nanos, 10, 2)}`
}

function bench (name, fn, count, after) {
  const start = performance.now()
  for (let i = 0; i < count; i++) fn()
  const elapsed = (performance.now() - start)
  const rate = Math.floor(count / (elapsed / 1000))
  const nanos = 1000000000 / rate
  const rss = mem()
  console.log(`${name.slice(0, 32).padEnd(17, ' ')} ${pad(Math.floor(elapsed), 6)} ms ${AG}rate${AD} ${pad(rate, 10)} ${formatNanos(nanos)} ${AG}rss${AD} ${rss}`)
  //console.log(`${name.slice(0, 32).padEnd(17, ' ')} ${pad(Math.floor(elapsed), 6)} ms ${AG}rate${AD} ${pad(rate, 10)} ${formatNanos(nanos)}`)
  after()
  return { name, count, elapsed, rate, nanos }
}

async function benchAsync (name, fn, count, after) {
  const start = performance.now()
  for (let i = 0; i < count; i++) await fn()
  const elapsed = (performance.now() - start)
  const rate = Math.floor(count / (elapsed / 1000))
  const nanos = 1000000000 / rate
  const rss = system.getrusage()[0]
  console.log(`${name.slice(0, 32).padEnd(17, ' ')} ${pad(Math.floor(elapsed), 6)} ms ${AG}rate${AD} ${pad(rate, 10)} ${formatNanos(nanos)} ${AG}rss${AD} ${rss}`)
  after()
  return { name, count, elapsed, rate, nanos }
}

if (globalThis.spin) {
  globalThis.performance = { now: () => spin.hrtime() / 1000000 }
  globalThis.assert = spin.assert
} else {
  if (!globalThis.performance && globalThis.just) {
    globalThis.performance = { now: () => just.hrtime() / 1000000 }
  }
  function assert (condition, message, ErrorType = Error) {
    if (!condition) {
      throw new ErrorType(message || "Assertion failed")
    }
  }
  globalThis.assert = assert
}

if (globalThis.Deno) {
  globalThis.args = Deno.args
} else if (globalThis.process) {
  globalThis.args = process.argv.slice(2)
} else if (globalThis.spin) {
  globalThis.args = spin.args.slice(2)
}

globalThis.colors = colors

const runAsync = async (name, fn, count, repeat = 10, after = () => {}) => {
  const runs = []
  for (let i = 0; i < repeat; i++) {
    runs.push(await benchAsync(name, fn, count, after))
  }
  return runs
}

const run = (name, fn, count, repeat = 10, after = () => {}) => {
  const runs = []
  for (let i = 0; i < repeat; i++) {
    runs.push(bench(name, fn, count, after))
  }
  return runs
}

function arrayEquals (a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
}

class Bench {
  #start = 0
  #end = 0
  #count = 0
  #name = 'bench'

  start (name = 'bench') {
    this.#name = name.slice(0, 32).padEnd(17, ' ')
    this.#start = Date.now()
  }

  end (count = 0) {
    this.#end = Date.now()
    this.#count = count
    const elapsed = this.#end - this.#start
    const rate = Math.floor(count / (elapsed / 1000))
    console.log(`${this.#name} ${pad(Math.floor(elapsed), 6)} ms ${AG}rate${AD} ${pad(rate, 10)} ${formatNanos(1000000000 / rate)} ${AG}rss${AD} ${mem()}`)
  }
}

globalThis.arrayEquals = arrayEquals

export { pad, formatNanos, colors, run, runAsync, Bench, mem }
