# CLAUDE.md — Personal Operating System (POS)

> **Single source of truth for the project.**
> Every AI assistant, every developer, every session must follow this document.

---

## Project Overview

**Personal Operating System (POS)** is a production-grade SaaS application that helps optimize every important area of life through a single platform — health, study, career, finance, productivity, and personal growth.

This is not a tutorial project. It is a flagship portfolio project built following real software engineering practices used by modern product companies.

**Developer's primary goals:**
- Reach 12 LPA+ salary
- Become a stronger MERN / Full Stack developer
- Build a real, production-ready SaaS
- Learn software engineering practices, not just coding
- Build a Test Series product as a side project

This codebase must be something the developer can confidently discuss in interviews at senior level.

---

## Product Features — Version 1

| Module | Description |
|--------|-------------|
| Authentication | Sign up, login, session management |
| Dashboard | Overview of all life areas |
| Daily Planner | Plan and track tasks for each day |
| Weekly / Monthly Planner | Higher-level planning views |
| Meal Planner | Daily meal tracking and planning |
| Workout Tracker | Exercise logs and progress |
| Weight Tracker | Weight gain/loss journey |
| Hair Recovery Tracker | Hair health and treatment tracking |
| Smoking Tracker | Reduction and cessation tracking |
| Sleep Tracker | Sleep quality and duration logs |
| Study Tracker | General study hours and topics |
| DSA Tracker | Data Structures & Algorithms problem progress |
| System Design Tracker | System design learning progress |
| Job Switch Tracker | Job search status and interview pipeline |
| Finance Tracker | Income, expenses, and savings |
| Test Series Project Tracker | Progress on building the Test Series SaaS |
| Reports | Analytics and insights across all modules |
| Settings | Account, preferences, notifications |

**Future modules (post v1):**
- Goals & Habits
- Water Intake
- Resume Versions
- Interview Preparation
- Reading Tracker
- Notes
- Reading List

---

## Technology Stack

### Frontend
| Package | Version / Notes |
|---------|-----------------|
| Next.js | App Router (latest) |
| React | Latest |
| TypeScript | Strict mode, v5+ |
| Tailwind CSS | v4 |
| shadcn/ui | Component library |
| Radix UI | Primitive components (via shadcn) |
| Framer Motion | Animations |
| Lucide React | Icons |
| React Icons | Additional icons |
| React Hook Form | Form management |
| Zod | Validation schemas |
| TanStack Query | Server state management |
| Zustand | Global UI state only |
| next-themes | Theme system |
| sonner | Toast notifications |
| clsx + tailwind-merge | Class utilities |
| class-variance-authority | Component variants |
| date-fns | Date utilities |

### Backend
| Package | Notes |
|---------|-------|
| Next.js Route Handlers | API layer |
| Prisma ORM | Database ORM |
| MongoDB | Primary database (via MongoDB Atlas or local) |

### Dev Tools
| Package | Notes |
|---------|-------|
| prettier | Code formatting |
| prettier-plugin-tailwindcss | Tailwind class sorting |
| husky | Git hooks |
| lint-staged | Pre-commit linting |
| tsx | TypeScript execution |

### Future Stack
- Auth.js (authentication)
- Redis (caching, rate limiting)
- Background Jobs (cron, queue)
- AI Integration (Claude API)
- Email Service (Resend)
- File Upload (Cloudflare R2 or S3)
- Charts (Recharts or Victory)
- Push Notifications

---

## Installed Packages (Confirmed)

Run these commands to install everything from scratch:

```bash
# Core dependencies
npm install next-themes @tanstack/react-query @tanstack/react-query-devtools sonner zod react-hook-form @hookform/resolvers class-variance-authority clsx tailwind-merge lucide-react framer-motion date-fns zustand react-icons

# Dev dependencies
npm install -D prettier prettier-plugin-tailwindcss husky lint-staged tsx

# Database
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init
```

**Verified versions (from initial setup):**
- prisma: `7.8.0`
- @prisma/client: `7.8.0`
- @tanstack/react-query: `5.101.2`
- next-themes: `0.4.6`
- Node.js: `v22.20.0`
- TypeScript: `5.9.3`

