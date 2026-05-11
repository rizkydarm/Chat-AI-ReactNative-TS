# 📱 AI Chat App MVP - Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** May 11, 2026  
**Author:** Senior Software Architect  
**Stakeholders:** Product Owner, Engineering Team (2 RN Devs, 1 Backend Dev, 1 QA)  
**Status:** ✅ Approved for MVP Development

---

## 🎯 1. Product Overview

### 1.1 Vision
A lightweight, cross-platform AI chat application that enables users to connect their **Bring Your Own Key (BYOK)** AI provider credentials and interact with multiple LLMs through a unified, secure interface — with zero infrastructure management.

### 1.2 MVP Scope Statement
> *"A text-only chat app where users register with username/password, store their AI provider API key + endpoint URL securely, create/manage multiple chat threads, and exchange messages via REST API — all built with free-tier resources and deployable via GitHub Actions."*

### 1.3 Key Constraints (Confirmed)
| Constraint | Implementation Decision |
|------------|------------------------|
| **Platforms** | Mobile (iOS/Android via Expo) + Web (Expo Web with responsive breakpoints) |
| **Frontend** | React Native + Expo + React Native Paper (design system) |
| **Backend** | Express.js + MongoDB (free tier: MongoDB Atlas M0) |
| **Auth** | JWT only (username + password, no email verification) |
| **AI Integration** | Vercel AI SDK (`ai` package) for provider abstraction [[3]][[18]] |
| **Request Flow** | Frontend → Express Backend → AI Provider (user's BYOK key + URL) |
| **Data Storage** | User profiles, encrypted API keys, chat threads/messages |
| **Communication** | REST API only (no WebSockets, no streaming) |
| **Content Type** | Text-only chat (no image/voice/file input) |
| **Offline** | No offline support |
| **Admin** | No admin dashboard |
| **Infra** | No managed infra; GitHub Actions for CI/CD only |
| **Cost** | 100% free-tier resources only |

---

## 📊 2. Goals & Success Metrics (MVP)

### 2.1 Business Goals
- ✅ Validate user demand for BYOK AI chat experience
- ✅ Demonstrate technical feasibility of multi-provider abstraction using AI SDK
- ✅ Achieve < 2s average API response time (backend proxy to AI provider)
- ✅ Zero critical security vulnerabilities in JWT/BYOK handling

### 2.2 User Success Metrics
| Metric | Target (MVP) | Measurement |
|--------|-------------|-------------|
| User Registration Completion | ≥ 85% | Analytics event tracking |
| First Message Sent | ≥ 70% of registered users | Backend logging |
| Chat Thread Creation | ≥ 2 threads/user avg | MongoDB aggregation |
| API Key Save Success | ≥ 95% | Error rate monitoring |
| App Crash Rate | < 1% sessions | Expo/Crashlytics (free tier) |

### 2.3 Technical Success Metrics
- ✅ 100% REST API contract coverage (OpenAPI spec)
- ✅ All user API keys encrypted at rest (AES-256)
- ✅ JWT tokens validated on every protected route
- ✅ CI/CD pipeline: lint → test → build on every PR (GitHub Actions)

---

## 👥 3. User Personas & Stories

### 3.1 Primary Persona: "Alex, the AI Explorer"
> *Tech-savvy user with accounts on multiple AI platforms (OpenAI, Anthropic, open-source endpoints). Wants one app to switch between providers without re-entering credentials. Values privacy and control over their keys.*

### 3.2 User Stories (MVP Priority)

#### 🔐 Authentication
```gherkin
As a new user
When I enter username + password on signup
Then I receive a JWT token
And I can access the chat interface
```

```gherkin
As a returning user
When I login with valid credentials
Then I receive a fresh JWT
And my chat history loads
```

#### 🔑 BYOK Management
```gherkin
As an authenticated user
When I navigate to Settings > AI Provider
And I enter my API key + provider URL + model name
Then the key is encrypted and stored securely
And I see a "Test Connection" button that validates the endpoint
```

#### 💬 Chat Experience
```gherkin
As an authenticated user with configured AI provider
When I start a new chat thread
Then I see a sidebar with thread list + "New Chat" button
And I can send a text message
And I receive the AI response within 5 seconds (avg)
```

```gherkin
As a user with multiple chat threads
When I click a thread in the sidebar
Then the chat history loads
And I can continue the conversation
```

```gherkin
As a user
When I long-press a chat thread
Then I see options: Rename, Delete
And deleting removes all messages permanently
```

#### 🌐 Responsive Web
```gherkin
As a web user
When I resize my browser window
Then the layout adapts:
  - <768px: sidebar collapses to hamburger menu
  - ≥768px: sidebar visible, chat area expands
  - ≥1024px: max-width container with centered layout
```

---

## ⚙️ 4. Functional Requirements

### 4.1 Authentication Module
| ID | Requirement | Priority |
|----|-------------|----------|
| AUTH-01 | POST `/api/auth/register` - username (3-20 chars), password (min 8 chars) | Must |
| AUTH-02 | POST `/api/auth/login` - returns `{ token: string, user: { id, username } }` | Must |
| AUTH-03 | JWT payload: `{ sub: userId, iat, exp: +7d }` | Must |
| AUTH-04 | Middleware: `authenticateJWT` validates token on protected routes | Must |
| AUTH-05 | Passwords hashed with bcrypt (salt rounds: 12) | Must |

### 4.2 User & Provider Settings
| ID | Requirement | Priority |
|----|-------------|----------|
| USER-01 | GET `/api/user/settings` - returns provider config (key masked) | Must |
| USER-02 | PUT `/api/user/settings` - accepts `{ providerUrl, apiKey, modelName }` | Must |
| USER-03 | API key encrypted before MongoDB storage (AES-256-GCM) | Must |
| USER-04 | POST `/api/user/settings/test` - validates provider connectivity (returns 200/4xx) | Should |

### 4.3 Chat Threads & Messages
| ID | Requirement | Priority |
|----|-------------|----------|
| CHAT-01 | GET `/api/threads` - list user's threads (id, title, lastMessage, updatedAt) | Must |
| CHAT-02 | POST `/api/threads` - create new thread with optional title | Must |
| CHAT-03 | GET `/api/threads/:id` - fetch thread messages (chronological) | Must |
| CHAT-04 | POST `/api/threads/:id/messages` - send user message, trigger AI response | Must |
| CHAT-05 | AI response flow: backend uses AI SDK `generateText()` with user's BYOK config [[3]][[18]] | Must |
| CHAT-06 | DELETE `/api/threads/:id` - soft delete (flag `deleted: true`) | Should |
| CHAT-07 | PUT `/api/threads/:id` - update title | Could |

### 4.4 AI Integration (Backend Proxy)
```typescript
// Backend logic using AI SDK Core [[3]][[18]]
import { generateText, createProviderRegistry } from 'ai';

// Dynamic provider setup per user request
async function callUserAIProvider({ 
  providerUrl, 
  apiKey, 
  modelName, 
  messages 
}: AIRequest) {
  // Create custom provider using AI SDK's customProvider API [[19]]
  const registry = createProviderRegistry({
    custom: customProvider({
      baseURL: providerUrl,
      headers: { Authorization: `Bearer ${apiKey}` },
      // Map to AI SDK's language model spec
    })
  });
  
  const result = await generateText({
    model: registry.languageModel(`custom/${modelName}`),
    messages, // Format: [{ role: 'user' | 'assistant', content: string }]
    // No streaming per requirements
  });
  
  return result.text;
}
```

> ✅ **Why proxy through backend?**  
> - Prevents exposing user API keys to frontend/CORS issues  
> - Enables key encryption at rest  
> - Allows future rate limiting, logging, error normalization  
> - AI SDK supports custom providers via `customProvider()` [[19]][[25]]

---

## 🛡️ 5. Non-Functional Requirements

### 5.1 Security
| Requirement | Implementation |
|-------------|---------------|
| **JWT Security** | Short expiry (7d), HTTPS-only cookies not used (mobile-first), token in `Authorization: Bearer` header |
| **BYOK Encryption** | API keys encrypted with AES-256-GCM; key derived from env `ENCRYPTION_KEY` (GitHub Secrets) |
| **Input Validation** | Zod schemas on all API endpoints (backend) + React Hook Form (frontend) |
| **Rate Limiting** | Express `express-rate-limit`: 100 req/15min per IP (free tier friendly) |
| **CORS** | Strict origin whitelist (Expo dev domains + production web domain) |

### 5.2 Performance
| Metric | Target | Strategy |
|--------|--------|----------|
| API Response (non-AI) | < 300ms p95 | MongoDB indexing, lean queries |
| AI Response Time | < 8s p95 | Backend timeout: 10s; user feedback: "Thinking..." state |
| App Launch (Mobile) | < 2s cold start | Expo prebuild, minimal initial bundle |
| Web LCP | < 2.5s | React.lazy for chat components, image optimization (none needed) |

### 5.3 Reliability & Maintainability
- ✅ All backend services stateless (scale-ready)
- ✅ MongoDB Atlas M0 free tier (512MB storage, sufficient for MVP text data)
- ✅ GitHub Actions: lint (ESLint), typecheck (TypeScript), test (Jest), build (Expo EAS free tier)
- ✅ Error logging: console + optional Sentry free tier (opt-in)

### 5.4 Accessibility & UX
- ✅ React Native Paper components (built-in a11y props)
- ✅ Color contrast ≥ 4.5:1 (Paper default theme compliant)
- ✅ Screen reader labels on interactive elements
- ✅ Responsive breakpoints: `xs (<600px)`, `sm (600-960px)`, `md (960-1280px)`, `lg (≥1280px)`

---

## 🏗️ 6. Technical Architecture

### 6.1 High-Level Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend       │     │   External      │
│   (Expo RN)     │────▶│   (Express)     │────▶│   AI Providers  │
│                 │     │                 │     │                 │
│ • React Native  │     │ • JWT Auth      │     │ • OpenAI        │
│ • React Native  │     │ • MongoDB ODM   │     │ • Anthropic     │
│   Paper         │     │ • AI SDK Proxy  │     │ • Custom URLs   │
│ • Axios         │     │ • Encryption    │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                       ▲
         │                       │
┌─────────────────┐     ┌─────────────────┐
│   GitHub Actions│     │   MongoDB Atlas │
│   (CI/CD)       │     │   (M0 Free)     │
│ • Lint/Test/Build│    │ • User Data     │
└─────────────────┘     └─────────────────┘
```

### 6.2 Tech Stack Matrix
| Layer | Technology | Rationale | Free Tier Compatible |
|-------|-----------|-----------|---------------------|
| **Mobile/Web** | React Native + Expo SDK 50 | Single codebase, web support, hot reload | ✅ Expo Go (dev), EAS Build free tier |
| **UI Library** | React Native Paper | Material Design, responsive, a11y-ready | ✅ MIT License |
| **State Mgmt** | React Context + useReducer | MVP simplicity, no extra deps | ✅ Built-in |
| **HTTP Client** | Axios | Interceptors for JWT, cancel tokens | ✅ MIT |
| **Backend** | Express.js + TypeScript | Lightweight, mature, AI SDK compatible | ✅ MIT |
| **Database** | MongoDB + Mongoose | Flexible schema for chat threads, Atlas free tier | ✅ Atlas M0 |
| **AI Abstraction** | Vercel AI SDK (`ai` package) | Unified interface for 30+ providers [[18]][[25]] | ✅ MIT |
| **Auth** | jsonwebtoken + bcrypt | Industry standard, minimal config | ✅ MIT |
| **Encryption** | Node.js `crypto` (AES-256-GCM) | No extra deps, FIPS-compliant algorithm | ✅ Built-in |
| **Testing** | Jest + Supertest (backend), React Native Testing Library (frontend) | Unified testing framework | ✅ MIT |
| **CI/CD** | GitHub Actions | Native integration, free minutes for OSS | ✅ Free tier |

### 6.3 Data Model (MongoDB)
```typescript
// User
interface User {
  _id: ObjectId;
  username: string; // unique, indexed
  passwordHash: string; // bcrypt
  createdAt: Date;
  updatedAt: Date;
}

// EncryptedProviderConfig (subdocument)
interface ProviderConfig {
  providerUrl: string; // e.g., "https://api.openai.com/v1"
  modelName: string;   // e.g., "gpt-4o-mini"
  apiKeyEncrypted: string; // AES-256-GCM ciphertext
  iv: string;          // initialization vector
  authTag: string;     // authentication tag
  lastTestedAt?: Date;
}

// ChatThread
interface ChatThread {
  _id: ObjectId;
  userId: ObjectId; // indexed, ref: User
  title: string;    // default: "New Chat"
  providerConfig: ProviderConfig; // snapshot at thread creation
  deleted: boolean; // soft delete
  createdAt: Date;
  updatedAt: Date;
}

// Message
interface Message {
  _id: ObjectId;
  threadId: ObjectId; // indexed, ref: ChatThread
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    providerResponseTime?: number;
    error?: string; // if AI call failed
  };
  createdAt: Date;
}
```

> 🔐 **Key Security Note**: `apiKeyEncrypted` is **never** returned to frontend. Decryption happens only in backend during AI proxy call.

---

## 🌐 7. API Contract (REST)

### 7.1 Base Configuration
- Base URL: `/api`
- Content-Type: `application/json`
- Auth: `Authorization: Bearer <JWT>` on protected routes
- Errors: `{ error: { code: string, message: string } }`

### 7.2 Endpoints Summary
| Method | Endpoint | Auth | Description | Request Body | Success Response |
|--------|----------|------|-------------|--------------|-----------------|
| POST | `/auth/register` | ❌ | Create account | `{ username, password }` | `{ token, user }` |
| POST | `/auth/login` | ❌ | Authenticate | `{ username, password }` | `{ token, user }` |
| GET | `/user/settings` | ✅ | Get provider config | - | `{ providerUrl, modelName }` (key masked) |
| PUT | `/user/settings` | ✅ | Save provider config | `{ providerUrl, apiKey, modelName }` | `{ success: true }` |
| POST | `/user/settings/test` | ✅ | Validate provider | `{ providerUrl, apiKey, modelName }` | `{ valid: boolean, error?: string }` |
| GET | `/threads` | ✅ | List chat threads | - | `[{ id, title, lastMessage, updatedAt }]` |
| POST | `/threads` | ✅ | Create thread | `{ title?: string }` | `{ id, title, createdAt }` |
| GET | `/threads/:id` | ✅ | Get thread + messages | - | `{ id, title, messages: [...] }` |
| POST | `/threads/:id/messages` | ✅ | Send message, get AI reply | `{ content: string }` | `{ message: { id, role, content } }` |
| DELETE | `/threads/:id` | ✅ | Soft delete thread | - | `{ success: true }` |
| PUT | `/threads/:id` | ✅ | Update thread title | `{ title: string }` | `{ id, title }` |

### 7.3 Example: Send Message Flow
```http
POST /api/threads/abc123/messages
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "content": "Explain quantum computing simply"
}

