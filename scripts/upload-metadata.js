const { Web3Storage, getFilesFromPath } = require('web3.storage');
require('dotenv').config();
const path = require('path');

async function main() {
  const token = process.env.WEB3STORAGE_TOKEN;
  if (!token) throw new Error('Set WEB3STORAGE_TOKEN in .env');
  const folder = process.env.METADATA_FOLDER || 'metadata';
  const storage = new Web3Storage({ token });

  const files = await getFilesFromPath(path.join(process.cwd(), folder));
  console.log('Uploading', files.length, 'files from', folder);
  const cid = await storage.put(files, { wrapWithDirectory: true });
  console.log('Uploaded to CID:', cid);
  console.log('Base URI (ipfs):', `ipfs://${cid}/`);
}

main().catch((err) => { console.error(err); process.exit(1); });
