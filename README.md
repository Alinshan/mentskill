<div align="center">

```
██████╗ ███████╗███████╗██╗  ██╗██╗██╗     ██╗
██╔══██╗██╔════╝██╔════╝██║ ██╔╝██║██║     ██║
██████╔╝█████╗  ███████╗█████╔╝ ██║██║     ██║
██╔══██╗██╔══╝  ╚════██║██╔═██╗ ██║██║     ██║
██║  ██║███████╗███████║██║  ██╗██║███████╗███████╗
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝
```

### **AI-Powered Career Advisor Platform**
*Personalized. Intelligent. Human.*

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## ✦ What is ReSkill?

**ReSkill** is an intelligent, full-stack career advisory platform that combines AI agents, real-time voice coaching, 3D visual roadmaps, and live mentor sessions — all personalized to your unique career trajectory.

Whether you're pivoting industries, climbing the ladder, or breaking into tech from scratch — ReSkill gives you the tools, the intel, and the human connection to actually get there.

---

## ✦ Core Features

### 🧠 AI Career Advisor
Powered by agentic AI with web search via **Tavily**, your advisor stays current. It doesn't just know — it *researches*. Get career guidance backed by live market data, trending roles, and real company intel.

### 🗺️ 3D Skill Roadmaps
Visual, interactive 3D roadmaps that map your current skills to your target role. Nodes represent skills, certifications, and milestones — rendered with depth, edges showing dependencies, and progress tracked in real-time.

### 🎙️ Voice Agents
Conversational voice agents for on-demand coaching. Practice salary negotiations, run through career pivots, or get coached through a tough decision — all via natural speech, 24/7.

### 📹 1:1 Mentor Video Calls
Connect with vetted industry mentors for live, scheduled video sessions. Real humans. Real experience. ReSkill handles booking, reminders, and session notes.

### 🎯 Interview Preparation
Role-specific mock interviews powered by AI. Behavioral, technical, and system design rounds — with instant feedback, scoring, and improvement tracking over time.

### 💼 Jobs & Courses
Hyper-personalized job listings and course recommendations pulled from live sources. No generic "you might like" — recommendations are scored against your roadmap gaps and career goals.

### 📚 Personalized Learning Sources
ReSkill surfaces the *right* content — blogs, papers, YouTube channels, communities — tuned to your learning style, current skill level, and target destination.

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Database** | Supabase (Postgres + Auth + Realtime) |
| **Cache / Queue** | Redis (Upstash) |
| **Data Fetching** | TanStack Query v5 |
| **AI SDK** | Vercel AI SDK |
| **AI Agents** | Custom agent loop + MCP servers |
| **Web Search** | Tavily API |
| **Voice** | WebRTC + AI voice pipeline |
| **Deployment** | Vercel |

---

## ✦ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        ReSkill Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Next.js App Router                                        │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │
│   │   Dashboard  │  │  Roadmap 3D │  │  Interview Prep  │   │
│   └──────┬──────┘  └──────┬──────┘  └────────┬────────┘   │
│          │                │                   │             │
│   ┌──────▼──────────────────────────────────▼───────────┐  │
│   │           TanStack Query (Client State)              │  │
│   └──────────────────────┬──────────────────────────────┘  │
│                           │                                 │
│   ┌───────────────────────▼──────────────────────────────┐ │
│   │               Next.js API Routes / RSC               │ │
│   └──┬────────────┬──────────────────┬───────────────────┘ │
│      │            │                  │                      │
│   ┌──▼───┐  ┌─────▼─────┐   ┌───────▼───────┐             │
│   │ Auth │  │ AI Agents │   │  MCP Servers  │             │
│   │      │  │  + Tavily │   │  (Tools/APIs) │             │
│   └──┬───┘  └─────┬─────┘   └───────┬───────┘             │
│      │            │                  │                      │
│   ┌──▼────────────▼──────────────────▼───────────────────┐ │
│   │          Supabase (Postgres + Realtime + Storage)     │ │
│   └───────────────────────────────────────────────────────┘ │
│                                                             │
│   ┌───────────────────────────────────────────────────────┐ │
│   │              Redis (Cache + Job Queues)               │ │
│   └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## ✦ Project Structure

