import { callLLM } from './_llm.js';
import { createClient } from '@supabase/supabase-js';

const MAX_TURNS = 5;

// Company-specific interviewer personas
const COMPANY_CONFIG = {
  Anthropic: {
    style: `You are a senior interviewer at Anthropic. Anthropic values careful, nuanced reasoning, explicit acknowledgment of uncertainty and tradeoffs, safety considerations in every system design, intellectual honesty, and thinking about second-order effects and failure modes. Push back hard on overconfident claims. Expect candidates to reason out loud and name their assumptions.`,
    nudge: `Ask the candidate to consider what could go wrong with their approach, or what assumptions they're making that could fail.`,
    scoring: `Weight reasoning quality and intellectual honesty heavily. Penalize overconfidence. Reward explicit acknowledgment of tradeoffs and failure modes.`,
  },
  OpenAI: {
    style: `You are a senior interviewer at OpenAI. OpenAI values speed and iteration, strong opinions on impact, practical deployment thinking, comfort with ambiguity, and scale. Push candidates to make concrete decisions quickly rather than endlessly exploring options.`,
    nudge: `Push the candidate to commit to a specific approach and explain how they would ship it in the next 30 days.`,
    scoring: `Weight decisiveness, practical thinking, and impact orientation. Penalize analysis paralysis. Reward concrete proposals with clear success metrics.`,
  },
  Google: {
    style: `You are a senior interviewer at Google. Google values systems thinking at massive scale, data-driven decisions, technical depth, structured problem-solving, and cross-functional awareness. Push candidates to think about edge cases, scale bottlenecks, and measurement.`,
    nudge: `Ask the candidate how they would measure success and what happens when this system needs to handle 100x the current volume.`,
    scoring: `Weight structured thinking, scale considerations, and measurement plans. Penalize hand-wavy answers without metrics. Reward explicit edge case handling.`,
  },
  Meta: {
    style: `You are a senior interviewer at Meta. Meta values social impact at scale, open source mindset, speed and pragmatism, cross-platform thinking, and real-world adoption. Push candidates to think about user behavior, network effects, and adoption.`,
    nudge: `Ask the candidate how real users will actually adopt and engage with this, and what the network effects look like.`,
    scoring: `Weight user impact thinking, pragmatism, and adoption strategy. Penalize over-engineering. Reward network effect thinking.`,
  },
  Microsoft: {
    style: `You are a senior interviewer at Microsoft. Microsoft values enterprise readiness, Azure and cloud-native thinking, integration with the Microsoft ecosystem, partner and customer obsession, and responsible AI with governance. Push candidates to think about enterprise procurement, compliance, and ecosystem integration.`,
    nudge: `Ask the candidate how a Fortune 500 enterprise IT team would approve and deploy this solution, and what compliance requirements apply.`,
    scoring: `Weight enterprise readiness, compliance thinking, and ecosystem integration. Penalize consumer-only thinking. Reward governance considerations.`,
  },
  Amazon: {
    style: `You are a senior interviewer at Amazon. Amazon's Leadership Principles drive everything: customer obsession (start with the customer, work backwards), ownership (think like an owner), invent and simplify, dive deep (get into the details), and deliver results. Expect candidates to anchor every decision to customer impact and be specific about metrics, owners, and timelines.`,
    nudge: `Ask the candidate to start from the customer perspective — who is the customer, what is their specific problem, and how does this solution measurably improve their situation?`,
    scoring: `Weight customer-backward thinking, ownership mentality, and specificity about metrics. Penalize vague answers. Reward explicit customer impact framing.`,
  },
  Nvidia: {
    style: `You are a senior interviewer at Nvidia. Nvidia values deep technical expertise in compute and parallelism, developer ecosystem thinking, performance obsession, full-stack platform awareness (CUDA, cuDNN, Triton), and AI infrastructure at scale. Push candidates to think about compute efficiency, hardware constraints, and developer experience.`,
    nudge: `Ask the candidate where the compute bottleneck is in their proposed solution and how they would profile and optimize it.`,
    scoring: `Weight technical depth, compute efficiency thinking, and developer experience. Penalize hardware-ignorant solutions. Reward explicit performance bottleneck analysis.`,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const authHeader = req.headers.authorization;
  let isPro = false;

  if (authHeader?.startsWith('Bearer ') && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const sb = createClient(
        process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data: { user } } = await sb.auth.getUser(authHeader.replace('Bearer ', ''));
      if (user) {
        const { data: prof } = await sb.from('profiles').select('is_pro,pro_expires_at,mocks_completed').eq('id', user.id).single();
        isPro = prof?.is_pro && (!prof?.pro_expires_at || new Date(prof.pro_expires_at) > new Date());

        if (req.body.mode !== 'score') {
          const today = new Date().toISOString().split('T')[0];
          const { data: usage } = await sb.from('daily_usage').select('ai_answers').eq('user_id', user.id).eq('date', today).single();
          const count = usage?.ai_answers || 0;
          const limit = isPro ? 999 : 20;
          if (count >= limit) return res.status(429).json({ error: "You've used all your free AI answers for today. Upgrade to Pro for unlimited." });
          await sb.from('daily_usage').upsert({ user_id: user.id, date: today, ai_answers: count + 1 }, { onConflict: 'user_id,date' });
        }

        if (req.body.mode === 'score' && !isPro) {
          await sb.from('profiles').upsert({
            id: user.id,
            mocks_completed: (prof?.mocks_completed || 0) + 1
          }, { onConflict: 'id' });
        }
      }
    } catch (e) { console.warn('Mock auth check:', e.message); }
  }

  const { mode, messages, role, industry, company = 'Anthropic', turn, maxTurns, openingProblem, keyComponents, hints } = req.body;
  const cfg = COMPANY_CONFIG[company] || COMPANY_CONFIG.Anthropic;
  const industryCtx = industry && industry !== 'General' ? ` in the ${industry} industry` : '';
  const isFinalTurn = turn >= MAX_TURNS;
  const isLastTwo = turn >= MAX_TURNS - 1;

  try {
    if (mode === 'score') {
      const transcript = messages.map(m => `${m.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${m.content}`).join('\n\n');

      const scorePrompt = `You evaluated a mock interview for a ${role} role${industryCtx} targeting ${company}.

${cfg.scoring}

Opening problem: "${openingProblem}"

Key components a strong answer should cover:
${(keyComponents || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

Full conversation:
${transcript}

Score the candidate (1-10, honest):
- structure, depth, problem_solving, adaptability, communication

Reply ONLY in this JSON (no markdown):
{"structure":7,"depth":6,"problem_solving":7,"adaptability":6,"communication":8,"overall":7,"strengths":["s1","s2","s3"],"improvements":["g1","g2","g3"],"summary":"2-3 sentences on performance.","components_covered":["what they got"],"components_missed":["what they missed"]}`;

      const { text } = await callLLM({ userMessages: [{ role: 'user', content: scorePrompt }], temperature: 0.2, maxTokens: 700 });
      const match = text.match(/\{[\s\S]*\}/);
      const score = JSON.parse(match ? match[0] : text);
      return res.status(200).json({ score });

    } else {
      // Pick the progressive hint for this turn
      const currentHint = hints && hints[turn - 1] ? hints[turn - 1] : null;

      const system = `You are a senior interviewer at ${company} conducting a mock interview for a ${role} role${industryCtx}.

${cfg.style}

Opening problem you gave: "${openingProblem}"

The ideal solution has these key components — you know them, the candidate does not:
${(keyComponents || []).map((c, i) => `${i + 1}. ${c}`).join('\n')}

Your job: ask questions that steer the candidate toward these components WITHOUT revealing them directly.

Turn ${turn} of ${MAX_TURNS}.

${isFinalTurn
  ? "This is the final turn. Acknowledge their answer in one sentence, then close: 'That brings us to the end of our session — thank you for your time.'"
  : isLastTwo
    ? `IMPORTANT: This is one of the final rounds. If the candidate hasn't addressed key components yet, now is the time to guide them more directly. ${cfg.nudge} Then ask one focused follow-up question.`
    : `${currentHint ? `If the candidate hasn't addressed this area yet, steer toward it: "${currentHint}"` : 'Probe the most important gap in their answer so far.'}
React specifically to what the candidate just said. ${turn === 1 ? 'Acknowledge their opening in one sentence, then probe the most critical gap.' : 'Go deeper on a specific detail they haven\'t fully addressed.'}
2-4 sentences ending with ONE sharp question.`}

Stay in character as a ${company} interviewer at all times.`;

      const userMessages = [];
      for (let i = 1; i < messages.length; i++) {
        userMessages.push({
          role: messages[i].role === 'candidate' ? 'user' : 'model',
          content: messages[i].content,
        });
      }

      const { text } = await callLLM({ system, userMessages, temperature: 0.7, maxTokens: 300 });
      return res.status(200).json({ reply: text.trim() });
    }
  } catch (err) {
    console.error('Mock API error:', err);
    return res.status(502).json({ error: err.message || 'AI service unavailable. Please try again.' });
  }
}
