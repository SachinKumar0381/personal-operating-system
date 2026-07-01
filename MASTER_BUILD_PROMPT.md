# MASTER BUILD PROMPT — Personal Operating System (POS)

---

## HOW TO USE THIS FILE

At the start of every Claude Code session, say:

> "Read CLAUDE.md and MASTER_BUILD_PROMPT.md. Find the first phase that is NOT marked ✅ DONE. Build that phase exactly as described. Do not skip steps. Do not jump ahead. Do not combine phases."

After each phase is complete and verified, mark it `✅ DONE` in this file, then commit.

---

## PROJECT SUMMARY

You are building **Personal Operating System (POS)** — a production-grade, full-stack SaaS life management application.

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui · MongoDB · Prisma ORM · TanStack Query · Zustand · React Hook Form + Zod · Framer Motion · next-themes · Auth.js · sonner

**Design:** Apple glassmorphism in both Light and Dark mode. Every component looks like visionOS / iOS 26 / macOS Tahoe. No flat design. No Material UI.

**Architecture:** Feature-Driven. Every module is isolated in `src/features/`. Shared code in `src/shared/`. Infrastructure in `src/core/`. Routing only in `src/app/`.

**Laws:** Read `CLAUDE.md` before writing a single line of code. Every decision must comply with it.

---

## CRITICAL RULES

1. Build **one phase at a time**. Never jump ahead.
2. After each phase: run `npm run lint`, `npm run type-check`, `npm run build`. Fix all errors before marking done.
3. Never use `any` in TypeScript.
4. Never write inline styles.
5. Never use relative imports — always use `@/`.
6. Never put business logic inside React components.
7. Never put server data in Zustand.
8. Every component must work in both Light and Dark mode with glass aesthetics.
9. Route handlers call services. Services call Prisma. Never skip layers.
10. After every phase: commit with a Conventional Commit message.

---

## PROGRESS TRACKER

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project Foundation | ✅ DONE |
| 2 | Design System | ✅ DONE |
| 3 | Complete Database Schema | ✅ DONE |
| 4 | Authentication | ✅ DONE |
| 5 | App Shell (Layout) | ✅ DONE |
| 6 | Dashboard | ✅ DONE |
| 7 | Daily Planner | ✅ DONE |
| 8a | Weight Tracker | ✅ DONE |
| 8b | Workout Tracker | ⬜ TODO |
| 8c | Sleep Tracker | ⬜ TODO |
| 8d | Meal Planner | ⬜ TODO |
| 8e | Hair Recovery Tracker | ⬜ TODO |
| 8f | Smoking Tracker | ⬜ TODO |
| 9a | Study Tracker | ⬜ TODO |
| 9b | DSA Tracker | ⬜ TODO |
| 9c | System Design Tracker | ⬜ TODO |
| 10a | Job Switch Tracker | ⬜ TODO |
| 10b | Resume Versions | ⬜ TODO |
| 11 | Finance Tracker | ⬜ TODO |
| 12 | Test Series Tracker | ⬜ TODO |
| 13 | Reports & Analytics | ⬜ TODO |
| 14 | Settings | ⬜ TODO |
| 15 | Production & Deployment | ⬜ TODO |

---

---

# PHASE 1 — Project Foundation

**Milestone:** 0.1  
**Status:** ✅ DONE

### Goal
A clean Next.js project with all packages installed, folder structure created, providers wired up, utilities ready, database client set up, and environment validation in place. The app must load with zero errors before proceeding.

---

### Step 1.1 — Create the Next.js Project

```bash
npx create-next-app@latest pos \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd pos
```

---

### Step 1.2 — Install All Packages

```bash
# Core packages
npm install \
  next-themes \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  sonner \
  zod \
  react-hook-form \
  @hookform/resolvers \
  class-variance-authority \
  clsx \
  tailwind-merge \
  lucide-react \
  framer-motion \
  date-fns \
  zustand \
  react-icons

# Dev packages
npm install -D \
  prettier \
  prettier-plugin-tailwindcss \
  husky \
  lint-staged \
  tsx

# Database
npm install prisma @prisma/client

# Initialize Prisma with MongoDB
npx prisma init --datasource-provider mongodb
```

---

### Step 1.3 — Create Folder Structure

```bash
mkdir -p src/core/{auth,database,env,errors,logger,theme,validation}
mkdir -p src/features
mkdir -p src/providers
mkdir -p src/shared/{components,constants,hooks,icons,lib,types,ui,utils}
mkdir -p src/store
mkdir -p src/styles
mkdir -p docs/{00-introduction,01-architecture,02-design-system,03-frontend,04-backend,05-database,06-development,07-features,08-testing,09-deployment}
mkdir -p tests
mkdir -p scripts
mkdir -p docker
mkdir -p public
```

---

### Step 1.4 — Configuration Files

**`.env`** (create and gitignore):
```env
DATABASE_URL="mongodb://localhost:27017/pos_db"
NEXTAUTH_SECRET="generate-a-long-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Personal Operating System"
```

**`.env.example`** (commit this):
```env
DATABASE_URL="mongodb://localhost:27017/pos_db"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Personal Operating System"
```

**`.prettierrc`**:
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Update **`package.json`** — add these scripts:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

Verify **`tsconfig.json`** has this (Next.js creates it, confirm it's there):
```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

### Step 1.5 — Environment Validation

**`src/core/env/index.ts`**:
```ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse(process.env);
```

---

### Step 1.6 — Database Client Singleton

**`src/core/database/prisma.ts`**:
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**`src/core/database/index.ts`**:
```ts
export { prisma } from "./prisma";
```

---

### Step 1.7 — Custom Error Classes

**`src/core/errors/index.ts`**:
```ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}
```

---

### Step 1.8 — Logger

**`src/core/logger/index.ts`**:
```ts
type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, message: string, data?: unknown): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (level === "error") {
    console.error(prefix, message, data ?? "");
  } else if (level === "warn") {
    console.warn(prefix, message, data ?? "");
  } else {
    console.log(prefix, message, data ?? "");
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      log("debug", message, data);
    }
  },
};
```

---

### Step 1.9 — Shared Types

**`src/shared/types/index.ts`**:
```ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export type DateRange = {
  from: Date;
  to: Date;
};

