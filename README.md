# Lead Scraper API — Cloudflare Worker

REST API JSON-only lead scraper untuk menghasilkan data bisnis (mock/mock generator pakej pertama). 
Disediakan sebagai starter projek untuk dijual di RapidAPI.

## Fitur

- Query: `?keyword=` & `?location=`
- JSON only, tidak ada UI
- CORS ready (`Access-Control-Allow-Origin: *`)
- Rate limiting (1 req / 5s per IP, free-tier friendly)
- Mock data generator + scraping stub (Ganti dengan real scraper kalau perlu)
- Pagination (`?page=` & `?limit=`)

## Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
# atau
pnpm add -g wrangler
```

### 2. Login ke Cloudflare

```bash
wrangler login
```

### 3. Deploy

```bash
wrangler publish
```

Atau deploy manual dari dashboard:
- Cloudflare Dashboard → Workers & Pages → Create Worker
- Edit code → Save and Deploy

## API Endpoint

```
https://mymachai-leads-api.<your-subdomain>.workers.dev/api
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `keyword` | ✅ | Kata kunci carian (cth: `teknologi`, `logistics`) |
| `location` | ❌ | Daerah (cth: `Kuala Lumpur`, `Penang`) |
| `url` | ❌ | URL untuk real scraping |
| `page` | ❌ | Halaman (default 0) |
| `limit` | ❌ | Jumlah hasil (default 20, max 100) |

### Response

```json
{
  "success": true,
  "keyword": "teknologi",
  "location": "Kuala Lumpur",
  "count": 20,
  "page": 0,
  "limit": 20,
  "leads": [
    {
      "id": "lead_0_1700000000000",
      "name": "ABC Enterprise Sdn Bhd",
      "category": "Teknologi",
      "location": "Kuala Lumpur",
      "phone": "+60 123456789",
      "email": "abc-enterprise-sdn-bhd-0@kl.com",
      "status": "lead",
      "source": "mock",
      "keyword": "teknologi",
      "timestamp": "2026-10-07T10:00:00.000Z"
    }
  ],
  "source": "mock",
  "timestamp": "2026-10-07T10:00:00.000Z"
}
```

### CORS

Semua response callback dari `*` (tunggalkan `*` main domain kalau nak lock-down).

### Rate Limit

Free tier: 1 request per 5 seconds per IP. 429 jika over.

## Development

```bash
# Start local dev server
wrangler dev

# Test
curl "http://localhost:8787/api?keyword=teknologi&location=Kuala+Lumpur"
```

## License

MIT — Guna secara bebas untuk projek personal atau komersial.
