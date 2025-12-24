#!/usr/bin/env bash
# trigger-gh-prod.sh — Helper to dispatch the prod workflow and stream logs via GH CLI
# Usage: ./scripts/trigger-gh-prod.sh <network> <repo>
# Example: ./scripts/trigger-gh-prod.sh sepolia shawki1990/KingShieldNFT_Fixed.sol

set -euo pipefail

NETWORK=${1:-sepolia}
REPO=${2:-}

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI not found. Install from https://cli.github.com/"
  exit 1
fi

if [ -z "$REPO" ]; then
  echo "Usage: $0 <network> <owner/repo>"
  exit 1
fi

echo "Dispatching prod workflow for network: $NETWORK on repo: $REPO"
# Trigger workflow
gh workflow run prod-deploy.yml -f network="$NETWORK" --repo "$REPO"

# Wait briefly for the run to be queued
sleep 3

# Find the latest run id for the workflow
run_id=$(gh run list --workflow=prod-deploy.yml --repo "$REPO" --limit 1 --json databaseId | jq -r '.[0].databaseId')
if [ -z "$run_id" ] || [ "$run_id" = "null" ]; then
  echo "Could not find a new run id; check Actions page: https://github.com/$REPO/actions"
  exit 1
fi

echo "Watching run id: $run_id... (this will block until run finishes)"
# Stream logs (gh has a 'watch' subcommand, but to be portable we fetch logs repeatedly)
# Use gh run watch if available
if gh help run | grep -q "watch"; then
  gh run watch --repo "$REPO" "$run_id"
else
  # Fallback: print logs when complete
  echo "'gh run watch' not available; polling until complete..."
  while true; do
    status=$(gh run view --repo "$REPO" "$run_id" --json status --jq '.status')
    echo "Status: $status"
    if [ "$status" = "completed" ]; then
      echo "Run completed. Fetching logs..."
      gh run view --repo "$REPO" "$run_id" --log
      break
    fi
    sleep 5
  done
fi

exit 0
