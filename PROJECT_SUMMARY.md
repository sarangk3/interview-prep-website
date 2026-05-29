# Project Overview

Interview Prep Website is a single-page application for practicing technical and product interviews. It is built with React and Vite and runs as static assets with no backend.

## How it works

1. The user selects an answer format (written or multiple choice), an industry focus, and a role.
2. The app presents either a full set of questions or a single question for quick practice.
3. Written answers are scored across technical depth, communication, structure, and approach, with specific strengths and improvements. Multiple-choice answers are scored instantly with explanations.
4. Results are summarized with an overall score, and the user can download a copy of the full session.
5. Completed sessions are saved locally and surfaced on a progress dashboard.

## Roles

- AI Solutions Architect
- Forward Deployed Engineer
- Forward Deployed Product Manager
- Technical Program Manager

## Industries

General, Healthcare, Fintech, and E-commerce. Each role's questions are tailored to the selected industry.

## Data and privacy

All progress and session data are stored in the browser's `localStorage`. Nothing is sent to a server except the request used to score written answers.

## Source layout

- `src/main.jsx` — application entry point
- `src/InterviewPrepApp.jsx` — UI and application logic
- `src/questions.js` — question bank organized by industry and role