export type Theme = "light" | "dark" | "system";

export type Priority = "low" | "medium" | "high";

export type Status = "todo" | "in_progress" | "done";
```

---

### Step 1.10 — Shared Constants

**`src/shared/constants/index.ts`**:
```ts
export const APP_NAME = "Personal Operating System";
export const APP_DESCRIPTION = "Life management system for productivity, health, and growth";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PLANNER: "/planner",
  WEIGHT: "/health/weight",
  WORKOUT: "/health/workout",
  SLEEP: "/health/sleep",
  MEALS: "/health/meals",
  HAIR: "/health/hair",
  SMOKING: "/health/smoking",
  STUDY: "/study",
  DSA: "/study/dsa",
  SYSTEM_DESIGN: "/study/system-design",
  JOBS: "/career/jobs",
  RESUME: "/career/resume",
  FINANCE: "/finance",
  TEST_SERIES: "/test-series",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const;

export const QUERY_KEYS = {
  USER: "user",
  PLANNER: "planner",
  WEIGHT: "weight",
  WORKOUT: "workout",
  SLEEP: "sleep",
  MEALS: "meals",
  HAIR: "hair",
  SMOKING: "smoking",
  STUDY: "study",
  DSA: "dsa",
  SYSTEM_DESIGN: "system-design",
  JOBS: "jobs",
  RESUME: "resume",
  FINANCE: "finance",
  TEST_SERIES: "test-series",
  REPORTS: "reports",
  SETTINGS: "settings",
} as const;
```

---

### Step 1.11 — Utility Functions

**`src/shared/utils/cn.ts`**:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**`src/shared/utils/api.ts`**:
```ts
import { AppError } from "@/core/errors";
import { ApiResponse } from "@/shared/types";
import { NextResponse } from "next/server";

export function successResponse<T>(data: T, status = 200): NextResponse {
  const response: ApiResponse<T> = { success: true, data };
  return NextResponse.json(response, { status });
}

export function errorResponse(error: unknown, defaultStatus = 500): NextResponse {
  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: error.message,
      details: error.code,
    };
    return NextResponse.json(response, { status: error.statusCode });
  }

  const response: ApiResponse = {
    success: false,
    error: "An unexpected error occurred",
  };
  return NextResponse.json(response, { status: defaultStatus });
}
```

**`src/shared/utils/date.ts`**:
```ts
import { format, formatDistance, isToday, isYesterday, startOfDay, endOfDay } from "date-fns";

export function formatDate(date: Date | string, pattern = "dd MMM yyyy"): string {
  return format(new Date(date), pattern);
}

export function formatRelative(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function getDayRange(date: Date = new Date()): { from: Date; to: Date } {
  return {
    from: startOfDay(date),
    to: endOfDay(date),
  };
}

export function toISODate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
```

---

### Step 1.12 — Providers

**`src/providers/Providers.tsx`**:
```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
            staleTime: 1000 * 60 * 5, // 5 minutes
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster richColors position="top-right" />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

---

### Step 1.13 — Root Layout

**`src/app/layout.tsx`**:
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Personal Operating System",
    template: "%s | POS",
  },
  description: "Life management system for productivity, health, and growth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

### Step 1.14 — Global CSS

**`src/styles/globals.css`**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  height: 100%;
}

body {
  @apply bg-background text-foreground font-sans;
}

* {
  @apply border-border;
}
```

Move the existing `src/app/globals.css` import reference to point to `src/styles/globals.css` in `layout.tsx`.

---

### Step 1.15 — Home Page (Temporary Placeholder)

**`src/app/page.tsx`**:
```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-semibold">Personal Operating System</h1>
    </main>
  );
}
```

---

### Phase 1 Verification

```bash
npm run dev          # App loads at http://localhost:3000 — no errors
npm run type-check   # Zero TypeScript errors
npm run lint         # Zero lint errors
npm run build        # Builds successfully
```

### Phase 1 Git Commit

```bash
git init
git add .
git commit -m "feat: project foundation — packages, structure, providers, utilities, db client"
```

---
---

# PHASE 2 — Design System

**Milestone:** 0.1.2  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 1 ✅ DONE

### Goal
A complete Apple glass design system. CSS variable tokens, shadcn/ui initialized, and all Glass primitive components built. After this phase, every subsequent page is built using these primitives only.

---

### Step 2.1 — Update Tailwind Config

Update **`tailwind.config.ts`** to include custom glass tokens and CSS variable references:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.12)",
          dark: "rgba(0, 0, 0, 0.25)",
          border: {
            light: "rgba(255, 255, 255, 0.25)",
            dark: "rgba(255, 255, 255, 0.08)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        glass: "1.25rem",
        "glass-lg": "1.5rem",
      },
      backdropBlur: {
        glass: "20px",
        "glass-sm": "10px",
        "glass-lg": "40px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

### Step 2.2 — CSS Variable Tokens (Glass Color System)

Replace the contents of **`src/styles/globals.css`** with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Light mode — Apple light glass */
    --background: 210 40% 96%;
    --foreground: 222 47% 11%;

    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;

    --primary: 221 83% 53%;
    --primary-foreground: 0 0% 100%;

    --secondary: 210 40% 90%;
    --secondary-foreground: 222 47% 11%;

    --muted: 210 40% 93%;
    --muted-foreground: 215 16% 47%;

    --accent: 210 40% 90%;
    --accent-foreground: 222 47% 11%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 214 32% 88%;
    --input: 214 32% 88%;
    --ring: 221 83% 53%;

    --radius: 0.75rem;

    /* Glass tokens — light */
    --glass-bg: rgba(255, 255, 255, 0.65);
    --glass-bg-subtle: rgba(255, 255, 255, 0.40);
    --glass-border: rgba(255, 255, 255, 0.70);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    --glass-blur: 20px;
  }

  .dark {
    /* Dark mode — Apple dark glass */
    --background: 222 47% 8%;
    --foreground: 210 40% 96%;

    --card: 222 47% 11%;
    --card-foreground: 210 40% 96%;

    --primary: 221 83% 60%;
    --primary-foreground: 0 0% 100%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 96%;

    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;

    --accent: 217 33% 17%;
    --accent-foreground: 210 40% 96%;

    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 100%;

    --border: 217 33% 17%;
    --input: 217 33% 17%;
    --ring: 221 83% 60%;

    /* Glass tokens — dark */
    --glass-bg: rgba(255, 255, 255, 0.06);
    --glass-bg-subtle: rgba(255, 255, 255, 0.03);
    --glass-border: rgba(255, 255, 255, 0.10);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.40);
    --glass-blur: 24px;
  }
}

@layer base {
  html,
  body {
    height: 100%;
  }

  body {
    @apply bg-background text-foreground font-sans antialiased;
  }

  * {
    @apply border-border;
  }
}

@layer utilities {
  .glass {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--glass-blur));
    -webkit-backdrop-filter: blur(var(--glass-blur));
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
  }

  .glass-subtle {
    background: var(--glass-bg-subtle);
    backdrop-filter: blur(calc(var(--glass-blur) * 0.5));
    -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.5));
    border: 1px solid var(--glass-border);
  }
}
```

