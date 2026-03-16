# Team Workflow Board

A simplified task board built with React.

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Building for production

```bash
npm run build
```

## Running tests

```bash
npm test    
```


## Project structure

```
src/
├── components/ui/     Reusable UI kit (Button, Modal, Select, Toast, etc.)
├── features/tasks/    Everything task-related
│   ├── components/    Board, Card, Column, Filters, Form, Toolbar
│   ├── hooks/         useTasks (CRUD + localStorage), useTaskFilters (URL sync)
│   ├── storage.ts     localStorage read/write
│   ├── migrations.ts  Schema versioning (v1 → v2)
│   ├── validation.ts  Form validation rules
│   ├── helpers.ts     Filter & sort logic
│   └── types.ts       All TypeScript types
├── hooks/             App-level hooks (useBeforeUnloadWarning)
└── styles/            SCSS variables, mixins, globals
```

- **@dnd-kit for drag-and-drop** — lightweight, accessible, works well with React 19.

## Known limitations

- No backend — everything is in localStorage, so data is per-browser.
