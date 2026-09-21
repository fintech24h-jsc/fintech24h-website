# Kiểm thử Spam Guard (PHP thật qua WebAssembly)
```bash
npm i @php-wasm/node @php-wasm/universal
node run.mjs   # nạp plugin + stubs WordPress, chạy scenarios.php
```
`run.mjs` (viết trong phiên điều tra) chép `stubs.php`, `scenarios.php` và plugin vào `/w/` trong PHP-WASM 8.3 rồi chạy `scenarios.php`; nhớ kết thúc bằng `process.exit(0)`. Không kèm `corpus.json` (nội dung spam thật, 7 MB).
