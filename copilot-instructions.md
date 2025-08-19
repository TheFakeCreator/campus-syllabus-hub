# Copilot Instruction Guide: **Campus Syllabus Hub**

A modern, minimal web app where college students can quickly find **syllabus, topic-wise lecture links, notes, and book references** per **branch → year → semester → subject**.

This guide is optimized for **GitHub Copilot & Copilot Chat** to generate the entire project. You’ll copy/paste prompts from each section into Copilot, in the order provided.

> **Tech Stack**
>
> - **Frontend:** Vite + React + Tailwind CSS v3 (TypeScript)
> - **Backend:** Node.js + Express (TypeScript)
> - **DB:** MongoDB + Mongoose
> - **Auth:** JWT (access + refresh), httpOnly cookies
> - **Infra (dev-friendly):** Docker + docker-compose, GitHub Actions CI
> - **Quality:** ESLint, Prettier, commitlint, Husky, vitest/jest, supertest, React Testing Library
> - **Security:** Helmet, CORS, rate-limit, mongo-sanitize, xss-clean, zod validation, OWASP best practices

---

## 0) Repository Setup (Single Monorepo)

> **Prompt to Copilot Chat**

```
Create a new monorepo named campus-syllabus-hub with two workspaces: apps/web and apps/api.
Use pnpm as the package manager; configure workspaces in pnpm-workspace.yaml.
Initialize shared config packages at packages/eslint-config and packages/tsconfig.
Add root README.md, LICENSE (MIT), and a .editorconfig.
```

> **Expected structure**

```
campus-syllabus-hub/
├─ apps/
│  ├─ web/        # Vite + React + Tailwind v3 (TS)
│  └─ api/        # Node + Express + Mongoose (TS)
├─ packages/
│  ├─ eslint-config/
│  └─ tsconfig/
├─ .github/workflows/
├─ .husky/
├─ .vscode/
├─ pnpm-workspace.yaml
├─ package.json
├─ .editorconfig
├─ README.md
└─ LICENSE
```

---

## 1) Global Tooling & Quality Gates

> **Prompt to Copilot Chat**

```
At the repo root:
- Add ESLint + Prettier with a shared config package packages/eslint-config.
- Set up Husky and lint-staged to run eslint --fix and prettier --write on staged files.
- Configure commitlint with @commitlint/config-conventional and Husky commit-msg hook.
- Add .vscode/settings.json for formatOnSave and default formatters.
- Add a root .nvmrc (LTS) and .node-version.
- Add .gitignore and .gitattributes.
```

> **Key files**

- packages/eslint-config/index.js (React + TS rules, Node rules)
- packages/tsconfig/base.json, react.json, node.json
- Root scripts:
  - pnpm lint, pnpm format, pnpm test, pnpm typecheck

---

## 2) Backend — Express API (TypeScript)

### 2.1 Initialize API app

> **Prompt to Copilot Chat**

```
Inside apps/api:
- Initialize a TypeScript Node project.
- Add Express, Mongoose, zod, bcryptjs, jsonwebtoken, cookie-parser.
- Add security middlewares: helmet, cors, express-rate-limit, xss-clean, express-mongo-sanitize, compression.
- Add pino for logging.
- Add dotenv for env.
- Add ts-node-dev for dev, jest or vitest + supertest for tests.
- Set "type": "module". Configure tsconfig paths.
- Provide npm scripts: dev, build, start, test, test:watch, lint, format, typecheck, seed.
- Create .env.sample with safe defaults.
```

**.env.sample**

```
NODE_ENV=development
PORT=4000
MONGO_URI=mongodb://mongo:27017/campus_syllabus_hub
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
CORS_ORIGIN=http://localhost:5173
COOKIE_SECURE=false
```

### 2.2 Folder structure

