/* Question bank: Industry → Role → { text, mc } */

export const INDUSTRIES = ['General', 'Healthcare', 'Fintech', 'E-commerce'];
export const ROLES = ['AI Solutions Architect', 'Forward Deployed Engineer', 'Forward Deployed Product Manager', 'Technical Program Manager'];

const mc = (q, options, correct, explanation) => ({ q, options, correct, explanation });

/* ── Reusable role blocks per industry ── */

const AISA = {
  General: {
    text: [
      "Design a RAG (retrieval-augmented generation) system over a company's internal knowledge base. Walk through chunking, embeddings, retrieval, and how you'd reduce hallucinations.",
      "A client wants an LLM-powered assistant. How do you decide between prompting, RAG, and fine-tuning — and what are the tradeoffs?",
      "Design an evaluation framework for an LLM application where there's no single ground-truth answer. How do you measure quality and catch regressions?",
      "How do you architect an agentic AI system that calls tools and takes multi-step actions reliably? How do you handle failures and guardrails?",
      "A client's AI feature is too slow and too expensive at scale. Walk me through how you'd cut latency and cost without sacrificing quality.",
    ],
    mc: [
      mc("A client needs an LLM to answer over proprietary docs that change weekly. Best approach?",
        ["Fine-tune a model weekly", "Retrieval-augmented generation (RAG)", "Prompt with no external data", "Train a model from scratch"], 1,
        "RAG keeps knowledge fresh without retraining. Fine-tuning bakes in static knowledge and is costly to update weekly."),
      mc("Your RAG system retrieves irrelevant chunks. Most impactful first fix?",
        ["Use a bigger LLM", "Improve chunking, embeddings, and add reranking", "Write longer prompts", "Increase temperature"], 1,
        "Garbage retrieval yields garbage generation. Fix retrieval quality before reaching for a larger model."),
      mc("Best way to reduce hallucinations in a RAG answer?",
        ["Raise temperature", "Ground answers in retrieved context, cite sources, allow 'I don't know'", "Remove the retrieval step", "Make the prompt vaguer"], 1,
        "Grounding in retrieved context with citations and an explicit 'I don't know' path curbs fabrication."),
      mc("Evaluating an LLM app with no single correct answer, best practice?",
        ["Eyeball a few outputs once", "Curated eval set with LLM-as-judge + human review + task metrics", "Trust the model", "Only measure latency"], 1,
        "A curated eval set scored by a mix of LLM-as-judge, humans, and task metrics catches regressions reliably."),
      mc("An AI feature is too expensive at scale. Effective lever?",
        ["Always use the largest model", "Route easy cases to a smaller model, cache, right-size context", "Disable caching", "Add more prompt text"], 1,
        "Model routing, caching, and trimming context cut cost substantially while preserving quality on hard cases."),
    ],
  },
  Healthcare: {
    text: [
      "Design an AI system to help clinicians summarize patient charts. How do you handle PHI, accuracy, and clinician trust?",
      "A health system wants AI-assisted HCC risk-adjustment coding. How do you architect it to be accurate and auditable?",
      "How would you deploy an LLM in a clinical setting while managing hallucination risk and regulatory concerns?",
    ],
    mc: [
      mc("Running an LLM over clinical notes containing PHI, key requirement?",
        ["Send notes to any public API", "Process within a HIPAA-compliant environment under a BAA", "Email notes to the model vendor", "Skip access controls"], 1,
        "PHI must stay within a HIPAA-compliant, BAA-covered environment — not sent to non-compliant endpoints."),
      mc("What makes AI-assisted clinical coding trustworthy to reviewers?",
        ["Hiding its reasoning", "Surfacing supporting evidence/citations from the chart for human verification", "Auto-submitting codes", "Higher temperature"], 1,
        "Showing the chart evidence behind each suggested code lets a human verify — essential for auditable coding."),
      mc("Biggest risk of an LLM giving medical info directly to patients?",
        ["Slower responses", "Hallucinated or incorrect guidance without clinical oversight", "Too many citations", "Lower cost"], 1,
        "Unsupervised clinical advice can be wrong and harmful; human oversight and strict guardrails are required."),
    ],
  },
  Fintech: {
    text: [
      "Design an AI system for detecting fraudulent transactions that combines ML models with LLMs. How do you handle false positives?",
      "A bank wants an LLM support assistant. How do you stop it giving incorrect financial advice or leaking customer data?",
      "How would you build an AI system to extract structured data from financial documents at scale and reliably?",
    ],
    mc: [
      mc("Deploying an LLM assistant in banking, top guardrail?",
        ["Let it answer anything", "Restrict scope, ground in approved content, block unauthorized advice and data leakage", "Disable logging", "Maximize creativity"], 1,
        "Banking assistants need tight scope, grounding, and controls against incorrect advice and data exposure."),
      mc("Why pair ML scoring with rules in fraud detection?",
        ["Rules are useless", "Rules catch known patterns deterministically; ML generalizes — together they balance precision/recall", "ML alone is always enough", "To slow it down"], 1,
        "Deterministic rules plus generalizing ML balance catching known and novel fraud while controlling false positives."),
      mc("Extracting data from financial PDFs robustly, best approach?",
        ["Trust raw OCR blindly", "OCR + LLM extraction with validation and confidence checks against the source", "Manual entry only", "Guess values"], 1,
        "Combining extraction with validation and confidence scoring against the source document ensures reliability."),
    ],
  },
  'E-commerce': {
    text: [
      "Design an AI-powered product search and recommendation system. How do you blend embeddings, ranking, and personalization?",
      "A retailer wants an LLM shopping assistant. How do you keep it grounded in real inventory and current pricing?",
      "How would you use AI to generate and optimize product descriptions at scale while keeping quality high?",
    ],
    mc: [
      mc("An LLM shopping assistant must not invent products. Best design?",
        ["Let it free-generate SKUs", "Ground responses in the live catalog via retrieval/tools", "Ignore inventory", "Hard-code 10 products"], 1,
        "Grounding in a live product catalog via retrieval/tools prevents the assistant from inventing products or prices."),
      mc("Improving semantic product search, key technique?",
        ["Exact keyword match only", "Embedding-based retrieval with reranking, blended with business signals", "Random ordering", "Alphabetical only"], 1,
        "Embedding retrieval plus reranking and business signals captures intent far better than keyword matching alone."),
      mc("Generating product descriptions at scale, quality control?",
        ["Publish raw output", "Templated prompts + automated checks + human spot-review for brand and accuracy", "No review", "One prompt for all"], 1,
        "Structured prompts with automated checks and human spot-review keep generated copy on-brand and accurate."),
    ],
  },
};

