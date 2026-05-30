import { callLLM } from './_llm.js';
import { createClient } from '@supabase/supabase-js';

const FREE_LIMIT = 20; // AI answers per day on free plan

// Per-IP fallback (for anonymous/unauthenticated requests)
const ipMap = new Map();
function checkIpLimit(ip) {
  const now = Date.now(), window = 24*60*60*1000;
  const entry = ipMap.get(ip);
  if (!entry || now > entry.resetAt) { ipMap.set(ip, { count:1, resetAt:now+window }); return true; }
  if (entry.count >= FREE_LIMIT) return false;
  entry.count++; return true;
}

async function logToAirtable(record) {
  const token=process.env.AIRTABLE_TOKEN, baseId=process.env.AIRTABLE_BASE_ID, tableId=process.env.AIRTABLE_TABLE_ID||'Responses';
  if (!token||!baseId) return;
  try {
    await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`,{method:'POST',headers:{'Authorization':`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({records:[{fields:record}]})});
  } catch(e) { console.error('Airtable error:',e.message); }
}

export default async function handler(req, res) {
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed.'});

  // Rate limiting — user-based if auth token present, IP-based otherwise
  const authHeader = req.headers.authorization;
  let userId = null;

  if (authHeader?.startsWith('Bearer ') && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const token = authHeader.replace('Bearer ', '');
      const { data:{ user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
        const today = new Date().toISOString().split('T')[0];
        const { data: usage } = await supabase.from('daily_usage').select('ai_answers').eq('user_id', userId).eq('date', today).single();
        const count = usage?.ai_answers || 0;
        if (count >= FREE_LIMIT) return res.status(429).json({ error:`You've used all ${FREE_LIMIT} AI-scored answers for today. Come back tomorrow, or use Multiple Choice mode — it's unlimited and works offline.` });
        // Increment usage
        await supabase.from('daily_usage').upsert({ user_id:userId, date:today, ai_answers:count+1 }, { onConflict:'user_id,date' });
      }
    } catch(e) { console.warn('Auth check error:', e.message); }
  }

  // Fallback to IP rate limiting for unauthenticated requests
  if (!userId) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (!checkIpLimit(ip)) return res.status(429).json({ error:'Daily limit reached. Sign in to track your limit or use Multiple Choice mode.' });
  }

  const { meta={}, answer='' } = req.body;
  const { role='', industry='', question='', sessionId='' } = meta;
  const industryCtx = industry&&industry!=='General'?` in the ${industry} industry`:'';

  const prompt = `You are a strict tech interviewer. Score this ${role} answer${industryCtx} honestly. No inflation.

Scale: 1-3 poor | 4-5 below avg | 6 average | 7 good | 8 strong | 9-10 exceptional (rare)
Generic/vague answers = 3-4. Never give 6 out of politeness.

Q: "${question}"
A: "${answer}"

Reply ONLY in JSON, no markdown:
{"technical_depth":0,"communication_clarity":0,"structure":0,"approach":0,"overall":0,"strengths":["s1","s2"],"improvements":["i1","i2"],"feedback":"2-3 direct sentences naming what was missing.","key_points":["point a strong answer covers","another key point","third key point"]}`;

  try {
    const { text, provider } = await callLLM({ userMessages:[{role:'user',content:prompt}], temperature:0.3, maxTokens:600 });
    console.log(`Feedback served by: ${provider}`);
    let fb;
    try { const m=text.match(/\{[\s\S]*\}/); fb=JSON.parse(m?m[0]:text); }
    catch { fb={technical_depth:5,communication_clarity:5,structure:5,approach:5,overall:5,strengths:['Some relevant points'],improvements:['Add specifics','Use a framework'],feedback:'Needs more depth.',key_points:['Use a clear framework','Cover trade-offs','Concrete examples']}; }

    logToAirtable({
      'Name':`${role} · ${industry} · Text · ${fb.overall}/10`,
      'Role':role,'Industry':industry,'Format':'text','Score':fb.overall,
      'Question':question,'Answer':answer,'Feedback':fb.feedback,
      'Correct':false,'Session ID':sessionId,'Timestamp':new Date().toISOString(),
    });

    return res.status(200).json({ content:[{ text:JSON.stringify(fb) }] });
  } catch(err) {
    console.error('Feedback error:',err);
    return res.status(502).json({ error: err.message||'AI service unavailable. Please try again.' });
  }
}