---

### Step 2.3 — Initialize shadcn/ui

```bash
npx shadcn@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

Then add these shadcn components:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add separator
npx shadcn@latest add badge
npx shadcn@latest add scroll-area
npx shadcn@latest add sheet
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add calendar
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add progress
npx shadcn@latest add tabs
npx shadcn@latest add avatar
npx shadcn@latest add skeleton
npx shadcn@latest add table
npx shadcn@latest add form
```

---

### Step 2.4 — Glass Primitive Components

Create each file in `src/shared/ui/`:

**`src/shared/ui/glass-card.tsx`**:
```tsx
import { cn } from "@/shared/utils/cn";
import { HTMLAttributes, forwardRef } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "subtle" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl transition-all duration-200",
          variant === "default" && "glass",
          variant === "subtle" && "glass-subtle",
          variant === "elevated" && "glass shadow-xl shadow-black/10 dark:shadow-black/30",
          padding === "none" && "p-0",
          padding === "sm" && "p-3",
          padding === "md" && "p-5",
          padding === "lg" && "p-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";

export { GlassCard };
```

**`src/shared/ui/glass-button.tsx`**:
```tsx
import { cn } from "@/shared/utils/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const glassButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "glass hover:bg-white/20 dark:hover:bg-white/10 text-foreground",
        primary:
          "bg-primary/90 backdrop-blur-sm text-primary-foreground hover:bg-primary shadow-lg shadow-primary/20",
        ghost:
          "hover:bg-white/15 dark:hover:bg-white/10 text-foreground",
        destructive:
          "bg-destructive/90 backdrop-blur-sm text-destructive-foreground hover:bg-destructive",
        outline:
          "border border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5 text-foreground backdrop-blur-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface GlassButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {}

const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
GlassButton.displayName = "GlassButton";

export { GlassButton, glassButtonVariants };
```

**`src/shared/ui/glass-input.tsx`**:
```tsx
import { cn } from "@/shared/utils/cn";
import { InputHTMLAttributes, forwardRef } from "react";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-10 w-full rounded-xl px-3 py-2 text-sm",
          "bg-white/10 dark:bg-white/5",
          "backdrop-blur-sm",
          "border border-white/20 dark:border-white/10",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-all duration-200",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
    );
  }
);
GlassInput.displayName = "GlassInput";

export { GlassInput };
```

**`src/shared/ui/glass-badge.tsx`**:
```tsx
import { cn } from "@/shared/utils/cn";
import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const glassBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/15 dark:bg-white/10 text-foreground border border-white/20 dark:border-white/10 backdrop-blur-sm",
        primary: "bg-primary/15 text-primary border border-primary/20 backdrop-blur-sm",
        success: "bg-green-500/15 text-green-600 dark:text-green-400 border border-green-500/20 backdrop-blur-sm",
        warning: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 backdrop-blur-sm",
        destructive: "bg-destructive/15 text-destructive border border-destructive/20 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface GlassBadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof glassBadgeVariants> {}

function GlassBadge({ className, variant, ...props }: GlassBadgeProps) {
  return (
    <span className={cn(glassBadgeVariants({ variant }), className)} {...props} />
  );
}

export { GlassBadge, glassBadgeVariants };
```

**`src/shared/ui/index.ts`** — barrel export:
```ts
export { GlassCard } from "./glass-card";
export { GlassButton, glassButtonVariants } from "./glass-button";
export { GlassInput } from "./glass-input";
export { GlassBadge, glassBadgeVariants } from "./glass-badge";
```

---

### Step 2.5 — Theme Toggle Component

**`src/shared/components/theme-toggle.tsx`**:
```tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { GlassButton } from "@/shared/ui/glass-button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { value: "light", icon: Sun },
    { value: "dark", icon: Moon },
    { value: "system", icon: Monitor },
  ] as const;

  return (
    <div className="flex gap-1 glass rounded-xl p-1">
      {themes.map(({ value, icon: Icon }) => (
        <GlassButton
          key={value}
          size="icon"
          variant={theme === value ? "primary" : "ghost"}
          onClick={() => setTheme(value)}
          aria-label={`Switch to ${value} theme`}
          className="h-8 w-8"
        >
          <Icon size={14} />
        </GlassButton>
      ))}
    </div>
  );
}
```

---

### Step 2.6 — Test Design System

Update **`src/app/page.tsx`** temporarily to verify glass styles work:

```tsx
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassBadge } from "@/shared/ui/glass-badge";
import { ThemeToggle } from "@/shared/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <ThemeToggle />
      <GlassCard className="max-w-sm w-full" variant="elevated">
        <h1 className="text-xl font-semibold mb-2">Personal Operating System</h1>
        <p className="text-muted-foreground text-sm mb-4">Design system working correctly.</p>
        <div className="flex gap-2 flex-wrap">
          <GlassBadge variant="primary">Active</GlassBadge>
          <GlassBadge variant="success">Done</GlassBadge>
          <GlassBadge variant="warning">Pending</GlassBadge>
        </div>
      </GlassCard>
      <div className="flex gap-3">
        <GlassButton variant="primary">Primary</GlassButton>
        <GlassButton variant="default">Default</GlassButton>
        <GlassButton variant="ghost">Ghost</GlassButton>
      </div>
    </main>
  );
}
```

