CareerTwin

CareerTwin is a full-stack career guidance platform that helps students and professionals identify suitable career paths based on their skills, interests, and academic profile. It provides personalized recommendations, skill-gap analysis, and learning roadmaps with a modern React UI and a Node/Express API.

Overview

- Personalized career prediction with confidence scoring
- Skill-gap analysis and learning roadmap suggestions
- Authenticated dashboard with profile, skills, and history
- REST API with input validation
- Modular frontend and backend, ready for extension

Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Backend: Node.js, Express, Passport (local auth), Zod
- State/API: React Query
- Storage: In-memory store (MemStorage) with schema definitions for persistence
- Optional: Python ML prototype script for offline experiments

Getting Started

Prerequisites

- Node.js 18+ (recommended)
- npm 9+

Install

1. Install dependencies

	 npm install

2. Start development server

	 npm run dev

The app starts on port 5000 by default and auto-increments if the port is busy.

Build and Run

- Build: npm run build
- Start production server: npm start
- Type check: npm run check

Environment Variables

Create a .env file if you need to override defaults.

- SESSION_SECRET: Session signing secret for Express sessions
- PORT: Base port for server (default: 5000)
- USE_PG_SESSION: Set to true to use Postgres-backed session store
- DATABASE_URL: Postgres connection string when USE_PG_SESSION is true

Demo Account

The in-memory store ships with a demo user for quick testing:

- Username: student_demo
- Password: Career@2026

Application Routes

- /login, /register
- / (Dashboard)
- /profile
- /skills
- /history

API Endpoints

Authentication

- POST /api/register
- POST /api/login
- POST /api/logout
- GET /api/user

User Profile

- PUT /api/users/:id

Skills

- GET /api/skills
- POST /api/skills
- DELETE /api/skills/:id

Predictions

- POST /api/predict
- GET /api/predictions

Project Structure

root/
	client/           React frontend (pages, components, hooks)
	server/           Express server, auth, API routes
	shared/           Shared schema and typed API definitions
	sqlite/           Local SQLite assets (optional)
	script/           Build scripts
	ml_predict.py     Python ML prototype (optional)
	index.html        Static prototype entry
	README-simple.md  Simple single-page version docs

Notes on Storage

The server currently uses an in-memory store (MemStorage) for users, skills, and predictions. The Drizzle schema in shared/schema.ts is ready for database-backed storage if you want to expand persistence.

Python ML Prototype (Optional)

The file ml_predict.py is a standalone ML prototype that reads JSON from stdin and outputs a prediction. It is not wired into the Node API by default.

Example usage:

	echo '{"cgpa":8.2,"skills":["Python","SQL"]}' | python ml_predict.py

Simple Version

If you want the single-page static version with a Kaggle dataset, see README-simple.md.
