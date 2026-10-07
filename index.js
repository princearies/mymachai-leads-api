/**
 * Lead Scraper REST API — Cloudflare Worker
 * JSON only, no UI
 * Routes: ?keyword=... & location=...
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

// ────────────────────────────
// Mock data generator (free-tier friendly)
// Gantikan dengan real scraping call kalau perlu
// ────────────────────────────
function generateMockLeads(keyword = '', location = '') {
  const leads = []
  const names = [
    'ABC Enterprise Sdn Bhd',
    'ABC International Trading',
    'XYZ Services Malaysia',
    'XYZ Corporation',
    '123 Digital Solutions',
    '456 Tech Services',
    'Prime Business Group',
    'Prime Harbor Logistics',
    'Northwind Manufacturing',
    'Apex Solutions Sdn Bhd',
  ]
  const categories = [
    'Teknologi', 'Logistics', 'Kewangan', 'Perindustrian',
    'Jasa', 'Kesihatan', 'Pendidikan', 'Pembinaan',
    'Perdagangan', 'Konsultasi', 'Perhotelan',
  ]
  const locations = [
    'Kuala Lumpur', 'Penang', 'Johor Bahru', 'Kuching',
    'Kota Kinabalu', 'Malacca', 'Kuantan', 'Ipoh', 'Sandakan', 'Miri',
  ]
  const phones = Array.from({ length: 50 }, (_, i) =>
    `+60 ${Math.floor(Math.random() * 9000000000) + 1000000000}`
  )

  const keywordLower = (keyword || '').toLowerCase()
  for (let i = 0; i < 5; i++) {
    const name =
      names[Math.floor(Math.random() * names.length)] +
      (i > 0 ? ` ${i}G` : '')
    const category = categories[Math.floor(Math.random() * categories.length)]
    const loc = location || locations[Math.floor(Math.random() * locations.length)]
    const phone = phones[i]
    const email = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}@${loc.toLowerCase().split(' ').join('')}.com`
    const status = i === 0 ? 'lead' : (i === 1 ? 'contact' : 'inquiry')

    leads.push({
      id: `lead_${i}_${Date.now()}`,
      name,
      category,
      location: loc,
      phone,
      email,
      status,
      source: 'mock',
      keyword: keywordLower,
      timestamp: new Date().toISOString(),
    })
  }
  return leads
}

// ────────────────────────────
// Scraping stub (ekstrak dari URL, optional)
// ────────────────────────────
async function scrapeLeads(rawUrl) {
  try {
    const res = await fetch(rawUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadScraper/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const text = await res.text()
    // Placeholder: extract name/category/location/phone/email pattern
    const leads = []
    const lines = text.split(/[\n\r]+/)
    for (const line of lines) {
      if (!line.trim()) continue
      const m = line.match(/name["\s:]+([^,\n]+)/i)
      const c = line.match(/category["\s:]+([^,\n]+)/i)
      const l = line.match(/location["\s:]+([^,\n]+)/i)
      const p = line.match(/phone["\s:]+([^,\n]+)/i)
      const e = line.match(/email["\s:]+([^,\n]+)/i)
      if (m || c || l || p || e) {
        leads.push({
          name: m?.[1] || 'N/A',
          category: c?.[1] || 'N/A',
          location: l?.[1] || 'N/A',
          phone: p?.[1] || 'N/A',
          email: e?.[1] || 'N/A',
          source: 'scrape',
          timestamp: new Date().toISOString(),
        })
      }
    }
    return leads.slice(0, 5)
  } catch {
    return null
  }
}

// ────────────────────────────
// Main fetch handler
// ────────────────────────────
export default {
  async fetch(req, env, ctx) {
    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    // Rate limiting (free-tier safe: 1 req / 5s per IP)
    const ip =
      req.headers.get('CF-Connecting-IP') || req.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    if (env.RATE_LIMIT && env.RATE_LIMIT[ip] && env.RATE_LIMIT[ip] > now - 5000) {
      return new Response(JSON.stringify({ error: 'Rate limited' }), {
        status: 429,
        headers: { ...CORS_HEADERS, 'Cache-Control': 'no-store' },
      })
    }
    env.RATE_LIMIT = env.RATE_LIMIT || {}
    env.RATE_LIMIT[ip] = now + 5000

    try {
      const url = new URL(req.url)
      const keyword = url.searchParams.get('keyword') || ''
      const location = url.searchParams.get('location') || ''

      // Keyword harus ada (Botulious filter hapus?)
      if (!keyword) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Parameter "keyword" diperlukan.',
            example: '?keyword=teknologi&location=Kuala+Lumpur',
          }),
          {
            status: 400,
            headers: CORS_HEADERS,
            cacheControl: 'no-store',
          }
        )
      }

      // 1. Cuba scrape dari URL user (if provided)
      const scrapeUrl = url.searchParams.get('url')
      let leads = null
      if (scrapeUrl) {
        leads = await scrapeLeads(scrapeUrl)
      }

      // 2. Fallback: mock data generator
      if (!leads) {
        leads = generateMockLeads(keyword, location)
      }

      // Pagination (optional)
      const page = Math.max(0, parseInt(url.searchParams.get('page') || '0', 10))
      const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)))
      const start = page * limit
      const sliced = leads.slice(start, start + limit)

      return new Response(
        JSON.stringify({
          success: true,
          keyword,
          location,
          count: sliced.length,
          page,
          limit,
          leads: sliced,
          source: leads.some(l => l.source === 'scrape') ? 'scrape' : 'mock',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: CORS_HEADERS,
          cacheControl: 'no-store',
        }
      )
    } catch (err) {
      return new Response(
        JSON.stringify({
          success: false,
          error: err.message || 'Internal server error',
          timestamp: new Date().toISOString(),
        }),
        {
          status: 500,
          headers: CORS_HEADERS,
          cacheControl: 'no-store',
        }
      )
    }
  },
}
