#!/usr/bin/env node
require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const address = process.env.CONTRACT_ADDRESS || process.argv[2];
  const recipient = process.env.MINT_TO || process.argv[3] || process.argv[2];
  if (!address) {
    console.error('ERROR: CONTRACT_ADDRESS not provided in .env or as arg');
    process.exit(1);
  }
  if (!recipient) {
    console.error('ERROR: recipient not provided in .env (MINT_TO) or as arg');
    process.exit(1);
  }

  const KingShield = await hre.ethers.getContractFactory('KingShieldNFT');
  const king = KingShield.attach(address);
  const tx = await king.mint(recipient);
  const receipt = await tx.wait();
  console.log('Mint tx hash:', receipt.transactionHash);
}

main().catch((err) => { console.error(err); process.exit(1); });
