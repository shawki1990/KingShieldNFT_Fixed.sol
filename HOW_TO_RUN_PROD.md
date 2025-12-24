HOW_TO_RUN_PROD — تشغيل النشر الإنتاجي الآمن (GitHub Actions أو محلياً)

خيار 1 — استخدام GitHub Actions (موصى به إذا لا تريد تشغيل مفاتيح محلياً)
1) ادفع هذه الشفرة إلى مستودع GitHub الخاص بك.
2) افتح: Settings → Secrets and variables → Actions وأضف الأسرار التالية:
   - `PRIVATE_KEY` (مفتاح المحفظة للنشر)
   - `RPC_URL` (مثال: https://sepolia.infura.io/v3/YOUR_ID)
   - `WEB3STORAGE_TOKEN` (مفتاح web3.storage لرفع الميتاداتا)
   - `ETHERSCAN_API_KEY` (اختياري للتحقق)
   - (اختياري) `CONTRACT_NAME`, `CONTRACT_DESCRIPTION`, `ROYALTY_RECEIVER`, `ROYALTY_FEE_NUMERATOR`
3) اذهب إلى صفحة Actions → اختر workflow "Prod Deploy (upload → deploy → setBaseURI → mint → verify)" → Run workflow → اختر الشبكة (sepolia أو mainnet) → Run.

بديل (آلي باستخدام سكربت مساعدة):
- يوجد سكربت مساعدة `scripts/trigger-gh-prod.sh` الذي يبسط تشغيل الـ workflow ومشاهدة اللوج.
- مثال استخدام محلي (بعد تسجيل الدخول عبر `gh auth login`):
```bash
# استبدل <owner>/<repo> باسم الريبو الخاص بك
./scripts/trigger-gh-prod.sh sepolia shawki1990/KingShieldNFT_Fixed.sol
```
- السكربت سيطلق الـ workflow وسيعرض اللوج أو ينتظر حتى ينتهي ثم يجلب اللوج تلقائياً.

4) بعد التنفيذ انسخ لوج الـ job وشاركه هنا لأساعد بتحليل النتائج (address, CID, tx hashes).

خيار 2 — تشغيل محلي (تحتاج مفاتيحك على الجهاز)
1) انسخ المثال إلى `.env`:
```bash
cp .env.example .env
# ثم عدّل .env وأضف:
# PRIVATE_KEY="0x..."
# RPC_URL="https://sepolia.infura.io/v3/YOUR_ID"
# WEB3STORAGE_TOKEN="..."
# ETHERSCAN_API_KEY="..."  # اختياري
```
2) شغّل السكربت الإنتاجي:
```bash
chmod +x run_all_prod.sh
./run_all_prod.sh
```
3) انسخ المخرجات (CID, contract address, tx hashes) وألصقها هنا لمساعدة فورية.

ملاحظات أمنية
- لا تشارك أي من القيم في الدردشة.
- استخدم حساب محفظة منفصل للاختبارات، واختبر أولًا على Sepolia (أو Testnet المعتمد) قبل Mainnet.
