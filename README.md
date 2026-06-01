# AI Interview Solutions

AI-powered interview practice platform for forward-deployed and AI-era tech roles.

**Live site:** [ai-interview.solutions](https://ai-interview.solutions)

---

## What it does

AI Interview Solutions helps candidates prepare for roles that most interview prep platforms ignore — Forward Deployed Engineers, AI Solutions Architects, Forward Deployed Product Managers, and Technical Program Managers. It offers three practice formats, company-specific mock interviews, role guides, and AI-scored feedback.

---

## Features

### Practice formats
- **Mock Interview** — a live back-and-forth with a named AI interviewer whose style adapts to the target company (Anthropic, OpenAI, Google, Meta, Microsoft, Amazon, Nvidia). Company-specific opening problems grounded in real interview research. 5 rounds, with a debrief on the final turn and a full score breakdown at the end.
- **Written Response** — free-form answers scored by AI across technical depth, communication, structure, and approach, with specific coaching feedback.
- **Multiple Choice** — 50 scenario-based questions covering all four roles, instant offline scoring, always free.

### Roles
- AI Solutions Architect
- Forward Deployed Engineer
- Forward Deployed Product Manager
- Technical Program Manager

### Other features
- Role guides with a two-tab structure: role overview and step-by-step interview guide with frameworks and example Q&As
- Company-specific interviewer personas with distinct names per company × role combination (28 total)
- Text-to-speech for interviewer responses using browser voices, with per-role voice assignment
- Google and GitHub OAuth, plus email OTP verification
- Session history and score tracking for signed-in users
- Anonymous-friendly: first mock and first written response require no account
- Email gate on second attempt: OTP-verified email required to continue
- Feedback submission logged to Airtable (Feature request / Bug report / General)
- Session responses logged to Airtable with role, score, question, answer, and user

---

## Tech stack

### Frontend
| Technology | Role |
|---|---|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Vercel Analytics** | Page view tracking (zero config) |

### Backend (Vercel Serverless Functions)
| File | Purpose |
|---|---|
| `api/feedback.js` | Calls Claude Sonnet to score written responses; logs to Airtable |
| `api/mock.js` | Runs mock interview turns and scoring via Claude Sonnet 4.5; Groq fallback |
| `api/tts.js` | Text-to-speech endpoint (ElevenLabs integration, currently unused — browser TTS active) |
| `api/profile.js` | Loads user profile from Supabase |
| `api/feedback-submit.js` | Logs feedback and email gate submissions to Airtable |
| `api/checkout.js` | Stripe checkout session creation (built, not yet wired) |
| `api/confirm-upgrade.js` | Stripe webhook handler for Pro upgrades (built, not yet wired) |

### Auth and database — Supabase
Supabase handles all authentication and data persistence.

- **Auth providers:** Email (with OTP and confirmation), Google OAuth, GitHub OAuth
- **Email delivery:** Resend SMTP (domain: ai-interview.solutions, configured in Supabase)
- **Database tables:**
  - `profiles` — user metadata: `is_pro`, `pro_expires_at`, `mocks_completed`, `free_written_done`, `free_mock_done`, `display_name`, `stripe_customer_id`, `stripe_subscription_id`
  - `interviews` — completed session records: role, format, score, responses, date
  - `daily_usage` — per-user AI answer count for rate limiting

### AI / LLM
| Service | Usage |
|---|---|
| **Anthropic Claude Sonnet 4.5** | Mock interview turns, mock scoring, written response scoring |
| **Groq (llama-3.3-70b-versatile)** | Fallback if Claude is unavailable |

### Data logging — Airtable
Two tables in the `apprDdjYrqDOmMpYN` base:

**Responses** — written response session data
Fields: `Name`, `Role`, `Industry`, `Format`, `Score`, `Question`, `Answer`, `Feedback`, `Session ID`, `User`, `Timestamp`

**Feedback** — user-submitted feedback and email gate captures
Fields: `Type`, `Message`, `Email`, `Page`, `Timestamp`

### Payments — Stripe
Stripe integration is built (`api/checkout.js`, `api/confirm-upgrade.js`) but not yet live. Requires `STRIPE_SECRET_KEY`, `STRIPE_PRICE_MONTHLY`, `STRIPE_PRICE_PACK`, and `APP_URL` environment variables.

### TTS — ElevenLabs (inactive)
ElevenLabs API integration exists in `api/tts.js` but is not active. Free tier does not allow API access. Browser speech synthesis is used instead, with distinct voices assigned per role.

---

## Environment variables

Set these in Vercel → Settings → Environment Variables:

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for scoring and mock interviews |
| `GROQ_API_KEY` | Yes | Groq fallback LLM |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL (frontend) |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon key (frontend) |
| `SUPABASE_URL` | Yes | Supabase project URL (serverless functions) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (serverless functions) |
| `AIRTABLE_TOKEN` | Yes | Airtable personal access token |
| `AIRTABLE_BASE_ID` | Yes | Airtable base ID (`apprDdjYrqDOmMpYN`) |
| `AIRTABLE_TABLE_ID` | Yes | Airtable responses table name (`Responses`) |
| `ELEVENLABS_API_KEY` | No | ElevenLabs TTS (configured but inactive) |
| `STRIPE_SECRET_KEY` | No | Stripe secret key (not yet live) |
| `STRIPE_PRICE_MONTHLY` | No | Stripe monthly price ID |
| `STRIPE_PRICE_PACK` | No | Stripe one-time pack price ID |
| `APP_URL` | No | Production URL for Stripe redirects |

---

## Local development

```bash
npm install
npm run dev
```

Create a `.env.local` file with the required environment variables listed above.

The app runs at `http://localhost:5173`.

```bash
npm run build   # production build
npm run preview # preview production build locally
```

---

## Project structure

```
.
├── index.html
├── vite.config.js
├── vercel.json
├── package.json
├── public/
│   └── favicon.svg
├── api/
│   ├── _llm.js               # Shared LLM helper (Claude + Groq fallback)
│   ├── feedback.js           # Written response scoring
│   ├── mock.js               # Mock interview turns and scoring
│   ├── tts.js                # TTS endpoint (ElevenLabs, inactive)
│   ├── profile.js            # User profile loader
│   ├── feedback-submit.js    # Feedback and email gate logging
│   ├── checkout.js           # Stripe checkout (not yet live)
│   └── confirm-upgrade.js    # Stripe webhook (not yet live)
└── src/
    ├── main.jsx              # Entry point with error boundary
    ├── supabase.js           # Supabase client initialisation
    ├── InterviewPrepApp.jsx  # Main application component (~2,400 lines)
    └── questions.js          # Question bank, role configs, company problems (~1,025 lines)
```

---

## Access model

- **Anonymous users:** 1 free mock interview + 1 free written response. Full results shown immediately. Email OTP required for a second attempt.
- **Signed-in users:** same limits tracked server-side in Supabase profiles.
- **Pro users:** unlimited access. Pro status set manually in Supabase (`is_pro = true`).
- **Multiple choice:** always free, no account required.

---

## Deployment

The project is connected to GitHub (`sarangk3/interview-prep-website`) and deployed automatically on Vercel on every push to `main`. Domain `ai-interview.solutions` is configured in Vercel with DNS pointing to Vercel's nameservers.

GitHub token expires approximately June 28, 2026 — renew at github.com/settings/tokens.
