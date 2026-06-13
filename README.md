<div align="center">

# TN-OSIRIS

### Tamil Nadu Governance Intelligence and FlowRadar Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![MapLibre](https://img.shields.io/badge/MapLibre_GL-Interactive_Map-396CB2?style=for-the-badge)](https://maplibre.org)
[![License](https://img.shields.io/badge/License-MIT-D4AF37?style=for-the-badge)](LICENSE)

**A Tamil Nadu-focused command platform for governance monitoring, district intelligence, spatial risk tracking, and FlowRadar-style operational visibility across state systems.**

[Report Bug](https://github.com/ic3w4r/tn_osiris/issues) · [Request Feature](https://github.com/ic3w4r/tn_osiris/issues)

</div>

---

## Overview

TN-OSIRIS is a map-first monitoring platform built for Tamil Nadu state operations. It combines district-level governance intelligence with a FlowRadar workspace for tracking how work, funds, grievances, schemes, projects, inspections, and public service activity move through the state.

This project is **inspired by the original OSIRIS interface language and command-center style** as a visual and interaction reference. The underlying purpose, information architecture, seeded datasets, district workflows, and operating model in this repository have been **reworked for Tamil Nadu governance and monitoring use cases**.

Rather than a global OSINT dashboard, this implementation focuses on:

- Tamil Nadu as the default operational map
- district command views with deeper bifurcations
- governance intelligence layers
- FlowRadar modules for state and district workflows
- budget allocation, utilization, schemes, grievances, and departmental feeds

---

## What This App Does

TN-OSIRIS provides two top-level working modes inside one product:

### 1. Governance Intelligence

This mode is the state monitoring layer for:

- pending grievances
- delayed projects
- schemes and delivery coverage
- budget allocation and utilization
- public assets
- tender risk
- department-linked governance feeds
- district risk and zone summaries

### 2. FlowRadar

This mode extends the system into a flow-tracking workspace built around shared flow objects and district-level routing. It supports seeded state data for:

- Fund Flow
- File Flow
- Grievance Flow
- Tender Flow
- Project Flow
- Scheme Benefit Flow
- Certificate / Service Flow
- Vehicle / Field Team Flow
- Material Supply Flow
- Disaster Response Flow
- Inspection Flow
- Citizen Impact Flow

---

## Product Direction

The current implementation is designed as a **Tamil Nadu command platform prototype with realistic seeded data** and a clean upgrade path toward live departmental integrations later.

Core product decisions in this repo:

- Tamil Nadu loads as the default map context
- district command view is the main operational drill-down
- district zones are normalized into `North`, `South`, `East`, and `West`
- the interface is map-led rather than text-led
- top summary cards remain navigable and tied to district/state drill-down
- FlowRadar lives inside the same app shell as Governance Intelligence

---

## Key Capabilities

### Statewide command view

- Tamil Nadu-focused map shell
- district selection and district jump workflows
- state summary cards for high-priority governance signals
- persistent footer ticker / ops strip

### District command view

- district risk posture
- district zones and zone-specific summaries
- grievance, project, scheme, and budget/fund bifurcations
- list-oriented operational drill-down instead of summary-only cards
- district-linked mapped workfronts and signals

### Governance monitoring layers

- District Risk
- Grievance Heat
- Delayed Projects
- Schemes
- Tender Risk
- Asset Track
- Disaster Watch

### FlowRadar workspace

- top-level mode switching between Governance Intelligence and FlowRadar
- module-aware state summaries
- flow-linked objects and district filters
- Flow Passport style tracking for operational entities
- department and channel heat summaries

### Visual system

- command-center styling inspired by OSIRIS
- Tamil Nadu-specific map orientation
- district and zone emphasis over generic global markers
- layered operational panels designed for desktop command use

---

## Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                        TN-OSIRIS APP                       │
│  Governance Intelligence  │  FlowRadar Workspace           │
├─────────────────────────────────────────────────────────────┤
│                      MAP + COMMAND UI                      │
│  Tamil Nadu map  │ District command view │ Feed panels     │
├─────────────────────────────────────────────────────────────┤
│                       NEXT.JS API ROUTES                   │
│  /api/governance   /api/flowradar   /api/news   /api/cctv  │
│  /api/frontlines   /api/infrastructure   /api/health       │
├─────────────────────────────────────────────────────────────┤
│                      SEEDED DATA LAYER                     │
│  tn-governance-data.ts   tn-flowradar-data.ts             │
└─────────────────────────────────────────────────────────────┘
```

---

## Repository Positioning

This repository should be understood as:

- **inspired by OSIRIS**
- **not a straight clone of the original product intent**
- **reframed around Tamil Nadu state operations**
- **expanded with district monitoring, FlowRadar, and state governance workflows**

The original OSIRIS project contributed inspiration around:

- cinematic command-center presentation
- layered intelligence panels
- map-centric operating model
- dense real-time visual language

This TN-OSIRIS implementation changes that baseline into:

- Tamil Nadu district governance mapping
- public administration monitoring
- scheme and budget visibility
- grievance and project escalation tracking
- department and flow-linked operational oversight

---

## Quick Start

Recommended runtime: `Node.js 22 LTS`

### Windows PowerShell

```powershell
git clone https://github.com/ic3w4r/tn_osiris.git
cd tn_osiris
npm run bootstrap
```

### macOS / Linux Terminal

```bash
git clone https://github.com/ic3w4r/tn_osiris.git
cd tn_osiris
npm run bootstrap
```

Open [http://localhost:3000](http://localhost:3000)

### What `npm run bootstrap` does

- installs dependencies
- creates `.env.local` from `.env.example` if needed
- starts the local development server

### Manual setup

```bash
npm install
npm run setup
npm run dev
```

### Useful scripts

```bash
npm run dev
npm run dev:host
npm run build
npm run build:webpack
npm run lint
```

---

## Docker

For containerized setup and self-hosting, see [DOCKER.md](DOCKER.md).

Quick start:

```bash
git clone https://github.com/ic3w4r/tn_osiris.git
cd tn_osiris
cp .env.template .env
docker compose up -d
```

---

## Environment

The project includes `.env.example` and `.env.template` for local setup.

Most of the Tamil Nadu governance and FlowRadar experience in this repository is driven by **seeded data**, so you can run the application locally without standing up live departmental integrations first.

Some inherited OSIRIS-style APIs and connectors still support optional configuration through environment variables where applicable. See [DOCKER.md](DOCKER.md) for the full container and environment reference.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| Language | TypeScript 5 |
| UI | React 19 |
| Mapping | MapLibre GL |
| Styling | Custom CSS design system |
| Motion | Framer Motion |
| Runtime | Node.js 22 LTS recommended |

---

## Current Focus Areas

- cleaner district-first map interactions
- stronger district zone drill-down
- richer FlowRadar bifurcations
- clearer governance feed grouping by department source
- production-friendly packaging for Windows and macOS setup

---

## License

MIT — see [LICENSE](LICENSE) for details.