Verify the page looks like Apple glass in both Light and Dark modes.

---

### Phase 2 Verification

```bash
npm run dev         # Glass components render correctly in light AND dark mode
npm run type-check  # Zero errors
npm run lint        # Zero errors
npm run build       # Builds successfully
```

### Phase 2 Git Commit

```bash
git add .
git commit -m "feat: design system — glass primitives, CSS tokens, shadcn/ui, theme toggle"
```

---
---

# PHASE 3 — Complete Database Schema

**Milestone:** 0.2 (pre-requisite)  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 1 ✅ DONE

### Goal
Define the **complete Prisma schema** for the entire application upfront. All models for all features. Push to MongoDB once. This prevents multiple `db push` runs later.

---

### Step 3.1 — Complete `prisma/schema.prisma`

Replace the entire contents of `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

model User {
  id            String    @id @default(auto()) @map("_id") @db.ObjectId
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts           Account[]
  sessions           Session[]
  plannerTasks       PlannerTask[]
  weightEntries      WeightEntry[]
  workoutEntries     WorkoutEntry[]
  sleepEntries       SleepEntry[]
  mealEntries        MealEntry[]
  hairEntries        HairEntry[]
  smokingEntries     SmokingEntry[]
  studyEntries       StudyEntry[]
  dsaProblems        DsaProblem[]
  systemDesigns      SystemDesignTopic[]
  jobApplications    JobApplication[]
  resumeVersions     ResumeVersion[]
  financeEntries     FinanceEntry[]
  testSeriesEntries  TestSeriesEntry[]
  settings           UserSettings?
}

model Account {
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  userId            String  @db.ObjectId
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.String
  access_token      String? @db.String
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.String
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  sessionToken String   @unique
  userId       String   @db.ObjectId
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  id         String   @id @default(auto()) @map("_id") @db.ObjectId
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─── PLANNER ──────────────────────────────────────────────────────────────────

model PlannerTask {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  description String?
  category    String?
  priority    String   @default("medium")
  status      String   @default("todo")
  date        DateTime
  startTime   String?
  endTime     String?
  tags        String[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ─── HEALTH ───────────────────────────────────────────────────────────────────

model WeightEntry {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  weight    Float
  unit      String   @default("kg")
  notes     String?
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model WorkoutEntry {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  type      String
  duration  Int
  exercises Json[]
  notes     String?
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SleepEntry {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  bedTime   DateTime
  wakeTime  DateTime
  duration  Float
  quality   Int
  notes     String?
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model MealEntry {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @db.ObjectId
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  mealType      String
  items         Json[]
  totalCalories Int?
  notes         String?
  date          DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model HairEntry {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      String
  products  String[]
  notes     String?
  photos    String[]
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model SmokingEntry {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  userId           String   @db.ObjectId
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  cigarettesSmoked Int      @default(0)
  cravings         Int      @default(0)
  mood             String?
  trigger          String?
  notes            String?
  date             DateTime
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

// ─── STUDY ────────────────────────────────────────────────────────────────────

model StudyEntry {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  subject   String
  topic     String
  duration  Int
  notes     String?
  resources String[]
  date      DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model DsaProblem {
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  userId          String    @db.ObjectId
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title           String
  platform        String
  difficulty      String
  category        String
  status          String
  url             String?
  notes           String?
  timeComplexity  String?
  spaceComplexity String?
  solvedAt        DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model SystemDesignTopic {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  userId      String    @db.ObjectId
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  title       String
  status      String
  concepts    String[]
  notes       String?
  resources   String[]
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ─── CAREER ───────────────────────────────────────────────────────────────────

model JobApplication {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  userId      String    @db.ObjectId
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  company     String
  role        String
  status      String
  salaryRange String?
  jobUrl      String?
  notes       String?
  appliedAt   DateTime
  followUpAt  DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  interviewRounds InterviewRound[]
}

model InterviewRound {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId
  applicationId String         @db.ObjectId
  application   JobApplication @relation(fields: [applicationId], references: [id], onDelete: Cascade)
  round         String
  scheduledAt   DateTime?
  outcome       String?
  notes         String?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model ResumeVersion {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  version   String
  fileUrl   String?
  notes     String?
  isActive  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// ─── FINANCE ──────────────────────────────────────────────────────────────────

model FinanceEntry {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String
  category    String
  amount      Float
  currency    String   @default("INR")
  description String?
  date        DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// ─── TEST SERIES ──────────────────────────────────────────────────────────────

model TestSeriesEntry {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  userId      String    @db.ObjectId
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  module      String
  status      String
  priority    String    @default("medium")
  notes       String?
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

model UserSettings {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  userId        String   @unique @db.ObjectId
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  theme         String   @default("system")
  timezone      String   @default("Asia/Kolkata")
  weightUnit    String   @default("kg")
  notifications Boolean  @default(true)
  weekStartsOn  String   @default("monday")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

### Step 3.2 — Push Schema to MongoDB

Make sure MongoDB is running locally, then:

```bash
npm run db:push
```

Expected output: `Your database is now in sync with your Prisma schema.`

Verify with:
```bash
npm run db:studio
```

---

### Step 3.3 — Create Prisma Seed File

**`prisma/seed.ts`**:
```ts
import { prisma } from "../src/core/database/prisma";

