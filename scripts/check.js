require('dotenv').config();

async function main() {
  const addr = process.env.CONTRACT_ADDRESS;
  if (!addr) throw new Error('Set CONTRACT_ADDRESS in .env');

  const King = await ethers.getContractFactory('KingShieldNFT');
  const k = King.attach(addr);

  // اقرأ arweaveTxId
  try { console.log('arweaveTxId:', await k.arweaveTxId()); } catch(e){ console.error('arweaveTxId err', e.message || e); }

  // استعلم عن توكن 1
  try { console.log('tokenURI(1):', await k.tokenURI(1)); } catch(e){ console.error('tokenURI err', e.message || e); }

  // استعلم عن توكنات مالك محدد
  const owner = process.env.RECIPIENT || (await ethers.getSigners())[0].address;
  try {
    const tokens = await k.getTokensByOwner(owner);
    console.log('tokens for', owner, tokens.map(n => n.toString()));
  } catch(e){ console.error('getTokensByOwner err', e.message || e); }
}

main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
