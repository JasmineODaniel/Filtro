# Filtro

A visual query builder for constructing complex, nested filter conditions — with live SQL, MongoDB, and GraphQL preview, mock data execution, and animated UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-5-FF6B35)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF)

## Features

- **Visual query builder** — add, remove, reorder (drag-and-drop) rules and nested groups
- **AND / OR logic** — toggle per-group, with inline connector labels between conditions
- **Field-aware operators** — operators adapt to field type (string, number, date, enum, boolean)
- **Live preview** — SQL `WHERE`, MongoDB aggregation, and GraphQL `where` generated in real time
- **Mock execution** — run queries against realistic in-memory datasets and paginate results
- **Query history** — every run is snapshotted; browse and restore past states
- **Presets** — save named queries, load or delete them from the sidebar
- **Import / Export** — queries round-trip as validated JSON
- **Keyboard shortcuts** — `Ctrl+Enter` run, `Ctrl+S` save preset, `Ctrl+R` reset, `Ctrl+E` export, `Ctrl+I` import
- **Dark / light theme** — CSS custom properties; toggle persisted to localStorage
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

### Recursive Rendering

`QueryGroup` renders itself recursively — each child that is a group mounts another `QueryGroupComponent` with `depth + 1`. Depth drives the color accent on the left border and connector lines. `React.memo` prevents subtree re-renders when siblings change.

```
<QueryGroupComponent depth={0}>        ← root (accent: charcoal)
  <QueryRuleComponent />
  <QueryGroupComponent depth={1}>      ← nested (accent: blue)
    <QueryRuleComponent />
    <QueryRuleComponent />
  </QueryGroupComponent>
</QueryGroupComponent>
```

### State Management

All query state lives in a single Zustand store (`src/store/query-store.ts`). Tree mutations use pure recursive helpers that return new objects — no mutation in place:

| Helper | What it does |
|---|---|
| `updateNodeInGroup` | DFS-walks the tree and replaces the matching node |
| `removeNodeFromGroup` | Filters the matching id out at any depth |
| `addNodeToGroup` | Appends a child node to the matching parent group |
| `reorderInGroup` | Swaps two indices inside the matching group |

The store also manages: `schema`, `previewMode`, `validationErrors`, `history[]`, `presets[]`, `theme`.

### Query Engine

`src/engine/executor.ts` evaluates a `QueryTree` against an array of plain objects. It mirrors the builder's operator set exactly:

- **Groups**: recursively evaluate children, then reduce with `&&` (AND) or `||` (OR)
- **Rules**: dispatch on `operator` — string ops use `includes`/`startsWith`/`endsWith`/`RegExp`; number ops use arithmetic comparison; date ops compare ISO strings; `between` splits a `value` string on `','`

### Query Generators

`src/utils/query-generator.ts` exposes three format generators, all derived from the same `QueryTree`:

| Export | Output format |
|---|---|
| `generateSQL` | `WHERE (field = 'val' AND ...)` |
| `generateMongoDB` | `{ $and: [{ field: { $eq: 'val' } }, ...] }` |
| `generateGraphQL` | Prisma-style `where: { AND: [{ field: { equals: "val" } }] }` |

Each is a recursive function over `QueryNode`; base case is a `QueryRule`, recursive case wraps children in the appropriate AND/OR construct.

### Component Structure