const FDE = {
  General: {
    text: [
      "You're embedded with a customer who can't clearly articulate what they need. Walk me through going from an ambiguous problem to a working prototype.",
      "A customer's data is messy, siloed across systems, and poorly documented. How do you build a reliable pipeline on top of it?",
      "You've built a solution for one customer. How do you decide what to push back into the core product vs. keep as a custom build?",
      "A customer demo is in 3 days and the integration isn't working. How do you triage and still deliver something credible?",
      "How do you balance moving fast for a single customer against building maintainable, scalable software?",
    ],
    mc: [
      mc("A customer can't articulate requirements. Best first move?",
        ["Write a 30-page spec first", "Observe their real workflow and build a quick prototype to react to", "Wait for them to figure it out", "Build what you assume they want"], 1,
        "Forward-deployed work thrives on observing real workflows and iterating on prototypes, not upfront specs."),
      mc("Customer data is messy and undocumented. Reliable pipeline approach?",
        ["Assume it's clean", "Build with schema validation, data-quality checks, and observability", "Skip validation to move fast", "Hardcode the happy path"], 1,
        "Validation, quality checks, and observability surface bad data early instead of failing silently downstream."),
      mc("A one-off custom feature is now requested by many customers. Right move?",
        ["Keep rebuilding it per customer", "Generalize it and push into the core platform", "Refuse all of them", "Ignore the pattern"], 1,
        "Recurring custom needs should be generalized into the platform to avoid maintaining many one-offs."),
      mc("Demo in 3 days, integration broken. Best triage?",
        ["Try to fix everything", "Scope to the critical path that proves value; mock non-essential parts", "Cancel the demo", "Show a slide deck only"], 1,
        "Focus on the critical path that demonstrates value and stub the rest to deliver something credible on time."),
      mc("Forward-deployed work risks one-off spaghetti. Mitigation?",
        ["Never reuse anything", "Build reusable components and feed learnings back to product", "Avoid documentation", "Rewrite per customer"], 1,
        "Reusable components plus a feedback loop to product keeps custom work from becoming unmaintainable."),
    ],
  },
  Healthcare: {
    text: [
      "You're embedded at a health system to deploy a data platform. How do you handle PHI access, EHR integration, and clinician adoption?",
      "A hospital's data is spread across legacy systems with no clean API. How do you integrate it safely?",
      "How do you earn the trust of clinical staff who are skeptical of a new tool you're deploying on-site?",
    ],
    mc: [
      mc("Accessing a health system's data on-site, first requirement?",
        ["Grab whatever you can", "Proper data-use agreements/BAA and least-privilege PHI access", "Use a personal laptop", "Disable audit logs"], 1,
        "PHI access requires the right agreements and least-privilege, audited access before any integration."),
      mc("Integrating a legacy EHR with no clean API, pragmatic approach?",
        ["Scrape the UI insecurely", "Use available interfaces (HL7/FHIR, secure extracts) with validation", "Copy the database to a USB", "Skip integration"], 1,
        "Lean on standard interfaces and secure extracts with validation rather than insecure scraping of PHI."),
      mc("Winning over skeptical clinicians, best tactic?",
        ["Mandate usage", "Solve a real pain they feel, with their input, inside their workflow", "Send a long email", "Ignore their concerns"], 1,
        "Adoption follows from solving a felt pain point collaboratively and fitting their existing workflow."),
    ],
  },
  Fintech: {
    text: [
      "You're deployed at a bank to build a custom risk dashboard. How do you integrate with their core systems while meeting compliance?",
      "A financial customer needs a solution fast but has strict change-control. How do you move quickly without breaking their rules?",
      "How do you build on a customer's sensitive financial data while ensuring auditability?",
    ],
    mc: [
      mc("Building on a bank's core systems, key constraint to respect?",
        ["Move fast and skip process", "Their change-control and compliance processes", "Their lunch schedule", "Nothing"], 1,
        "Regulated customers have change-control and compliance you must align delivery to, not bypass."),
      mc("Handling sensitive financial data on-site, essential practice?",
        ["Open access for all", "Auditable, least-privilege access with encryption", "Store it in plaintext", "Email extracts around"], 1,
        "Least-privilege, audited, encrypted access is foundational when handling sensitive financial data."),
      mc("Moving fast in a regulated customer environment, best approach?",
        ["Ignore their controls", "Work within controls, automate compliance evidence, prototype in safe environments", "Deploy straight to prod", "Avoid documentation"], 1,
        "Speed in regulated settings comes from working within controls and automating evidence, not skipping them."),
    ],
  },
  'E-commerce': {
    text: [
      "You're embedded with a retailer to unify inventory, orders, and analytics into one platform. Where do you start?",
      "A retail customer wants a custom solution before peak season. How do you deliver reliably under a hard deadline?",
      "How do you handle a retailer's data that's inconsistent across online and in-store systems?",
    ],
    mc: [
      mc("Integrating a retailer's fragmented systems, sensible first step?",
        ["Build the UI first", "Map data sources and establish a single source of truth", "Pick one system and ignore the rest", "Skip discovery"], 1,
        "Mapping sources and defining a canonical source of truth prevents downstream inconsistency."),
      mc("Delivering before peak season, risk management?",
        ["Add scope as you go", "Lock scope to must-haves, load-test, and leave buffer", "Deploy on Black Friday", "No testing"], 1,
        "A hard seasonal deadline demands tight scope, load testing, and buffer for the unexpected."),
      mc("Inconsistent online/in-store data, approach?",
        ["Pick whichever looks right", "Reconcile to a canonical model with validation rules", "Ignore in-store data", "Average the numbers"], 1,
        "Reconciling to a canonical model with validation resolves cross-channel inconsistency reliably."),
    ],
  },
};

