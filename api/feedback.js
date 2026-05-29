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
    const body = await r.json();
    if (!r.ok) console.error('Airtable error:', JSON.stringify(body));
  } catch (e) { console.error('Airtable log error:', e.message); }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) return res.status(429).json({ error: 'You have reached the daily limit of 20 scored answers. Come back tomorrow, or use Multiple Choice mode in the meantime.' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured on the server.' });

  try {
    const { meta, ...anthropicBody } = req.body;
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(anthropicBody),
    });

    const data = await upstream.json();
    if (!upstream.ok) { console.error('Anthropic error:', upstream.status, data); return res.status(upstream.status).json({ error: data?.error?.message || 'Anthropic API error.' }); }

    // Log to Airtable using default Name + Notes fields
    try {
      const raw = data.content?.[0]?.text || '';
      const match = raw.match(/\{[\s\S]*\}/);
      const fb = JSON.parse(match ? match[0] : raw);
      const { role, industry, question, sessionId } = meta || {};
      const answerText = req.body.messages?.[0]?.content?.match(/Candidate's Answer: "([\s\S]+?)"\n\nEvaluate/)?.[1] || '';

      logToAirtable({
        'Name': `${role || '—'} · ${industry || '—'} · Text · ${fb.overall || '?'}/10`,
        'Notes': [
          `Session:    ${sessionId || '—'}`,
          `Role:       ${role || '—'}`,
          `Industry:   ${industry || '—'}`,
          `Format:     Text`,
          `Score:      ${fb.overall || '?'}/10`,
          `Technical:  ${fb.technical_depth || '?'}/10`,
          `Clarity:    ${fb.communication_clarity || '?'}/10`,
          `Structure:  ${fb.structure || '?'}/10`,
          `Approach:   ${fb.approach || '?'}/10`,
          ``,
          `QUESTION:`,
          question || '',
          ``,
          `ANSWER:`,
          answerText,
          ``,
          `FEEDBACK:`,
          fb.feedback || '',
          ``,
          `STRENGTHS:`,
          ...(fb.strengths || []).map(s => `+ ${s}`),
          ``,
          `IMPROVEMENTS:`,
          ...(fb.improvements || []).map(i => `→ ${i}`),
        ].join('\n'),
      });
    } catch (e) { console.error('Airtable parse error:', e.message); }

    return res.status(200).json(data);
  } catch (err) { console.error('Proxy error:', err); return res.status(502).json({ error: 'Failed to reach the AI service. Please try again.' }); }
}