async function main() {
  console.log("Seeding database...");
  // Add seed data here as features are built
  console.log("Seed complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Add to **`package.json`**:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

### Phase 3 Verification

```bash
npm run db:push      # Schema in sync
npm run type-check   # PrismaClient types generated correctly, zero errors
npm run build        # Builds successfully
```

### Phase 3 Git Commit

```bash
git add .
git commit -m "feat: complete mongodb schema — all feature models defined and pushed"
```

---
---

# PHASE 4 — Authentication

**Milestone:** 0.2  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 3 ✅ DONE

### Goal
Full authentication: credential-based registration and login using Auth.js (NextAuth v5). Protected routes via middleware. Session hook for client-side access. Login and register pages with Apple glass design.

---

### Step 4.1 — Install Auth.js

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
```

---

### Step 4.2 — Auth Configuration

**`src/core/auth/auth.config.ts`**:
```ts
import type { NextAuthConfig } from "next-auth";
import { ROUTES } from "@/shared/constants";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname === ROUTES.LOGIN ||
        nextUrl.pathname === ROUTES.REGISTER;

      if (isAuthPage) {
        if (isLoggedIn) return Response.redirect(new URL(ROUTES.DASHBOARD, nextUrl));
        return true;
      }

      if (!isLoggedIn) return false;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
};
```

**`src/core/auth/index.ts`**:
```ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/core/database";
import { authConfig } from "./auth.config";
import { loginSchema } from "@/features/auth/schemas/auth-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(parsed.data.password, user.password);
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
});
```

---

### Step 4.3 — Middleware

**`src/middleware.ts`**:
```ts
import NextAuth from "next-auth";
import { authConfig } from "@/core/auth/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
```

---

### Step 4.4 — Auth API Route

**`src/app/api/auth/[...nextauth]/route.ts`**:
```ts
import { handlers } from "@/core/auth";

export const { GET, POST } = handlers;
```

---

### Step 4.5 — Auth Feature Structure

Create folder:
```
src/features/auth/
├── api/
├── components/
├── constants/
├── hooks/
├── schemas/
├── services/
├── store/
├── types/
└── utils/
```

**`src/features/auth/schemas/auth-schema.ts`**:
```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

**`src/features/auth/services/auth-service.ts`**:
```ts
import bcrypt from "bcryptjs";
import { prisma } from "@/core/database";
import { AppError } from "@/core/errors";
import { RegisterInput } from "@/features/auth/schemas/auth-schema";

export const authService = {
  async register(data: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError("Email already in use", 409);

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { id: user.id, email: user.email, name: user.name };
  },
};
```

**`src/app/api/auth/register/route.ts`**:
```ts
import { NextRequest } from "next/server";
import { registerSchema } from "@/features/auth/schemas/auth-schema";
import { authService } from "@/features/auth/services/auth-service";
import { successResponse, errorResponse } from "@/shared/utils/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse({ message: "Invalid input", details: parsed.error.flatten() }, 400);
    }
    const user = await authService.register(parsed.data);
    return successResponse(user, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
```

**`src/features/auth/hooks/use-session.ts`**:
```ts
"use client";

import { useSession as useNextSession } from "next-auth/react";

export function useSession() {
  const session = useNextSession();
  return {
    user: session.data?.user,
    isLoading: session.status === "loading",
    isAuthenticated: session.status === "authenticated",
  };
}
```

---

### Step 4.6 — Login Page

**`src/app/(auth)/login/page.tsx`**:

Build a full glass login page with:
- Centered GlassCard layout
- Email and password GlassInput fields
- Submit button using GlassButton with `variant="primary"`
- Link to register page
- Error display
- Call `signIn("credentials", { email, password, redirectTo: ROUTES.DASHBOARD })`
- Use React Hook Form + `loginSchema`
- Add Framer Motion `motion.div` with `fadeIn` animation

---

### Step 4.7 — Register Page

**`src/app/(auth)/register/page.tsx`**:

Build a full glass register page with:
- Centered GlassCard layout
- Name, email, password, confirm password fields (GlassInput)
- Submit button using GlassButton
- Link to login page
- Error display
- Call POST `/api/auth/register`, then redirect to login on success
- Use React Hook Form + `registerSchema`
- Add Framer Motion animation

---

### Step 4.8 — Auth Layout

**`src/app/(auth)/layout.tsx`**:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950 dark:to-gray-900 p-4">
      {children}
    </div>
  );
}
```

---

### Phase 4 Verification

```bash
npm run dev
# Test: Register a new user → redirect to login ✅
# Test: Login with correct credentials → redirect to /dashboard (404 is ok for now) ✅
# Test: Login with wrong password → show error ✅
# Test: Access /dashboard without login → redirect to /login ✅
npm run type-check
npm run lint
npm run build
```

### Phase 4 Git Commit

```bash
git add .
git commit -m "feat: authentication — auth.js, register, login, middleware, credential auth"
```

---
---

# PHASE 5 — App Shell (Layout)

**Milestone:** 0.3  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 4 ✅ DONE

### Goal
The app shell that wraps all authenticated pages. A glass sidebar with navigation, a top navbar with user info and theme toggle, and the main content area.

---

### Step 5.1 — Navigation Config

**`src/config/navigation.ts`**:
```ts
import {
  LayoutDashboard, Calendar, Scale, Dumbbell, Moon, Utensils,
  Sparkles, Cigarette, BookOpen, Code2, Server, Briefcase,
  FileText, Wallet, FlaskConical, BarChart3, Settings,
} from "lucide-react";
import { ROUTES } from "@/shared/constants";