---

## Project Folder Structure

```
personal-operating-system/
│
├── .github/                    # GitHub Actions workflows
├── docker/                     # Docker configuration files
├── docs/                       # Project documentation
├── prisma/                     # Prisma schema and seed scripts
│   ├── schema.prisma
│   ├── prisma.config.ts
│   └── seed.ts
├── public/                     # Static assets
├── scripts/                    # Utility scripts (seed, etc.)
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── config/                 # App-level configuration
│   ├── core/                   # Infrastructure layer
│   │   ├── auth/               # Auth helpers and session
│   │   ├── database/           # Prisma client singleton
│   │   ├── env/                # Environment validation
│   │   ├── errors/             # Custom error classes
│   │   ├── logger/             # Logging system
│   │   ├── theme/              # Theme tokens and config
│   │   └── validation/         # Shared validation helpers
│   ├── features/               # Business feature modules
│   ├── middleware/             # Next.js middleware
│   ├── providers/              # React context providers
│   ├── shared/                 # Shared reusable code
│   │   ├── components/         # Reusable non-UI components
│   │   ├── constants/          # App-wide constants
│   │   ├── hooks/              # Reusable custom hooks
│   │   ├── icons/              # Icon wrappers
│   │   ├── lib/                # Utility libraries
│   │   ├── types/              # Shared TypeScript types
│   │   ├── ui/                 # Glass design system primitives
│   │   └── utils/              # Utility functions
│   ├── store/                  # Zustand global stores
│   └── styles/                 # Global CSS
│
├── tests/                      # Test files
│
├── .env                        # Environment variables (gitignored)
├── .env.example                # Example env file (committed)
├── docker-compose.yml          # Local development services (MongoDB)
├── CLAUDE.md                   # This file
├── README.md
└── package.json
```

**Rule:** Do not create all feature folders at once. Create each feature folder only when building that module.

---

## Feature Folder Structure

Every feature in `src/features/` must follow this structure exactly:

```
features/
└── [feature-name]/
    ├── api/            # Route handler logic for this feature
    ├── components/     # Feature-specific React components
    ├── constants/      # Feature-specific constants
    ├── hooks/          # Feature-specific custom hooks
    ├── schemas/        # Zod validation schemas
    ├── services/       # Business logic and data access
    ├── store/          # Feature-specific Zustand store (if needed)
    ├── types/          # Feature-specific TypeScript types
    └── utils/          # Feature-specific utilities
```

**Rules:**
- Never skip folders. Empty folders are acceptable.
- Never put business logic in shared/.
- Never put reusable code in features/.

---

## Folder Responsibilities

| Folder | Responsibility |
|--------|---------------|
| `core/` | Infrastructure: DB client, auth, env, logger, errors, theme |
| `shared/` | Reusable code with zero business logic |
| `features/` | Business logic and feature-specific code only |
| `providers/` | React context and provider wrappers |
| `store/` | Global Zustand stores |
| `app/` | Next.js routing layer only — no business logic |
| `config/` | Configuration objects and constants |

---

## Architecture: Feature-Driven

The project uses **Feature-Driven Architecture**.

```
src/
├── app/         ← Routing only
├── core/        ← Infrastructure only
├── features/    ← Business logic only
├── shared/      ← Reusable utilities only
└── providers/   ← React providers only
```

**Rules:**
- Every business feature is isolated in its own feature module.
- Shared logic must never contain business-specific code.
- Core is for infrastructure only.
- App directory is for routing only — no logic lives here.

---

## API Data Flow

```
UI Component
    ↓
TanStack Query (useQuery / useMutation)
    ↓
Next.js Route Handler (app/api/...)
    ↓
Feature Service (features/[name]/services/)
    ↓
Prisma ORM (core/database/)
    ↓
MongoDB
```

**Rule:** Business logic must never live inside React components or Route Handlers directly. It belongs in services.

---

## Design Philosophy

The UI should feel like Apple's latest operating systems.

