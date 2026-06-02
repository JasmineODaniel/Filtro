# Filtro

A visual query builder for constructing complex, nested filter conditions — with live SQL, MongoDB, and GraphQL preview, mock data execution, animated UI, and a responsive mobile experience.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-5-FF6B35)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF)

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — hero, features, animated step connector, mock UI preview |
| `/builder` | The query builder application |

## Features

- **Visual query builder** — add, remove, reorder (drag-and-drop) rules and nested groups
- **AND / OR logic** — toggle per-group, with inline connector labels between conditions
- **Field-aware operators** — operators adapt to field type (string, number, date, enum, boolean)
- **Between validation** — reversed ranges (e.g. 35–20) are caught and flagged before execution
- **Live preview** — SQL `WHERE`, MongoDB aggregation, and GraphQL `where` generated in real time
- **Syntax highlighting** — keywords, values, and operators coloured via CSS design tokens
- **Mock execution** — run queries against 50 users, 30 orders, 25 products; sortable paginated results
- **Query history** — auto-snapshotted on change (deduped) and on execute; schema is saved with each entry
- **Presets** — save named queries with schema context; loading a preset restores the correct schema automatically
- **Import / Export** — queries round-trip as validated JSON; size and structure guarded on import
- **Keyboard shortcuts** — `Ctrl+S` save preset, `Ctrl+R` reset, `Ctrl+E` export, `Ctrl+I` import
- **Mobile responsive** — hamburger drawer with schema selector, History and Presets sub-panels; three-tab layout (Builder / Preview / Results)
- **Dark / light theme** — CSS custom properties; toggle persisted to localStorage; flash-free on load
- **Animated UI** — Framer Motion stagger, slide, and scale transitions throughout

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, custom component library |
| State | Zustand 5 |
| Animations | Framer Motion 12 |
| Drag-and-drop | @dnd-kit/core + sortable |
| Icons | Lucide React |
| IDs | nanoid |
| Tests | Vitest + Testing Library |

## Getting Started

```bash
npm install
npm run dev
# open http://localhost:3000
```

```bash
npm test          # run test suite
npm run build     # production build
```

## Architecture

### Query Tree

The core data structure is a recursive tree of two node types:

```
QueryTree
└── root: QueryGroup
      ├── operator: 'AND' | 'OR'
      └── children: QueryNode[]
            ├── QueryRule  { field, operator, value }
            └── QueryGroup { operator, children[], collapsed }
```

`QueryGroup` and `QueryRule` are discriminated by `type: 'rule' | 'group'`. The tree can nest arbitrarily deep.

### State Management

All query state lives in a single Zustand store (`src/store/query-store.ts`). Tree mutations use pure recursive helpers — no mutation in place.

The store manages: `tree`, `schema`, `previewMode`, `validationErrors`, `history[]` (max 50, deduped), `presets[]`, `theme`. Both history entries and presets persist `schemaId` so loading them restores the correct schema.

### Query Engine

`src/engine/executor.ts` evaluates a `QueryTree` against an array of plain objects:

- **Empty groups** return `false` (no records) rather than matching everything
- **Groups** reduce children with `&&` (AND) or `||` (OR)
- **Rules** dispatch on `operator` — string, number, date, enum, boolean, regex all handled
- **`between`** accepts a `[a, b]` tuple; tries date parsing first, falls back to numeric comparison

### Query Generators

| Export | Output |
|---|---|
| `generateSQL` | `WHERE (field = 'val' AND ...)` |
| `generateMongo` | `{ $and: [{ field: { $eq: 'val' } }] }` |
| `generateGraphQL` | Prisma-style `where: { AND: [{ field: { equals: "val" } }] }` |

### Component Structure