```
apps/api/src/
├─ app.ts                 # Express app instance
├─ server.ts              # bootstrap
├─ config/
│  └─ env.ts
├─ db/
│  └─ connect.ts
├─ middleware/
│  ├─ error.ts
│  ├─ auth.ts
│  ├─ security.ts         # helmet, cors, rate-limit, sanitize, xss, compression
│  └─ validate.ts         # zod validation wrapper
├─ utils/
│  ├─ logger.ts           # pino
│  ├─ tokens.ts           # sign/verify tokens
│  └─ pagination.ts
├─ features/
│  ├─ auth/
│  │  ├─ auth.controller.ts
│  │  ├─ auth.routes.ts
│  │  ├─ auth.service.ts
│  │  ├─ auth.schemas.ts  # zod
│  │  └─ auth.types.ts
│  ├─ users/
│  │  ├─ user.model.ts
│  │  ├─ user.controller.ts
│  │  └─ user.routes.ts
│  ├─ catalog/            # academic structure
│  │  ├─ branch.model.ts  # CSE, ECE, ME, CE, etc.
│  │  ├─ program.model.ts # BTech, MTech
│  │  ├─ year.model.ts    # 1..4 (or 5)
│  │  ├─ semester.model.ts# 1..8
│  │  ├─ subject.model.ts # subject codes, credits
│  │  └─ catalog.routes.ts
│  ├─ resources/
│  │  ├─ resource.model.ts  # links to lectures/notes/books
│  │  ├─ resource.controller.ts
│  │  ├─ resource.routes.ts
│  │  └─ resource.schemas.ts
│  └─ search/
│     ├─ search.controller.ts
│     └─ search.routes.ts
├─ tests/
└─ types/
   └─ express.d.ts        # request.user typing
```

### 2.3 Data models (Mongoose)

> **Prompt to Copilot Chat**

```
Create Mongoose schemas with indexes:
- User: name, email [unique, indexed], passwordHash, role ["student","moderator","admin"], createdAt.
- Branch: code ["CSE","ECE",... unique], name.
- Program: code ["BTECH","MTECH"], name, durationYears.
- Year: number (1..5), programRef, unique compound index (programRef, number).
- Semester: number (1..10), yearRef, unique compound index (yearRef, number).
- Subject: code [unique], name, branchRef, semesterRef, credits, topics [string[]]. Indexes on branchRef, semesterRef, text index on name and topics.
- Resource: type ["syllabus","lecture","notes","book"], title, url, description, provider, subjectRef, topics [string[]], tags [string[]], addedBy, isApproved, qualityScore (0..100), createdAt. Indexes on subjectRef, type, tags and a text index on title/description/tags.
Password hashing on save; hide passwordHash in toJSON.
```

### 2.4 Validation (zod)

- Auth: register, login, refresh, logout
- CRUD: create/update resource, subject, etc.
- Query params: pagination (page, limit), search (q, type, branch, semester, subject), safe sorting whitelist.

### 2.5 API routes

> **Prompt to Copilot Chat**

```
Implement versioned routes under /api/v1:
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout

- GET  /users/me
- PATCH /users/me

- GET  /catalog/branches
- GET  /catalog/:branch/semesters
- GET  /catalog/:branch/semesters/:sem/subjects
- GET  /subjects/:code            # by subject code
- GET  /subjects/:code/resources  # resources for a subject

- GET  /resources                 # list + filters + full-text search
- POST /resources                 # moderator/admin only
- PATCH /resources/:id            # moderator/admin
- DELETE /resources/:id           # admin

- GET  /search?q=...&type=lecture|notes|book|syllabus&branch=CSE&semester=5&subject=DAA
```

**Features**

- RBAC: student read-only; moderator can add/update; admin can delete/manage roles.
- Approval workflow: isApproved = false pending; public endpoints return only approved resources.
- Quality score: simple heuristic or upvotes later.
- Rate limiting on auth & search routes.
- Pagination: X-Total-Count header, page, limit, hasNext in response.

### 2.6 Security middleware (middleware/security.ts)