**Primary inspirations:**
- visionOS
- iOS 26
- macOS Tahoe
- Apple Wallet
- Apple Health
- Apple Fitness
- Apple Settings
- Apple Music

Every page should feel **premium, calm, spacious, and elegant**.

**Avoid:**
- Clutter
- Flat design
- Material Design appearance
- Bootstrap styling
- Loud colors
- Excessive decorations

---

## Theme System

The application supports **three appearance modes only:**
- Light
- Dark
- System (follows OS preference)

**There is NO separate "Glass Theme."**

The entire design system is based on **Apple-inspired glassmorphism** that adapts to both Light and Dark modes.

### Light Theme Glass
- Bright frosted glass surfaces
- White translucent backgrounds
- Soft gray borders
- Gentle shadows
- High brightness blur

### Dark Theme Glass
- Dark translucent glass
- Soft black overlays
- Low-opacity white borders
- Deeper shadows
- Higher backdrop blur

The user never switches to a separate Glass mode. Glass is the **default and only visual language** of the application.

---

## Glass Design System (Mandatory)

Glassmorphism is a core design principle, not an option.

**Every page and every reusable component must follow Apple's glass material language.**

### Required characteristics for all components:
- Backdrop blur (`backdrop-blur-*`)
- Semi-transparent surfaces (`bg-white/10`, `bg-black/20`, etc.)
- Layered depth
- Rounded corners (`rounded-2xl`, `rounded-3xl`)
- Thin translucent borders (`border-white/20`, `border-white/10`)
- Soft shadows (`shadow-lg`, `shadow-black/10`)
- Floating card appearance
- Smooth gradients
- Elegant spacing

**Components that must use glass design:**

| Component | Notes |
|-----------|-------|
| Sidebar | Frosted sidebar panel |
| Navbar | Floating top navigation |
| Dashboard Cards | Glass stat cards |
| Dialogs | Glass modal overlays |
| Drawers | Side panel drawers |
| Dropdowns | Frosted dropdown menus |
| Inputs | Glass input fields |
| Buttons | Glass button variants |
| Charts | Glass chart containers |
| Tables | Glass table backgrounds |
| Popovers | Glass popover panels |
| Tooltips | Glass tooltip bubbles |
| Notifications | Frosted toast messages |

---

## Glass Primitive Components (Design System)

The project uses a custom glass design system built from these primitives located in `src/shared/ui/`:

| Component | File | Description |
|-----------|------|-------------|
| `GlassCard` | `glass-card.tsx` | Base floating card |
| `GlassButton` | `glass-button.tsx` | Button with glass styles |
| `GlassInput` | `glass-input.tsx` | Glass-styled input |
| `GlassSidebar` | `glass-sidebar.tsx` | Frosted sidebar |
| `GlassNavbar` | `glass-navbar.tsx` | Floating navbar |
| `GlassDialog` | `glass-dialog.tsx` | Glass modal dialog |
| `GlassModal` | `glass-modal.tsx` | Full glass modal |
| `GlassTable` | `glass-table.tsx` | Table with glass container |
| `GlassBadge` | `glass-badge.tsx` | Status badge |

Every screen is built from these primitives. Do not style pages independently.

---

## Theme-Aware Components

Every reusable component must automatically adapt to Light and Dark themes **without requiring duplicate implementations**.

**Example:** `<Button />` should render:
- Light mode → Light glass button with frosted appearance
- Dark mode → Dark glass button with deep translucent appearance

This applies to all components. The design system handles all visual differences through theme-aware Tailwind classes.

**Never create separate light/dark component versions.**

---

## Design Consistency Rules

Every page must look like it belongs to the same operating system. The following must remain consistent throughout the entire application:

| Property | Rule |
|----------|------|
| Spacing | Use Tailwind spacing scale consistently |
| Colors | Only use design system color tokens |
| Blur | Consistent backdrop-blur values per component type |
| Border Radius | `rounded-2xl` for cards, `rounded-xl` for inputs/buttons |
| Shadows | Consistent shadow classes per elevation level |
| Typography | Consistent font sizes and weights |
| Animations | Consistent Framer Motion easing and duration |
| Borders | Consistent border opacity and color tokens |