→ 200 OK
{
  "message": {
    "id": "msg_789",
    "role": "assistant",
    "content": "Quantum computing uses qubits that can be 0 and 1 simultaneously..."
  }
}
```

> ⚠️ **Backend internally**:  
> 1. Fetch thread → decrypt provider config  
> 2. Format messages for AI SDK `generateText()` [[3]]  
> 3. Call user's provider URL with their API key  
> 4. Save assistant message to DB  
> 5. Return response to frontend  

---

## 🎨 8. UI/UX Guidelines

### 8.1 Design System
- **Library**: React Native Paper v5 [[https://oss.callstack.com/react-native-paper/]]
- **Theme**: Default light/dark mode (auto-detect OS preference)
- **Typography**: Paper's default `titleMedium`, `bodyLarge` for readability
- **Spacing**: 8px baseline grid

### 8.2 Key Screens (MVP)
#### 🔐 Auth Flow
```
[Signup Screen]
- Username input (min 3 chars)
- Password input (min 8 chars, visibility toggle)
- "Create Account" button
- Link to Login

[Login Screen]
- Username + Password
- "Login" button
- Link to Signup
```

#### 💬 Main Chat Interface (Responsive)
```
[Web ≥768px]
┌─────────────────────────────────┐
│ [☰] AI Chat App        [⚙️]    │ ← Header
├─────────────┬───────────────────┤
│ Sidebar     │ Chat Area         │
│ • New Chat  │ • Messages list   │
│ • Thread 1  │ • Input box + send│
│ • Thread 2  │                   │
│ [Settings]  │                   │
└─────────────┴───────────────────┘

