#!/usr/bin/env node
require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const address = process.env.CONTRACT_ADDRESS || process.argv[2];
  const base = process.env.BASE_URI || process.argv[3] || process.argv[2];
  if (!address) {
    console.error('ERROR: CONTRACT_ADDRESS not provided in .env or as arg');
    process.exit(1);
  }
  if (!base) {
    console.error('ERROR: BASE_URI not provided in .env or as arg');
    process.exit(1);
  }

  const KingShield = await hre.ethers.getContractFactory('KingShieldNFT');
  const king = KingShield.attach(address);
  const tx = await king.setBaseURI(base);
  await tx.wait();
  console.log('Base URI set to', base);
}

main().catch((err) => { console.error(err); process.exit(1); });
