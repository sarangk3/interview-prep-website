import React, { useState, useEffect } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/* ─── Global CSS ───────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: #060a16;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }
    .syne { font-family: 'Syne', sans-serif; }
    textarea, input, button { font-family: 'DM Sans', system-ui, sans-serif; }
    textarea { resize: none; }
    textarea:focus, input:focus { outline: none; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 4px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes scalePop { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .fade-up   { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
    .fade-in   { animation: fadeIn 0.3s ease both; }
    .scale-pop { animation: scalePop 0.55s cubic-bezier(.22,.68,0,1.2) both; }
    .delay-1 { animation-delay: 0.08s; } .delay-2 { animation-delay: 0.16s; }
    .delay-3 { animation-delay: 0.24s; } .delay-4 { animation-delay: 0.32s; }
    .delay-5 { animation-delay: 0.40s; } .delay-6 { animation-delay: 0.48s; }
    .spinner { display: inline-block; width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.15); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
    .role-card { cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
    .role-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
    .btn { cursor: pointer; border: none; transition: opacity 0.15s ease, transform 0.15s ease; font-weight: 500; }
    .btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn:active:not(:disabled) { transform: translateY(0); }
    .btn:disabled { opacity: 0.35; cursor: not-allowed; }
    .nav-btn { cursor: pointer; background: none; border: none; color: #64748b; font-size: 13px; font-weight: 500; padding: 8px 14px; border-radius: 8px; transition: color 0.15s, background 0.15s; display: flex; align-items: center; gap: 6px; font-family: 'DM Sans', sans-serif; }
    .nav-btn:hover { color: #e2e8f0; background: rgba(255,255,255,0.06); }
    .mc-option { cursor: pointer; transition: all 0.18s ease; }
    .mc-option:hover { border-color: rgba(255,255,255,0.2) !important; background: rgba(255,255,255,0.05) !important; }
    .seg { cursor: pointer; transition: all 0.2s ease; }
  `}</style>
);

/* ─── Constants ─────────────────────────────────────────────────────── */
const ROLE_CFG = {
  'System Design':    { color: '#a78bfa', glow: 'rgba(167,139,250,0.18)', label: 'Architecture & Scale'  },
  'DevOps/SRE':       { color: '#34d399', glow: 'rgba(52,211,153,0.18)',  label: 'Infrastructure & SLOs' },
  'Backend Engineer': { color: '#60a5fa', glow: 'rgba(96,165,250,0.18)',  label: 'APIs & Data Systems'   },
  'Product Manager':  { color: '#fbbf24', glow: 'rgba(251,191,36,0.18)',  label: 'Strategy & Roadmaps'   },
  'TPM':              { color: '#f472b6', glow: 'rgba(244,114,182,0.18)', label: 'Programs & Delivery'   },
};
const ROLES = Object.keys(ROLE_CFG);

const TEXT_QUESTIONS = {
  'System Design': [
    "Design a URL shortening service like bit.ly. Walk through your architecture and how you'd handle 100M requests/day.",
    "Design a real-time chat application. How do you handle message delivery guarantees and scale to millions of users?",
    "Design Twitter's news feed. How do you generate, rank, and deliver feeds efficiently at scale?",
    "Design a distributed cache like Redis. What eviction strategies would you implement and why?",
    "Design a video streaming platform. How do you handle transcoding, CDN distribution, and adaptive bitrate?",
  ],
  'DevOps/SRE': [
    "Walk me through designing a production-grade CI/CD pipeline. How do you handle rollbacks and zero-downtime deploys?",
    "Design an observability stack for a microservices architecture. How do you set SLOs and handle alerts?",
    "How do you approach infrastructure as code? Describe your strategy for multi-region deployments.",
    "Walk me through your incident response playbook. How do you conduct blameless post-mortems?",
    "Design a disaster recovery strategy for a payment service with a 99.99% uptime SLA.",
  ],
  'Backend Engineer': [
    "Design a payment processing system. How do you ensure idempotency, reliability, and fraud detection?",
    "You have a slow query taking 8 seconds. Walk me through your investigation and optimization approach.",
    "Design an API rate limiter. Compare token bucket vs sliding window and when you'd use each.",
    "How would you implement distributed transactions across microservices without 2PC?",
    "Design a job queue for async processing. How do you handle retries, dead letters, and ordering?",
  ],
  'Product Manager': [
    "Walk me through how you'd prioritize a backlog with 50 features requested by different stakeholders.",
    "You launched a feature and DAU dropped 5%. How do you diagnose what happened and what do you do next?",
    "Describe your approach to competitive analysis. How does it actually feed into your roadmap decisions?",
    "How do you navigate a situation where engineering says a feature will take 6 months but sales promised it in 2?",
    "Walk me through a product decision where you said no to a major stakeholder. What was your reasoning?",
  ],
  'TPM': [
    "You're running a program with 8 teams across 3 orgs and a hard ship date. How do you manage dependencies?",
    "How do you build and maintain a program status dashboard that leadership actually trusts?",
    "Walk me through your risk management framework. Give a real example of a risk that materialized.",
    "How do you decide when to cut scope vs. push the ship date vs. add resources?",
    "Describe a program that went off the rails. How did you detect it early and replan?",
  ],
};

