const RATE_LIMIT = 20;
const WINDOW_MS  = 24 * 60 * 60 * 1000;
const ipMap      = new Map();

function checkRateLimit(ip) {
  const now = Date.now(); const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) { ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS }); return true; }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++; return true;
}

async function logToAirtable(record) {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID || 'Responses';
  if (!token || !baseId) return;
  try {
    const r = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ records: [{ fields: record }] }),
    });
    if (!r.ok) console.error('Airtable error:', await r.text());
  } catch (e) { console.error('Airtable log error:', e.message); }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'Daily limit of 20 answers reached. Come back tomorrow or use Multiple Choice mode.' });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured.' });

  const { meta = {}, answer = '' } = req.body;
  const { role = '', industry = '', question = '', sessionId = '' } = meta;
  const industryCtx = industry && industry !== 'General' ? ` in the ${industry} industry` : '';

  // Tight prompt — ~50% fewer tokens than before
  const prompt = `You are a strict tech interviewer. Score this ${role} answer${industryCtx} honestly. No inflation.

Scale: 1-3 poor | 4-5 below avg | 6 average | 7 good | 8 strong | 9-10 exceptional (rare)
Generic/vague answers = 3-4. Never give 6 out of politeness.

Q: "${question}"
A: "${answer}"

Reply ONLY in JSON, no markdown:
{"technical_depth":0,"communication_clarity":0,"structure":0,"approach":0,"overall":0,"strengths":["s1","s2"],"improvements":["i1","i2"],"feedback":"2-3 direct sentences naming what was missing.","key_points":["point a strong answer covers","another key point","third key point"]}`;

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await upstream.json();
    if (!upstream.ok) {
      console.error('Groq error:', data);
      return res.status(upstream.status).json({ error: data?.error?.message || 'AI service error.' });
    }

    const raw = data.choices?.[0]?.message?.content || '';
    let fb;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      fb = JSON.parse(match ? match[0] : raw);
    } catch {
      fb = { technical_depth:5, communication_clarity:5, structure:5, approach:5, overall:5,
        strengths:['Some relevant points raised'], improvements:['Add more specifics','Use a clear structure'],
        feedback:'Answer needs more depth and structure.', key_points:['Use a clear framework','Cover trade-offs','Give concrete examples'] };
    }

    // Log to Airtable (non-blocking)
    logToAirtable({
      'Name':       `${role} · ${industry} · Text · ${fb.overall}/10`,
      'Role':       role,
      'Industry':   industry,
      'Format':     'text',
      'Score':      fb.overall,
      'Question':   question,
      'Answer':     answer,
      'Feedback':   fb.feedback,
      'Correct':    false,
      'Session ID': sessionId,
      'Timestamp':  new Date().toISOString(),
    });

    return res.status(200).json({ content: [{ text: JSON.stringify(fb) }] });

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(502).json({ error: 'Failed to reach AI service. Please try again.' });
  }
}