**Consistency is more important than creativity.**

---

## Animation Guidelines

Animations must feel like Apple products — smooth, purposeful, and subtle.

### Use:
- Framer Motion for all animations
- Smooth easing (`ease-out`, `easeInOut`)
- Soft transitions (opacity, scale, blur)
- Micro-interactions on hover and click
- Fade transitions between routes
- Scale transitions for modals and dialogs
- Blur fade for glass overlays

### Avoid:
- Bouncy spring effects
- Excessive or distracting motion
- Flashy entrance animations
- Long animation durations (keep under 400ms for interactions)

---

## Providers Architecture

### `src/providers/Providers.tsx`
```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### `src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";

export const metadata: Metadata = {
  title: "Personal Operating System",
  description: "Life management system for productivity, health, and growth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Utility Setup

### `src/shared/utils/cn.ts`
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### `src/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  height: 100%;
}

body {
  @apply bg-background text-foreground;
}
```

---

## State Management Rules

| Type of State | Solution |
|--------------|----------|
| Server data (API responses) | TanStack Query |
| Local component state | React useState / useReducer |
| Global UI state | Zustand |
| Form state | React Hook Form |

**Rules:**
- Never put server data into Zustand.
- Never use Zustand unless React state is genuinely insufficient.
- TanStack Query is the primary state layer for anything from the server.

---

## Forms

All forms must use:
```
React Hook Form + Zod
```

- Validation logic belongs in `schemas/` files using Zod.
- Never validate inside components directly.
- Use `@hookform/resolvers/zod` to connect form to schema.

---

## TypeScript Rules

- **Strict mode always on.**
- Never use `any`.
- Always define `interface` or `type` for all data structures.
- Use generics for reusable types.
- Use utility types (`Partial`, `Pick`, `Omit`, `Record`, etc.) where appropriate.
- Use discriminated unions for complex state modeling.
- Every function must have explicit return types.

---

## React Rules

- **Prefer Server Components** by default.
- Use `"use client"` only when the component needs:
  - Browser APIs
  - Event listeners
  - React state or effects
  - TanStack Query hooks
- Lazy load expensive components with `React.lazy` and `Suspense`.
- Avoid unnecessary re-renders.
- Never put business logic inside components.

---

## Next.js Rules

- Use **App Router** (not Pages Router).
- All routes live in `src/app/`.
- API endpoints live in `src/app/api/`.
- Route handlers call services, not Prisma directly.
- Never import PrismaClient inside a component — only inside server-side services.
- Use `loading.tsx`, `error.tsx`, `not-found.tsx` per route segment.
- Use `generateMetadata` for SEO on each page.

---

## Styling Rules

- **Tailwind CSS only.**
- No CSS Modules.
- No Styled Components.
- No Emotion.
- No inline styles.
- Global CSS variables defined in `src/styles/globals.css`.
- Use `cn()` utility for conditional class merging.
- Use `class-variance-authority` (cva) for component variants.

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `GlassCard.tsx` |
| Hooks | camelCase with `use` prefix | `useWeightTracker.ts` |
| Functions | camelCase | `calculateBMI()` |
| Constants | UPPER_SNAKE_CASE | `MAX_WEIGHT_ENTRIES` |
| Folders | kebab-case | `weight-tracker/` |
| Files (non-component) | kebab-case | `weight-service.ts` |
| Types/Interfaces | PascalCase | `WeightEntry`, `IUserProfile` |
| Zod Schemas | camelCase with `Schema` suffix | `createWeightEntrySchema` |
| API Routes | kebab-case | `/api/weight-entries` |

---

## Import Rules

**Always use absolute imports.**

```ts
// Correct
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/utils/cn";
import { weightService } from "@/features/weight-tracker/services/weight-service";

