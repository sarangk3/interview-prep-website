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
  const { sessionId, role, industry, options, chosenIndex, correctIndex, isCorrect, explanation, question } = req.body;
  const chosenLabel  = options?.[chosenIndex]  ? `${String.fromCharCode(65+chosenIndex)}. ${options[chosenIndex]}`  : '—';
  const correctLabel = options?.[correctIndex] ? `${String.fromCharCode(65+correctIndex)}. ${options[correctIndex]}` : '—';

  await logToAirtable({
    'Name': `${role || '—'} · ${industry || '—'} · MC · ${isCorrect ? '✓ Correct' : '✗ Wrong'}`,
    'Notes': [
      `Session:  ${sessionId || '—'}`,
      `Role:     ${role || '—'}`,
      `Industry: ${industry || '—'}`,
      `Format:   Multiple Choice`,
      `Result:   ${isCorrect ? 'Correct' : 'Incorrect'}`,
      ``,
      `QUESTION:`,
      question || '',
      ``,
      `THEIR ANSWER: ${chosenLabel}`,
      `CORRECT:      ${correctLabel}`,
      ``,
      `EXPLANATION:`,
      explanation || '',
    ].join('\n'),
  });

  return res.status(200).json({ ok: true });
}
