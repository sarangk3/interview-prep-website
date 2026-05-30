/**
 * Shared LLM helper.
 * Primary: Groq (Llama 3.3 70B) — 14,400 req/day free, reliable
 * Fallback: Gemini 1.5 Flash — when Groq is rate-limited
 *
 * Note: swap order here when Gemini key is confirmed working.
 */

const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`;

export async function callLLM({ system, userMessages, temperature = 0.4, maxTokens = 600 }) {
  const groqKey   = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  /* ── 1. Groq (primary) ─────────────────────────────────── */
  if (groqKey) {
    try {
      const messages = [];
      if (system) messages.push({ role: 'system', content: system });
      messages.push(...userMessages.map(m => ({
        role: m.role === 'model' ? 'assistant' : m.role,
        content: m.content,
      })));

      const res  = await fetch(GROQ_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
        body: JSON.stringify({ model:'llama-3.3-70b-versatile', max_tokens:maxTokens, temperature, messages }),
      });
      const data = await res.json();

      if (res.status === 429 || res.status >= 500) {
        console.warn(`Groq rate-limited (${res.status}), falling back to Gemini`);
        throw new Error('retry');
      }
      if (!res.ok) throw new Error(data?.error?.message || `Groq HTTP ${res.status}`);

      const text = data?.choices?.[0]?.message?.content;
      if (!text) throw new Error('Empty Groq response');
      console.log('Served by: groq');
      return { text, provider: 'groq' };

    } catch (err) {
      if (err.message !== 'retry') {
        console.warn(`Groq error: ${err.message}, falling back to Gemini`);
      }
    }
  }

  /* ── 2. Gemini (fallback) ──────────────────────────────── */
  if (geminiKey) {
    try {
      const msgs = [...userMessages];
      if (system && msgs.length > 0) {
        msgs[0] = { ...msgs[0], content: `${system}\n\n${msgs[0].content}` };
      }
      const contents = msgs.map(m => ({
        role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const res  = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig:{ temperature, maxOutputTokens:maxTokens } }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || `Gemini HTTP ${res.status}`);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty Gemini response');
      console.log('Served by: gemini');
      return { text, provider: 'gemini' };
    } catch (err) {
      console.error(`Gemini fallback error: ${err.message}`);
    }
  }

  throw new Error('All AI providers unavailable. Please try again.');
}