// Never
import { Button } from "../../../shared/ui/button";
```

Configure `tsconfig.json` paths:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Database Rules

- Use **Prisma ORM** for all database operations.
- No raw MongoDB queries (`db.collection.find()`) unless there is absolutely no Prisma alternative.
- All models defined in `prisma/schema.prisma` with `provider = "mongodb"`.
- Database client singleton in `src/core/database/`.
- MongoDB does **not** support `prisma migrate` — always use `npx prisma db push` to sync the schema.
- Every model ID must use `@id @map("_id") @db.ObjectId` convention.
- Use `String @db.ObjectId` for all foreign key / relation fields.
- Never store relational data in flat tables — use embedded documents or references depending on access patterns.
- Seed data lives in `prisma/seed.ts` and is run with `npx prisma db seed`.

---

## MongoDB + Prisma Schema Conventions

Prisma supports MongoDB with some important differences from relational databases.

### Prisma datasource block
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Model ID convention (always use this)
```prisma
model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Relation fields
```prisma
model WeightEntry {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
}
```

### Schema sync (NO migrations with MongoDB)
```bash
# Sync schema to database — use this instead of prisma migrate
npx prisma db push

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### PrismaClient singleton (`src/core/database/prisma.ts`)
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Key differences from PostgreSQL
| Feature | PostgreSQL | MongoDB |
|---------|-----------|---------|
| Migrations | `prisma migrate dev` | Not supported — use `db push` |
| IDs | `Int @id @default(autoincrement())` | `String @id @default(auto()) @map("_id") @db.ObjectId` |
| Relations | Foreign keys at DB level | References stored as ObjectId strings |
| Raw queries | `prisma.$queryRaw` | `prisma.$runCommandRaw` |
| Transactions | Full ACID | Supported (replica set required) |

---

## API Design Principles

- Route handlers are thin — they call services.
- Services contain all business logic.
- Validate all input at the route handler level using Zod.
- Return consistent response shapes:
```ts
// Success
{ success: true, data: T }

