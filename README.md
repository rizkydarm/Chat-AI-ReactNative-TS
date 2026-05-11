# 🤖 AI Chat App MVP

> A cross-platform (Mobile + Web) AI chat application with **Bring Your Own Key (BYOK)** support. Connect your AI provider credentials and chat with multiple LLMs through a unified, secure interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK_50-000020.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.73-61DAFB.svg)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF.svg)](.github/workflows)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🎯 MVP Scope](#-mvp-scope)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#️-configuration)
- [🔌 API Reference](#-api-reference)
- [🧪 Testing](#-testing)
- [🔄 CI/CD](#-cicd)
- [🔐 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### ✅ MVP Features
- 🔐 **JWT Authentication**: Username + password login (no email verification)
- 🔑 **BYOK Support**: Securely store & use your AI provider API key + endpoint URL
- 🧠 **Multi-Provider AI**: Abstracted via [Vercel AI SDK](https://ai-sdk.dev/) — supports OpenAI, Anthropic, custom endpoints
- 💬 **Chat Threads**: Create, rename, delete, and switch between multiple conversations
- 📱 **Cross-Platform**: Single codebase for iOS, Android, and Web (Expo)
- 🎨 **Responsive UI**: React Native Paper design system with adaptive breakpoints
- 🌐 **REST API Only**: No WebSockets, no streaming — simple request/response
- 🔒 **Encrypted Storage**: API keys encrypted at rest (AES-256-GCM)
- 🧪 **CI/CD Ready**: GitHub Actions for lint, test, build on every PR

### ❌ Out of Scope (MVP)
- Streaming responses
- Image/voice/file input
- Offline support
- Push notifications
- Admin dashboard
- OAuth / social login
- Chat export or sharing

---

## 🎯 MVP Scope

```mermaid
graph LR
    A[User] --> B[Register/Login]
    B --> C[Configure AI Provider]
    C --> D[Create Chat Thread]
    D --> E[Send Message]
    E --> F[Backend Proxy]
    F --> G[AI Provider API]
    G --> F
    F --> E
    E --> H[Save to MongoDB]
```

**User Flow**:  
`Register → Login → Settings (add API key + URL) → New Chat → Send Prompt → Receive AI Response`

---

## 🏗️ Architecture

### High-Level Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend       │     │   AI Providers  │
│   (Expo RN)     │────▶│   (Express)     │────▶│   (BYOK)        │
│                 │     │                 │     │                 │
│ • React Native  │     │ • JWT Auth      │     │ • OpenAI        │
│ • React Native  │     │ • MongoDB       │     │ • Anthropic     │
│   Paper         │     │ • AI SDK Proxy  │     │ • Custom URL    │
│ • Axios         │     │ • AES Encryption│     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                       ▲
         │                       │
┌─────────────────┐     ┌─────────────────┐
│   GitHub Actions│     │   MongoDB Atlas │
│   (CI/CD)       │     │   (M0 Free)     │
└─────────────────┘     └─────────────────┘
```

### Data Flow: Send Message
1. Frontend sends `POST /api/threads/:id/messages` with `{ content }` + JWT
2. Backend validates JWT, fetches thread + encrypted provider config
3. Backend decrypts API key using `ENCRYPTION_KEY` (env var)
4. Backend calls AI SDK `generateText()` with user's provider URL + key
5. AI response saved to MongoDB, returned to frontend
6. Frontend displays assistant message

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend** | React Native + Expo | SDK 50 | Cross-platform mobile/web |
| **UI Library** | React Native Paper | ^5.12 | Material Design components |
| **Navigation** | React Navigation | ^6.16 | Stack + drawer navigation |
| **State** | React Context + useReducer | Built-in | MVP-simple state management |
| **HTTP** | Axios | ^1.6 | API client with JWT interceptor |
| **Backend** | Express.js + TypeScript | ^4.18 / ^5.3 | REST API server |
| **Database** | MongoDB + Mongoose | ^8.0 / ^7.6 | Flexible schema for chats |
| **AI Abstraction** | Vercel AI SDK (`ai`) | ^3.0 | Unified provider interface |
| **Auth** | jsonwebtoken + bcrypt | ^9.0 / ^5.1 | JWT tokens + password hashing |
| **Encryption** | Node.js `crypto` | Built-in | AES-256-GCM for API keys |
| **Validation** | Zod | ^3.22 | Runtime schema validation |
| **Testing** | Jest + Supertest + RNTL | ^29.7 | Unit/integration tests |
| **CI/CD** | GitHub Actions | Native | Lint → Test → Build pipeline |

---

## 📁 Project Structure

```
ai-chat-mvp/
├── 📁 apps/
│   ├── 📁 mobile-web/          # Expo React Native app (mobile + web)
│   │   ├── 📁 app/             # Expo Router file-based routes
│   │   │   ├── (auth)/         # Auth screens (login, signup)
│   │   │   ├── (chat)/         # Main chat interface
│   │   │   │   ├── index.tsx   # Chat list + sidebar
│   │   │   │   ├── [id].tsx    # Thread detail + messages
│   │   │   │   └── _layout.tsx # Responsive layout wrapper
│   │   │   ├── settings.tsx    # Provider config screen
│   │   │   └── _layout.tsx     # Root layout + navigation
│   │   ├── 📁 components/      # Reusable UI components
│   │   ├── 📁 contexts/        # AuthContext, ChatContext
│   │   ├── 📁 hooks/           # useResponsive, useApi, useChat
│   │   ├── 📁 services/        # api.ts (Axios instance), auth.ts
│   │   ├── 📁 utils/           # responsive.ts, encryption.ts (frontend stubs)
│   │   ├── app.json            # Expo config
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── 📁 backend/             # Express.js API server
│       ├── 📁 src/
│       │   ├── 📁 config/      # db.ts, ai-sdk.ts, cors.ts
│       │   ├── 📁 controllers/ # auth.controller.ts, chat.controller.ts
│       │   ├── 📁 middleware/  # auth.middleware.ts, error.middleware.ts
│       │   ├── 📁 models/      # user.model.ts, thread.model.ts, message.model.ts
│       │   ├── 📁 routes/      # auth.routes.ts, chat.routes.ts
│       │   ├── 📁 services/    # encryption.service.ts, ai-proxy.service.ts
│       │   ├── 📁 utils/       # api-error.ts, logger.ts
│       │   └── app.ts          # Express app factory
│       ├── 📁 tests/           # Jest tests (unit + integration)
│       ├── 📁 docs/            # OpenAPI spec snippet
│       ├── package.json
│       ├── tsconfig.json
│       └── server.ts           # Entry point
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── lint-test.yml       # Run ESLint + Jest on PR
│       └── build.yml           # Build Expo app on main push
│
├── 📁 scripts/                 # Helper scripts (setup, seed, encrypt-test)
├── .env.example                # Template for environment variables
├── docker-compose.yml          # Optional: local MongoDB for dev
├── README.md                   # This file
└── package.json                # Root scripts (optional monorepo)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20.x ([nvm recommended](https://github.com/nvm-sh/nvm))
- Yarn ≥ 1.22 or npm ≥ 10.x
- Expo CLI: `npm install -g expo-cli`
- MongoDB Atlas account (free M0 tier) — or local MongoDB for dev
- GitHub account for CI/CD

### 1️⃣ Clone & Install
```bash
git clone https://github.com/your-org/ai-chat-mvp.git
cd ai-chat-mvp

# Install root dependencies (if using workspaces)
yarn install

# Install frontend
cd apps/mobile-web && yarn install

# Install backend
cd ../backend && yarn install
```

### 2️⃣ Environment Setup
Copy example env files and fill in your values:
```bash
# Frontend
cd apps/mobile-web
cp .env.example .env.local

# Backend
cd ../backend
cp .env.example .env.local
```

See [⚙️ Configuration](#️-configuration) for variable details.

### 3️⃣ Start Development Servers

#### Backend (Express)
```bash
cd apps/backend
yarn dev
# → Server running at http://localhost:3000
# → MongoDB connected (check logs)
```

#### Frontend (Expo)
```bash
cd apps/mobile-web
yarn android    # Start on Android emulator
yarn ios        # Start on iOS simulator (macOS only)
yarn web        # Start on web (Chrome)
# → Expo Dev Tools: http://localhost:8081
```

> 💡 **Tip**: Use `expo start --tunnel` if testing on physical device outside local network.

### 4️⃣ Verify Setup
1. Open app → Register new user (`testuser` / `password123`)
2. Login → Navigate to Settings
3. Enter test provider config:
   ```
   Provider URL: https://api.openai.com/v1
   Model Name: gpt-4o-mini
   API Key: sk-test-... (use OpenAI test key)
   ```
4. Click "Test Connection" → Should return `✓ Valid`
5. Create new chat → Send "Hello" → Receive AI response

---

## ⚙️ Configuration

### 🔐 Environment Variables

#### Backend (`apps/backend/.env.local`)
```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ai-chat-mvp?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Encryption (32-byte hex string for AES-256-GCM)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
ENCRYPTION_KEY=your-32-byte-hex-encryption-key-here

# CORS (comma-separated origins)
CORS_ORIGINS=http://localhost:8081,http://localhost:3000,https://your-web-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (`apps/mobile-web/.env.local`)
```env
# API Base URL (use EXPO_PUBLIC_ prefix for Expo env vars)
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Expo Web (optional)
EXPO_PUBLIC_WEB_ROOT=/

# Feature flags (MVP)
EXPO_PUBLIC_ENABLE_ANALYTICS=false
```

> 🔒 **Critical**:  
> - Never commit `.env.local` files  
> - Store `ENCRYPTION_KEY` and `JWT_SECRET` in GitHub Secrets for CI/CD  
> - Rotate keys periodically

### 🌍 MongoDB Setup (Free Tier)
1. Create free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (M0)
2. Get connection string → replace `<user>`, `<pass>`, `<cluster>` in `MONGODB_URI`
3. Whitelist `0.0.0.0/0` for development (restrict in production)
4. Database name: `ai-chat-mvp` (auto-created on first write)

Optional local dev with Docker:
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
volumes:
  mongo-data:
```
```bash
docker-compose up -d
# Then set MONGODB_URI=mongodb://localhost:27017/ai-chat-mvp
```

---

## 🔌 API Reference

### Base Configuration
- Base URL: `/api`
- Content-Type: `application/json`
- Auth Header: `Authorization: Bearer <JWT>` (required for protected routes)
- Error Format:
  ```json
  { "error": { "code": "AUTH_INVALID", "message": "Invalid credentials" } }
  ```

### 🔑 Authentication
| Method | Endpoint | Description | Request | Success Response |
|--------|----------|-------------|---------|-----------------|
| POST | `/auth/register` | Create new account | `{ username, password }` | `{ token, user: { id, username } }` |
| POST | `/auth/login` | Authenticate user | `{ username, password }` | `{ token, user: { id, username } }` |

### ⚙️ User Settings (BYOK)
| Method | Endpoint | Description | Request | Success Response |
|--------|----------|-------------|---------|-----------------|
| GET | `/user/settings` | Get provider config (key masked) | — | `{ providerUrl, modelName }` |
| PUT | `/user/settings` | Save encrypted provider config | `{ providerUrl, apiKey, modelName }` | `{ success: true }` |
| POST | `/user/settings/test` | Validate provider connectivity | `{ providerUrl, apiKey, modelName }` | `{ valid: true }` or `{ valid: false, error: "..." }` |

### 💬 Chat Threads
| Method | Endpoint | Description | Request | Success Response |
|--------|----------|-------------|---------|-----------------|
| GET | `/threads` | List user's threads | — | `[{ id, title, lastMessage, updatedAt }]` |
| POST | `/threads` | Create new thread | `{ title?: string }` | `{ id, title, createdAt }` |
| GET | `/threads/:id` | Get thread + messages | — | `{ id, title, messages: [{ id, role, content, createdAt }] }` |
| POST | `/threads/:id/messages` | Send message, get AI reply | `{ content: string }` | `{ message: { id, role, content } }` |
| DELETE | `/threads/:id` | Soft delete thread | — | `{ success: true }` |
| PUT | `/threads/:id` | Update thread title | `{ title: string }` | `{ id, title }` |

### 📝 Example: Send Message
```bash
curl -X POST http://localhost:3000/api/threads/abc123/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json" \
  -d '{ "content": "Explain quantum entanglement" }'
```

```json
// Response
{
  "message": {
    "id": "msg_789xyz",
    "role": "assistant",
    "content": "Quantum entanglement is a phenomenon where particles become correlated..."
  }
}
```

> 📄 Full OpenAPI spec available at `apps/backend/docs/openapi.yaml` (WIP)

---

## 🧪 Testing

### Backend Tests (Jest + Supertest)
```bash
cd apps/backend

# Run all tests
yarn test

# Run with coverage
yarn test:coverage

# Watch mode for TDD
yarn test:watch

# Run specific test file
yarn test auth.controller.test.ts
```

### Frontend Tests (React Native Testing Library)
```bash
cd apps/mobile-web

# Run unit tests
yarn test

# Run with coverage
yarn test:coverage

# Test specific component
yarn test MessageList.test.tsx
```

### Manual QA Checklist (for QA Tester)
```markdown
## Auth Flow
- [ ] Register with valid credentials → JWT received
- [ ] Login with invalid password → 401 error shown
- [ ] JWT expiration → auto-redirect to login

## BYOK Settings
- [ ] Save valid OpenAI key → "Test Connection" succeeds
- [ ] Save invalid key → "Test Connection" shows error
- [ ] API key never visible in UI/network tab

## Chat Experience
- [ ] Create new thread → appears in sidebar
- [ ] Send message → AI response received < 10s
- [ ] Switch threads → correct history loads
- [ ] Delete thread → removed from list (soft delete)

## Responsive Web
- [ ] <600px: sidebar hidden, hamburger menu works
- [ ] ≥768px: sidebar visible, chat area expands
- [ ] ≥1024px: centered layout, max-width applied

## Error Handling
- [ ] Network offline → user-friendly toast
- [ ] AI provider timeout → "Request failed, try again"
- [ ] Invalid JWT → redirect to login
```

### Running E2E Tests (Optional)
```bash
# Mobile: Detox (requires iOS/Android build)
cd apps/mobile-web
yarn build:e2e
yarn test:e2e:ios

# Web: Playwright
cd apps/mobile-web
yarn test:e2e:web
```

---

## 🔄 CI/CD (GitHub Actions)

### Workflows
| Workflow | Trigger | Jobs |
|----------|---------|------|
| `lint-test.yml` | `pull_request`, `push` to `main` | ESLint, TypeScript check, Jest tests (backend + frontend) |
| `build.yml` | `push` to `main` | Expo EAS build (mobile), Vercel deploy (web) |

### Setup GitHub Secrets
Go to **Repo Settings → Secrets and variables → Actions** and add:
```
# Backend
MONGODB_URI          # Production MongoDB connection string
JWT_SECRET           # Production JWT secret
ENCRYPTION_KEY       # 32-byte hex key for AES encryption

# Frontend (Expo EAS)
EXPO_TOKEN           # Expo access token (https://expo.dev/settings/access-tokens)
EXPO_PROJECT_ID      # From eas.json or expo.dev dashboard

# Optional
SENTRY_DSN           # For error monitoring (free tier)
```

### Local CI Simulation
```bash
# Run same checks as GitHub Actions
yarn lint
yarn typecheck
yarn test
```

---

## 🔐 Security

### Key Practices Implemented
✅ **JWT Security**
- Tokens signed with HS256 + strong secret
- 7-day expiry (configurable)
- Validated on every protected route via middleware

✅ **BYOK Encryption**
- API keys encrypted with AES-256-GCM before MongoDB storage
- Decryption happens **only** in backend during AI proxy call
- Keys never logged, never sent to frontend after save

✅ **Input Validation**
- Zod schemas on all API endpoints (backend)
- React Hook Form + Zod on frontend forms
- Sanitization of user-generated content (chat messages)

✅ **Rate Limiting**
- Express `express-rate-limit`: 100 requests/15min per IP
- Prevents abuse of free-tier resources

✅ **CORS Policy**
- Strict origin whitelist via `CORS_ORIGINS` env var
- Preflight requests handled securely

### Security Checklist for Releases
- [ ] Run `npm audit` / `yarn audit` — fix high/critical issues
- [ ] Verify `ENCRYPTION_KEY` is 64-char hex (32 bytes)
- [ ] Confirm MongoDB Atlas network access restricted
- [ ] Test JWT expiration + refresh flow
- [ ] Scan for accidental key leaks: `git log -p | grep -i "sk-"`

### Reporting Vulnerabilities
Found a security issue? Please email `security@yourorg.com` (replace with actual) — **do not** open a public GitHub issue.

---

## 🤝 Contributing

### Team Workflow
```mermaid
graph LR
    A[Feature Branch] --> B[PR with Tests]
    B --> C[Code Review + QA]
    C --> D[GitHub Actions Pass]
    D --> E[Merge to main]
    E --> F[Auto-deploy to staging]
```

### Branch Strategy
- `main`: Production-ready code (protected)
- `develop`: Integration branch (optional for MVP)
- `feature/*`: New features (e.g., `feature/chat-delete`)
- `fix/*`: Bug fixes (e.g., `fix/jwt-expiry`)
- `chore/*`: DevOps, config, docs

### Pull Request Template
```markdown
## 🎯 What does this PR do?
<!-- Brief description -->

## ✅ Checklist
- [ ] Code follows project style guide
- [ ] Tests added/updated (if applicable)
- [ ] QA tested on iOS/Android/Web
- [ ] Environment variables documented
- [ ] No sensitive data in commits

## 🧪 How to test?
1. Step one...
2. Step two...

## 📸 Screenshots (if UI change)
<!-- Attach images -->
```

### Code Style
- **TypeScript**: Strict mode enabled, no `any`
- **ESLint**: Airbnb + React Native config
- **Prettier**: Auto-format on save
- **Commit Messages**: Conventional Commits
  ```
  feat(chat): add thread delete confirmation
  fix(auth): handle bcrypt salt rounding edge case
  docs: update API reference in README
  ```

### First-Time Contributors
1. Fork the repo
2. Create your feature branch: `git checkout -b feature/your-name`
3. Commit changes: `git commit -m 'feat: your change'`
4. Push to branch: `git push origin feature/your-name`
5. Open a Pull Request → Tag `@tech-lead` for review

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

```
MIT License

Copyright (c) 2026 Your Organization

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

> 💡 **Pro Tips for the Team**  
> - **Backend Dev**: Use `nodemon` for hot reload; test AI proxy with Postman first  
> - **RN Devs**: Use Expo Go for quick mobile testing; `expo start --web` for web  
> - **QA**: Keep Postman collection updated; test edge cases (empty messages, long text)  
> - **All**: Run `yarn lint` before committing; small PRs = faster reviews  

🚀 **MVP Target Launch**: June 8, 2026  
🔗 **Staging URL**: *TBD after first successful GitHub Actions deploy*  

*Last updated: May 11, 2026*  
*Document owner: Senior Software Architect*