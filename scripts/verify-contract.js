#!/usr/bin/env node
require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const address = process.env.CONTRACT_ADDRESS || process.argv[2];
  if (!address) {
    console.error('ERROR: CONTRACT_ADDRESS not provided in .env or as arg');
    process.exit(1);
  }

  try {
    console.log('Running Etherscan verification for', address);
    await hre.run('verify:verify', { address });
    console.log('Verification submitted. Check Etherscan for status.');
  } catch (err) {
    console.error('Verification failed:', err.message || err);
    process.exit(1);
  }
}

main();
