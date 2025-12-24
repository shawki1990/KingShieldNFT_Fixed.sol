#!/usr/bin/env bash
set -euo pipefail

# run_all_prod.sh — تنفيذ كامل للخطوات الإنتاجية محلياً (يتطلب .env مع مفاتيح)
# خطوات: compile -> upload metadata -> deploy to sepolia -> setBaseURI -> mint -> verify

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if [ ! -f .env ]; then
  echo "ERROR: .env not found. انسخ .env.example .env واملأ القيم الحساسة." >&2
  exit 1
fi

set -a
source .env
set +a

required=(PRIVATE_KEY RPC_URL WEB3STORAGE_TOKEN)
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

echo "1/7 — Compiling contracts..."
npx hardhat compile

echo "2/7 — Uploading metadata to web3.storage..."
upload_out=$(node scripts/upload-metadata-fixed.js ./metadata 2>&1)
echo "$upload_out"

# extract CID
cid=$(echo "$upload_out" | grep -Eo 'bafy[0-9a-zA-Z]+' | head -n1 || true)
if [ -z "$cid" ]; then
  cid=$(echo "$upload_out" | grep -Eo 'Qm[1-9A-HJ-NP-Za-km-z]{44}' | head -n1 || true)
fi
if [ -z "$cid" ]; then
  echo "ERROR: لم يتم العثور على CID في مخرجات الرفع." >&2
  exit 1
fi

BASE_URI="ipfs://$cid/"
echo "Found CID: $cid"

echo "3/7 — Deploying contract to Sepolia..."
deploy_out=$(npx hardhat run scripts/deploy-fixed.js --network sepolia 2>&1 || true)
echo "$deploy_out"

deployed_addr=$(echo "$deploy_out" | grep -Eo '0x[a-fA-F0-9]{40}' | head -n1 || true)
if [ -z "$deployed_addr" ]; then
  echo "ERROR: لم يتم العثور على عنوان العقد في مخرجات النشر." >&2
  exit 1
fi

echo "Deployed contract address: $deployed_addr"

echo "4/7 — Setting baseURI ($BASE_URI) on contract $deployed_addr..."
export BASE_URI
export CONTRACT_ADDRESS="$deployed_addr"
npx hardhat run scripts/setBaseURI-fixed.js --network sepolia

echo "5/7 — Minting a test token to deployer..."
npx hardhat run scripts/mint-fixed.js --network sepolia

echo "6/7 — Verifying contract on Etherscan..."
if [ -z "${ETHERSCAN_API_KEY:-}" ]; then
  echo "WARN: ETHERSCAN_API_KEY not set; skipping verification step." >&2
else
  npx hardhat run scripts/verify-contract.js --network sepolia || true
fi

echo "7/7 — Summary"
echo "Contract: $deployed_addr"
echo "Base URI: $BASE_URI"
echo "Metadata CID: $cid"

echo "All done. Review transaction hashes and confirm listing on marketplaces as needed." 
exit 0
