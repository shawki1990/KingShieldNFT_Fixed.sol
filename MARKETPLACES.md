MARKETPLACES — خطوات نشر NFT على الأسواق (OpenSea, Rarible, إلخ)

ملخص سريع:
- تأكد من أن `BASE_URI` خاصتك متاحة عبر IPFS (ipfs://CID/).
- تأكد من أن العقد نشر على شبكة عامة (Sepolia لا يدعمه OpenSea تمامًا؛ استخدم Goerli/Mainnet / Polygon لتواجد أفضل).
- قم بالتحقق من العقد على Etherscan (اختياري لكن موصى به).

OpenSea / Rarible (إجراءات يدوية النموذجية)
1) افتح OpenSea، اربط محفظتك (MetaMask) التي تملك الـ NFT.
2) اذهب إلى قسم "My Collections" أو "My Items" واختر "Create" أو "Sell".
3) لا حاجة لتحميل الميتاداتا يدوياً إن كانت متاحة عبر BASE_URI/IPFS؛ OpenSea يقرأها تلقائياً.
4) لإنشاء عرض بيع (list), استخدم زر "Sell" واختر السعر ومدة العرض.

نصائح تقنية للتكامل الآلي
- أضف ملف `contract-metadata.json` في جذر الـ metadata وارفِعه إلى IPFS (OpenSea يقرأه كـ contract-level metadata).
- استخدم سكربت `scripts/generate-contract-metadata.js` ثم `scripts/upload-contract-metadata.js` لرفع الملف.
- إذا أردت إنشاء أمر بيع برمجياً، راجع Seaport SDK (`@opensea/seaport-js`) وأضف سكربت تشغيل محلي (مثال في `scripts/create-seaport-order.example.js`).

قوائم المنصات المركزية (CEX)
- إدراج مجموعة NFT على بورصة مركزية عملية معقدة: تتطلب تواصل تجاري، مستندات قانونية، كشف KYC، وأحياناً رسوم إدراج.
- اتصل بفريق الدعم أو فريق الشركاء بالمنصة لتقديم طلب إدراج؛ جهّز عرضًا يشمل عملتك، هدف المجموعة، حجم العرض، وطلب التوثيق.

التحقق والتحسين
- تحقق من ظهور NFTs على OpenSea بعد بعض الوقت (قد تستغرق الفهرسة دقائق إلى ساعات).
- أضف صورة مصغرة و contract-level metadata لإظهار معلومات عن المجموعة على مستوى العقد.

أمن
- لا تعطِ PRIVATE_KEY لأي خدمة غير موثوقة.
- استخدم محفظة منفصلة للاختبار.
