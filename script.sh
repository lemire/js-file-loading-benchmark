#!/bin/bash
source ~/.nvm/nvm.sh

if ! $(command -v nvm &> /dev/null); then
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
  source ~/.nvm/nvm.sh
fi 

if ! $(command -v bun &> /dev/null); then
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
else
  bun upgrade
fi 

for version in  20; do
  nvm install $version --silent
done
npm install --ignore-scripts --no-audit --no-fund 
current_node_version=$(nvm current)

function cleanup {
  echo "Restoring node version to $current_node_version"
  nvm use $current_node_version
}

trap cleanup EXIT

echo "please wait a few seconds"

# Clear terminal output
# printf "\033c"
echo "running node benchmark"
for version in 20; do
  nvm use $version
  node bench_loadfile.js
  echo ""
done


echo "running bun benchmark"
echo ""
bun run bench_loadfile.js
echo ""

echo "running node benchmark"
for version in 20; do
  nvm use $version
  node alternative/files.mjs
  echo ""
done


echo "running bun benchmark"
echo ""
bun run alternative/files.mjs
echo ""