const FDPM = {
  General: {
    text: [
      "You're embedded with a customer to understand their needs. How do you translate messy, on-the-ground requirements into a clear product direction?",
      "How do you balance building exactly what one customer wants against building a generalizable product?",
      "A customer demands a feature that doesn't fit the product vision. How do you handle it?",
      "How do you drive adoption of a deployed solution when end-users resist change?",
      "You sit between the customer and your engineering team. How do you manage competing priorities and expectations on both sides?",
    ],
    mc: [
      mc("Embedded with a customer, best way to capture true requirements?",
        ["Take their feature list at face value", "Observe real workflows and validate with prototypes", "Survey once", "Ask executives only"], 1,
        "Stated asks often miss the real need; observing workflows and prototyping surfaces what actually matters."),
      mc("One customer wants a bespoke feature. Key product concern?",
        ["Build it as a pure one-off", "Assess if the need is shared and generalize what's common", "Reject it outright", "Build for everyone blindly"], 1,
        "Distinguishing shared needs from true one-offs keeps the product generalizable and maintainable."),
      mc("A customer demand conflicts with product vision. Best move?",
        ["Just say no", "Understand the underlying need and find a vision-aligned solution", "Always comply", "Escalate immediately"], 1,
        "Digging into the underlying need usually reveals a solution that serves the customer and the vision."),
      mc("End-users resist a deployed tool. Most effective adoption lever?",
        ["Mandate it top-down", "Solve a real pain they feel and involve them early", "Add more features", "Ignore the resistance"], 1,
        "Adoption follows from solving felt pain and involving users early, not mandates or feature bloat."),
      mc("Caught between customer and engineering, key skill?",
        ["Take one side", "Translate needs both ways and manage expectations transparently", "Avoid both", "Promise everything"], 1,
        "An FDPM bridges both sides — translating needs and setting honest expectations in both directions."),
    ],
  },
  Healthcare: {
    text: [
      "You're embedded at a provider org. How do you translate clinician frustrations into a prioritized product roadmap?",
      "How do you balance one health system's custom needs against a scalable healthcare product?",
      "How do you drive clinician adoption of a tool that changes their workflow?",
    ],
    mc: [
      mc("Translating clinician frustrations to a roadmap, best input?",
        ["Executive guesses", "Direct observation + clinician interviews, prioritized by impact on care and burden", "Competitor copying", "Random requests"], 1,
        "Observation and clinician input, prioritized by care impact and workload, build a roadmap that lands."),
      mc("Balancing custom health-system needs vs scale, approach?",
        ["Hard-code each system", "A configurable platform over one-off builds", "Refuse customization", "Fork per customer"], 1,
        "Configurability lets you serve varied health systems without unscalable per-customer forks."),
      mc("Driving clinician adoption, top factor?",
        ["More dashboards", "Demonstrable reduction in their daily burden", "Mandates", "Longer training only"], 1,
        "Clinicians adopt tools that visibly reduce their daily burden, not ones that add work."),
    ],
  },
  Fintech: {
    text: [
      "You're embedded at a financial institution. How do you balance compliance-driven requirements with product simplicity?",
      "How do you prioritize when a financial customer's regulatory needs compete with usability?",
      "How do you manage the customer relationship when you must say no to a non-compliant feature request?",
    ],
    mc: [
      mc("Financial customer's compliance need vs simplicity, stance?",
        ["Skip compliance for UX", "Compliance is non-negotiable; design the simplest compliant experience", "Ignore UX entirely", "Let legal build it"], 1,
        "Compliance is a hard constraint; the craft is making the simplest experience that still satisfies it."),
      mc("Regulatory vs usability tradeoff, approach?",
        ["Drop the requirement", "Meet the requirement, then optimize UX within those constraints", "Ignore usability", "Delay indefinitely"], 1,
        "Satisfy the regulation first, then optimize the experience within the allowed design space."),
      mc("Saying no to a non-compliant request, best framing?",
        ["A flat no", "Explain the regulatory risk and offer a compliant alternative", "Pretend to agree", "Escalate without context"], 1,
        "Framing the no around concrete regulatory risk plus an alternative preserves trust and progress."),
    ],
  },
  'E-commerce': {
    text: [
      "You're embedded with a retailer. How do you translate their conversion and growth goals into product priorities?",
      "How do you balance a retailer's seasonal, urgent requests against long-term product health?",
      "How do you drive adoption of new tooling across a retailer's merchandising and ops teams?",
    ],
    mc: [
      mc("Translating a retailer's growth goals to product, key focus?",
        ["Vanity metrics", "Conversion/funnel metrics tied to revenue", "Page views only", "Internal opinions"], 1,
        "Revenue-linked conversion and funnel metrics keep product priorities aligned to the retailer's growth goals."),
      mc("Seasonal urgent requests vs long-term health, approach?",
        ["Always drop everything", "Triage by impact; protect platform health with clear tradeoff communication", "Ignore seasonality", "Say yes to all"], 1,
        "Impact-based triage with transparent tradeoffs balances urgent seasonal asks against long-term health."),
      mc("Driving cross-team adoption at a retailer, lever?",
        ["One generic rollout", "Show value in each team's own workflow", "Mandate from HQ", "More emails"], 1,
        "Adoption sticks when each team sees value inside their own workflow, not a one-size-fits-all push."),
    ],
  },
};

const TPM = {
  General: {
    text: [
      "You're running a program with 8 teams across 3 orgs and a hard ship date. How do you manage dependencies?",
      "How do you build and maintain a program status dashboard that leadership actually trusts?",
      "Walk me through your risk management framework. Give a real example of a risk that materialized.",
      "How do you decide when to cut scope vs. push the ship date vs. add resources?",
      "Describe a program that went off the rails. How did you detect it early and replan?",
    ],
    mc: [
      mc("8 teams, hard date. First tool for managing dependencies?",
        ["One giant group chat", "Critical path + dependency matrix with clear owners", "Hope teams self-coordinate", "Daily 2-hour all-hands"], 1,
        "Critical path + dependency mapping surfaces what blocks what and where slippage threatens the date."),
      mc("What makes a status dashboard leadership trusts?",
        ["Only green statuses", "Leading indicators, honest risk signals, consistent definitions", "Vague updates", "Quarterly refresh"], 1,
        "Trust comes from leading indicators and honest red/yellow signals, not vanity dashboards."),
      mc("Core artifact of structured risk management?",
        ["A risk register with likelihood, impact, owner, mitigation", "A mental note", "A kickoff email", "Reacting when it breaks"], 0,
        "A living risk register enables proactive management of each risk's likelihood, impact, and mitigation."),
      mc("Behind schedule. Per Brooks's Law, often the WORST option?",
        ["Cut scope", "Add many new engineers late", "Push the date", "Re-sequence work"], 1,
        "Adding people to a late project often slows it further due to onboarding and communication overhead."),
      mc("How to detect a program going off the rails early?",
        ["Wait for the final milestone", "Track leading indicators (velocity, blocker age, scope creep)", "Ask at status meetings only", "Assume no news is good news"], 1,
        "Leading indicators reveal trouble weeks before a missed milestone makes it obvious."),
    ],
  },
  Healthcare: {
    text: [
      "You're coordinating a rollout of a new clinical system across multiple hospital sites. How do you manage stakeholders, compliance, and phased deployment?",
      "How do you run a program that depends on integrating with several external EHR vendors with different timelines?",
      "A compliance audit is scheduled mid-program. How do you ensure readiness without derailing delivery?",
    ],
    mc: [
      mc("Rolling out a clinical system across sites, best deployment approach?",
        ["Big-bang to all sites at once", "Phased rollout with a pilot site and clinical validation gates", "Let each site self-install", "Deploy without clinician input"], 1,
        "A phased rollout with a pilot limits patient-safety risk and lets you learn before scaling."),
      mc("Depending on multiple EHR vendors with different timelines, key tool?",
        ["Assume all deliver on time", "Vendor-specific milestone tracking with contingency plans", "One shared deadline", "No tracking"], 1,
        "External vendor timelines aren't yours to control; track milestones per vendor with contingencies."),
      mc("A compliance audit lands mid-program. Best stance?",
        ["Pause all delivery", "Treat compliance evidence as a tracked workstream from the start", "Scramble the week before", "Ignore it"], 1,
        "Continuously gathering compliance evidence avoids last-minute scrambles and delivery disruption."),
    ],
  },
  Fintech: {
    text: [
      "You're driving a program to obtain a financial compliance certification with a hard regulatory deadline. How do you plan and de-risk it?",
      "How do you coordinate a migration to a new payment processor across teams without disrupting live transactions?",
      "A regulator changes requirements mid-program. How do you absorb the change and keep the deadline?",
    ],
    mc: [
      mc("A regulatory deadline is fixed. Your planning posture?",
        ["Treat it like a soft date", "Plan backward from the date with buffer and a compliance-evidence workstream", "Start late", "Assume an extension"], 1,
        "Regulatory deadlines rarely move; plan backward with buffer and continuous evidence-gathering."),
      mc("Migrating to a new payment processor on live traffic, safest approach?",
        ["Cut over all at once", "Gradual traffic shifting with parallel-run and reconciliation", "Migrate during peak", "No rollback plan"], 1,
        "Gradual cutover with parallel-run lets you reconcile and roll back before fully trusting the new processor."),
      mc("A regulator changes requirements mid-program. First move?",
        ["Ignore it", "Assess impact, re-baseline, and communicate to stakeholders", "Hide it from leadership", "Cancel the program"], 1,
        "Assess impact, re-baseline transparently, and communicate — regulatory change is a managed risk."),
    ],
  },
  'E-commerce': {
    text: [
      "You own peak-season (Black Friday) readiness across engineering, ops, and support. How do you run the program?",
      "How do you coordinate a re-platforming of the checkout system across teams without hurting conversion?",
      "A key third-party integration is at risk weeks before peak. How do you respond?",
    ],
    mc: [
      mc("Running peak-season readiness, most useful cross-team artifact?",
        ["A motivational poster", "A readiness checklist with load tests, runbooks, and go/no-go gates", "A single email", "Nothing"], 1,
        "Readiness needs explicit checklists, load-test sign-offs, runbooks, and go/no-go gates across teams."),
      mc("Re-platforming checkout without hurting conversion, safest approach?",
        ["Switch everyone at once", "Gradual rollout with A/B measurement of conversion impact", "Launch at peak", "No measurement"], 1,
        "Gradual rollout with conversion A/B testing catches regressions before they hit all revenue."),
      mc("A critical integration is at risk weeks before peak. First move?",
        ["Wait and see", "Escalate, assess impact, and activate a contingency/fallback plan", "Hide it", "Cancel peak"], 1,
        "Surface the risk early, assess impact, and stand up a fallback — peak dates don't move."),
    ],
  },
};

