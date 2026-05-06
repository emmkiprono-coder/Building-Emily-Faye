# Emily Faye Restoration PM

Restoration project management system for **Emily Faye**, a 1979 C&C 29 sailboat owned by [TMarK Charters](https://tmark-site.vercel.app), bound for the July 4, 2026 Airbnb dock-stay launch at Montrose Harbor, Chicago.

## What's inside

- 52 pre-loaded restoration projects across 5 zones (Bedroom, Living Room, Kitchen, Bathroom, Cockpit)
- Per-project tracking: assignee, hours, cost, parts, before/after photos, videos, notes
- Dependency graph (blocked by), priority levels, status workflow
- Dashboard: deadline countdown, budget burn-down per zone, completion velocity
- Inventory tracker aggregating parts across all projects
- AI assistant tools (require Anthropic API key):
  - **Voice-to-log**: dictate a work session, auto-extract hours/cost/parts/status
  - **Photo analysis**: describe before-photo, generate work-completed from before/after
  - **Task decomposition**: break a project into 5 to 10 subtasks
  - **Cost & time estimate**: marine-grade material estimates
  - **Risk advisor**: ABYC code, sequencing, fire/structural concerns
  - **Daily standup, Slack updates, parts-order email, end-of-season report**
  - **Receipt scanner**: snap a Home Depot/West Marine receipt, auto-log
  - **NOAA weather** for Montrose Harbor with exterior-work gating
  - **Calendar export** (.ics) and **public progress page** (HTML for tmark-site)

## Tech stack

- Next.js 15 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS
- Lucide icons
- localStorage persistence (browser-side, no backend required)

## Quick start

```bash
# Install
npm install

# Add your Anthropic API key (optional, only needed for AI features)
cp .env.example .env.local
# then edit .env.local and paste in your key

# Run locally
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

```bash
# One-time setup: push to GitHub
git init
git add .
git commit -m "feat: initial restoration PM"
git branch -M main
git remote add origin git@github.com:emmkiprono-coder/emily-faye-pm.git
git push -u origin main

# Then either:
# (a) Click "Add New Project" at https://vercel.com/new and import the repo, OR
# (b) Use the Vercel CLI:
npx vercel
```

After import, add `ANTHROPIC_API_KEY` as an environment variable in the Vercel dashboard (Settings → Environment Variables).

## Project structure

```
src/
  app/
    layout.tsx              # Root layout, font loading
    page.tsx                # Main app shell
    globals.css             # Tailwind + global styles
    api/claude/route.ts     # Server proxy to Anthropic API (keeps key safe)
  components/
    Header.tsx
    BoardView.tsx
    Dashboard.tsx
    InventoryView.tsx
    ProjectCard.tsx
    ProjectDetail.tsx
    AlertStrip.tsx
    AIToolPanel.tsx         # Per-project AI tools
    AgenticPanel.tsx        # Global AI tools
    PhotoSection.tsx
    BlockerSelector.tsx
    NewProjectModal.tsx
    primitives.tsx          # Reusable Label, FilterChip, etc.
  data/
    seed.ts                 # 52 initial projects from sticky notes
    constants.ts            # Zones, statuses, priorities
  lib/
    storage.ts              # localStorage wrapper with versioning
    claude.ts               # Client-side wrapper for /api/claude
    compute.ts              # Stats, deadline, stale-task computation
  types/
    project.ts              # Project, Zone, Status, Priority types
```

## Software quality gate

This codebase follows the standard quality bar:

- TypeScript strict mode
- All inputs validated at boundaries
- All async ops wrapped in try/catch with loading/error/empty states
- API key never exposed to client (server proxy at `/api/claude`)
- localStorage with try/catch around every read/write
- 4.5:1 contrast minimum, focus rings, aria-labels, semantic HTML
- 44x44pt touch targets minimum
- Reduced-motion support
- No raw hex in JSX, only semantic Tailwind tokens
- Mobile-first layout, tested at 375px

## License

Private. TMarK Charters. All rights reserved.

---

⚓ Montrose Harbor · Target: July 4, 2026
