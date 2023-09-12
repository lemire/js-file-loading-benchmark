# File benchmarks in JavaScript

Requirement: We assume that have macOS or Linux. Windows is not supported.


Run the bash script `script.sh` (e.g., type `bash script.sh`). It will install `nvm` and `bun` in your user account, if needed. 

The benchmark simply reads the current README.md file, as quickly as possible.

The README file may contain non-ASCII characters: é, ê, ô.

## Sample Results

```
runtime: bun 1.0.0 (arm64-darwin)

benchmark      time (avg)             (min … max)       p75       p99      p995
------------------------------------------------- -----------------------------
README.md    8.08 µs/iter     (7.88 µs … 9.04 µs)   8.07 µs   9.04 µs   9.04 µs

Now using node v20.6.1 (npm v9.8.1)
cpu: Apple M2
runtime: node v20.6.1 (arm64-darwin)

benchmark      time (avg)             (min … max)       p75       p99      p995
------------------------------------------------- -----------------------------
README.md   13.38 µs/iter  (12.33 µs … 279.67 µs)  13.08 µs     18 µs  22.92 µs

Restoring node version to v20.6.1
Now using node v20.6.1 (npm v9.8.1)
```


```
cpu: Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz
runtime: bun 1.0.0 (x64-linux)

benchmark      time (avg)             (min … max)       p75       p99      p995
------------------------------------------------- -----------------------------
README.md    2.57 µs/iter     (2.45 µs … 2.98 µs)   2.56 µs   2.98 µs   2.98 µs

Now using node v20.6.1 (npm v9.8.1)
cpu: Intel(R) Xeon(R) Gold 6338 CPU @ 2.00GHz
runtime: node v20.6.1 (x64-linux)

benchmark      time (avg)             (min … max)       p75       p99      p995
------------------------------------------------- -----------------------------
README.md    9.68 µs/iter     (8.28 µs … 1.25 ms)   9.16 µs  13.56 µs  15.95 µs

Restoring node version to v20.6.1
Now using node v20.6.1 (npm v9.8.1)
```
