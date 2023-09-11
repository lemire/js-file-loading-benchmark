# File benchmarks in JavaScript

Requirement: We assume that have macOS or Linux. Windows is not supported.


Run the bash script `script.sh` (e.g., type `bash script.sh`). It will install `nvm` and `bun` in your user account, if needed. 

The benchmark simply reads the current README.md file, as quickl as possible.


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
