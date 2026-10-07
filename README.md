# Lead Scraper REST API — Cloudflare Worker

B2B Lead Scraper REST API. Production-ready. Live data via SerpAPI (Google Maps).

## Fitur

- ✅ Live search via SerpAPI (Google Maps engine)
- ✅ JSON only, tidak ada UI
- ✅ CORS ready (`Access-Control-Allow-Origin: *`)
- ✅ Rate limiting (1 req / 5s per IP, free-tier friendly)
- ✅ Graceful error handling (missing key, quota, invalid request)
- ✅ Structured response format (industry standard)
- ✅ ES Module (`export default { async fetch(request, env) }`)

## Env Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SERPAPI_KEY` | ✅ | SerpAPI API key (Google Maps engine) |

Set via:
```bash
wrangler secret put SERPAPI_KEY
```

## Endpoints

### `GET /api`

Query parameters:

| Parameter | Required | Description |
|-----------|----------|-------------|
| `keyword` | ✅ | Kata kunci carian (cth: `restaurant`, `technology`, `logistics`) |
| `location` | ❌ | Daerah/city (cth: `Kuala Lumpur`, `Penang`, `Johor Bahru`) |

Examples:
```bash
# Find restaurants in Kuala Lumpur
curl "https://api.yourdomain.com/api?keyword=restaurant&location=Kuala+Lumpur"

# Find technology companies in Malaysia
curl "https://api.yourdomain.com/api?keyword=technology&location=Malaysia"
```

### Success Response

```json
{
  "success": true,
  "keyword": "restaurant",
  "location": "Kuala Lumpur",
  "count": 12,
  "source": "live_google_maps",
  "timestamp": "2026-10-07T18:30:00.000Z",
  "leads": [
    {
      "id": "ChIJfZ9...",
      "name": "Gouthaman Restaurant",
      "category": "Food & Beverage",
      "location": "123 Jalan Petaling, 50450 Kuala Lumpur, Malaysia",
      "phone": "+60 3-1234 5678",
      "email": "N/A",
      "website": "https://gouthaman.com",
      "rating": 4.5,
      "reviews": 120,
      "status": "active",
      "timestamp": "2026-10-07T18:30:00.000Z"
    }
  ]
}
```

### Error Responses

**400 — Keyword missing:**
```json
{"success": false, "error": "Query parameter 'keyword' is required"}
```

**401 — SerpAPI key missing/invalid:**
```json
{"success": false, "error": "SerpAPI key is missing or invalid. Set SERPAPI_KEY environment variable."}
```

**429 — Rate limit exceeded:**
```json
{"success": false, "error": "SerpAPI rate limit or quota exceeded."}
```

## Deployment

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login

```bash
wrangler login
```

### 3. Set Secret

```bash
wrangler secret put SERPAPI_KEY
```

### 4. Deploy

```bash
wrangler publish
```

### 5. Custom Domain (optional)

- Cloudflare Dashboard → Workers & Pages → `mymachai-leads-api` → Settings → Triggers → Add custom domain

## Project Structure

```
.
├── src/
│   └── index.js      # Main worker entry (ES Module)
├── wrangler.toml     # Worker config (main src/index.js)
├── README.md
└── .gitignore
```

## License

MIT — Guna secara bebas untuk projek komersial.