[Mobile <768px]
┌─────────────────┐
│ [☰] AI Chat App │ ← Hamburger toggles sidebar drawer
├─────────────────┤
│ Chat Area       │
│ • Messages      │
│ • Input + send  │
└─────────────────┘
```

#### ⚙️ Provider Settings
```
[Settings Screen]
- Provider URL input (placeholder: "https://api.openai.com/v1")
- API Key input (secure, masked)
- Model Name input (placeholder: "gpt-4o-mini")
- [Test Connection] button (shows success/error toast)
- [Save] button (disabled until valid inputs)
```

### 8.3 Responsive Breakpoints (Expo Web)
```typescript
// utils/responsive.ts
export const BREAKPOINTS = {
  xs: 0,    // <600px: mobile, sidebar hidden
  sm: 600,  // 600-960px: tablet, sidebar collapsible
  md: 960,  // 960-1280px: desktop, sidebar visible
  lg: 1280, // ≥1280px: large desktop, max-width container
};

// Usage in components:
const { width } = useWindowDimensions();
const isMobile = width < BREAKPOINTS.sm;
```

---

## 🗓️ 9. Development Plan & Timeline (MVP)

### 9.1 Team Allocation
| Role | Responsibilities | Time Allocation |
|------|-----------------|-----------------|
| **RN Dev 1** | Auth flow, Settings screen, responsive layout, web adaptation | 100% frontend |
| **RN Dev 2** | Chat UI, thread management, message list, error states | 100% API integration |
| **Backend Dev** | Express API, MongoDB models, AI SDK proxy, encryption, JWT | 100% backend + DevOps |
| **QA Tester** | Test cases, manual testing (mobile/web), API validation (Postman), bug reporting | 100% QA across all layers |

### 9.2 Sprint Plan (4 Weeks Total)
```
Week 1: Foundation
✅ Backend: Express setup, MongoDB connection, User model, JWT auth
✅ Frontend: Expo init, React Native Paper setup, navigation structure
✅ CI/CD: GitHub Actions workflow (lint + test on PR)

