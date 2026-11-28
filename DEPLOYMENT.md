# Nebula 部署與網域設定（主機層）

這份文件處理《改進提示詞》第六節中**無法只靠前端檔案完成**的項目。前端已補上 favicon、canonical、description、Open Graph 與 `theme-color`；以下是主機／CDN 需要配合的設定。

## 1. 根網域與 www

`https://nebula.ink`（不帶 www）目前無法連線，必須與 `https://www.nebula.ink` 指向同一站點，並永久轉址。

### DNS（任選其一）

- **ALIAS / ANAME / CNAME flattening**（推薦，Cloudflare、DNSimple、Route 53 Alias）：
  - `nebula.ink` → `ALIAS` 指向 `www.nebula.ink` 或主機提供的目標。
  - `www.nebula.ink` → `CNAME` 指向主機。
- **A / AAAA 記錄**：把 `nebula.ink` 的 A/AAAA 設成與 `www` 相同的 IP。
- 不要只設定 `www` 而讓 apex 留空。

### 轉址（主機或 CDN）

Nginx 範例：

```nginx
server {
  listen 80;
  server_name nebula.ink www.nebula.ink;
  return 301 https://www.nebula.ink$request_uri;
}

server {
  listen 443 ssl http2;
  server_name nebula.ink;
  ssl_certificate     /etc/letsencrypt/live/nebula.ink/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/nebula.ink/privkey.pem;
  return 301 https://www.nebula.ink$request_uri;
}

server {
  listen 443 ssl http2;
  server_name www.nebula.ink;
  root /var/www/nebula;
  index index.html;

  add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;

  # HTML 不快取，確保改版立即生效
  location = /index.html {
    add_header Cache-Control "no-cache, must-revalidate";
  }

  # 靜態資源：檔名加內容雜湊後可長期快取（見下一節）
  location ~* \.(css|js|png|svg|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
}
```

Cloudflare 等 CDN：建立 Redirect Rule，`nebula.ink/*` → `https://www.nebula.ink/$1`，狀態碼 301；同時開啟「Always Use HTTPS」。

### 驗收

```bash
curl -I https://nebula.ink
# 期待 301 / 308，Location: https://www.nebula.ink/
curl -I http://nebula.ink
# 期待 301 到 https
```

## 2. 快取與拆包

目前前端是 `index.html` + `styles.css` + `themes.css` + `ui.css` + `levels.js` + `app.js` + `studio.js`。其中 `levels.js`（約 76 KB）與 `app.js`（約 600 KB）最大，且檔名沒有內容雜湊，導致幾乎無法長期快取。

建議：

1. 建置時把檔名改成內容雜湊，例如 `app.9f2c1a.js`、`levels.4b71d0.js`，HTML 內引用對應檔名。
2. 靜態資源設 `Cache-Control: public, max-age=31536000, immutable`。
3. `index.html` 設 `no-cache`（或短 max-age + ETag）。
4. 進一步按星區拆分：和弦詞典、調式、樂句、譜例、測驗各自 lazy load 或動態 import；`studio.js` 的分析與五度圈可只在進入對應星區時載入。
5. 開啟 Brotli / gzip；字型若使用系統字型棧（PingFang TC、Noto Sans CJK TC、Microsoft JhengHei）可省下網路字型成本。

## 3. 分享預覽

已加入：

- `<link rel="canonical" href="https://www.nebula.ink/">`
- `description`、Open Graph（title／description／url／type／site_name）與 Twitter card。
- 內嵌 SVG favicon。

建議補一張 1200×630 的 `og-image.png`，並加上：

```html
<meta property="og:image" content="https://www.nebula.ink/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:image" content="https://www.nebula.ink/og-image.png" />
```

## 4. 其他主機層建議

- 啟用 HTTP/2 或 HTTP/3。
- 設定 404 頁回到 `https://www.nebula.ink/#dictionary`，避免直接顯示伺服器錯誤。
- 若使用 SPA 路由（目前是 hash 路由，不需要 rewrite），保留 `index.html` fallback。
- 定期備份：本機資料只存在瀏覽器；請在教學或工作坊流程中提醒使用者用「匯出工作區」備份。