export const QUESTION_BANK = {
  'General':     { 'AI Solutions Architect': AISA.General,     'Forward Deployed Engineer': FDE.General,     'Forward Deployed Product Manager': FDPM.General,     'Technical Program Manager': TPM.General },
  'Healthcare':  { 'AI Solutions Architect': AISA.Healthcare,  'Forward Deployed Engineer': FDE.Healthcare,  'Forward Deployed Product Manager': FDPM.Healthcare,  'Technical Program Manager': TPM.Healthcare },
  'Fintech':     { 'AI Solutions Architect': AISA.Fintech,     'Forward Deployed Engineer': FDE.Fintech,     'Forward Deployed Product Manager': FDPM.Fintech,     'Technical Program Manager': TPM.Fintech },
  'E-commerce':  { 'AI Solutions Architect': AISA['E-commerce'],'Forward Deployed Engineer': FDE['E-commerce'],'Forward Deployed Product Manager': FDPM['E-commerce'],'Technical Program Manager': TPM['E-commerce'] },
};

/* ── Opening problems for Mock Interview mode ── */
export const OPENING_PROBLEMS = {
  'AI Solutions Architect': {
    'General':     { title: 'Enterprise AI Knowledge Assistant', problem: "A 600-person professional services firm wants to build an internal AI assistant that can answer questions using their 10 years of project documentation, client reports, and internal wikis. Employees waste 2 hours a day searching for information. Walk me through how you'd approach this." },
    'Healthcare':  { title: 'Clinical Documentation AI', problem: "A large academic medical center wants to deploy an AI system to help physicians reduce clinical documentation time by 50%. Physicians currently spend 3 hours per day on notes. Walk me through how you'd design this system." },
    'Fintech':     { title: 'Real-Time Fraud Detection', problem: "A digital bank processing 5 million transactions daily wants to build an AI-powered fraud detection system that makes decisions in under 100ms with a false positive rate below 0.1%. Walk me through your approach." },
    'E-commerce':  { title: 'AI Shopping Assistant', problem: "A fashion marketplace with 20 million SKUs and 15 million monthly active users wants to build a personalized AI shopping assistant that improves conversion by 15%. Walk me through how you'd approach this." },
  },
  'Forward Deployed Engineer': {
    'General':     { title: 'Supply Chain Visibility Platform', problem: "A Fortune 500 manufacturing company wants a real-time supply chain visibility platform. They have 12 legacy ERP systems, no unified API layer, inconsistent data formats, and need a working MVP in 90 days. Where do you start?" },
    'Healthcare':  { title: 'Multi-EHR Patient Data Unification', problem: "A regional hospital network wants to unify patient records across 6 different EHR systems to enable care coordination. Their IT team is understaffed, change-averse, and two of the systems are 15 years old with no modern APIs. Walk me through your approach." },
    'Fintech':     { title: 'Real-Time Lending Risk Dashboard', problem: "A regional bank wants a real-time lending risk dashboard pulling data from 4 core banking systems. Their data is inconsistent, partially in mainframes, and they have a board presentation in 60 days. Where do you start?" },
    'E-commerce':  { title: 'Omnichannel Inventory Unification', problem: "A large retailer wants to unify online and in-store inventory across 400 locations into a single real-time view. They have 8 existing systems, seasonal peak in 10 weeks, and their current inventory accuracy is 73%. Walk me through your approach." },
  },
  'Forward Deployed Product Manager': {
    'General':     { title: 'Enterprise Churn Crisis', problem: "A Series B SaaS company brought you in — their enterprise customers are churning at 30% annually and they don't know why. You have 60 days, full access to customers, data, and engineering. Walk me through how you'd approach diagnosing and fixing this." },
    'Healthcare':  { title: 'Clinical Platform Adoption Crisis', problem: "A health system deployed your care coordination platform to 300 clinicians 4 months ago. Adoption is at 25% and declining. The CMO is losing patience and threatening to pull the contract. Walk me through how you'd diagnose and turn this around." },
    'Fintech':     { title: 'SMB Lending Product Strategy', problem: "A digital lending startup wants to expand from consumer personal loans into SMB lending. You're embedded with them for 90 days to define the product strategy and go-to-market approach. Walk me through how you'd tackle this." },
    'E-commerce':  { title: 'Marketplace Seller Satisfaction Crisis', problem: "A marketplace with 3 million sellers has seen seller satisfaction drop 20% in 6 months and churn is accelerating. You're embedded to diagnose the problem and build a roadmap. Walk me through your approach." },
  },
  'Technical Program Manager': {
    'General':     { title: 'Failing Platform Migration', problem: "You've just taken over as TPM for a 12-team, 18-month platform migration. It's 4 months in, 6 weeks behind schedule, there's no dependency map, and three teams are blocked on each other. Walk me through how you'd stabilize this program." },
    'Healthcare':  { title: 'Clinical System Multi-Site Rollout', problem: "You're leading the rollout of a new clinical decision support system across 8 hospital sites with a hard regulatory compliance deadline in 5 months. Two sites are actively resisting. Walk me through how you'd run this program." },
    'Fintech':     { title: 'Compliance + Migration Collision', problem: "You're driving a PCI-DSS Level 1 recertification across 6 engineering teams while simultaneously migrating to a new payment processor. Both have hard deadlines in the same quarter and are competing for the same engineers. Walk me through your approach." },
    'E-commerce':  { title: 'Black Friday Readiness at Risk', problem: "You're the TPM for peak-season readiness at a major retailer. It's September, Black Friday is 11 weeks away, 4 critical integrations aren't finished, load tests haven't started, and two team leads just gave notice. Walk me through how you'd run this." },
  },
};

