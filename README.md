# TRA-DIRECT

Digital Registry Management, Office Directory and Visitor Guidance System for the Tanzania Revenue Authority.

Original proposal: [docs/PROJECT PROPOSAL NEW.docx](docs/PROJECT%20PROPOSAL%20NEW.docx)

## Structure

- `server/` — Express + Prisma API (SQLite in dev)
- `client/` — React (Vite + Tailwind) single-page app with two areas:
  - `/` — public kiosk/directory (unauthenticated)
  - `/staff/*` — internal staff registry portal (authenticated)

## Current scope

Both halves of Phase 1 are implemented:

- **Public Kiosk** — home/search, office & service detail, building map placeholder,
  announcements, QR codes.
- **Staff Registry Portal** — login (JWT), role-based access, incoming/outgoing
  correspondence registers with file upload, document detail with status updates,
  file transfer/tracking between officers, document search, office & service
  directory management, announcements manager, user management (admin), audit log.

Not yet built: the building map is still a placeholder graphic (needs the real
floor plan), and reporting is limited to the dashboard summary tiles (no export yet).

## Running locally

```bash
# API
cd server
npm run prisma:migrate   # first time only
npm run prisma:seed      # first time only (also re-runnable safely)
npm run dev              # http://localhost:4000 (nodemon, auto-reload)

# Kiosk + staff app
cd client
npm run dev              # http://localhost:5173
```

### Test accounts (seeded, password: `Passw0rd!`)

| Username | Role |
|---|---|
| admin | System Administrator |
| registry | Registry Officer |
| records | Records Officer |
| taxofficer | Department Officer |
| supervisor | Supervisor |

### Windows path note

This project's path contains `&` (`CODES&PROJECTS`), which breaks `npm.cmd`/`npx.cmd`
batch-file argument parsing on Windows. If you see `Cannot find module 'C:\...\index.js'`
errors when running `npm run ...` or `npx ...` directly from a shell, invoke the tool's
JS entry point with `node` instead, e.g.:

```bash
node node_modules/prisma/build/index.js migrate dev
node node_modules/vite/bin/vite.js --host
```

The `npm run dev` scripts inside `server/package.json` work fine since they're
launched by npm itself once already running; it's ad-hoc `npx <tool>` invocations
from an external shell that are affected.
