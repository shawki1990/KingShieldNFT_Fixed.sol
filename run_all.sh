#!/usr/bin/env bash
set -euo pipefail

# run_all.sh — نصّ آمن لتجهيز المشروع ورفع الميتاداتا ونشر العقد على Sepolia/localhost
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  echo "ERROR: .env not found. انسخ .env.example إلى .env واملأ القيم الحسّاسة." >&2
  exit 1
fi

set -a
source .env
set +a

required=(WEB3STORAGE_TOKEN)
missing=()
for v in "${required[@]}"; do
  if [ -z "${!v:-}" ]; then
    missing+=("$v")
  fi
done

if [ ${#missing[@]} -ne 0 ]; then
  echo "ERROR: المتغيرات التالية ناقصة في .env: ${missing[*]}" >&2
  echo "املأها ثم أعد تشغيل هذا السكربت." >&2
  exit 1
fi

echo "1/6 — Compiling contracts..."
npx hardhat compile

echo "2/6 — Uploading metadata to web3.storage..."
upload_out=$(node scripts/upload-metadata-fixed.js ./metadata 2>&1 || true)
echo "$upload_out"

cid=$(echo "$upload_out" | grep -Eo 'bafy[0-9a-zA-Z]+' | head -n1 || true)
if [ -z "$cid" ]; then
  cid=$(echo "$upload_out" | grep -Eo 'Qm[1-9A-HJ-NP-Za-km-z]{44}' | head -n1 || true)
fi

if [ -z "$cid" ]; then
  echo "WARN: لم يتم العثور على CID في مخرجات الرفع." >&2
  echo "قم بتشغيل 'node scripts/upload-metadata-fixed.js ./metadata' يدوياً وتعيين BASE_URI في .env إلى 'ipfs://<CID>/' ثم أعد المحاولة." >&2
  exit 1
fi

BASE_URI="ipfs://$cid/"
echo "Found CID: $cid"

echo "3/6 — Deploying contract to localhost (use network 'localhost' or change to sepolia)..."
npx hardhat run scripts/deploy-fixed.js --network localhost

if [ -n "${CONTRACT_ADDRESS:-}" ]; then
  deployed_addr="$CONTRACT_ADDRESS"
else
  echo "Please set CONTRACT_ADDRESS in .env after deploy if not automatically set." >&2
fi

echo "4/6 — Setting baseURI ($BASE_URI) on contract $deployed_addr..."
export BASE_URI
npx hardhat run scripts/setBaseURI-fixed.js --network localhost

echo "5/6 — Minting a test token to deployer..."
npx hardhat run scripts/mint-fixed.js --network localhost

echo "6/6 — Finished. Check local node logs and contract state." 
exit 0