- helmet() with sensible defaults
- cors({ origin: CORS_ORIGIN, credentials: true })
- rateLimit for /auth/* and /search
- mongoSanitize(), xss()
- compression()
- cookie-parser
- Trust proxy in production for secure cookies

### 2.7 Error handling

- Centralized error handler (zod errors → 400; auth → 401/403; fallback → 500)
- Never leak stack traces in production
- Pino logger with request-id

### 2.8 Tests

- Unit tests for services (auth, resource ranking)
- Integration tests for routes via supertest
- Seed data for e2e in-memory MongoDB (mongodb-memory-server)

### 2.9 Seed script

- Seeds branches, programs, years, semesters, a few subjects (by common Indian curricula), and example resources (NPTEL, Gate Smashers, CodeWithHarry, GFG, standard textbooks).

---

## 3) Frontend — Vite + React + Tailwind v3 (TypeScript)

### 3.1 Initialize Web app

> **Prompt to Copilot Chat**

```
Inside apps/web:
- Create a Vite React TS app.
- Install Tailwind v3, PostCSS, Autoprefixer, class-variance-authority, clsx, tailwind-merge.
- Add React Router v6, axios, jotai or zustand (for lightweight state), react-hook-form + zod resolver.
- Add shadcn/ui for primitives and lucide-react for icons.
- Set up absolute imports with tsconfig paths.
- Add ESLint with React + TS.
```

### 3.2 Tailwind setup

- @tailwind base; @tailwind components; @tailwind utilities;
- Theme: neutral palette, rounded-2xl, soft shadow, generous padding, fluid type
- Dark mode: class-based

### 3.3 UI/UX Requirements (modern & minimal)

- Home: Branch → Year → Semester drilldown, or quick search box
- Search: filters (Type, Branch, Semester, Subject), sort by quality/newest
- Subject page: syllabus summary, curated playlists, notes, books
- Contribute: form for moderators (hidden for students)
- Profile: saved subjects, last visited
- Header/Footer: compact, sticky header, keyboard navigation '/' to focus search

### 3.4 Frontend Folder structure

```
apps/web/src/
├─ main.tsx
├─ app/
│  ├─ routes/
│  │  ├─ index.tsx               # Home
│  │  ├─ search.tsx
│  │  ├─ subject.$code.tsx
│  │  ├─ contribute.tsx
│  │  └─ login.tsx
│  ├─ components/
│  │  ├─ ui/                     # shadcn wrapped components
│  │  ├─ layout/
│  │  ├─ forms/
│  │  └─ cards/
│  ├─ hooks/
│  ├─ store/                     # zustand/jotai
│  ├─ lib/                       
│  │  ├─ api.ts                  # axios instance with interceptors
│  │  ├─ auth.ts                 # token helpers
│  │  └─ utils.ts
│  ├─ styles/
│  │  └─ globals.css
│  └─ types/
│     └─ api.ts
```

### 3.5 API client

- Axios with baseURL from import.meta.env.VITE_API_URL
- Interceptors for refresh-token flow (on 401 → attempt refresh → retry)
- Strong typing of DTOs with shared types or manual types

### 3.6 Key screens & components

- Drilldown cards (Branch → Year → Semester)
- Subject header with code, credits
- ResourceList: badges for type/tags, provider favicon, quality score, copy-link
- Filters: command bar (kbar-like) for quick actions
- Contribute form: zod validated; shows only for roles moderator+
- Empty states and skeleton loaders

### 3.7 Accessibility & Perf

- Semantic landmarks, focus rings, keyboard-first
- Prefetch subject data on hover
- Code-split routes, lazy images
- Avoid layout shift; use aspect-ratio utilities

### 3.8 Frontend tests

- Vitest + React Testing Library for components
- MSW for API mocking on tests
- Cypress optional for e2e

---

## 4) Shared Conventions

### 4.1 Type-safe DTOs

- Define API response/request types in apps/web/src/types/api.ts and apps/api/src/features/**/types.ts
- Keep SubjectDTO, ResourceDTO, Paginated<T> generic

### 4.2 Naming, Logging, Errors

- Services: getX, createX, updateX, deleteX
- Controllers only coordinate; services hold logic
- Client error toast messages from server message field

---

## 5) Security Checklist (Back + Front)

- Secrets in env only; never commit
- Helmet and CORS with whitelist
- rateLimit for auth/search
- Zod validation on every request body & query
- Mongo sanitize, xss-clean
- Password: bcrypt with strong salt rounds (10–12)
- JWT: short-lived access (15m), refresh (7d), httpOnly, secure in prod, SameSite=lax
- RBAC on resource mutations
- Input allow-lists for sorting/filters
- Pagination to avoid unbounded results
- E2E Tests for auth and resource access control