export const navigationItems = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: "Planner",
    href: ROUTES.PLANNER,
    icon: Calendar,
  },
  {
    group: "Health",
    items: [
      { label: "Weight", href: ROUTES.WEIGHT, icon: Scale },
      { label: "Workout", href: ROUTES.WORKOUT, icon: Dumbbell },
      { label: "Sleep", href: ROUTES.SLEEP, icon: Moon },
      { label: "Meals", href: ROUTES.MEALS, icon: Utensils },
      { label: "Hair", href: ROUTES.HAIR, icon: Sparkles },
      { label: "Smoking", href: ROUTES.SMOKING, icon: Cigarette },
    ],
  },
  {
    group: "Study",
    items: [
      { label: "Study", href: ROUTES.STUDY, icon: BookOpen },
      { label: "DSA", href: ROUTES.DSA, icon: Code2 },
      { label: "System Design", href: ROUTES.SYSTEM_DESIGN, icon: Server },
    ],
  },
  {
    group: "Career",
    items: [
      { label: "Jobs", href: ROUTES.JOBS, icon: Briefcase },
      { label: "Resume", href: ROUTES.RESUME, icon: FileText },
    ],
  },
  {
    label: "Finance",
    href: ROUTES.FINANCE,
    icon: Wallet,
  },
  {
    label: "Test Series",
    href: ROUTES.TEST_SERIES,
    icon: FlaskConical,
  },
  {
    label: "Reports",
    href: ROUTES.REPORTS,
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
] as const;
```

---

### Step 5.2 — Sidebar Component

**`src/shared/ui/glass-sidebar.tsx`**:

Build a full glass sidebar with:
- Fixed left position, full height
- `glass` utility class on root element
- App logo/name at top
- `navigationItems` mapped to clickable nav items
- Active state detection using `usePathname()`
- Active item gets `variant="primary"` style, others get hover glass effect
- Group labels for "Health", "Study", "Career" sections
- Collapsed on mobile (sheet/drawer)
- User avatar + name at bottom
- Framer Motion `AnimatePresence` for mobile open/close

---

### Step 5.3 — Navbar Component

**`src/shared/ui/glass-navbar.tsx`**:

Build a glass top navbar with:
- `glass` utility class, sticky top
- Page title (derived from current route)
- ThemeToggle component on right
- User avatar with dropdown (profile, sign out) on right
- Mobile hamburger button that opens sidebar

---

### Step 5.4 — Authenticated App Layout

**`src/app/(app)/layout.tsx`**:
```tsx
import { auth } from "@/core/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/shared/constants";
// Import GlassSidebar, GlassNavbar

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect(ROUTES.LOGIN);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* GlassSidebar */}
      <main className="flex-1 overflow-auto">
        {/* GlassNavbar */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
```

---

### Step 5.5 — Move Dashboard Route

Create `src/app/(app)/dashboard/page.tsx` with a placeholder:

```tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
    </div>
  );
}
```

Create placeholder pages for all routes so navigation links don't 404:
- `src/app/(app)/planner/page.tsx`
- `src/app/(app)/health/weight/page.tsx`
- `src/app/(app)/health/workout/page.tsx`
- `src/app/(app)/health/sleep/page.tsx`
- `src/app/(app)/health/meals/page.tsx`
- `src/app/(app)/health/hair/page.tsx`
- `src/app/(app)/health/smoking/page.tsx`
- `src/app/(app)/study/page.tsx`
- `src/app/(app)/study/dsa/page.tsx`
- `src/app/(app)/study/system-design/page.tsx`
- `src/app/(app)/career/jobs/page.tsx`
- `src/app/(app)/career/resume/page.tsx`
- `src/app/(app)/finance/page.tsx`
- `src/app/(app)/test-series/page.tsx`
- `src/app/(app)/reports/page.tsx`
- `src/app/(app)/settings/page.tsx`

Each page returns a `<h1>` with the page name wrapped in a GlassCard.

---

### Phase 5 Verification

```bash
npm run dev
# Login → see sidebar + navbar ✅
# Navigate between all links — no 404s ✅
# Active sidebar item highlights correctly ✅
# Theme toggle works inside app ✅
# Sidebar collapses on mobile ✅
npm run type-check && npm run lint && npm run build
```

### Phase 5 Git Commit

```bash
git add .
git commit -m "feat: app shell — glass sidebar, navbar, navigation, authenticated layout"
```

---
---

# PHASE 6 — Dashboard

**Milestone:** 0.4  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 5 ✅ DONE

### Goal
A beautiful dashboard overview with welcome message, daily summary stats, and quick-access tiles. No real data yet — uses static or mock data. Real data comes when individual features are built.

---

### Feature Structure

```
src/features/dashboard/
├── components/
│   ├── welcome-section.tsx
│   ├── stat-card.tsx
│   ├── quick-access-grid.tsx
│   └── daily-summary.tsx
├── hooks/
├── types/
└── utils/
```

---

### Step 6.1 — Components to Build

**`welcome-section.tsx`**: Glass card showing user's name, current date, and a motivational subtitle. Uses `useSession()` for name. Animated with Framer Motion `slideUp`.

**`stat-card.tsx`**: Reusable glass stat card with icon, title, value, and optional trend arrow. Uses `GlassCard` with `variant="elevated"`. Accepts `title`, `value`, `icon`, `trend`, `color` props.

**`quick-access-grid.tsx`**: Grid of clickable GlassCard tiles — one for each major feature module. On click, navigates to that feature. Uses Framer Motion stagger animation for each tile entering.

**`daily-summary.tsx`**: Shows today's planner task count, study hours logged, and workout status as a horizontal row of mini stat cards.

---

### Step 6.2 — Dashboard Page

**`src/app/(app)/dashboard/page.tsx`**:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* WelcomeSection */}
      {/* DailySummary */}
      {/* QuickAccessGrid */}
    </div>
  );
}
```

---

### Phase 6 Verification

```bash
npm run dev
# Dashboard looks premium and glass-like ✅
# Welcome message shows logged-in user's name ✅
# All tiles navigate to correct pages ✅
# Animations are smooth ✅
npm run type-check && npm run lint && npm run build
```

### Phase 6 Git Commit

```bash
git add .
git commit -m "feat: dashboard — welcome section, stat cards, quick access grid"
```

---
---

# PHASE 7 — Daily Planner

**Milestone:** 0.4.1  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 6 ✅ DONE

### Goal
Full CRUD for daily tasks. View tasks by date, add/edit/delete, change status, filter by category and priority.

---

### Feature Structure

```
src/features/planner/
├── api/
│   ├── get-tasks.ts
│   ├── create-task.ts
│   ├── update-task.ts
│   └── delete-task.ts
├── components/
│   ├── task-list.tsx
│   ├── task-card.tsx
│   ├── task-form.tsx
│   ├── task-filters.tsx
│   └── date-navigator.tsx
├── hooks/
│   ├── use-tasks.ts
│   └── use-task-mutations.ts
├── schemas/
│   └── task-schema.ts
├── services/
│   └── task-service.ts
├── types/
│   └── index.ts
└── utils/
    └── task-utils.ts
```

---

### Steps

**Schemas** (`task-schema.ts`): `createTaskSchema` and `updateTaskSchema` using Zod. Fields: title (required), description, category (enum), priority (enum: low/medium/high), status (enum: todo/in_progress/done), date, startTime, endTime, tags.

**Types** (`index.ts`): `Task`, `CreateTaskInput`, `UpdateTaskInput` derived from schema and Prisma model.