// Error
{ success: false, error: string, details?: unknown }
```
- Use HTTP status codes correctly.
- Never expose internal errors to the client.

---

## Error Handling

- Custom error classes in `src/core/errors/`.
- Every service method should throw typed errors.
- Route handlers catch errors and return appropriate HTTP responses.
- Never swallow errors silently.
- Log all server errors.

---

## Performance Rules

- Prefer Server Components (reduce client JS bundle).
- Use Client Components only when necessary.
- Lazy load expensive components.
- Avoid unnecessary re-renders using `useMemo`, `useCallback` where warranted.
- Optimize images using `next/image`.
- Minimize third-party dependencies.

---

## Accessibility Standards (Mandatory)

- Keyboard navigation must work on all interactive elements.
- Screen reader support via semantic HTML and ARIA labels.
- Focus management in modals and dialogs.
- Sufficient color contrast (WCAG AA minimum).
- All form fields must have associated labels.
- Accessibility is not optional — it is a release requirement.

---

## Security Rules

- Validate all input on the server side.
- Never trust client-sent data.
- Never expose secrets or API keys to the frontend.
- Store secrets in environment variables only.
- Sanitize all user-generated content before rendering.
- Use HTTPS in production.
- Implement rate limiting on API routes.

---

## Git Workflow

### Branch Strategy
```
main        ← Production-ready code only
  └── develop   ← Integration branch
        └── feature/*   ← Individual feature work
        └── fix/*        ← Bug fixes
        └── chore/*      ← Non-feature work
```

**Rules:**
- Every feature gets its own branch.
- Never commit directly to `main`.
- Never commit directly to `develop` for features.
- PRs required to merge into `develop`.

### Commit Convention (Conventional Commits)

```
feat: add weight tracker form
fix: resolve hydration issue in theme provider
refactor: extract service logic from route handler
style: adjust glass card border opacity
docs: update architecture documentation
test: add unit tests for weight service
chore: update prisma schema with weight model
```

---

## Milestone Roadmap

| Milestone | Goal | Status |
|-----------|------|--------|
| 0.1 | Foundation (packages, structure, providers, theme, utilities) | In Progress |
| 0.2 | Authentication (Auth.js, login, register, session) | Pending |
| 0.3 | Layout (sidebar, navbar, shell, routing) | Pending |
| 0.4 | Dashboard (overview, stats, welcome) | Pending |
| 0.5 | Health (weight, workout, sleep, meals, hair, smoking) | Pending |
| 0.6 | Study (study tracker, DSA, system design) | Pending |
| 0.7 | Career (job switch, interview prep, resume) | Pending |
| 0.8 | Finance (income, expenses, savings) | Pending |
| 0.9 | Test Series Tracker | Pending |
| 0.10 | Reports & Analytics | Pending |
| 1.0 | Production (CI/CD, Docker, optimization, deployment) | Pending |

### Development Rules — Every Milestone Must End With:
```
✅ npm run lint
✅ npm run type-check
✅ npm run build
✅ Git commit with conventional message
✅ Documentation updated
```

---

## Development Workflow Per Step

Every coding step follows this order:

1. **Files to create** — list what will be created
2. **Write code** — implement the files
3. **Run commands** — install packages, run dev
4. **Verify output** — check browser and terminal
5. **Git commit** — commit with conventional message

If something breaks: do not guess-fix. Read the error, identify the root cause, fix it, then continue.

---

## Milestone 0.1 — Completed Work

### What was done:
1. Created Next.js project with TypeScript and Tailwind CSS
2. Installed all core packages
3. Installed dev packages (prettier, husky, lint-staged)
4. Installed and initialized Prisma
5. Created folder structure under `src/`
6. Created `src/providers/Providers.tsx` with ThemeProvider, QueryClientProvider, and Sonner Toaster
7. Updated `src/app/layout.tsx` to use Providers
8. Created `src/shared/utils/cn.ts` utility function
9. Created `src/styles/globals.css` with Tailwind base

### Next Step — Milestone 0.1.2: Design System Foundation
- Tailwind config alignment
- CSS variable color tokens
- Glass design system tokens
- shadcn/ui initialization
- First glass primitive components (GlassCard, GlassButton, GlassInput)

---

## Documentation Structure

```
docs/
│
├── 00-introduction/
│   ├── Project-Vision.md
│   ├── Goals.md
│   ├── Success-Metrics.md
│   └── Product-Roadmap.md
│
├── 01-architecture/
│   ├── Architecture.md
│   ├── Folder-Structure.md
│   ├── Feature-Architecture.md
│   ├── Rendering-Strategy.md
│   ├── Data-Flow.md
│   ├── Providers.md
│   └── Decisions.md
│
├── 02-design-system/
│   ├── Apple-Glass-System.md
│   ├── Colors.md
│   ├── Typography.md
│   ├── Spacing.md
│   ├── Shadows.md
│   ├── Blur-System.md
│   ├── Animations.md
│   ├── Icons.md
│   ├── Components.md
│   └── Theme-System.md
│
├── 03-frontend/
│   ├── NextJS.md
│   ├── React.md
│   ├── TypeScript.md
│   ├── Tailwind.md
│   ├── ReactQuery.md
│   ├── Forms.md
│   ├── Routing.md
│   └── State-Management.md
│
├── 04-backend/
│   ├── API.md
│   ├── Services.md
│   ├── Validation.md
│   ├── Error-Handling.md
│   ├── Logging.md
│   └── Authentication.md
│
├── 05-database/
│   ├── Prisma.md
│   ├── MongoDB.md
│   ├── Schema-Sync.md          # db push workflow (no migrations in MongoDB)
│   ├── Naming.md
│   └── Seed.md
│
├── 06-development/
│   ├── Coding-Standards.md
│   ├── Git-Workflow.md
│   ├── Commit-Convention.md
│   ├── Branching.md
│   ├── Pull-Requests.md
│   ├── Releases.md
│   └── Development-Checklist.md
│
├── 07-features/
│   ├── Dashboard.md
│   ├── Health.md
│   ├── Hair.md
│   ├── Smoking.md
│   ├── Sleep.md
│   ├── Meals.md
│   ├── Study.md
│   ├── Career.md
│   ├── Finance.md
│   ├── Projects.md
│   ├── Reports.md
│   └── Settings.md
│
├── 08-testing/
│   ├── Unit-Testing.md
│   ├── Integration.md
│   ├── E2E.md
│   └── Accessibility.md
│
└── 09-deployment/
    ├── Docker.md
    ├── CI-CD.md
    ├── Vercel.md
    └── Production.md
```

---

## Definition of Done

A feature is only complete when ALL of the following are true:

- [ ] Works correctly (functional requirements met)
- [ ] Responsive (mobile, tablet, desktop)
- [ ] Accessible (keyboard nav, ARIA, contrast)
- [ ] Fully typed (no `any`, all types explicit)
- [ ] Documented (relevant docs updated)
- [ ] Tested (when applicable)
- [ ] Linted (`npm run lint` passes)
- [ ] Builds successfully (`npm run build` passes)
- [ ] Theme compatible (Light and Dark mode)
- [ ] Apple Glass design applied

---

## Code Quality Principles

**Use:**
- Small, single-responsibility functions
- Small, focused components (under 150 lines ideally)
- Reusable hooks for shared logic
- Reusable services for data access
- Composition over inheritance

**Avoid:**
- God Components (components doing too many things)
- Large files over 300 lines
- Duplicate logic across features
- Magic strings (use constants)
- Deeply nested components
- Prop drilling (use composition or context)

---

## AI Assistant Instructions

When generating code for this project:

1. **Always follow the existing architecture** — no new patterns without justification.
2. **Never introduce duplicate components** — reuse what exists.
3. **Always use existing utilities** — especially `cn()` for classes.
4. **Keep components small** — extract logic into hooks and services.
5. **Prefer composition** — build from glass primitives.
6. **Prefer Server Components** — use `"use client"` only when necessary.
7. **Explain major architectural decisions** — especially for patterns not yet in the codebase.
8. **Generate production-ready code only** — no placeholders unless explicitly requested.
9. **Maintain design consistency** — every new component must look like it belongs in the same app.
10. **Every new component must support:**
    - Light Theme (bright glass)
    - Dark Theme (dark glass)
    - System theme detection via `next-themes`

**All UI must feel like a premium Apple application.**

**Quality is more important than speed.**

---

## Non-Goals

The following are explicitly out of scope for Version 1:

- Mobile app (React Native)
- Offline-first / PWA
- Multi-user / team features
- Social features
- Public API
- Marketplace
- Payment processing (unless Finance module requires it)

---

## Environment Variables

```env
# .env.example

# Database — MongoDB
# Local:  mongodb://localhost:27017/pos_db
# Atlas:  mongodb+srv://<user>:<password>@<cluster>.mongodb.net/pos_db?retryWrites=true&w=majority
DATABASE_URL="mongodb://localhost:27017/pos_db"

# Next.js
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Personal Operating System"
```

---

## How to Start Fresh (Complete Setup)

```bash
# 1. Create Next.js project
npx create-next-app@latest pos --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 2. Navigate to project
cd pos

# 3. Install core packages
npm install next-themes @tanstack/react-query @tanstack/react-query-devtools sonner zod react-hook-form @hookform/resolvers class-variance-authority clsx tailwind-merge lucide-react framer-motion date-fns zustand react-icons

# 4. Install dev packages
npm install -D prettier prettier-plugin-tailwindcss husky lint-staged tsx

# 5. Install Prisma
npm install prisma @prisma/client

# 6. Initialize Prisma with MongoDB provider
npx prisma init --datasource-provider mongodb

# 7. Create folder structure
mkdir -p src/core/{auth,database,env,errors,logger,theme,validation}
mkdir -p src/features
mkdir -p src/providers
mkdir -p src/shared/{components,constants,hooks,icons,lib,types,ui,utils}
mkdir -p src/store
mkdir -p src/styles
mkdir -p docs
mkdir -p tests

# 8. Start development server
npm run dev
```

---

*This document is the single source of truth for the POS project. Update it at the end of every milestone.*