---

## 6) Docker & Compose

> **Prompt to Copilot Chat**

```
At the repo root, add docker-compose.yml to run:
- api service (ports 4000:4000), depends_on mongo
- web service (ports 5173:5173)
- mongo service (with volume)
Create Dockerfiles in apps/web and apps/api optimized for node:20-alpine using pnpm.
```

Provide .dockerignore for node_modules, dist, coverage.

---

## 7) CI with GitHub Actions

- Lint + Typecheck + Test on PR
- Cache pnpm store
- Optionally build both apps

> **Prompt to Copilot Chat**

```
Create .github/workflows/ci.yml to run on push/pull_request:
- setup-node with pnpm
- pnpm install --frozen-lockfile
- pnpm lint && pnpm typecheck && pnpm -r test
```

---

## 8) Seeding & Demo Data

> **Prompt to Copilot Chat**

```
Add a seed script that inserts:
- Branches: CSE, ECE, ME, CE, EE
- Programs: BTECH(4y), MTECH(2y)
- Years & Semesters mapping
- Example subjects: DSA, DBMS, OS, CN, TOC, M3, Signals & Systems, etc.
- Resources: syllabus PDFs (url), lectures (NPTEL, Gate Smashers), notes (GDrive/GitHub), books (ISBN + Amazon/Publisher links).
Ensure isApproved=true for a subset. Mark provider names.
```

---

## 9) Example API Usage

- GET /api/v1/subjects/CS301/resources?type=lecture&page=1&limit=20
- GET /api/v1/resources?q=graph%20algorithms&branch=CSE&semester=3
- POST /api/v1/resources (moderator) with body:
  ```json
  {
    "type": "lecture",
    "title": "Graphs - Playlist",
    "url": "https://...",
    "description": "Complete graphs series",
    "provider": "NPTEL",
    "subjectCode": "CS301",
    "topics": ["BFS","DFS","MST"],
    "tags": ["playlist","foundation"]
  }
  ```

---

## 10) Copilot: File-by-File Prompts

> Copy these into Copilot Chat **one by one** inside the target folder.

### 10.1 API bootstrap

```
In apps/api/src, create app.ts that sets up Express with security middleware, JSON parsing, cookie-parser, routes placeholder, health check at GET /healthz returning { status:"ok", time: new Date().toISOString() }. Export the app.
Create server.ts that reads env, connects to Mongo, starts server, and handles SIGTERM.
```

### 10.2 API middleware & utils

```
Create middleware/security.ts applying helmet, cors, rate limiter for /auth and /search, xss-clean, mongo-sanitize, compression, cookie-parser.
Create middleware/error.ts with a central error handler and zod error formatter.
Create middleware/validate.ts that takes a zod schema for body/query/params.
Create utils/logger.ts with pino and request-id.
Create utils/tokens.ts with signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken.
Create utils/pagination.ts exposing parsePagination({page,limit}) with safe defaults and caps.
```

### 10.3 Models

```
Implement user.model.ts with email uniqueness, password hashing pre-save, comparePassword method, and toJSON hiding passwordHash.
Implement branch.model.ts, program.model.ts, year.model.ts, semester.model.ts, subject.model.ts with indexes as specified.
Implement resource.model.ts with type enum, text indexes, and default isApproved=false.
```

### 10.4 Auth

```
Create auth.schemas.ts (zod) for register/login.
Create auth.service.ts for register/login/refresh/logout.
Create auth.controller.ts using cookies for tokens, secure flags based on env.
Create auth.routes.ts mount under /api/v1/auth.
Create middleware/auth.ts to check JWT and attach req.user. Add requireRole(...roles).
```

### 10.5 Catalog & Resources

```
Create catalog.routes.ts to list branches, semesters per branch, and subjects per semester.
Create resource.schemas.ts for create/update with zod.
Create resource.controller.ts with CRUD, filtering, full-text search, pagination, and approval gating.
Create resource.routes.ts and mount under /api/v1/resources.
Create search.routes.ts for GET /api/v1/search delegating to resources search implementation.
```

