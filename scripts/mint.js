async function main() {
  const [deployer] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error('Set CONTRACT_ADDRESS in .env');

  const KingShield = await ethers.getContractFactory('KingShieldNFT');
  const king = KingShield.attach(contractAddress);

  const recipient = process.env.RECIPIENT || deployer.address;
  const tx = await king.mint(recipient);
  console.log('Mint tx sent:', tx.hash);
  await tx.wait();
  console.log('Mint completed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