const MC_QUESTIONS = {
  'System Design': [
    { q: "A URL shortener must handle 100M reads/day with low latency. Which approach scales best?",
      options: ["Single PostgreSQL instance, no caching", "Distributed cache (Redis) in front of the DB, with read replicas", "Generate URLs on-the-fly without storing them", "One in-memory hashmap on a single server"],
      correct: 1, explanation: "Read-heavy workloads benefit most from a cache layer plus read replicas. A single DB or single server can't handle the load, and on-the-fly generation can't guarantee uniqueness or persistence." },
    { q: "For a chat app, how do you best guarantee a message isn't lost if a server crashes mid-delivery?",
      options: ["Fire-and-forget over UDP", "Persist to a durable message queue, then acknowledge only after write", "Store messages only in client memory", "Retry indefinitely on the client"],
      correct: 1, explanation: "Durable persistence + acknowledgement after a successful write ensures at-least-once delivery even through crashes. UDP and client-only memory both risk loss." },
    { q: "Twitter's feed: a celebrity with 50M followers tweets. What's the right fan-out strategy?",
      options: ["Fan-out on write for everyone", "Fan-out on read for everyone", "Hybrid: fan-out on write for normal users, fan-out on read for celebrities", "Recompute every feed every minute"],
      correct: 2, explanation: "Writing to 50M timelines per celebrity tweet is wasteful. A hybrid model writes for normal users but pulls celebrity tweets at read time — the standard solution." },
    { q: "Your cache is full and you need an eviction policy for a workload with strong temporal locality. Pick the best fit.",
      options: ["FIFO", "Random eviction", "LRU (Least Recently Used)", "Never evict; just reject writes"],
      correct: 2, explanation: "LRU exploits temporal locality — recently accessed items are likely to be accessed again. FIFO and random ignore access patterns." },
    { q: "Which rate-limiting algorithm best smooths bursty traffic while allowing short bursts?",
      options: ["Fixed window counter", "Token bucket", "Simple request blocking", "No limiting, scale infinitely"],
      correct: 1, explanation: "Token bucket allows controlled bursts (drain accumulated tokens) while enforcing an average rate. Fixed windows suffer from edge-of-window burst spikes." },
  ],
  'DevOps/SRE': [
    { q: "Which deployment strategy gives you instant rollback with zero downtime?",
      options: ["Stop old version, then start new (recreate)", "Blue-green deployment", "Manually SSH and replace binaries", "Deploy on Fridays at 5pm"],
      correct: 1, explanation: "Blue-green keeps the old environment live until the new one is verified, enabling instant rollback by switching traffic back. Recreate causes downtime." },
    { q: "Your team is drowning in alerts. What's the most effective fix?",
      options: ["Add more alerts to catch everything", "Alert on symptoms/SLO burn rate, not every cause", "Disable all alerts", "Route all alerts to one engineer"],
      correct: 1, explanation: "Symptom-based, SLO-driven alerting reduces noise and focuses on user impact. Cause-based alerting on every metric creates fatigue." },
    { q: "What's a core principle of infrastructure as code?",
      options: ["Manual changes documented in a wiki", "Idempotent, declarative definitions stored in version control", "One-off shell scripts run by hand", "Click-ops in the cloud console"],
      correct: 1, explanation: "IaC should be declarative, idempotent, and version-controlled so infrastructure is reproducible and auditable." },
    { q: "What's the primary goal of a blameless post-mortem?",
      options: ["Identify who to fire", "Find systemic causes and improve resilience without blaming individuals", "Avoid documenting the incident", "Assign penalties"],
      correct: 1, explanation: "Blameless post-mortems focus on systemic improvement, encouraging honesty. Blame discourages transparency and repeats failures." },
    { q: "For a 99.99% SLA payment service, which DR setup is most appropriate?",
      options: ["Single region, daily backups", "Multi-region active-passive with automated failover", "No DR, hope for the best", "Backups stored on the same server"],
      correct: 1, explanation: "99.99% (~52 min/yr downtime) requires multi-region failover. Single-region or same-server backups can't meet that during a regional outage." },
  ],
  'Backend Engineer': [
    { q: "How do you prevent a double-charge when a payment request is retried?",
      options: ["Hope the user doesn't click twice", "Idempotency keys that dedupe repeated requests", "Charge and refund later", "Add a CAPTCHA"],
      correct: 1, explanation: "Idempotency keys ensure repeated requests with the same key are processed once — the standard pattern for safe payment retries." },
    { q: "A query suddenly takes 8 seconds. What's the first investigative step?",
      options: ["Add more RAM to the server", "Examine the query execution plan (EXPLAIN)", "Rewrite the whole service", "Restart the database"],
      correct: 1, explanation: "EXPLAIN reveals missing indexes, full table scans, or bad join order — the root cause most of the time. Hardware/restart are guesses." },
    { q: "You need precise per-user rate limits that don't allow edge-of-window bursts. Best choice?",
      options: ["Fixed window counter", "Sliding window log or sliding window counter", "No limit", "Limit only at the load balancer"],
      correct: 1, explanation: "Sliding window approaches avoid the boundary burst problem of fixed windows by accounting for request distribution over time." },
    { q: "Without two-phase commit, how do you coordinate a transaction across microservices?",
      options: ["Global database lock", "Saga pattern with compensating transactions", "Ignore consistency", "Single giant service"],
      correct: 1, explanation: "Sagas break a distributed transaction into local steps with compensating actions on failure — the standard approach to avoid 2PC's coupling." },
    { q: "A job in your queue keeps failing. What's the right handling?",
      options: ["Retry forever immediately", "Exponential backoff retries, then move to a dead-letter queue", "Delete the job silently", "Crash the worker"],
      correct: 1, explanation: "Exponential backoff prevents hammering downstream systems; a DLQ isolates poison messages for inspection instead of infinite retries." },
  ],
  'Product Manager': [
    { q: "You have 50 feature requests. What's the most defensible prioritization approach?",
      options: ["Build whatever the loudest stakeholder wants", "Score with a framework (e.g., RICE) tied to strategy and impact", "Build them in the order received", "Let engineering decide"],
      correct: 1, explanation: "A scoring framework like RICE (Reach, Impact, Confidence, Effort) creates transparent, strategy-aligned prioritization defensible to stakeholders." },
    { q: "DAU dropped 5% after a launch. What do you do first?",
      options: ["Immediately roll back everything", "Segment the data to isolate where the drop is concentrated", "Ignore it; 5% is noise", "Blame the engineers"],
      correct: 1, explanation: "Segmenting by platform, cohort, geography, and funnel step isolates the cause before you act. Rolling back blindly may not address the real issue." },
    { q: "What makes competitive analysis actually useful for your roadmap?",
      options: ["Copying every competitor feature", "Framing around customer jobs-to-be-done and gaps you can win", "Listing competitor features in a spreadsheet only", "Ignoring competitors entirely"],
      correct: 1, explanation: "Tying analysis to jobs-to-be-done reveals unmet needs and defensible differentiation, rather than reactive feature-copying." },
    { q: "Engineering says 6 months; sales promised a customer 2 months. Best move?",
      options: ["Force engineering to hit 2 months", "Negotiate a phased MVP that delivers core value sooner, reset expectations", "Tell sales it's impossible and stop", "Secretly miss the deadline"],
      correct: 1, explanation: "A phased MVP balances the real customer need with engineering reality, and resets expectations transparently — the mature PM move." },
    { q: "When saying no to a powerful stakeholder, what's most effective?",
      options: ["Just say no with no reason", "Tie the decision to strategy, data, and opportunity cost", "Always say yes to avoid conflict", "Escalate to your manager every time"],
      correct: 1, explanation: "Grounding a no in strategy and opportunity cost makes it a business decision, not a personal one — and builds credibility." },
  ],
  'TPM': [
    { q: "8 teams, 3 orgs, hard date. What's your first tool for managing dependencies?",
      options: ["A single giant group chat", "Map the critical path and a dependency matrix with clear owners", "Hope teams self-coordinate", "Daily 2-hour all-hands"],
      correct: 1, explanation: "Critical path + dependency mapping with named owners surfaces what blocks what and where slippage threatens the date." },
    { q: "What makes a status dashboard leadership actually trusts?",
      options: ["Only green statuses", "Leading indicators, honest risk signals, and consistent definitions", "Vague qualitative updates", "Updated once a quarter"],
      correct: 1, explanation: "Trust comes from leading indicators and honest red/yellow signals with consistent definitions — not vanity green dashboards." },
    { q: "What's the core artifact of structured risk management?",
      options: ["A risk register with likelihood, impact, owner, and mitigation", "A mental note", "A single email at kickoff", "Nothing; react when things break"],
      correct: 0, explanation: "A living risk register tracks each risk's likelihood, impact, owner, and mitigation/contingency — enabling proactive management." },
    { q: "You're behind schedule. Per Brooks's Law, what's often the WORST option?",
      options: ["Cut scope", "Add many new engineers late to the project", "Push the date", "Re-sequence work"],
      correct: 1, explanation: "Adding people to a late project often slows it further (onboarding + communication overhead) — Brooks's Law. Cutting scope or moving the date is usually safer." },
    { q: "How do you detect a program going off the rails early?",
      options: ["Wait for the final milestone", "Track leading indicators (velocity trends, blocker age, scope creep)", "Ask only at status meetings", "Trust that no news is good news"],
      correct: 1, explanation: "Leading indicators like rising blocker age and scope creep reveal trouble weeks before a missed milestone makes it obvious." },
  ],
};

