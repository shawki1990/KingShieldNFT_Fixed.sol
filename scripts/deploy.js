async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  const KingShield = await ethers.getContractFactory('KingShieldNFT');
  const kingShield = await KingShield.deploy();
  await kingShield.deployed();

  console.log('KingShieldNFT deployed to:', kingShield.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })