/**
 * Lead Scraper REST API — Cloudflare Worker (v2: Live Data via SerpAPI)
 * JSON only, no UI
 * Routes: ?keyword=... & location=...
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

// ────────────────────────────
// SerpAPI Google Maps Live Search
// ────────────────────────────
async function fetchSerpAPI(env, keyword, location) {
  const apiKey = env.SERPAPI_KEY;
  if (!apiKey) {
    console.error('[fetchSerpAPI] SERPAPI_KEY is missing from env:', {
      envKeys: Object.keys(env || {}),
      hasSERPAPI_KEY: !!env?.SERPAPI_KEY,
    });
    throw new Error('SERPAPI_KEY is not configured in environment variables.');
  }

  const query = encodeURIComponent(keyword || '');
  // SerpAPI requires z or m when location is used (city-level zoom = 13)
  const locationParam = location ? `&location=${encodeURIComponent(location)}&z=13` : '';

  const url = `https://serpapi.com/search.json?engine=google_maps&q=${query}&type=search&api_key=${apiKey}${locationParam}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadScraper/1.0)' },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SerpAPI request failed: ${res.status} ${res.statusText} — ${text}`);
  }

  const data = await res.json();

  // Extract from data.local_results (Google Maps results)
  const results = data.local_results || [];
  if (results.length === 0) {
    throw new Error('No results found from SerpAPI. Check API key or query.');
  }

  return results.map((place, idx) => normalizeLead(place, idx, keyword, location));
}

function extractPhone(place) {
  const phone = place.get_results?.phone || place.phone || place.tel || '';
  return phone || 'N/A';
}

function extractEmail(place) {
  const email = place.get_results?.email || place.email || '';
  return email || 'N/A';
}

function extractWebsite(place) {
  const url = place.get_results?.website || place.website || place.url || '';
  return url || 'N/A';
}

function inferCategory(place) {
  const cats = [
    place.get_results?.categories?.[0] ||
    place.get_results?.type ||
    place.category ||
    '',
  ];
  return cats[0] || 'Unknown';
}

function normalizeLead(place, idx, keyword, location) {
  const createdAt = place.knowledge_graph?.found?.[0]?.date_found ||
    new Date().toISOString();

  return {
    id: place.get_results?.place_id || place.place_id || `place_${idx}_${Date.now()}`,
    name: place.get_results?.title || place.title || `Business ${idx + 1}`,
    category: inferCategory(place),
    location: place.get_results?.address || place.location || place.address || location || 'N/A',
    phone: extractPhone(place),
    email: extractEmail(place),
    website: extractWebsite(place),
    rating: place.get_results?.rating || place.rating || 0,
    reviews: place.get_results?.rating_count || place.reviews || 0,
    status: 'active',
    timestamp: createdAt,
    keyword: keyword || 'N/A',
  };
}

// ────────────────────────────
// Main request handler
// ────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const location = url.searchParams.get('location');

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // Validate keyword
    if (!keyword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Query parameter 'keyword' is required",
        }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    try {
      const leads = await fetchSerpAPI(env, keyword, location);
      const response = {
        success: true,
        keyword: keyword,
        location: location || null,
        count: leads.length,
        source: 'live_google_maps',
        timestamp: new Date().toISOString(),
        leads,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: CORS_HEADERS,
      });
    } catch (err) {
      console.error('[Lead Scraper Error]', err);

      const message = err.message || 'Unknown error';

      if (message.includes('SERPAPI_KEY') || message.includes('401') || message.includes('unauthorized')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'API key not configured. Please contact admin.'
          }),
          { status: 500, headers: CORS_HEADERS }
        );
      }

      if (message.includes('429') || message.includes('rate limit')) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Rate limit exceeded. Please try again later.'
          }),
          { status: 429, headers: CORS_HEADERS }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: `Error: ${message}`
        }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  },
};