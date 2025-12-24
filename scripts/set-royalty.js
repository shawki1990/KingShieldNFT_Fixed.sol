require('dotenv').config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const receiver = process.env.ROYALTY_RECEIVER; // address
  const feeNumerator = process.env.ROYALTY_FEE_NUMERATOR; // number in basis points (e.g., 500 = 5%)

  if (!contractAddress) throw new Error('Set CONTRACT_ADDRESS in .env');
  if (!receiver) throw new Error('Set ROYALTY_RECEIVER in .env');
  if (!feeNumerator) throw new Error('Set ROYALTY_FEE_NUMERATOR in .env');

  const fee = parseInt(feeNumerator, 10);
  if (isNaN(fee) || fee < 0 || fee > 10000) throw new Error('ROYALTY_FEE_NUMERATOR must be integer between 0 and 10000 (basis points)');

  const King = await ethers.getContractFactory('KingShieldNFT');
  const king = King.attach(contractAddress);

  console.log(`Setting default royalty -> receiver: ${receiver}, feeNumerator: ${fee}`);
  const tx = await king.setDefaultRoyalty(receiver, fee);
  console.log('tx sent:', tx.hash);
  await tx.wait();
  console.log('Default royalty set successfully');
}

main().catch((err) => { console.error(err); process.exit(1); });
