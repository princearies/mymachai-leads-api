# 🌍 Global Google Maps B2B Lead Scraper API

An ultra-fast, production-ready REST API powered by Cloudflare Workers and SerpAPI to scrape real-time B2B business leads from Google Maps worldwide.

## ⚡ Key Features
- **Global Coverage:** Fetch live business data for any city or country (e.g., London, New York, Tokyo, Kuala Lumpur).
- **Real-Time Live Data:** Powered by live Google Maps records.
- **Developer & No-Code Friendly:** Export data to JSON, Python, JavaScript, or direct into Microsoft Excel / Google Sheets.
- **High Availability:** Hosted on Cloudflare Edge Network with global low-latency response times.

---

## 🚀 API Endpoint & Query Parameters

### `GET /leads`

| Parameter  | Type   | Required | Description | Example |
| :---       | :---   | :---     | :---        | :---    |
| `keyword`  | String | **Yes**  | Business niche / keyword | `coffee shop`, `dentist`, `hardware store` |
| `location` | String | No       | Target city or region | `Kuala Lumpur`, `London`, `New York` |

---

## 📄 Response Payload Example (JSON)

```json
{
  "success": true,
  "keyword": "coffee shop",
  "location": "London",
  "count": 20,
  "source": "live_google_maps",
  "timestamp": "2026-10-07T10:55:01.376Z",
  "leads": [
    {
      "id": "ChIJ31RUqd1KzDER...",
      "name": "London Artisan Coffee",
      "category": "Coffee Shop",
      "location": "123 Oxford Street, London, UK",
      "phone": "+44 20 7946 0912",
      "website": "https://example.com",
      "rating": 4.7,
      "reviews": 185,
      "status": "active"
    }
  ]
}
```