**Service** (`task-service.ts`): Methods — `getTasksByDate(userId, date)`, `createTask(userId, data)`, `updateTask(userId, taskId, data)`, `deleteTask(userId, taskId)`. Always filter by `userId` for security.

**API Routes**:
- `GET /api/planner?date=yyyy-mm-dd` → `getTasksByDate`
- `POST /api/planner` → `createTask`
- `PATCH /api/planner/[id]` → `updateTask`
- `DELETE /api/planner/[id]` → `deleteTask`

**Hooks**:
- `useTasks(date)` → TanStack Query `useQuery` calling GET endpoint
- `useTaskMutations()` → `createTask`, `updateTask`, `deleteTask` mutations with `onSuccess` invalidating `[QUERY_KEYS.PLANNER, date]`

**Components**:
- `DateNavigator`: Prev/next day buttons + date display. Updates selected date in local state.
- `TaskFilters`: Filter chips for category and priority. Glass style.
- `TaskCard`: Shows task title, priority badge, status toggle button, edit/delete actions. Animated with Framer Motion.
- `TaskForm`: Dialog/sheet with React Hook Form for creating/editing tasks. GlassInput fields, GlassButton submit.
- `TaskList`: Maps tasks to TaskCard with empty state and skeleton loaders.

**Page** (`src/app/(app)/planner/page.tsx`): Composites all components. Date state lives here.

---

### Phase 7 Verification

```bash
npm run dev
# Create a task → appears in list ✅
# Mark task as done → status updates ✅
# Edit task → changes reflect ✅
# Delete task → removed from list ✅
# Navigate dates → tasks change ✅
npm run type-check && npm run lint && npm run build
```

### Phase 7 Git Commit

```bash
git add .
git commit -m "feat: daily planner — full CRUD tasks with date navigation, filters, animations"
```

---
---

# PHASE 8a — Weight Tracker

**Milestone:** 0.5  
**Status:** ✅ DONE  
**Pre-requisite:** Phase 7 ✅ DONE

### Feature Structure

```
src/features/weight-tracker/
├── api/
├── components/
│   ├── weight-form.tsx
│   ├── weight-list.tsx
│   ├── weight-chart.tsx
│   └── weight-stats.tsx
├── hooks/
│   ├── use-weight-entries.ts
│   └── use-weight-mutations.ts
├── schemas/
│   └── weight-schema.ts
├── services/
│   └── weight-service.ts
└── types/
    └── index.ts
```

**Schema**: `createWeightSchema` — weight (number, positive), unit (kg/lbs, default kg), date, notes (optional).

**Service**: `getWeightEntries(userId, limit?)`, `createWeightEntry(userId, data)`, `deleteWeightEntry(userId, id)`. Calculate BMI if height is available in settings (use 0 if not).

**API Routes**:
- `GET /api/health/weight` → list entries (last 30)
- `POST /api/health/weight` → create entry
- `DELETE /api/health/weight/[id]` → delete entry

**Components**:
- `WeightStats`: Current weight, goal weight, change since last entry as GlassCard stats.
- `WeightChart`: Line chart (use Recharts) showing weight over time inside a GlassCard.
- `WeightForm`: Glass form to log weight + date.
- `WeightList`: List of past entries as GlassCard rows.

**Page** (`src/app/(app)/health/weight/page.tsx`): Stats at top, chart in middle, form + list below.

**Verification**: Log 3 entries → chart updates → delete one → chart reflects change.

**Commit**: `feat: weight tracker — log entries, chart visualization, stats`

---

# PHASE 8b — Workout Tracker

**Status:** ⬜ TODO

**Feature**: Log workout sessions with name, type (strength/cardio/yoga/mixed), duration (minutes), exercises array (each: name, sets, reps, weight/duration), and notes.

**Key Components**: WorkoutForm (with dynamic exercise array using `useFieldArray` from RHF), WorkoutCard (shows summary), WorkoutStats (total workouts this week, total minutes).

**Commit**: `feat: workout tracker — session logging with exercise details`

---

# PHASE 8c — Sleep Tracker

**Status:** ⬜ TODO

**Feature**: Log bed time, wake time (DateTime pickers). Auto-calculate duration. Rate sleep quality 1–5. Show average sleep this week. Chart showing sleep duration over last 14 days.

**Commit**: `feat: sleep tracker — bed/wake time logging, quality rating, chart`

---

# PHASE 8d — Meal Planner

**Status:** ⬜ TODO

**Feature**: Log meals by type (breakfast/lunch/dinner/snack). Each meal has items array (name, calories, protein, carbs, fat). Show daily calorie total. Allow adding multiple meals per day.

**Commit**: `feat: meal planner — multi-meal logging with macro tracking`

---

# PHASE 8e — Hair Recovery Tracker

**Status:** ⬜ TODO

**Feature**: Log hair care activities — type (oil/wash/treatment/supplement), products used (tag input), notes. Timeline view of entries. Photo upload (store URL, implement upload in Phase 15).

**Commit**: `feat: hair recovery tracker — care log, timeline, product tracking`

---

# PHASE 8f — Smoking Tracker

**Status:** ⬜ TODO

**Feature**: Log daily cigarettes smoked, cravings resisted, mood, trigger. Show 30-day trend chart (cigarettes per day). Show streak (days with 0 cigarettes). Motivational stat: "You resisted X cravings this week."

**Commit**: `feat: smoking tracker — daily log, streak counter, trend chart`

---
---

# PHASE 9a — Study Tracker

**Milestone:** 0.6  
**Status:** ⬜ TODO  
**Pre-requisite:** Phase 8f ✅ DONE

**Feature**: Log study sessions with subject, topic, duration (minutes), resources, notes. Show total study hours this week. Chart of daily study time. Group by subject.

**Commit**: `feat: study tracker — session logging, weekly hours, subject grouping`

---

# PHASE 9b — DSA Tracker

**Status:** ⬜ TODO

**Feature**: Track DSA problems. Fields: title, platform (LeetCode/GFG/Codeforces), difficulty (Easy/Medium/Hard), category (Arrays/DP/Graphs/Trees/etc.), status (solved/attempted/revisit), URL, notes, time/space complexity.