/* ── Target solutions for Mock Interview mode ──
   Each has:
   - keyComponents: the specific things a strong answer must cover (used to steer the interviewer)
   - idealSolution: the full model answer shown on the results page
   - hints: progressive hints the interviewer can drop if candidate is off track
*/
export const MOCK_TARGETS = {
  'AI Solutions Architect': {
    'General': {
      keyComponents: [
        'Document chunking strategy (semantic vs fixed-size, overlap)',
        'Embedding model selection and vector store (e.g. Pinecone, pgvector)',
        'Retrieval pipeline with hybrid search (semantic + keyword)',
        'Reranking layer to improve precision',
        'LLM orchestration with citation and grounding',
        'Evaluation framework (retrieval recall, answer faithfulness, latency)',
        'Access control — not every employee should see every document',
      ],
      idealSolution: `The core architecture is a RAG (retrieval-augmented generation) pipeline. Documents are ingested, chunked semantically (500–1000 tokens with overlap), and embedded using a model like text-embedding-3-small. Embeddings are stored in a vector database (pgvector or Pinecone). At query time, hybrid search combines dense vector retrieval with BM25 keyword search, then a reranker (e.g. Cohere Rerank) improves precision. The top-k chunks are injected into an LLM prompt with a strict grounding instruction: only answer from retrieved context, cite sources, say "I don't know" if nothing is found. Access control is enforced at retrieval time — filter by document permissions before returning chunks. The evaluation framework tracks retrieval recall@k, answer faithfulness (does the answer match retrieved context?), and latency p95. Fine-tuning is not needed for V1 — good chunking and retrieval outperform fine-tuning at this stage.`,
      hints: [
        'Think about how documents get broken up before they can be searched',
        'How does the system find relevant documents — what does similarity search actually mean here?',
        'What stops the model from making things up that aren\'t in the documents?',
        'If an employee can\'t see a document normally, should they be able to ask the AI about it?',
        'How would you know if the system is giving bad answers before users complain?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'PHI must stay within HIPAA-compliant, BAA-covered environment',
        'Ambient AI listening during visit (not post-hoc transcription only)',
        'Structured note generation: SOAP format from conversation',
        'Physician review and one-click edit before signing',
        'EHR integration via FHIR to auto-populate structured fields',
        'Hallucination guardrails: only document what was explicitly said',
        'Audit trail for every generated and edited note',
      ],
      idealSolution: `The system uses ambient AI — a microphone captures the physician-patient conversation in real time within a HIPAA-compliant, BAA-covered cloud environment. Speech is transcribed and processed by an LLM fine-tuned or prompted to generate structured SOAP notes. Critically, the model is instructed to only document what was explicitly stated — hallucination here is a patient safety risk. The draft note is surfaced to the physician immediately post-visit for review and one-click editing before it's signed. Structured data (diagnosis codes, medications, vitals) are extracted and pushed to the EHR via FHIR APIs to auto-populate structured fields rather than relying on free-text alone. Every generated note, edit, and sign-off is logged in an immutable audit trail. Success is measured by time-to-signed-note per encounter and physician edit rate (proxy for accuracy).`,
      hints: [
        'When in the clinical workflow does the AI actually listen — before, during, or after the visit?',
        'SOAP notes have specific structure — how does the AI know what goes where?',
        'What\'s the patient safety risk if the AI documents something that wasn\'t actually said?',
        'How does the structured data get into the EHR system itself, not just as a text note?',
        'How would a physician trust this enough to actually use it?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'Two-layer architecture: fast ML model (<10ms) + slower LLM anomaly explainer',
        'Feature engineering: velocity, geolocation delta, merchant category, device fingerprint',
        'Real-time feature store for sub-100ms retrieval',
        'Gradient boosted model (XGBoost/LightGBM) for primary scoring',
        'LLM for explainability and edge case triage, not primary detection',
        'Feedback loop: analyst decisions retrain the model weekly',
        'False positive budget — blocking legit transactions is also costly',
      ],
      idealSolution: `The architecture is two-layer. Layer 1 is a gradient boosted model (XGBoost or LightGBM) that scores every transaction in under 10ms using a real-time feature store — features include transaction velocity (5/15/60 min windows), geolocation delta from last transaction, merchant category risk score, device fingerprint, and amount z-score against user history. Transactions above a threshold are blocked or flagged; borderline cases go to Layer 2. Layer 2 uses an LLM to synthesize signals and generate a human-readable explanation for analyst review — the LLM is not in the primary detection path because it can't hit 100ms. Analysts review flagged transactions and their decisions feed back into weekly model retraining. The false positive rate is as important as the true positive rate — blocking a legitimate transaction destroys trust. The system is monitored via precision/recall on a labeled holdout set, with concept drift detection to catch when fraud patterns shift.`,
      hints: [
        'Can an LLM actually make a decision in under 100ms? What does that mean for your architecture?',
        'What signals tell you a transaction is suspicious before you have a label for it?',
        'How does the model get better over time as fraud patterns change?',
        'Blocking a legitimate transaction has a cost too — how do you think about that tradeoff?',
        'How does an analyst actually review a flagged transaction — what do they see?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Candidate generation (collaborative filtering or two-tower model) separate from ranking',
        'Multi-signal ranking: purchase history, browse history, explicit ratings, trending',
        'Embedding-based semantic search for natural language queries',
        'Business constraints layer: margin, inventory, sponsored products',
        'A/B testing framework to measure conversion lift, not just CTR',
        'Cold start solution for new users and new products',
        'Real-time vs batch inference tradeoff',
      ],
      idealSolution: `The system separates candidate generation from ranking. Candidate generation uses a two-tower neural network trained on purchase and browse history — one tower encodes the user, one encodes items, and dot product similarity retrieves top-500 candidates in milliseconds from an ANN index (Faiss or ScaNN). The ranking layer scores those 500 with a more complex model incorporating explicit signals (purchases, wishlists), implicit signals (dwell time, scroll depth), item features (margin, inventory level), and contextual signals (time of day, device). For the shopping assistant specifically, a semantic search layer maps natural language queries to item embeddings, enabling "show me something for a beach vacation under $50" queries. Business constraints (sponsored products, inventory limits, margin floors) are applied as a post-ranking filter. Cold start is handled via popularity-based fallback for new users and content-based similarity for new products. All changes are validated via A/B tests measuring conversion rate and revenue per session, not just CTR.`,
      hints: [
        'Ranking 20 million items for every user in real time isn\'t feasible — how do you narrow it down first?',
        'Purchase history is the strongest signal, but what do you do with a new user who has none?',
        'The business wants to promote high-margin items even if they\'re not the best recommendation — how do you handle that?',
        'How do you know if the recommendation system is actually better, not just getting more clicks?',
        'A new product has no purchase history — how does it get recommended at all?',
      ],
    },
  },

  'Forward Deployed Engineer': {
    'General': {
      keyComponents: [
        'Discovery first: map all 12 systems, identify the 2-3 with the richest data',
        'Don\'t boil the ocean — pick one high-value data flow for the MVP',
        'Thin integration layer (event bus or API gateway) not a full ETL rewrite',
        'Define "visibility" concretely with the stakeholder before building',
        'Incremental delivery: working dashboard in 30 days, not 90',
        'Data quality validation at ingestion, not at query time',
        'Change management — 12 systems means 12 teams who need to cooperate',
      ],
      idealSolution: `Start with a discovery sprint — 2 weeks mapping all 12 systems, their data models, owners, and update frequencies. Don't try to integrate everything. Identify the 2-3 systems that hold the most operationally critical data (typically order management, inventory, and shipping). Define "visibility" concretely with the business stakeholder: what decisions will they make with this dashboard that they can't make today? Build a thin integration layer — an event bus (Kafka or cloud pub/sub) that systems publish to rather than a heavyweight ETL pipeline. MVP in 30 days: one working data flow, one dashboard screen, real data. Validate data quality at ingestion with schema checks and alerting, not at query time. The hardest problem is change management — 12 legacy systems means 12 teams, and at least 3 will be uncooperative. Establish a single executive sponsor who can unblock access. Deliver incrementally, adding data flows every 2 weeks, so the business sees value before the 90-day deadline.`,
      hints: [
        'You have 12 systems — where do you actually start on day one?',
        'What does "supply chain visibility" actually mean in terms of a specific decision the business makes today that they can\'t?',
        'A full ETL rewrite of 12 systems would take a year — what\'s the thinnest possible integration that still delivers value?',
        'What happens when the team that owns system #7 won\'t give you API access?',
        'How do you show value before the 90 days are up so the project doesn\'t get cancelled?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'Start with a read-only integration — don\'t write back to EHRs initially',
        'HL7 FHIR R4 as the canonical data model for patient data',
        'Master Patient Index (MPI) to deduplicate patients across systems',
        'Proper data use agreements and BAA before touching any PHI',
        'Work with IT champions inside the hospital, not around them',
        'Pilot with one site, one use case before expanding',
        'Clinician workflow — the integration must fit into existing clinical flow',
      ],
      idealSolution: `Before touching any data, get signed data use agreements and BAA for every facility. Then run a 2-week discovery: audit each EHR's available interfaces (most support HL7 FHIR R4 or at minimum HL7 v2 feeds), document what patient data each holds, and identify IT champions at each site who will advocate internally. Start read-only — pull data from each EHR via FHIR APIs into a unified patient record store, mapping to a canonical FHIR R4 data model. The hardest problem is patient matching: the same patient exists in all 6 systems with slightly different demographics. Build a probabilistic Master Patient Index using name, DOB, address, and MRN to create a unified patient ID. Pilot with one site and one clinical use case (e.g., care transitions). Only after proving value and ironing out data quality issues do you expand to remaining sites. Never start with the most resistant site — find your early adopter.`,
      hints: [
        'Before you write a single line of code, what do you need in place legally?',
        'The same patient exists in all 6 systems — how do you know they\'re the same person?',
        'Most EHRs have APIs — what\'s the standard you\'d use to pull patient data?',
        'The IT team at site 3 says they\'re too busy to help for 3 months. How do you handle that?',
        'Writing data back to an EHR is much harder than reading — how does that change your approach?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'Read-only first — never write to core banking systems as MVP',
        'Identify the single most valuable metric for the board presentation',
        'Mainframe data extraction via existing batch feeds, not direct access',
        'Data normalization layer to reconcile inconsistent schemas',
        'Pre-compute risk metrics on a schedule, not real-time for V1',
        'Work within their change-control process, not around it',
        'Build with their security team\'s constraints from day one',
      ],
      idealSolution: `The 60-day constraint defines the architecture. This is not the time for a real-time streaming pipeline — it's the time for a pragmatic batch solution that actually ships. Work with the bank's IT team to get read-only exports from each of the 4 systems on a nightly schedule — mainframes typically have existing batch feeds. Build a normalization layer that maps each system's schema to a canonical loan record model, with explicit reconciliation rules for conflicts. Pre-compute the key risk metrics (portfolio concentration, delinquency rates, covenant headroom) nightly and serve them from a simple database. The board presentation needs 3-5 numbers, not 50. Spend week 1 nailing down exactly which metrics matter to the board — that defines everything. Work within their change-control process even if it's slow — a bank that sees you bypass controls will shut the project down. Deliver a working V1 in 45 days, leaving 15 days for testing and sign-off.`,
      hints: [
        'You have 60 days — does the solution need to be real-time, or is nightly good enough for a board presentation?',
        'Mainframes don\'t have REST APIs — how do you actually get data out of them?',
        'The 4 systems define "delinquent loan" differently — how do you reconcile that in the dashboard?',
        'The bank\'s change-control process takes 3 weeks to approve any system change. How does that affect your plan?',
        'What are the 3 numbers the board actually needs — and how does that shape what you build?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Event-driven architecture: inventory changes published as events',
        'Golden record per SKU with source-of-truth hierarchy across systems',
        'Store POS integration via existing APIs or polling if no webhooks',
        'Conflict resolution rules when two systems show different stock counts',
        'Reservation system to prevent overselling during high-traffic events',
        'Peak season in 10 weeks — MVP scope must be ruthlessly cut',
        'Accuracy monitoring: sample physical counts vs system counts',
      ],
      idealSolution: `The core design is a golden record system — one canonical inventory record per SKU, with a defined source-of-truth hierarchy (e.g., warehouse management system is authoritative for stock levels, ERP for pricing). When any of the 8 systems updates inventory, it publishes an event to a central bus. The golden record service consumes these events, applies conflict resolution rules, and updates the unified view. Store POS systems are the hardest: many don't support webhooks, so you poll on a 5-minute cycle for V1. A reservation system is critical for the peak season — when a customer adds to cart, inventory is soft-reserved to prevent overselling under concurrent load. Given 10 weeks to peak, ruthlessly cut scope: launch with online + top 50 stores (highest volume) first, then roll out to remaining 350. Monitor accuracy by sampling: weekly comparison of system counts against physical counts at 10 stores. 73% accuracy today means there's bad data in the source systems — surface and fix the top 5 data quality issues first.`,
      hints: [
        'When inventory changes in the warehouse system and the POS at the same time, which one is right?',
        'Not all store systems support real-time updates — what\'s your fallback?',
        'Two customers buy the last unit simultaneously — how does your system handle that?',
        'You have 10 weeks and 400 stores. What\'s the realistic scope for launch?',
        'The current accuracy is 73% — does that mean your new system will also be 73% accurate on day one?',
      ],
    },
  },

  'Forward Deployed Product Manager': {
    'General': {
      keyComponents: [
        'Churn diagnosis before solutioning — don\'t assume you know the cause',
        'Segment churned accounts: which customers, which use cases, which point in lifecycle',
        'Talk to churned customers directly, not just internal stakeholders',
        'Identify the "aha moment" — what do retained customers do that churned ones don\'t?',
        'Separate product issues from sales/onboarding/support issues',
        'Propose a intervention with a measurable leading indicator, not just churn rate',
        'Build a retention motion, not just fix bugs',
      ],
      idealSolution: `Start with data before talking to anyone. Segment churned accounts by size, industry, contract length, and feature usage patterns. Look for the "aha moment" — the action or milestone that retained customers hit that churned customers didn't. This is almost always identifiable in product analytics within the first 2 weeks. Then do 10-15 interviews with churned customers (not just internal account teams who will rationalize). Separate root causes: is churn from product gaps, poor onboarding, lack of ongoing support, or a bad-fit customer that sales shouldn't have sold? Most enterprise churn is a combination of onboarding failure and product-market fit gaps for specific segments. Prioritize the highest-value segment where the fix is tractable. Propose one high-confidence intervention with a measurable leading indicator — not churn rate (lags 6-12 months) but something like "% of accounts reaching X engagement milestone in first 30 days." Build a retention playbook, not just a bug fix list.`,
      hints: [
        'Before you talk to anyone, what does the data tell you about which customers are churning?',
        'What\'s the difference between a customer who churns because the product is bad vs one who churns because they were a bad fit to begin with?',
        'Internal account teams will tell you churn is about missing features — why might that not be the whole story?',
        'Churn rate takes 6-12 months to move — what leading indicator tells you earlier if your intervention is working?',
        'You could fix the product, fix onboarding, or fix which customers sales targets — which do you go after first and why?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'Adoption diagnosis: which workflows, which roles, which sites have the lowest usage',
        'Observe actual clinical use, don\'t rely on surveys',
        'Separate the "won\'t use" from the "can\'t use" problem',
        'Find internal clinical champion — not just an admin sponsor',
        'Reduce friction to zero for the first interaction',
        'Quick win that makes one group\'s life visibly better within 30 days',
        'Usage metric must be tied to patient care outcome, not just logins',
      ],
      idealSolution: `Start by segmenting adoption data: which clinical roles (physicians vs nurses vs care coordinators), which sites, and which specific workflows have the lowest usage. Low overall adoption masks very different problems. Spend the first week observing actual clinical workflows at the lowest-adoption site — not interviewing, observing. You'll find the real friction: most clinical adoption failures are workflow integration failures, not feature gaps. Clinicians won't change their workflow for a tool that doesn't fit in it. Separate "won't use" (skeptics who don't see value) from "can't use" (workflow or technical barrier). Find one clinical champion — a respected physician or charge nurse, not an administrator — who believes in the tool and will advocate peer-to-peer. Design a 30-day quick win: remove every click between login and the one thing that saves clinicians the most time. Measure success by a workflow metric tied to patient care, not just logins — e.g., "reduction in time to next care action after discharge."`,
      hints: [
        'Overall adoption is 25% — but is that 25% across all roles and sites, or is it 80% in one place and 5% everywhere else?',
        'Clinicians say the tool is "too many clicks" — is that a feature problem or a workflow integration problem?',
        'The CMO is your executive sponsor, but who actually influences whether a physician uses a new tool day-to-day?',
        'What\'s the difference between a clinician who doesn\'t see value and one who sees value but can\'t fit it into their workflow?',
        'Logins per day is an easy metric — but what would a metric look like that actually reflects impact on patient care?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'SMB lending is fundamentally different from consumer — different risk model, sales motion, and product',
        'Underwriting is the core product decision: what data signals determine creditworthiness for SMBs?',
        'Distribution strategy: direct, broker, embedded in accounting software',
        'Regulatory requirements differ by loan size and type (SBA, non-SBA)',
        'Unit economics: CAC, default rate, and interest margin must work together',
        'Start with a specific SMB segment, not "all SMBs"',
        'Differentiation: why would an SMB choose this over their bank or Kabbage?',
      ],
      idealSolution: `SMB lending is not consumer lending with a higher limit — it's a different product. The first 2 weeks are market segmentation: which SMB segment (micro-business <$1M revenue, small business $1-10M, lower-middle market) and which vertical (restaurant, retail, SaaS, services) are tractable given current data and capital? The underwriting model is the core product decision — what signals predict SMB creditworthiness? Bank transaction data (cash flow consistency, revenue trends) is more predictive than credit scores for SMBs. The distribution strategy is equally critical: direct sales is expensive, broker networks have margin pressure, but embedding in accounting software (QuickBooks, Xero) where SMBs already manage cash flow is the highest-leverage channel. Regulatory complexity scales with loan size — sub-$150K loans have lighter-touch requirements. Define unit economics targets before building: what default rate and interest margin makes the business work at scale? Differentiation must be concrete: faster decisioning, higher approval rates for good-risk businesses banks reject, or sector-specific underwriting.`,
      hints: [
        'Consumer personal loans and SMB loans — what\'s actually different about the risk and the product?',
        'A credit score works for consumers — what tells you whether a small business will repay a loan?',
        'You could sell directly, through brokers, or through accounting software — what are the tradeoffs?',
        'Which specific type of SMB are you going after first, and why not all of them?',
        'What makes this better than what an SMB can get from their existing bank today?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Seller satisfaction diagnosis: segment by seller size, category, tenure',
        'Identify the top 3 pain points by frequency AND severity, not just complaints',
        'Distinguish platform problems from seller expectation problems',
        'Seller lifetime value framework — not all sellers are equally worth retaining',
        'Quick win within 30 days to stop the bleeding before roadmap work',
        'Feedback loop: how do sellers currently surface problems, and why isn\'t it working?',
        'Seller success motion: proactive vs reactive support',
      ],
      idealSolution: `Start with data segmentation: satisfaction scores broken down by seller GMV tier, category, tenure, and geography. A 20% average drop almost certainly hides a catastrophic drop in one segment masked by stability elsewhere. Pull CSAT drivers — what are sellers actually complaining about? Cluster complaints into themes and score each by frequency × severity × tractability. The top issues in marketplace seller dissatisfaction are almost always: fee changes, search/ranking algorithm changes that reduced visibility, policy enforcement inconsistency, and slow dispute resolution. Separate legitimate product problems from expectation problems — some churn is sellers who never should have been onboarded. Build a seller lifetime value model: a seller doing $500K GMV annually is worth fighting for; a seller doing $500 is not. Design a 30-day quick win targeting the highest-LTV churning segment — often it's a specific policy or fee change you can roll back or grandfather. Long-term: build a proactive seller success motion (dedicated support tiers, early warning system based on GMV trends) rather than reactive firefighting.`,
      hints: [
        'A 20% average drop — is that uniform across all 3 million sellers, or is it concentrated somewhere?',
        'Sellers complain about everything — how do you separate the 3 problems worth solving from the 50 they mention?',
        'Some sellers churning might actually be fine for the business — how do you think about that?',
        'What can you do in the next 30 days that would visibly improve things for your most important sellers?',
        'Sellers are telling you about problems — but what\'s the system today for surfacing those problems, and why isn\'t it working?',
      ],
    },
  },

  'Technical Program Manager': {
    'General': {
      keyComponents: [
        'Immediate triage: understand the critical path and where the 6-week slip came from',
        'Dependency mapping session within week 1 — not a document, a working session',
        'Separate "blocked" from "behind" — different interventions',
        'Executive alignment: is the date fixed or is scope negotiable?',
        'Weekly program rhythm with clear escalation path',
        'One source of truth for status — replace all the shadow trackers',
        'Risk register with owners and mitigation plans, not just a list',
      ],
      idealSolution: `Week 1 is entirely diagnostic — don't make changes yet. Schedule 1:1s with each of the 12 team leads to understand their actual state, not their status report state. Map the critical path by asking: "What is the one thing your team is waiting for that isn't in your control?" This surfaces the real dependency graph in 2-3 days. Separate teams that are behind on their own work from teams that are blocked by others — the intervention is completely different. With the dependency map in hand, call a cross-team working session (not a status meeting) to resolve the top 3 blocking dependencies in real time. Establish a single program tracker that all teams feed — eliminate shadow spreadsheets. Set up a weekly rhythm: 30-min leads sync Monday, written status update Thursday, escalation path defined so any blocker unresolved for 48 hours auto-escalates to you. Go to your executive sponsor and have an honest conversation: given 6 weeks of slip, is the date actually fixed? Scope negotiation now is better than a missed launch. Build a risk register with likelihood, impact, owner, and mitigation — not to report it, but to actively work it weekly.`,
      hints: [
        'You inherit a program that\'s behind — what do you do in the first 48 hours before you change anything?',
        'A dependency map is the first thing you need — but how do you actually build one when no one has documented it?',
        'Three teams are blocked on each other — what does "blocked" actually mean, and how do you unblock them?',
        'Your executive sponsor asks you for a status update on day 3. What do you tell them?',
        'Is the ship date actually fixed? How do you have that conversation with leadership?',
      ],
    },
    'Healthcare': {
      keyComponents: [
        'Clinical validation gate before each site rollout — not just technical testing',
        'Regulatory compliance as a tracked workstream from day 1, not a final checklist',
        'Phased rollout: pilot site → validation → expansion, not big bang',
        'Clinician change management is the hardest part, not the technology',
        'Two resisting sites: understand root cause — political, workflow, or technical?',
        'Hard compliance deadline drives backward planning — start there',
        'Clinical superuser network at each site',
      ],
      idealSolution: `The 5-month regulatory deadline is immovable — start there and plan backward. Map every compliance evidence artifact required and assign it to a team with a due date 3 weeks before the deadline to allow for audit prep. Don't treat compliance as a final step; it's a continuous workstream. The phased site rollout is driven by risk and influence: start with the most receptive site that has a clinical champion, not the largest or most complex. Build a clinical validation gate between sites — go-live at site 2 only when site 1 meets pre-defined adoption and safety metrics for 30 days. Clinician change management is the hardest part: deploy clinical superusers (2-3 trained power users per site) who support peers peer-to-peer, because clinicians trust other clinicians. For the 2 resisting sites, diagnose the root cause: if it's political (administration vs clinical leadership conflict), escalate to your health system executive sponsor. If it's workflow, redesign the implementation for that site's specific workflow before launch. Never go live at a resisting site without genuine buy-in — it will fail and damage the whole program.`,
      hints: [
        'The compliance deadline is in 5 months — when do you need to have all compliance evidence ready, and who owns it?',
        'You have 8 sites — do you launch all of them at once, or in sequence? What determines the order?',
        'Two sites are resisting — is that a political problem, a workflow problem, or a technical problem? Does the answer change what you do?',
        'Technology rollouts in hospitals fail more often due to people than technology — how does your program address that?',
        'How do you know a site is actually ready to go live, not just technically deployed?',
      ],
    },
    'Fintech': {
      keyComponents: [
        'Separate the two programs with one shared resource pool — explicit allocation model',
        'Regulatory deadline for PCI is immovable — it gates everything else',
        'Identify the shared engineers and get explicit executive decision on prioritization',
        'PCI recertification is evidence-heavy — compliance as a workstream from day 1',
        'Payment processor migration needs a parallel-run and gradual traffic cutover',
        'Risk register with shared-resource conflicts explicitly tracked',
        'Single executive sponsor who owns the prioritization decision',
      ],
      idealSolution: `The first problem is resource contention — you can't run both programs at full speed with the same engineers. In week 1, map exactly which engineers are on which workstreams and where they're double-booked. Take this to a single executive sponsor and force an explicit prioritization decision: PCI recertification is the right answer because it has a regulatory hard stop, while the payment processor migration has a business-driven deadline with more flexibility. With that decision made, allocate engineers accordingly and replan the migration timeline. PCI recertification is primarily an evidence and process problem, not a technology problem — stand up a compliance workstream that runs in parallel, collecting evidence continuously rather than scrambling at the end. For the payment processor migration, design a gradual traffic cutover: 1% → 5% → 25% → 100% over 4 weeks with a parallel-run period where both processors handle traffic and you reconcile the results. Never cut over fully without reconciliation proving the new processor matches the old. Maintain a shared risk register that explicitly tracks every shared-resource conflict and its resolution.`,
      hints: [
        'You have two programs competing for the same engineers — who makes the call on who gets priority?',
        'PCI recertification has a regulatory deadline, the processor migration has a business deadline — does that change how you treat them?',
        'PCI certification requires a lot of documentation and evidence — when does that work start?',
        'You\'re switching payment processors on live transaction traffic — what\'s the safest way to do that cutover?',
        'How do you know the new payment processor is working correctly before you fully switch over?',
      ],
    },
    'E-commerce': {
      keyComponents: [
        'Immediate readiness assessment: what\'s done, what\'s not, what\'s the critical path to peak',
        'Go/no-go gate with explicit criteria — not a feeling, a checklist',
        'Load testing is the highest priority in week 1 — you need data on current capacity',
        'The 4 unfinished integrations: triage by revenue impact, not by technical complexity',
        'Two team leads leaving: knowledge transfer plan before they\'re gone',
        'Escalate to leadership immediately — this is a program at risk',
        'Contingency plan: what if integration X isn\'t done by November 1?',
      ],
      idealSolution: `The first action is to escalate to leadership immediately — this program is at significant risk and leadership needs to know now, not after peak. Then run a 48-hour triage: for each of the 4 unfinished integrations, assess revenue impact (how much GMV is at risk if it's not done?), completion estimate, and dependencies. Rank them by revenue impact, not technical complexity. The one that protects the most revenue gets all available resources. Stand up load testing immediately — you need to know what the system can actually handle today before you know how much risk you're carrying. Schedule knowledge transfer sessions with the two departing team leads this week before they mentally check out. Establish a daily readiness stand-up with a go/no-go framework: explicit criteria that must be met by November 1 for peak go-live. Build contingency plans for each unfinished integration — what's the manual workaround if it's not ready? Some peak season failures can be mitigated with operations if you plan ahead. Weekly stakeholder communication to leadership with a traffic-light dashboard — no surprises.`,
      hints: [
        'It\'s September and peak is 11 weeks away — who do you tell first, and what do you tell them?',
        'You have 4 unfinished integrations and not enough time to finish all of them. How do you decide which one gets the engineers?',
        'Two team leads are leaving — what\'s the single most important thing you need from them before they go?',
        'How do you know if the system can actually handle Black Friday traffic if you haven\'t load tested yet?',
        'What\'s your plan if integration #2 isn\'t done by November 1 — do you cancel peak, or is there another option?',
      ],
    },
  },
};
