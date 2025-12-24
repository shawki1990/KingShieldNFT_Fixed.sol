ENV_SETUP — إرشادات إعداد ملف .env (جذر المستودع)

1) انسخ الملف المثال:

```bash
cp .env.example .env
```

2) افتح `.env` واملأ المتغيرات التالية (لا تشاركها مع أحد):

- `PRIVATE_KEY` — مفتاح المحفظة التي ستستخدم للنشر
- `RPC_URL` — رابط مزود JSON-RPC (مثال: https://sepolia.infura.io/v3/PROJECT_ID)
- `WEB3STORAGE_TOKEN` — مفتاح رفع إلى web3.storage
- `ETHERSCAN_API_KEY` — (اختياري) لمصادقة التحقق على Etherscan
- `CONTRACT_ADDRESS` — (اختياري) إذا قمت بنشر العقد يدوياً وتريد تشغيل باقي السكربتات
- `BASE_URI` — (سيتم وضعه بعد رفع الميتاداتا)

3) مثال بسيط لمحتوى `.env`:

```env
PRIVATE_KEY="0xYOUR_PRIVATE_KEY_HERE"
RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"
WEB3STORAGE_TOKEN="YOUR_WEB3STORAGE_TOKEN"
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"
CONTRACT_ADDRESS=""
BASE_URI=""
```

4) ملاحظات أمان:
- لا تشارك القيم داخل هذه الملفات عبر الدردشة أو منصات عامة.
- أضف `.env` إلى `.gitignore` قبل أي `git add`.
