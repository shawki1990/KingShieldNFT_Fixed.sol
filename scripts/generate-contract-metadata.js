#!/usr/bin/env node
// Generates a contract-level metadata JSON file for OpenSea and other marketplaces
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const outDir = path.resolve(__dirname, '../metadata');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const name = process.env.CONTRACT_NAME || 'الدرع الملكي';
const description = process.env.CONTRACT_DESCRIPTION || 'KingShieldNFT collection';
const image = process.env.CONTRACT_IMAGE || 'logo.svg';
const external_link = process.env.CONTRACT_EXTERNAL_LINK || '';
const seller_fee_basis_points = process.env.ROYALTY_FEE_NUMERATOR || '500'; // default 5% (500/10000)
const fee_recipient = process.env.ROYALTY_RECEIVER || '';

const contractMetadata = {
  name,
  description,
  image,
  external_link,
  seller_fee_basis_points: parseInt(seller_fee_basis_points, 10),
  fee_recipient,
};

const outPath = path.join(outDir, 'contract-metadata.json');
fs.writeFileSync(outPath, JSON.stringify(contractMetadata, null, 2), 'utf8');
console.log('Wrote contract-level metadata to', outPath);
console.log('Content:', JSON.stringify(contractMetadata, null, 2));