```
reskill/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── onboarding/          # Career goal intake flow
│   ├── (dashboard)/
│   │   ├── advisor/             # AI chat + voice agent
│   │   ├── roadmap/             # 3D skill roadmap viewer
│   │   ├── interview/           # Mock interview sessions
│   │   ├── mentor/              # 1:1 video call booking
│   │   ├── jobs/                # Personalized job board
│   │   └── courses/             # Course recommendations
│   └── api/
│       ├── agents/
│       │   ├── career/route.ts  # Career advisor agent
│       │   ├── interview/route.ts
│       │   └── voice/route.ts   # Voice agent stream
│       ├── roadmap/route.ts
│       ├── search/route.ts      # Tavily-backed search
│       └── mcp/route.ts         # MCP tool execution
│
├── lib/
│   ├── agents/
│   │   ├── career-agent.ts      # Core advisor agent loop
│   │   ├── tools.ts             # Agent tool definitions
│   │   └── mcp-client.ts        # MCP server connections
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts             # Generated DB types
│   ├── redis/
│   │   ├── client.ts
│   │   └── cache.ts             # Cache helpers
│   └── tavily.ts                # Search client
│
├── queries/                     # TanStack Query hooks
│   ├── use-roadmap.ts
│   ├── use-jobs.ts
│   ├── use-courses.ts
│   └── use-mentor-sessions.ts
│
└── components/
    ├── roadmap/
    │   └── RoadmapCanvas.tsx    # Three.js / R3F 3D graph
    ├── advisor/
    │   ├── ChatInterface.tsx
    │   └── VoiceAgent.tsx
    └── interview/
        └── MockInterview.tsx
```

---

## ✦ Agent Architecture

ReSkill's AI advisor is built as a **multi-step agent loop** using the Vercel AI SDK with custom MCP tool bindings.

```typescript
// lib/agents/career-agent.ts
import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { tavily } from '@tavily/core'
import { z } from 'zod'

export const careerAdvisorAgent = async (messages: CoreMessage[]) => {
  return streamText({
    model: openai('gpt-4o'),
    system: CAREER_ADVISOR_SYSTEM_PROMPT,
    messages,
    tools: {
      searchJobMarket: tool({
        description: 'Search for current job market data, salary ranges, and role demand',
        parameters: z.object({ query: z.string(), role: z.string() }),
        execute: async ({ query }) => tavily.search(query, { searchDepth: 'advanced' }),
      }),
      getRoadmapGaps: tool({
        description: 'Analyze skill gaps between current profile and target role',
        parameters: z.object({ currentSkills: z.array(z.string()), targetRole: z.string() }),
        execute: async (params) => analyzeSkillGaps(params),
      }),
      suggestCourses: tool({
        description: 'Fetch personalized course recommendations based on skill gaps',
        parameters: z.object({ gaps: z.array(z.string()), learningStyle: z.string() }),
        execute: async (params) => fetchCourseRecommendations(params),
      }),
    },
    maxSteps: 5,
  })
}
```

---

## ✦ MCP Integration

ReSkill uses **Model Context Protocol** to connect agents to external services as tools — keeping the agent loop clean and extensible.

```typescript
// MCP servers connected:
// - GitHub (portfolio analysis)
// - LinkedIn (profile enrichment)
// - Calendar (mentor scheduling)
// - Notion (learning notes sync)
```

---

## ✦ Getting Started

### Prerequisites

- Node.js 20+
- Supabase project
- Upstash Redis instance
- Tavily API key
- OpenAI API key (or preferred LLM provider)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/reskill.git
cd reskill

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# AI
OPENAI_API_KEY=your_openai_key

# Tavily
TAVILY_API_KEY=your_tavily_key
```

### Database Setup

```bash
# Push schema to Supabase
pnpm supabase db push

# Generate TypeScript types
pnpm supabase gen types typescript --project-id your_project_id > lib/supabase/types.ts
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✦ Key Data Models

```sql
-- Core user profile
users (id, email, current_role, target_role, skills[], experience_years, learning_style)

-- Roadmap nodes and edges
roadmap_nodes (id, user_id, skill_name, status, position_3d, category)
roadmap_edges (id, source_node, target_node, dependency_type)

-- Mentor sessions
mentor_sessions (id, user_id, mentor_id, scheduled_at, status, notes, recording_url)

-- Interview history
interview_sessions (id, user_id, role, type, score, feedback_json, created_at)

-- Agent conversation history
advisor_conversations (id, user_id, messages_json, created_at)
```

---

## ✦ Roadmap

- [x] AI Career Advisor with Tavily search
- [x] 3D Roadmap visualization
- [x] Voice agent integration
- [x] 1:1 Mentor video calls
- [x] Interview prep module
- [x] Jobs & course recommendations
- [ ] Mobile app (React Native)
- [ ] Browser extension for passive tracking
- [ ] Team/company tier for upskilling programs
- [ ] Peer accountability groups
- [ ] Portfolio AI analyzer (GitHub + projects)

---

## ✦ Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## ✦ License

MIT © ReSkill

---

<div align="center">

**Built for career changers. By people who've been there.**

*ReSkill — Don't just find a job. Build a career.*

</div>