Week 2: Core Features
✅ Backend: Provider settings encryption, chat thread/message models
✅ Frontend: Auth screens, Settings screen with form validation
✅ Integration: Axios interceptors for JWT, API service layer

Week 3: Chat Experience
✅ Backend: AI proxy endpoint using AI SDK `generateText()` [[3]]
✅ Frontend: Chat UI, message list, input handling, loading states
✅ Responsive: Web breakpoints, sidebar toggle logic

Week 4: Polish & QA
✅ Error handling: Network failures, invalid keys, rate limits
✅ Security audit: JWT validation, encryption verification
✅ QA cycle: Test matrix execution, bug fixes, MVP demo prep
```

### 9.3 Definition of Done (MVP)
- [ ] All user stories implemented + tested
- [ ] 100% API endpoints documented (OpenAPI 3.0 snippet in `/docs`)
- [ ] Zero critical/high security issues (Snyk free scan)
- [ ] App runs on: iOS Simulator, Android Emulator, Chrome (web)
- [ ] GitHub Actions pipeline passes on `main` branch
- [ ] QA sign-off on test report

---

## 🧪 10. QA Strategy

### 10.1 Test Pyramid (MVP Focus)
```
        /🔶 Manual E2E (20%)
       /  - Critical user journeys (register → chat → send)
      /   - Cross-platform validation (iOS/Android/Web)
     /🔶 API Contract Tests (30%)
    /   - Supertest + Jest: validate request/response schemas
   /    - Postman collection for manual exploration
  /🔶 Unit Tests (50%)
 /    - Backend: auth middleware, encryption utils, AI proxy logic
