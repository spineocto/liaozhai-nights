# 安全注意事項 (Security)

## ⚠️ 重要：保護你的 API 金鑰

### 永遠不要提交以下檔案到 Git：
- ❌ `.env` - 包含真實 API 金鑰
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ 任何包含 API 金鑰的檔案

### ✅ 可以安全提交的檔案：
- ✅ `.env.example` - 只包含佔位符
- ✅ `.gitignore` - 確保忽略敏感檔案

## 🔒 如何保護金鑰

1. **本地開發**：
   - 複製 `.env.example` 到 `.env`
   - 在 `.env` 中填入真實金鑰
   - `.gitignore` 會自動忽略 `.env`

2. **部署到 Vercel**：
   - 在 Vercel 控制台設定環境變數
   - 不要在程式碼中硬編碼金鑰

3. **分享專案**：
   - 只分享 GitHub 連結
   - 告訴其他人建立自己的 `.env`

## 🆘 如果不小心上傳了金鑰

1. **立即撤銷該 API 金鑰**
2. 生成新的金鑰
3. 從 Git 歷史中移除：
   ```bash
   git rm --cached .env
   git commit -m "Remove leaked API key"
   git push --force
   ```
4. 永遠不要在公開倉庫中包含真實金鑰

## ✅ 目前的保護狀態

- ✅ `.gitignore` 已正確設定
- ✅ `.env.example` 只包含佔位符
- ✅ 所有 API 呼叫都在後端（Vercel Functions）
- ✅ 金鑰不會暴露在瀏覽器中

保持安全！🔐