### 10.6 Tests

```
Set up vitest/jest + supertest. Write tests for auth register/login, resources search, and RBAC on POST /resources.
Add a mongodb-memory-server setup file.
```

### 10.7 Web bootstrap

```
In apps/web, scaffold Vite React TS. Configure Tailwind v3 and dark mode class.
Add Router with routes: /, /search, /subject/:code, /contribute, /login.
Add a minimal theme with container widths, rounded-2xl, shadow, and spacing scale.
```

### 10.8 UI components

```
Create a Header with logo text, search input, login/profile button.
Create Card components (SubjectCard, ResourceCard) with compact layout and hover states.
Create FilterBar with select inputs for Type, Branch, Semester, Subject (async options).
Create CommandPalette (optional) to open search with '/'.
Create Pagination component with page/limit.
Create ProtectedRoute component that checks role for moderator/admin.
```

### 10.9 API integration

```
Create lib/api.ts using axios with baseURL from VITE_API_URL and withCredentials=true.
Add interceptors to handle 401 by calling /auth/refresh then retrying once.
Create pages that fetch:
- Home: branches → years → semesters → subjects drilldown (cascading selects)
- Search: /search with query params + filters + pagination
- Subject: /subjects/:code and its /resources
- Contribute: POST /resources (role-gated)
- Login: POST /auth/login then store minimal user in zustand
```

### 10.10 Auth UI

```
Create /login with email/password form (react-hook-form + zod).
Store minimal user info and role in state (zustand/jotai).
Gate /contribute route for roles moderator/admin only.
```

---

## 11) Scripts & Commands

**Root**

```
pnpm i
pnpm -r build
pnpm -r dev
pnpm -r test
pnpm -r lint
pnpm -r typecheck
```

**API**

```
pnpm --filter api dev
pnpm --filter api seed
```

**Web**

```
pnpm --filter web dev
```

---

## 12) Deployment Notes

- Use a dedicated Mongo Atlas cluster
- Set COOKIE_SECURE=true and enable trust proxy behind reverse proxies
- Configure CORS with exact client origin(s)
- Rotate JWT secrets regularly
- Optional: static hosting for web (Netlify/Vercel) + Render/Fly for API

---

## 13) Roadmap (Nice-to-have)

- Upvote/rating & reporting for resources
- Admin dashboard (approval queue, analytics)
- Bulk import via CSV/Google Sheets
- Subject versioning per university
- Internationalization (i18n)
- Offline PWA for cached subjects

---

## 14) Final Copilot Prompt (Full Project Stitching)

> Paste this in the repo root to let Copilot cross-reference and fill gaps.

```
Review the entire repository and ensure:
- All routes are wired under /api/v1 in apps/api/src/app.ts.
- All models export named and default types, indexes are created.
- Seed script runs idempotently and uses upsert where needed.
- Web app environment variables are documented in apps/web/.env.sample (VITE_API_URL).
- Axios client uses withCredentials and handles refresh-token flow properly.
- Add README sections for Getting Started, Scripts, Env, and Architecture.
- Ensure test suites run locally and in CI.
- Ensure Dockerfiles build successfully and docker-compose up works end-to-end.
```

---

### Appendix A — Example Tailwind design tokens

- Spacing: p-4 md:p-6, rounded-2xl, shadow-lg
- Typography: text-sm/relaxed, text-base, text-lg, font-medium
- Surfaces: cards with subtle borders border border-neutral-200/70 dark:border-neutral-800
- Focus ring: focus:outline-none focus:ring-2 focus:ring-offset-2

### Appendix B — Subject taxonomy suggestion

- Branches: CSE, ECE, ME, CE, EE
- Semesters: 1–8 (BTech)
- Subjects (examples): DSA, DBMS, OS, CN, TOC, OOP, M3, Signals & Systems, Digital Logic

---

> With the prompts above, Copilot can bootstrap and iteratively refine the **Campus Syllabus Hub** with strong defaults for **security, scalability, and maintainability**.