```
src/
├── app/
│   ├── layout.tsx            fonts, theme init script, CSS vars
│   ├── page.tsx              landing page (always dark, CSS var tokens)
│   ├── builder/page.tsx      query builder shell
│   └── icon.tsx              dynamic favicon
├── components/
│   ├── builder/
│   │   ├── Toolbar.tsx       header: schema tabs, actions, mobile hamburger drawer
│   │   ├── QueryBuilder.tsx  root mount, mobile tab layout
│   │   ├── QueryGroup.tsx    recursive group renderer + DnD context
│   │   ├── QueryRule.tsx     single rule row (field / operator / value)
│   │   ├── Sidebar.tsx       desktop sidebar: history + presets + theme toggle
│   │   ├── HistoryPanel.tsx
│   │   └── PresetsPanel.tsx
│   ├── preview/
│   │   └── QueryPreview.tsx  syntax-highlighted preview, mode toggle (SQL/Mongo/GQL)
│   ├── simulator/
│   │   └── ResultsPanel.tsx  execute, sort, paginate results table
│   └── ui/
│       ├── Card.tsx          Card / CardHeader / CardBody
│       ├── Chip.tsx          ChipSelect (portal dropdown), ChipInput
│       ├── Button.tsx        variant=primary|accent|icon|danger
│       ├── Badge.tsx         variant=accent|muted|depth
│       ├── Icon.tsx          lucide icon wrapper
│       ├── FiltroLogo.tsx    FILTRO wordmark component
│       ├── ConnectorLine.tsx AND/OR label between rules
│       └── Animated.tsx      AnimatedItem, AnimatedCollapse, StaggeredRow, OperatorToggle
├── engine/
│   └── executor.ts           in-memory query evaluation
├── hooks/
│   ├── useIsMobile.ts        768px breakpoint resize listener
│   ├── useAnimation.ts       shared Framer Motion transition tokens
│   ├── useHover.ts           hover state hook
│   └── useKeyboardShortcuts.ts
├── store/
│   └── query-store.ts        Zustand store (single source of truth)
├── types/
│   ├── query.ts              QueryTree, QueryGroup, QueryRule, operators, schema types
│   └── schema.ts             USERS_SCHEMA, ORDERS_SCHEMA, PRODUCTS_SCHEMA
├── utils/
│   ├── query-generator.ts    SQL / MongoDB / GraphQL output
│   ├── validator.ts          tree validation including reversed between ranges
│   ├── operators.ts          operator label maps and type guards per field type
│   ├── sanitize.ts           import validation + size guard (512 KB max)
│   └── ids.ts                nanoid wrapper
└── schemas/
    └── mock-data.ts          50 users, 30 orders, 25 products
```

### Theming

CSS custom properties on `:root` (light) and `.dark` (dark). Key design tokens:

| Token | Purpose |
|---|---|
| `--bg` / `--surface` / `--bg-secondary` | layered backgrounds |
| `--card-header-bg` / `--card-header-text` | card header — always dark bg, light text |
| `--accent` / `--accent-text` | primary action color (lime `#c8ff00`) |
| `--preview-bg` / `--preview-text` | code preview — always dark |
| `--syntax-keyword` / `--syntax-value` / `--syntax-operator` | syntax highlighting — mint in light, neon in dark |
| `--table-header-bg` / `--table-header-text` | results table header |
| `--border` / `--border-strong` | subtle / prominent dividers |
| `--text-primary` / `--text-secondary` / `--text-muted` | typography hierarchy |

### Mobile

`useIsMobile` (768px breakpoint) drives two distinct layouts:

- **Desktop**: 56px sidebar icon rail (history, presets, theme) + toolbar with schema tabs
- **Mobile**: sidebar hidden; toolbar shows FILTRO wordmark + theme toggle (top row) and hamburger + action buttons (bottom row); builder/preview/results switch via tabs

The hamburger drawer contains the schema selector (2-column grid), and History / Presets as navigable sub-panels.

## Testing

```bash
npm test
```

| Suite | What is tested |
|---|---|
| `executor.test.ts` | AND/OR evaluation, all operator types, nested groups, empty group returns false |
| `operators.test.ts` | operator label lookup per field type |
| `query-generator.test.ts` | SQL, MongoDB, GraphQL output |
| `validator.test.ts` | empty field, missing value, reversed between range detection |

## Schemas

| Schema | Records | Key Fields |
|---|---|---|
| **Users** | 50 | id, name, email, age, country, status, verified, createdAt, purchases |
| **Orders** | 30 | id, customerId, total, status, quantity, region, priority, createdAt |
| **Products** | 25 | id, name, price, category, inStock, rating, createdAt |

## Sample Complex Queries

| Query | Expected results |
|---|---|
| `status = active AND purchases > 15 AND verified = true` | 15+ users (triggers pagination) |
| `age between 25 35 AND country contains Nigeria` | Amara, Chioma, Emmanuel, Seun, Tolu |
| `category in [electronics, books] AND price < 100 AND inStock = true` | Multiple products |
| `total > 1000 AND status in [delivered, shipped] AND priority = true` | High-value priority orders |
| `createdAt before 2024-01-01 AND purchases > 20` | Power users from 2023 |