/* ─── Sub-components ────────────────────────────────────────────────── */
const ScoreBar = ({ score, color, animated }) => (
  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
    <div style={{ height: '100%', borderRadius: 4, background: color,
      width: animated ? `${score * 10}%` : '0%',
      transition: 'width 0.9s cubic-bezier(.22,.68,0,1)', boxShadow: `0 0 12px ${color}60` }} />
  </div>
);

const ScoreDimension = ({ label, score, color, animated }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color }}>{score}/10</span>
    </div>
    <ScoreBar score={score} color={color} animated={animated} />
  </div>
);

/* ─── Main App ───────────────────────────────────────────────────────── */
export default function InterviewPrepApp() {
  const [user, setUser]               = useState(null);
  const [email, setEmail]             = useState('');
  const [page, setPage]               = useState('login');
  const [format, setFormat]           = useState('text');   // 'text' | 'mc'
  const [role, setRole]               = useState(null);
  const [mode, setMode]               = useState(null);      // 'full' | 'deep'
  const [qIndex, setQIndex]           = useState(0);
  const [response, setResponse]       = useState('');
  const [mcChoice, setMcChoice]       = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [results, setResults]         = useState(null);
  const [allResponses, setAllResponses] = useState([]);
  const [sessionQs, setSessionQs]     = useState([]);
  const [barsAnimated, setBarsAnimated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ipUser');
    if (saved) { setUser(JSON.parse(saved)); setPage('home'); }
  }, []);
  useEffect(() => {
    if (page === 'results') { const t = setTimeout(() => setBarsAnimated(true), 400); return () => clearTimeout(t); }
    setBarsAnimated(false);
  }, [page]);

  const saveUser = u => { setUser(u); localStorage.setItem('ipUser', JSON.stringify(u)); };
  const login = () => { if (!email.trim()) return;
    const u = { email: email.trim(), joined: new Date().toISOString(), interviews: [] };
    saveUser(u); setPage('home'); setEmail(''); };
  const logout = () => { setUser(null); setPage('login'); };

  const startInterview = (r, m) => {
    const bank = format === 'text' ? TEXT_QUESTIONS[r] : MC_QUESTIONS[r];
    let qs;
    if (m === 'full') qs = bank;
    else qs = [bank[Math.floor(Math.random() * bank.length)]];
    setRole(r); setMode(m); setQIndex(0);
    setSessionQs(qs); setAllResponses([]);
    setResponse(''); setMcChoice(null); setResults(null);
    setPage('interview');
  };

  /* TEXT submit → AI feedback */
  const submitText = async () => {
    if (!response.trim()) return;
    setSubmitting(true);
    const q = sessionQs[qIndex];
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514', max_tokens: 1000,
          messages: [{ role: 'user', content:
`You are a senior technical interviewer. Evaluate this ${role} interview answer.

Question: "${q}"
Candidate's Answer: "${response}"

Score 1-10 on each dimension. Be honest and calibrated — most answers score 5-7, exceptional answers 8-10.

Respond ONLY in this exact JSON (no markdown):
{"technical_depth":7,"communication_clarity":6,"structure":7,"approach":7,"overall":7,"strengths":["s1","s2"],"improvements":["i1","i2"],"feedback":"2-3 sentences of direct, actionable feedback."}` }],
        }),
      });
      const data = await res.json();
      let fb;
      try { const raw = data.content[0].text; const m2 = raw.match(/\{[\s\S]*\}/); fb = JSON.parse(m2 ? m2[0] : raw); }
      catch { fb = { technical_depth:6, communication_clarity:6, structure:6, approach:6, overall:6,
        strengths:['Clear explanation','Relevant points raised'],
        improvements:['Add more technical specifics','Use a structured framework'],
        feedback:'Solid response. Add concrete technical details and structure your answer.' }; }
      const next = [...allResponses, { question: q, answer: response, feedback: fb }];
      setAllResponses(next);
      if (qIndex + 1 < sessionQs.length) { setQIndex(qIndex + 1); setResponse(''); }
      else finishInterview(next);
    } catch { alert('Error connecting to AI. Check your API key in Vercel settings — or try Multiple Choice mode, which works offline.'); }
    finally { setSubmitting(false); }
  };

  /* MC submit → instant scoring, no API */
  const submitMC = () => {
    if (mcChoice === null) return;
    const q = sessionQs[qIndex];
    const correct = mcChoice === q.correct;
    const next = [...allResponses, { question: q.q, options: q.options, chosen: mcChoice, correct: q.correct, isCorrect: correct, explanation: q.explanation }];
    setAllResponses(next);
    if (qIndex + 1 < sessionQs.length) { setQIndex(qIndex + 1); setMcChoice(null); }
    else finishInterviewMC(next);
  };

  const finishInterview = (responses) => {
    const avg = Math.round(responses.reduce((s, r) => s + r.feedback.overall, 0) / responses.length);
    const interview = { id: Date.now(), role, mode, format: 'text', date: new Date().toISOString(), score: avg, responses };
    saveUser({ ...user, interviews: [...(user.interviews || []), interview] });
    setResults(responses); setPage('results');
  };
  const finishInterviewMC = (responses) => {
    const correctCount = responses.filter(r => r.isCorrect).length;
    const score = Math.round((correctCount / responses.length) * 10);
    const interview = { id: Date.now(), role, mode, format: 'mc', date: new Date().toISOString(), score, responses };
    saveUser({ ...user, interviews: [...(user.interviews || []), interview] });
    setResults(responses); setPage('results');
  };

  const stats = () => {
    const iv = user?.interviews || [];
    if (!iv.length) return null;
    const avg = Math.round(iv.reduce((s, i) => s + i.score, 0) / iv.length);
    const byRole = {};
    iv.forEach(i => { byRole[i.role] = (byRole[i.role] || 0) + 1; });
    const top = Object.keys(byRole).sort((a,b) => byRole[b]-byRole[a])[0];
    return { total: iv.length, avg, byRole, top };
  };

  const S = {
    page:  { minHeight: '100vh', background: '#060a16' },
    center:{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' },
    card:  { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 },
    input: { width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)',
             border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', fontSize: 15 },
    tag:   { fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  };
  const meshBg = 'radial-gradient(ellipse 70% 50% at 15% 0%, rgba(99,102,241,0.10), transparent), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(236,72,153,0.08), transparent), #060a16';

  /* ═══ LOGIN ═══ */
  if (page === 'login') return (
    <>
      <GlobalStyles />
      <SpeedInsights />
      <div style={{ ...S.page, ...S.center, background: meshBg }}>
        <div className="fade-up" style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56,
              borderRadius: 16, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', marginBottom: 24,
              boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="syne" style={{ fontSize: 32, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>Interview Prep</h1>
            <p style={{ color: '#64748b', fontSize: 15 }}>AI-powered mock interviews with real feedback</p>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 36, flexWrap: 'wrap' }}>
            {ROLES.map(r => (<span key={r} style={{ ...S.tag, background: ROLE_CFG[r].glow, color: ROLE_CFG[r].color }}>{r}</span>))}
          </div>
          <div style={{ ...S.card, padding: 32 }}>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, fontWeight: 500 }}>Your email</p>
            <input style={S.input} type="email" placeholder="you@company.com" value={email}
              onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
            <button className="btn" onClick={login} style={{ width: '100%', marginTop: 16, padding: '15px',
              borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 15, fontWeight: 600 }}>
              Start Practicing →
            </button>
          </div>
          <p style={{ textAlign: 'center', color: '#334155', fontSize: 13, marginTop: 20 }}>No password. Progress saved locally.</p>
        </div>
      </div>
    </>
  );

  /* ═══ HOME ═══ */
  if (page === 'home') {
    const st = stats();
    const initials = user.email.slice(0, 2).toUpperCase();
    return (
      <>
        <GlobalStyles />
        <SpeedInsights />
        <div style={{ ...S.page, background: meshBg }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Interview Prep</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button className="nav-btn" onClick={() => setPage('dashboard')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  Dashboard
                </button>
                <button className="nav-btn" onClick={logout}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  Sign out
                </button>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', marginLeft: 8 }}>{initials}</div>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
            <div className="fade-up" style={{ marginBottom: 36 }}>
              <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, color: '#f8fafc', marginBottom: 8 }}>
                Good to see you, {user.email.split('@')[0]}.
              </h2>
              <p style={{ color: '#64748b', fontSize: 16 }}>Choose your answer format, then pick a role to begin.</p>
            </div>

            {/* FORMAT SELECTOR */}
            <div className="fade-up delay-1" style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 12, color: '#475569', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Answer format</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {[
                  { id: 'text', title: 'Text Response', desc: 'Write full answers, get AI feedback on depth & structure', icon: 'M4 6h16M4 12h16M4 18h10' },
                  { id: 'mc',   title: 'Multiple Choice', desc: 'Pick the best answer, instant scoring & explanations', icon: 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' },
                ].map(f => {
                  const active = format === f.id;
                  return (
                    <div key={f.id} className="seg" onClick={() => setFormat(f.id)}
                      style={{ flex: 1, minWidth: 240, padding: 20, borderRadius: 16, cursor: 'pointer',
                        background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                        border: active ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
                        boxShadow: active ? '0 0 30px rgba(99,102,241,0.15)' : 'none', transition: 'all 0.2s ease' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10,
                          background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke={active ? '#818cf8' : '#64748b'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 600, color: active ? '#f8fafc' : '#94a3b8' }}>{f.title}</span>
                        {active && <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%',
                          background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M5 12l5 5L20 7"/></svg>
                        </div>}
                      </div>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, paddingLeft: 48 }}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {st && (
              <div className="fade-up delay-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 44 }}>
                {[{ label: 'Interviews', value: st.total }, { label: 'Avg Score', value: `${st.avg}/10` }, { label: 'Top Role', value: st.top?.split(' ')[0] || '—' }].map(s => (
                  <div key={s.label} style={{ ...S.card, padding: '20px 24px' }}>
                    <p style={{ fontSize: 12, color: '#475569', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                    <p className="syne" style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc' }}>{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="fade-up delay-3" style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Full Mock Interview</h3>
                <span style={{ ...S.tag, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>5 questions · {format === 'mc' ? 'Multiple choice' : 'Text'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {ROLES.map((r, i) => {
                  const cfg = ROLE_CFG[r];
                  return (
                    <div key={r} className={`role-card fade-up delay-${Math.min(i+2,6)}`} onClick={() => startInterview(r, 'full')}
                      style={{ ...S.card, padding: 24, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: cfg.glow, filter: 'blur(20px)', pointerEvents: 'none' }} />
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.glow, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: `1px solid ${cfg.color}30` }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      </div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: '#f1f5f9', marginBottom: 4 }}>{r}</p>
                      <p style={{ fontSize: 13, color: '#475569', marginBottom: 16 }}>{cfg.label}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ ...S.tag, background: cfg.glow, color: cfg.color }}>Start</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="fade-up delay-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc' }}>Quick Practice</h3>
                <span style={{ ...S.tag, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>1 question</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {ROLES.map(r => {
                  const cfg = ROLE_CFG[r];
                  return (
                    <div key={`q-${r}`} className="role-card" onClick={() => startInterview(r, 'deep')}
                      style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, marginBottom: 8 }} />
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1' }}>{r}</p>
                      </div>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══ INTERVIEW ═══ */
  if (page === 'interview') {
    const q   = sessionQs[qIndex];
    const cfg = ROLE_CFG[role];
    const pct = (qIndex / sessionQs.length) * 100;
    const isLast = qIndex === sessionQs.length - 1;
    return (
      <>
        <GlobalStyles />
        <SpeedInsights />
        <div style={{ ...S.page, background: `radial-gradient(ellipse 60% 40% at 80% 0%, ${cfg.glow}, transparent), #060a16` }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 760, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="nav-btn" onClick={() => setPage('home')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ ...S.tag, background: cfg.glow, color: cfg.color }}>{role}</span>
                <span style={{ ...S.tag, background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>{format === 'mc' ? 'Multiple Choice' : 'Text'}</span>
                <span style={{ fontSize: 13, color: '#475569' }}>{qIndex + 1} / {sessionQs.length}</span>
              </div>
            </div>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.04)' }}>
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}aa)`, width: `${pct}%`, transition: 'width 0.5s ease', boxShadow: `0 0 8px ${cfg.color}` }} />
          </div>

          <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }}>
            {/* Question */}
            <div className="fade-up" key={`q-${qIndex}`} style={{ ...S.card, padding: 40, marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: cfg.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Question {qIndex + 1}</p>
              <p style={{ fontSize: 20, lineHeight: 1.6, color: '#f1f5f9' }}>{format === 'mc' ? q.q : q}</p>
            </div>

            {format === 'mc' ? (
              /* ── MULTIPLE CHOICE ── */
              <div className="fade-up delay-1" key={`mc-${qIndex}`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {q.options.map((opt, i) => {
                    const selected = mcChoice === i;
                    return (
                      <div key={i} className="mc-option" onClick={() => setMcChoice(i)}
                        style={{ padding: '18px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 16,
                          background: selected ? cfg.glow : 'rgba(255,255,255,0.02)',
                          border: selected ? `1px solid ${cfg.color}` : '1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                          border: selected ? `2px solid ${cfg.color}` : '2px solid rgba(255,255,255,0.15)',
                          background: selected ? cfg.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: selected ? '#060a16' : '#475569' }}>
                          {selected ? '✓' : String.fromCharCode(65 + i)}
                        </div>
                        <span style={{ fontSize: 15, color: selected ? '#f1f5f9' : '#94a3b8', lineHeight: 1.5 }}>{opt}</span>
                      </div>
                    );
                  })}
                </div>
                <button className="btn" onClick={submitMC} disabled={mcChoice === null}
                  style={{ width: '100%', padding: '15px', borderRadius: 12, background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, color: '#060a16', fontSize: 15, fontWeight: 700 }}>
                  {isLast ? 'Finish & See Results →' : 'Next Question →'}
                </button>
              </div>
            ) : (
              /* ── TEXT ── */
              <div className="fade-up delay-1" key={`txt-${qIndex}`}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, marginBottom: 24 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" style={{ marginTop: 1, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                  <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>Think out loud. Structure your answer — situation, approach, trade-offs, outcome.</p>
                </div>
                <textarea style={{ ...S.input, height: 260, fontSize: 15, lineHeight: 1.7, borderRadius: 16, padding: '20px 24px',
                  background: 'rgba(255,255,255,0.03)', borderColor: response.length > 50 ? `${cfg.color}40` : 'rgba(255,255,255,0.08)',
                  transition: 'border-color 0.3s ease', display: 'block' }}
                  placeholder="Type your answer here..." value={response} onChange={e => setResponse(e.target.value)} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <span style={{ fontSize: 12, color: response.length > 100 ? '#475569' : '#334155' }}>
                    {response.length} characters{response.length > 0 && response.length < 100 && ' — elaborate more'}
                  </span>
                  <button className="btn" onClick={submitText} disabled={submitting || response.trim().length < 10}
                    style={{ padding: '14px 32px', borderRadius: 12, background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, color: '#fff', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                    {submitting ? (<><span className="spinner" /> Analyzing…</>) : isLast ? 'Finish Interview →' : 'Next Question →'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  /* ═══ RESULTS ═══ */
  if (page === 'results' && results) {
    const cfg = ROLE_CFG[role];
    const isMC = results[0] && 'isCorrect' in results[0];
    let avg, overallColor, overallLabel;
    if (isMC) {
      const correct = results.filter(r => r.isCorrect).length;
      avg = Math.round((correct / results.length) * 10);
    } else {
      avg = Math.round(results.reduce((s, r) => s + r.feedback.overall, 0) / results.length);
    }
    overallColor = avg >= 8 ? '#34d399' : avg >= 6 ? '#60a5fa' : avg >= 4 ? '#fbbf24' : '#f87171';
    overallLabel = avg >= 8 ? 'Excellent' : avg >= 6 ? 'Good' : avg >= 4 ? 'Developing' : 'Needs Work';
    const avgDim = dim => Math.round(results.reduce((s, r) => s + r.feedback[dim], 0) / results.length);

    return (
      <>
        <GlobalStyles />
        <SpeedInsights />
        <div style={{ ...S.page, background: `radial-gradient(ellipse 50% 40% at 50% 0%, ${cfg.glow}, transparent), #060a16` }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 800, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="nav-btn" onClick={() => setPage('home')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Home
              </button>
              <span style={{ ...S.tag, background: cfg.glow, color: cfg.color }}>{role}</span>
            </div>
          </div>

          <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 32px' }}>
            {/* Hero */}
            <div className="fade-up" style={{ ...S.card, padding: '48px 40px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center', minWidth: 140 }}>
                <div className="scale-pop" style={{ width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
                  background: `conic-gradient(${overallColor} ${avg * 36}deg, rgba(255,255,255,0.05) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 40px ${overallColor}30` }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#0a1020', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="syne" style={{ fontSize: 30, fontWeight: 800, color: overallColor, lineHeight: 1 }}>{avg}</span>
                    <span style={{ fontSize: 12, color: '#475569' }}>/10</span>
                  </div>
                </div>
                <span style={{ ...S.tag, background: `${overallColor}20`, color: overallColor }}>{overallLabel}</span>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <h2 className="syne" style={{ fontSize: 22, fontWeight: 700, color: '#f8fafc', marginBottom: 8 }}>Interview Complete</h2>
                {isMC ? (
                  <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.6 }}>
                    You answered <strong style={{ color: '#34d399' }}>{results.filter(r=>r.isCorrect).length}</strong> of {results.length} correctly. Review the explanations below to sharpen your reasoning.
                  </p>
                ) : (
                  <div style={{ marginTop: 16 }}>
                    {[{ key:'technical_depth',label:'Technical Depth' },{ key:'communication_clarity',label:'Communication' },{ key:'structure',label:'Structure' },{ key:'approach',label:'Problem Approach' }].map(d => (
                      <ScoreDimension key={d.key} label={d.label} score={avgDim(d.key)} color={cfg.color} animated={barsAnimated} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Per-question */}
            {results.map((r, i) => (
              <div key={i} className={`fade-up delay-${Math.min(i+1,6)}`} style={{ ...S.card, padding: 32, marginBottom: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Question {i + 1}</p>
                <p style={{ fontSize: 16, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>{isMC ? r.question : `"${r.question}"`}</p>

                {isMC ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                      {r.options.map((opt, j) => {
                        const isCorrectOpt = j === r.correct;
                        const isChosen = j === r.chosen;
                        let bg = 'rgba(255,255,255,0.02)', border = 'rgba(255,255,255,0.06)', col = '#64748b', icon = String.fromCharCode(65+j);
                        if (isCorrectOpt) { bg = 'rgba(52,211,153,0.08)'; border = 'rgba(52,211,153,0.4)'; col = '#34d399'; icon = '✓'; }
                        else if (isChosen) { bg = 'rgba(248,113,113,0.08)'; border = 'rgba(248,113,113,0.4)'; col = '#f87171'; icon = '✕'; }
                        return (
                          <div key={j} style={{ padding: '14px 18px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 14, background: bg, border: `1px solid ${border}` }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 12, fontWeight: 700, color: col, border: `1.5px solid ${col}50` }}>{icon}</div>
                            <span style={{ fontSize: 14, color: isCorrectOpt || isChosen ? '#e2e8f0' : '#64748b', lineHeight: 1.5 }}>{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, borderLeft: `3px solid ${cfg.color}` }}>
                      <strong style={{ color: cfg.color }}>Why: </strong>{r.explanation}
                    </p>
                  </>
                ) : (
                  <>
                    <details style={{ marginBottom: 24 }}>
                      <summary style={{ cursor: 'pointer', fontSize: 13, color: '#475569', fontWeight: 600, userSelect: 'none', listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>Your answer
                      </summary>
                      <p style={{ marginTop: 12, fontSize: 14, color: '#64748b', lineHeight: 1.7, padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 10, borderLeft: `3px solid ${cfg.color}` }}>{r.answer}</p>
                    </details>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                      {[{ key:'technical_depth',label:'Technical' },{ key:'communication_clarity',label:'Clarity' },{ key:'structure',label:'Structure' },{ key:'approach',label:'Approach' }].map(d => (
                        <div key={d.key} style={{ textAlign: 'center', padding: '14px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="syne" style={{ fontSize: 22, fontWeight: 700, color: cfg.color, lineHeight: 1, marginBottom: 6 }}>{r.feedback[d.key]}</p>
                          <p style={{ fontSize: 11, color: '#475569' }}>{d.label}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                      <div style={{ padding: 16, background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.12)', borderRadius: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#34d399', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Strengths</p>
                        {r.feedback.strengths.map((s, j) => (<p key={j} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 6, display: 'flex', gap: 8, color: '#34d399' }}><span>+</span>{s}</p>))}
                      </div>
                      <div style={{ padding: 16, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.12)', borderRadius: 12 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#fbbf24', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Improve</p>
                        {r.feedback.improvements.map((s, j) => (<p key={j} style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 6, display: 'flex', gap: 8, color: '#fbbf24' }}><span>→</span>{s}</p>))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, borderLeft: `3px solid ${cfg.color}40` }}>{r.feedback.feedback}</p>
                  </>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="btn" onClick={() => startInterview(role, mode)} style={{ flex: 1, padding: '15px', borderRadius: 12, background: cfg.glow, color: cfg.color, border: `1px solid ${cfg.color}30`, fontSize: 15, fontWeight: 600 }}>Retry {role}</button>
              <button className="btn" onClick={() => setPage('home')} style={{ flex: 1, padding: '15px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', fontSize: 15, fontWeight: 600 }}>Choose Another Role</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ═══ DASHBOARD ═══ */
  if (page === 'dashboard') {
    const iv = user?.interviews || [];
    const st = stats();
    const recent = [...iv].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0, 8);
    const maxCount = st ? Math.max(...Object.values(st.byRole), 1) : 1;
    return (
      <>
        <GlobalStyles />
        <div style={{ ...S.page, background: meshBg }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 32px' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button className="nav-btn" onClick={() => setPage('home')}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>Back
              </button>
              <span className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc' }}>Your Progress</span>
              <div style={{ width: 80 }} />
            </div>
          </div>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px' }}>
            {!st ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <p style={{ fontSize: 18, color: '#334155', marginBottom: 24 }}>No interviews yet.</p>
                <button className="btn" onClick={() => setPage('home')} style={{ padding: '13px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 15 }}>Start Practicing</button>
              </div>
            ) : (
              <>
                <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 40 }}>
                  {[{ label: 'Total Interviews', value: st.total, color: '#6366f1' },{ label: 'Average Score', value: `${st.avg}/10`, color: '#34d399' },{ label: 'Roles Practiced', value: Object.keys(st.byRole).length, color: '#f472b6' }].map(s => (
                    <div key={s.label} style={{ ...S.card, padding: '24px 28px' }}>
                      <p style={{ fontSize: 12, color: '#475569', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                      <p className="syne" style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="fade-up delay-1" style={{ ...S.card, padding: 32, marginBottom: 24 }}>
                  <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>Practice by Role</h3>
                  {ROLES.map(r => {
                    const cfg = ROLE_CFG[r]; const count = st.byRole[r] || 0;
                    return (
                      <div key={r} style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontSize: 13, color: '#94a3b8' }}>{r}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: count > 0 ? cfg.color : '#334155' }}>{count} session{count !== 1 ? 's' : ''}</span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,0.04)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 4, background: cfg.color, width: `${(count / maxCount) * 100}%`, transition: 'width 0.9s ease', boxShadow: count > 0 ? `0 0 8px ${cfg.color}60` : 'none' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="fade-up delay-2" style={{ ...S.card, padding: 32 }}>
                  <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>Recent Sessions</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {recent.map(s => {
                      const cfg2 = ROLE_CFG[s.role];
                      const sc = s.score >= 8 ? '#34d399' : s.score >= 6 ? '#60a5fa' : '#fbbf24';
                      return (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg2.color }} />
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>{s.role}</p>
                              <p style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>
                                {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {' · '}{s.format === 'mc' ? 'Multiple choice' : 'Text'}{' · '}{s.mode === 'full' ? '5 Q' : '1 Q'}
                              </p>
                            </div>
                          </div>
                          <span className="syne" style={{ fontSize: 20, fontWeight: 700, color: sc }}>{s.score}/10</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }

  return null;
}
