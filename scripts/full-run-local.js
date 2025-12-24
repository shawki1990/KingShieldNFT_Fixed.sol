#!/usr/bin/env node
require('dotenv').config();
const hre = require('hardhat');
const crypto = require('crypto');

async function main() {
  // generate fake CID
  const cid = 'bafy' + crypto.randomBytes(10).toString('hex');
  const baseURI = `ipfs://${cid}/`;
  console.log('Using mock Base URI:', baseURI);

  const [deployer, other] = await hre.ethers.getSigners();
  console.log('Deployer address:', deployer.address);

  const KingShield = await hre.ethers.getContractFactory('KingShieldNFT');
  const king = await KingShield.deploy();
  if (typeof king.deployed === 'function') {
    await king.deployed();
  } else if (typeof king.waitForDeployment === 'function') {
    await king.waitForDeployment();
  }
  // normalize address across ethers versions
  let deployedAddress;
  if (king.address) deployedAddress = king.address;
  else if (king.target) deployedAddress = king.target;
  else if (typeof king.getAddress === 'function') deployedAddress = await king.getAddress();
  console.log('Deployed contract address:', deployedAddress);

  // set base URI
  let tx = await king.setBaseURI(baseURI);
  await tx.wait();
  console.log('BaseURI set on contract');

  // mint to deployer
  tx = await king.mint(deployer.address);
  const receipt = await tx.wait();
  // normalize tx hash
  const txHash = receipt && (receipt.transactionHash || receipt.hash || receipt.transaction?.hash);
  console.log('Mint tx hash:', txHash || 'N/A');

  // read tokenURI(1)
  const uri = await king.tokenURI(1);
  console.log('tokenURI(1):', uri);

  // list tokens of deployer (getTokensByOwner)
  try {
    const tokens = await king.getTokensByOwner(deployer.address);
    console.log('Tokens owned by deployer:', tokens.map(t => t.toString()));
  } catch (err) {
    console.log('getTokensByOwner failed:', err.message || err);
  }

}

main().catch((err) => { console.error(err); process.exit(1); });
