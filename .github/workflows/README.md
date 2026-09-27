# GitHub Actions Workflows

## `supabase-keepalive.yml`

### 目的

Supabase 免費方案的專案若連續 7 天沒有任何 API 活動，資料庫會被自動暫停（pause）。這個 workflow 定期對 Supabase REST API 送一次輕量請求，避免專案被暫停。

### 運作方式

- **觸發時機**：`schedule: cron '0 3 */3 * *'`（每 3 天的 UTC 03:00，約台灣時間 11:00），另外也開放 `workflow_dispatch` 讓人可以在 Actions 頁籤手動觸發測試。
- **執行內容**：對 Supabase PostgREST 端點打一支 `GET`：
  ```bash
  curl -sf -X GET \
    "${{ secrets.SUPABASE_KEEPLIVE }}/rest/v1/quiz_history?select=id&limit=1" \
    -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
    -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
  ```
  只查 `quiz_history` 表的 `id` 欄位、限制 1 筆，單純是為了製造一次有效的 API 活動，不在意回傳內容。
- **`-sf` 參數**：`-s` 靜音、`-f` 讓 HTTP 4xx/5xx 直接以非 0 exit code 失敗，這樣 Actions 才能正確標示 job 失敗。

### 所需 Secrets

| Secret 名稱 | 內容 | 對應本地 `.env.local` |
|---|---|---|
| `SUPABASE_KEEPLIVE` | Supabase 專案的 REST URL（例如 `https://xxxx.supabase.co`） | `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | Supabase anon/public key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

> 注意：URL secret 命名是 `SUPABASE_KEEPLIVE` 而不是更直覺的 `SUPABASE_URL`，是沿用最初建立時的命名，修 bug 時選擇讓 workflow 對齊既有 secret，而不是重新命名 secret。

### 除錯記錄（2026-09）

首次上線後 job 持續失敗，`Process completed with exit code 3`（curl 的「URL malformed」錯誤）。逐步排查發現有兩個獨立問題：

1. **Secret 名稱對不上**
   Workflow 原本寫的是 `secrets.SUPABASE_URL`，但 repo 裡實際存在的 secret 叫 `SUPABASE_KEEPLIVE`（`gh secret list` 確認）。`SUPABASE_URL` 從未被建立過，所以這個變數在 runtime 永遠是空字串，組出來的 URL 變成 `/rest/v1/quiz_history?...`，curl 判定格式錯誤。
   → 修正：把 workflow 裡的 `secrets.SUPABASE_URL` 改成 `secrets.SUPABASE_KEEPLIVE`，並 commit + push 到 `master`（改完本機測試時一度忘記 push，導致 Actions 仍執行舊版本，又多花一輪才發現）。

2. **Secret 值本身夾帶換行字元**
   改完名稱後仍然失敗。從 `gh run view --log` 的輸出可以看到，遮罩後的指令被硬生生斷成兩行：
   ```
   "***
   ***/rest/v1/quiz_history?select=id&limit=1"
   ```
   遮罩內容跨行代表 secret 的值本身包含一個換行符（可能來自建立 secret 當下複製貼上多帶了 `\n`），組出來的 URL 中間被截斷，同樣導致 curl 判定為 malformed URL。
   → 修正：直接從 `.env.local` 重新取值，用 `tr -d '\r\n'` 清掉換行/回車字元，再用 `printf '%s' "$value" | gh secret set <NAME>` 的方式覆蓋設定（`printf` 不像 `echo` 預設會補上結尾換行，管線輸入也不會有殼層自動加值，確保寫進去的字串是乾淨的）。

修正後以 `gh workflow run supabase-keepalive.yml` 手動觸發驗證，`gh run list` 顯示 `completed success`，確認排程可以正常運作。

### 除錯時用到的指令

```bash
# 檢查 repo 目前有哪些 secrets（只看得到名稱，看不到值）
gh secret list

# 手動觸發 workflow
gh workflow run supabase-keepalive.yml

# 看最近的執行紀錄與結果
gh run list --workflow=supabase-keepalive.yml --limit 3

# 看某次執行的完整 log（secret 內容會被遮罩成 ***）
gh run view <run-id> --log

# 用乾淨字串（無結尾換行）覆蓋設定 secret
printf '%s' "$value" | gh secret set <SECRET_NAME>
```

### 之後要注意

- 若之後要更新 URL 或 key，務必用 `printf '%s' "$value" | gh secret set <NAME>` 這種方式設定，避免透過互動式貼上時不小心夾帶換行或多餘空白。
- 修改這個 yml 後記得確認有 `git push` 上去（GitHub Actions 只認 repo 上實際存在的版本，本機修改未推送不會生效）。
