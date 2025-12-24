#!/usr/bin/env node
require('dotenv').config();
const hre = require('hardhat');

async function main() {
  const KingShield = await hre.ethers.getContractFactory('KingShieldNFT');
  const king = await KingShield.deploy();
  await king.deployed();
  console.log('Deployed contract address:', king.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
