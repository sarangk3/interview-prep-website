# Deployment

The project builds to static assets and can be hosted on any static platform. The steps below use Vercel.

## 1. Push to a Git repository

Commit the project and push it to GitHub (or another supported Git provider).

## 2. Import the project

In Vercel, create a new project and import the repository. Vercel detects the Vite configuration automatically:

- **Build command:** `npm run build`
- **Output directory:** `dist`

## 3. Set environment variables

Add the following under the project's environment variable settings so written-answer feedback works:

| Name | Value |
| --- | --- |
| `VITE_ANTHROPIC_API_KEY` | Your LLM API key |

Multiple-choice mode works without this variable.

## 4. Deploy

Trigger the deployment. Vercel builds the project and serves it at the configured domain (production: https://ai-interview.solutions). Subsequent pushes to the connected branch redeploy automatically.

## Custom domain

Add a custom domain under the project's domain settings and follow the DNS instructions provided.
