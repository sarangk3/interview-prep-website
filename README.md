# Interview Prep Website

A web application for practicing technical and product interviews. Users select a role, industry, and answer format, work through a set of questions, and receive a scored evaluation with targeted feedback.

**Live site:** https://ai-interview.solutions

## Features

- **Two answer formats** — write free-form responses for detailed feedback, or answer multiple-choice questions for instant scoring with explanations.
- **Four roles** — AI Solutions Architect, Forward Deployed Engineer, Forward Deployed Product Manager, and Technical Program Manager.
- **Industry focus** — tailor questions to General, Healthcare, Fintech, or E-commerce contexts.
- **Scored feedback** — written answers are evaluated across technical depth, communication, structure, and approach, with strengths and areas to improve.
- **Progress tracking** — a dashboard summarizes completed sessions, average scores, and practice by role. Data is stored locally in the browser.
- **Session export** — download a full copy of any completed session, including questions, answers, scores, and feedback.

## Tech Stack

- React 18
- Vite
- Browser `localStorage` for persistence

## Getting Started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

To create a production build:

```bash
npm run build
```

## Configuration

Multiple-choice mode runs entirely in the browser with no configuration.

Written-answer feedback requires an LLM API key, supplied through the `VITE_ANTHROPIC_API_KEY` environment variable. Set it locally in a `.env` file or, for deployments, in your hosting provider's environment settings.

## Deployment

The project builds to static assets and can be hosted on any static platform (e.g., Vercel, Netlify). Connect the repository, set the `VITE_ANTHROPIC_API_KEY` environment variable, and deploy.

## Project Structure

```
.
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Entry point
    ├── InterviewPrepApp.jsx  # Application UI and logic
    └── questions.js          # Question bank by industry and role
```

## License

Released for personal and commercial use.
