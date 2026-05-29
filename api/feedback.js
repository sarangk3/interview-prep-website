/**
 * Serverless proxy for Anthropic API.
 * - Keeps the API key server-side (never exposed to the browser)
 * - Rate limits per IP: max 20 scored answers per 24 hours
 */

const RATE_LIMIT   = 20;                      // max requests per IP
const WINDOW_MS    = 24 * 60 * 60 * 1000;    // 24-hour window

// In-memory store — resets per cold start, good enough for abuse prevention
const ipMap = new Map();

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  // Rate limit by IP
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'You have reached the daily limit of 20 scored answers. Come back tomorrow, or use Multiple Choice mode in the meantime.',
    });
  }

  // Forward to Anthropic with the server-side key
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set');
    return res.status(500).json({ error: 'API key not configured on the server. Please check Vercel environment variables.' });
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('Anthropic error:', upstream.status, data);
      return res.status(upstream.status).json({ error: data?.error?.message || 'Anthropic API error.' });
    }
    return res.status(200).json(data);
  } catch (err) {
    console.error('Anthropic proxy error:', err);
    return res.status(502).json({ error: 'Failed to reach the AI service. Please try again.' });
  }
}
