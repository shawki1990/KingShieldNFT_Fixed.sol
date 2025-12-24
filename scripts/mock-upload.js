#!/usr/bin/env node
// mock-upload.js — يعيد CID مزيف لاختبار التدفق دون web3.storage
const crypto = require('crypto');

function fakeCid() {
  // generate a pseudo CID-like string starting with bafy
  const rnd = crypto.randomBytes(10).toString('hex');
  return 'bafy' + rnd;
}

const cid = fakeCid();
console.log(`CID:${cid}`);
console.log(`ipfs://${cid}/`);
