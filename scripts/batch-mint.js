require('dotenv').config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error('Set CONTRACT_ADDRESS in .env');
  const recipientsCsv = process.env.RECIPIENTS_CSV || 'recipients.txt';
  const fs = require('fs');
  const recipients = fs.readFileSync(recipientsCsv, 'utf8').split(/\r?\n/).filter(Boolean);

  const KingShield = await ethers.getContractFactory('KingShieldNFT');
  const king = KingShield.attach(contractAddress);

  for (let i = 0; i < recipients.length; i++) {
    const to = recipients[i].trim();
    console.log('Minting to', to);
    const tx = await king.mint(to);
    console.log('  tx', tx.hash);
    await tx.wait();
  }
  console.log('Batch mint completed:', recipients.length);
}

main().catch((err) => { console.error(err); process.exit(1); });