/     - Frontend: form validation, message rendering, responsive hooks
```

### 10.2 Test Coverage Targets (MVP)
| Component | Target | Tool |
|-----------|--------|------|
| Backend Services | ≥ 70% | Jest + Supertest |
| Frontend Utils | ≥ 60% | React Native Testing Library |
| Critical Paths | 100% manual E2E | Detox (mobile) + Playwright (web) free tier |

### 10.3 QA Deliverables
- ✅ Test Plan Document (Google Doc)
- ✅ Postman Collection (exported JSON)
- ✅ Bug Reports (GitHub Issues with labels: `bug`, `priority:high`)
- ✅ MVP Sign-off Checklist

---

## ⚠️ 11. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation Strategy |
|------|--------|------------|---------------------|
| **AI Provider API Changes** | High | Medium | Use AI SDK's abstraction layer [[18]]; log provider errors for future adapter updates |
| **BYOK Key Leakage** | Critical | Low | Encrypt at rest; never log keys; backend-only decryption; security review pre-MVP |
| **MongoDB Free Tier Limits** | Medium | Medium | Monitor storage; archive old messages (MVP: no auto-delete, but document limitation) |
| **Expo Web Compatibility** | Medium | Medium | Test early on Chrome/Firefox; use Paper's web-tested components; fallback for unsupported APIs |
| **Team Bandwidth (4 people)** | High | High | Strict MVP scope; no "nice-to-haves"; daily 15-min syncs; backend dev owns AI SDK integration |
| **JWT Security Misconfiguration** | High | Low | Use established libraries (`jsonwebtoken`, `bcrypt`); no custom crypto; peer review auth code |

---

## 🚫 12. Out of Scope (MVP)
- ❌ Streaming responses (AI SDK `streamText()` not used) [[3]]
- ❌ Image/file upload or vision models
- ❌ Voice input/output
- ❌ Offline message queuing
- ❌ Push notifications
- ❌ User profile customization (avatar, bio)
- ❌ Chat export/share functionality
- ❌ Multi-language support
- ❌ Admin dashboard or user management
- ❌ Rate limiting per user (only per-IP at gateway level)
- ❌ Analytics beyond basic logging

---
