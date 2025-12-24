#!/usr/bin/env node
require('dotenv').config();
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const path = require('path');

async function main() {
  const token = process.env.WEB3STORAGE_TOKEN || process.argv[2];
  if (!token) {
    console.error('ERROR: WEB3STORAGE_TOKEN not set in .env or passed as arg');
    process.exit(1);
  }

  const dir = process.argv[3] || process.argv[2] || './metadata';
  const fullPath = path.resolve(dir);

  try {
    const files = await getFilesFromPath(fullPath);
    const client = new Web3Storage({ token });
    console.log(`Uploading ${files.length} files from ${fullPath}...`);
    const cid = await client.put(files, { wrapWithDirectory: true });
    console.log(`CID:${cid}`);
    console.log(`ipfs://${cid}/`);
    process.exit(0);
  } catch (err) {
    console.error('Upload failed:', err);
    process.exit(1);
  }
}

main();
