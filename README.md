# CareerTwin

CareerTwin is a full-stack career guidance platform that helps students and professionals identify career paths based on academic profile, skills, and interests.

It includes:
- Career prediction with confidence score
- Skill-gap analysis and matching-skills report
- Suggested courses, certifications, and project roadmap
- Authenticated user flow (register/login/logout)
- Prediction history tracking

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Radix UI
- Backend: Node.js, Express, Passport (local auth), Zod
- API/Data State: TanStack React Query
- Storage (current): in-memory store
- Sessions: Memory store by default, optional PostgreSQL session store
- Optional ML prototype: Python (scikit-learn, numpy, scipy)

## Project Structure

```text
CareerTwin/
  client/            React app (pages, components, hooks, UI)
  server/            Express API, auth, prediction logic, storage
  shared/            Shared schemas and typed route contracts
  script/            Build script
  sqlite/            Optional local DB-related assets
  ml_predict.py      Optional standalone Python prediction prototype
  career-dataset.json
  package.json
```

## Prerequisites

- Node.js 18+
- npm 9+

Optional for ML prototype:
- Python 3.11+

## Quick Start

1. Install Node dependencies

```bash
npm install
```

2. Run in development

```bash
npm run dev
```

3. Open app

```text
http://localhost:5000
```

The server starts at port 5000 by default and automatically tries next ports if 5000 is busy.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm start` - run production build output
- `npm run check` - TypeScript type-check

## Environment Variables

Create a `.env` file in the project root (optional):

- `SESSION_SECRET` - secret used by `express-session`
- `PORT` - base server port (default: `5000`)
- `USE_PG_SESSION` - set `true` to use PostgreSQL-backed sessions
- `DATABASE_URL` - PostgreSQL connection string (required if `USE_PG_SESSION=true`)

## Demo Credentials

Default demo account in memory store:

- Username: `student_demo`
- Password: `Career@2026`

## App Routes

- `/login`
- `/register`
- `/` (dashboard)
- `/profile`
- `/skills`
- `/history`

## API Endpoints

Authentication:
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/user`

Profile:
- `PUT /api/users/:id`

Skills:
- `GET /api/skills`
- `POST /api/skills`
- `DELETE /api/skills/:id`

Predictions:
- `POST /api/predict`
- `GET /api/predictions`

## How Prediction Confidence Is Calculated

Confidence combines three weighted signals:

- Skills match: 60%
- Interest keyword match: 20%
- CGPA score: 20%

Formula used in server logic:

```text
confidence = clamp(0.6*skillScore + 0.2*interestScore + 0.2*cgpaScore, 0.2, 0.96)
```

Where:
- `skillScore = matchingRequiredSkills / totalRequiredSkills`
- `interestScore = matchedHints / totalHints`
- `cgpaScore = clamp(cgpa/10, 0, 1)`

## Storage Notes

- Current app data uses an in-memory store (users, skills, predictions).
- Session storage can use PostgreSQL when enabled.
- Shared schema/types are defined in `shared/schema.ts` for future DB-backed expansion.

## Optional Python ML Prototype

`ml_predict.py` is standalone and not wired to the Node API by default.

Example:

```bash
echo '{"cgpa":8.2,"skills":["Python","SQL"],"interests":["ai"]}' | python ml_predict.py
```

## Troubleshooting

- If login fails, verify cookies/session are enabled in browser and API requests include credentials.
- If port is busy, app will auto-try the next ports and print the final URL in terminal.
- If types fail, run `npm run check` to view TypeScript diagnostics.