**Key Components**:
- Problem table with filters for difficulty, category, platform, status.
- Stats: total solved, solved by difficulty, solved by category (bar chart).
- Add/Edit problem form.
- Progress toward goal (e.g., "150/300 problems solved").

**Commit**: `feat: dsa tracker — problem log, filters, stats, progress tracking`

---

# PHASE 9c — System Design Tracker

**Status:** ⬜ TODO

**Feature**: Track system design topics. Fields: title (e.g. "Design Twitter"), status (not_started/in_progress/completed/needs_revision), concepts covered (tags), notes, resources. Progress board view (Kanban-style or list).

**Commit**: `feat: system design tracker — topic tracking, progress board, concepts`

---
---

# PHASE 10a — Job Switch Tracker

**Milestone:** 0.7  
**Status:** ⬜ TODO

**Feature**: Track job applications. Fields: company, role, status (applied/screening/interview/offer/rejected/withdrawn), salary range, job URL, applied date, follow-up date, notes. Each application can have multiple InterviewRounds.

**Key Components**:
- Application board (grouped by status — Kanban-style columns).
- Application form with interview rounds section.
- Stats: total applied, active applications, offers, rejection rate.

**Commit**: `feat: job switch tracker — application board, pipeline, interview rounds`

---

# PHASE 10b — Resume Versions

**Status:** ⬜ TODO

**Feature**: Manage multiple resume versions. Fields: version name, file URL, notes, active status. Show list of versions, mark one as active, link to file. (File upload in Phase 15.)

**Commit**: `feat: resume versions — multi-version management, active tracking`

---
---

# PHASE 11 — Finance Tracker

**Milestone:** 0.8  
**Status:** ⬜ TODO

**Feature**: Track income, expenses, and savings. Fields: type (income/expense/saving), category, amount, currency (INR default), description, date.

**Key Components**:
- Finance summary: total income, total expenses, net savings (this month).
- Expense breakdown by category (pie chart).
- Monthly trend (bar chart).
- Transaction list with filters.
- Add transaction form.

**Commit**: `feat: finance tracker — income, expenses, savings, charts, category breakdown`

---
---

# PHASE 12 — Test Series Tracker

**Milestone:** 0.9  
**Status:** ⬜ TODO

**Feature**: Track progress on building the Test Series SaaS side project. Fields: module name, status (not_started/in_progress/completed/blocked), priority, notes, completion date.

**Key Components**:
- Progress board (Kanban-style or progress list).
- Overall completion percentage.
- Module cards with status badges.

**Commit**: `feat: test series tracker — module progress, kanban board, completion stats`

---
---

# PHASE 13 — Reports & Analytics

**Milestone:** 0.10  
**Status:** ⬜ TODO

### Goal
Aggregate data across all features to provide weekly and monthly insights.

**Reports to build:**
1. **Weekly Summary**: Study hours, workouts completed, average sleep, weight change, tasks completed, smoking trend, finance summary.
2. **Monthly Summary**: Same metrics over a month.
3. **Health Report**: Weight trend, workout frequency, sleep average, meal calories.
4. **Study Report**: Total hours by subject, DSA progress, system design progress.
5. **Career Report**: Job applications by status, interview success rate.
6. **Finance Report**: Monthly income vs. expenses, top expense categories.

**Architecture**: Each report is computed server-side from Prisma aggregations. Create `src/features/reports/services/report-service.ts` with one function per report type. Use TanStack Query to fetch on the client.

**Commit**: `feat: reports — weekly/monthly summaries across all feature modules`

---
---

# PHASE 14 — Settings

**Milestone:** Post-Reports  
**Status:** ⬜ TODO

### Goal
User preferences stored in `UserSettings` MongoDB document.

**Settings to implement:**
- Display name update
- Theme preference (light/dark/system) — syncs with next-themes
- Weight unit (kg/lbs)
- Timezone
- Week starts on (Monday/Sunday)
- Notification preferences
- Account: Change password, delete account

**Architecture**: Single `PATCH /api/settings` endpoint. `useSettings()` hook using TanStack Query. Settings form uses React Hook Form + Zod. Changes are optimistic (update UI immediately, revert on failure).

**Commit**: `feat: settings — user preferences, theme sync, account management`

---
---

# PHASE 15 — Production & Deployment

**Milestone:** 1.0  
**Status:** ⬜ TODO

### Step 15.1 — Docker Setup

**`docker/Dockerfile`**:
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

**`docker-compose.yml`**:
```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=pos_db

volumes:
  mongo_data:
```

### Step 15.2 — Performance Optimizations

- Enable `next/image` for all images.
- Add `loading="lazy"` to non-critical content.
- Add `React.Suspense` boundaries with `<Skeleton />` fallbacks.
- Enable Next.js `output: "standalone"` in `next.config.ts`.
- Add HTTP caching headers to API routes where appropriate.

### Step 15.3 — CI/CD (GitHub Actions)

**`.github/workflows/ci.yml`**:
```yaml
name: CI
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

### Step 15.4 — Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL` → MongoDB Atlas connection string
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` → production URL

### Step 15.5 — Final Checklist

```bash
npm run lint          # Zero warnings
npm run type-check    # Zero errors
npm run build         # Successful
# Manual test every feature end-to-end
# Verify light + dark mode on every page
# Verify mobile responsive on every page
# Verify auth redirect works in production
```

### Phase 15 Git Commit

```bash
git add .
git commit -m "feat: production — docker, ci/cd, vercel deployment, performance optimization"
git tag v1.0.0
git push origin main --tags
```

---
---

## POST-BUILD CHECKLIST

After all phases are marked ✅ DONE:

- [ ] Every page works in Light Mode
- [ ] Every page works in Dark Mode
- [ ] Every page is mobile responsive
- [ ] All forms validate correctly
- [ ] All API routes return consistent response shapes
- [ ] No `any` types in TypeScript
- [ ] No console.log statements in production code
- [ ] No unused imports
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] All features have been manually tested end-to-end
- [ ] README.md is up to date
- [ ] CLAUDE.md reflects current state

---

*Update the PROGRESS TRACKER table above after completing each phase. Mark phases with ✅ DONE.*
