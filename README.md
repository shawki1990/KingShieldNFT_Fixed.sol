# الدرع الملكي — نشر وتحكم (ملف المشروع)

هذا المستودع يحتوي على عقد ERC-721 بسيط (`KingShieldNFT`) مع دعم Royalties (ERC-2981) وسكربتات مساعدة لنشر ورفع الميتاداتا ومينت.

ملخص الخطوات الآمنة (نفّذ على جهازك المحلي):

1) انسخ `.env.example` إلى `.env` واملأ القيم الحساسة محلياً.

2) تثبيت الحزم:
```bash
cd /workspaces/KingShieldNFT_Fixed.sol
npm install
```

3) ترجمة العقد:
```bash
npx hardhat compile
```

4) نشر إلى شبكة اختبار (Sepolia مثال):
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

5) رفع الميتاداتا إلى web3.storage:
```bash
# ضع ملفات JSON و/أو الصور داخل مجلد metadata/
node scripts/upload-metadata.js
```

6) ضع `ipfs://<CID>/` في `BASE_URI` داخل `.env` ثم شغّل:
```bash
npx hardhat run scripts/setBaseURI.js --network sepolia
```

7) عمل Mint تجريبي:
```bash
npx hardhat run scripts/mint.js --network sepolia
```

8) للتحقق على Etherscan:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

ملاحظات أمان:
- لا تشارك `PRIVATE_KEY` أو `WEB3STORAGE_TOKEN` أو `ETHERSCAN_API_KEY` علناً.
- جرب أولاً على شبكة اختبار.

ملفات مهمة في المستودع:
- `contracts/KingShieldNFT.sol` — العقد.
- `scripts/` — سكربتات النشر، المينت، رفع الميتاداتا، ومينت دفعة.
- `package.json` — سكربتات المشروع والاعتماديات.
# KingShieldNFT_Fixed.sol