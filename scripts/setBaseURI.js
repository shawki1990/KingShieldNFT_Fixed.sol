async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const baseUri = process.env.BASE_URI;
  if (!contractAddress) throw new Error('Set CONTRACT_ADDRESS in .env');
  if (!baseUri) throw new Error('Set BASE_URI in .env');

  const KingShield = await ethers.getContractFactory('KingShieldNFT');
  const king = KingShield.attach(contractAddress);
  const tx = await king.setBaseURI(baseUri);
  console.log('setBaseURI tx:', tx.hash);
  await tx.wait();
  console.log('Base URI set to', baseUri);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