```
src/
├── app/
│   ├── layout.tsx          theme provider, CSS vars, keyboard shortcuts
│   └── page.tsx            three-column shell (sidebar | builder | preview+results)
├── components/
│   ├── builder/
│   │   ├── Toolbar.tsx     header: schema tabs, reset/export/import/save, run
│   │   ├── QueryBuilder.tsx root group mount + sidebar toggle
│   │   ├── QueryGroup.tsx  recursive group renderer + DnD context
│   │   ├── QueryRule.tsx   single rule row (field / operator / value chips)
│   │   ├── Sidebar.tsx     history + presets panel
│   │   ├── HistoryPanel.tsx
│   │   └── PresetsPanel.tsx
│   ├── preview/
│   │   └── QueryPreview.tsx  syntax-highlighted code preview, mode toggle
│   ├── simulator/
│   │   └── ResultsPanel.tsx  execute, paginate, sort results table
│   └── ui/
│       ├── Card.tsx         Card / CardHeader / CardBody
│       ├── Chip.tsx         ChipSelect (portal dropdown), ChipInput
│       ├── Button.tsx       variant=primary|accent|icon|danger
│       ├── Badge.tsx        variant=accent|muted|depth
│       ├── Icon.tsx         lucide icon wrapper
│       ├── ConnectorLine.tsx AND/OR label between rules
│       └── Animated.tsx     AnimatedItem, AnimatedCollapse, StaggeredRow, OperatorToggle
├── engine/
│   └── executor.ts         in-memory query evaluation
├── store/
│   └── query-store.ts      Zustand store (single source of truth)
├── types/
│   ├── query.ts            QueryTree, QueryGroup, QueryRule, operators, ...
│   └── schema.ts           Schema definitions (Users, Orders, Products)
├── utils/
│   ├── query-generator.ts  SQL / MongoDB / GraphQL output
│   ├── validator.ts        tree validation (empty fields, missing values)
│   ├── operators.ts        operator label maps per field type
│   ├── sanitize.ts         import validation + size guard
│   └── ids.ts              nanoid wrapper
└── schemas/
    └── mock-data.ts        realistic mock datasets for each schema
```

### Animation System

Animations use shared variants from `src/hooks/useAnimation.ts` and components in `src/components/ui/Animated.tsx`:

- `AnimatedItem` — wraps any element with a named variant (`fadeIn`, `slideDown`, `scaleIn`)
- `AnimatedCollapse` — height-based collapse using `AnimatePresence` + `initial/animate/exit`
- `StaggeredRow` — table rows that fan in sequentially via `staggerChildren`
- `OperatorToggle` — AND/OR pill with layout animation on label swap

Transition tokens (`smooth`, `snappy`, `bouncy`) are defined once and shared everywhere.

### Custom Dropdown (ChipSelect)

Native `<select>` can't be styled and gets clipped by `overflow: hidden` on Card. `ChipSelect` replaces it with:

1. A styled button trigger that reads `<option>` children at render time
2. A portal dropdown (`createPortal → document.body`) positioned with `getBoundingClientRect` + `position: fixed`
3. Auto-flip: if not enough viewport below the trigger, the list opens upward
4. Click-outside and Escape key close it; SSR-safe via `useState(false)` mount guard

### Theming

CSS custom properties on `:root` (light) and `.dark` (dark). Key tokens:

| Token | Purpose |
|---|---|
| `--bg` / `--surface` / `--bg-secondary` | layered backgrounds |
| `--card-header-bg` | card header — darker than surface in both modes |
| `--accent` / `--accent-text` | primary action color (lime green) |
| `--border` / `--border-strong` | subtle / prominent dividers |
| `--text-primary` / `--text-muted` | typography hierarchy |
| `--destructive` / `--destructive-bg` | error + danger states |
| `--shadow` / `--shadow-md` / `--shadow-lg` | elevation |

## Testing

```bash
npm test
```

Four test suites covering the pure-logic layers:

| Suite | What is tested |
|---|---|
| `executor.test.ts` | AND/OR evaluation, all operator types, nested groups |
| `operators.test.ts` | operator label lookup per field type |
| `query-generator.test.ts` | SQL, MongoDB, GraphQL output for rules and groups |
| `validator.test.ts` | empty field, empty operator, missing value detection |

## Schemas

Three built-in schemas, switchable from the toolbar:

| Schema | Fields |
|---|---|
| **Users** | id, name, email, age, status, verified, createdAt |
| **Orders** | id, userId, amount, status, product, quantity, createdAt |
| **Products** | id, name, category, price, stock, active, updatedAt |

Each schema has a corresponding mock dataset in `src/schemas/mock-data.ts`.

## Project Status

Built as a submission project. All features complete and TypeScript-clean (`tsc --noEmit` passes).
