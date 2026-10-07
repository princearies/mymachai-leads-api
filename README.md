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

---

## 📊 How to Import API Leads Directly into Microsoft Excel (Without Coding)

1. Copy your API Endpoint URL from RapidAPI (including your RapidAPI key headers) or your direct worker endpoint:
   `https://mymachai-leads-api.p.rapidapi.com/leads?keyword=dental&location=Kuala+Lumpur`
2. Open Microsoft Excel (Excel 2016 or newer / Office 365).
3. Go to the top menu tab **Data** ➔ Click **Get Data** ➔ **From Other Sources** ➔ Select **From Web**.
4. In the pop-up box:
   - Select **Advanced**.
   - Paste your API Request URL into the URL parts field.
   - Under HTTP request header parameters, add your RapidAPI Headers:
     - `X-RapidAPI-Key`: `YOUR_RAPIDAPI_KEY`
     - `X-RapidAPI-Host`: `mymachai-leads-api.p.rapidapi.com`
5. Click **OK**. Power Query Editor will open.
6. Click on leads list ➔ Click **To Table** at the top left ➔ Click the Expand Icon (double arrow) on the column header to select all fields (name, phone, location, rating, etc.).
7. Click **Close & Load**. Your live business leads are now populated directly into an Excel spreadsheet!

---

## 📈 How to Import Leads Directly into Google Sheets (No-Code Tutorial)

You can easily pull live B2B leads into Google Sheets using the free "API Connector" extension or Google Apps Script:

### Method: Using API Connector Extension (Recommended)

1. Open a new **Google Sheet**.
2. Go to top menu: **Extensions** ➔ **Add-ons** ➔ **Get add-ons**.
3. Search for **API Connector** (by InstallSimple) and click **Install**.
4. Open the extension (**Extensions** ➔ **API Connector** ➔ **Open**).
5. Configure your API Request:
   - **Request URL:** `https://mymachai-leads-api.p.rapidapi.com/leads?keyword=restaurant&location=Singapore`
   - **Headers:** Add your RapidAPI key:
     - Key: `X-RapidAPI-Key` | Value: `YOUR_RAPIDAPI_KEY`
     - Key: `X-RapidAPI-Host` | Value: `mymachai-leads-api.p.rapidapi.com`
6. Set Output Destination to current sheet cell (`Sheet1!A1`).
7. Click **Run**. All live business leads, phone numbers, and addresses will automatically populate into your Google Sheet!
