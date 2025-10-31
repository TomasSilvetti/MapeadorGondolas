<!-- bc263b05-f675-496c-8317-1e9eb89d8924 6628d164-63ca-4a2f-a6f8-4aa29f38601a -->
# Setup Next.js Project with Dependencies

## 1. Initialize Next.js 14 with TypeScript

- Create new Next.js 14 project using `create-next-app` with TypeScript and App Router
- Configure `tsconfig.json` with strict mode
- Set up basic project structure

## 2. Install and Configure Core Dependencies

- Install Tailwind CSS (likely already included)
- Install and configure Shadcn UI with default theme
- Set up `components.json` for Shadcn
- Install initial Shadcn components (Button, Card, Input, Dialog, Tabs)

## 3. Install State Management and Libraries

- Install Zustand for global state management
- Install Konva.js and react-konva for canvas interactions
- Install PapaParse for CSV parsing
- Install Recharts for data visualization
- Install necessary TypeScript types for all libraries

## 4. Create Project Structure

```
app/
  ├─ page.tsx (home/landing)
  ├─ map/
  ├─ gondola/
  ├─ config/
  └─ reports/
components/
  ├─ ui/ (Shadcn components)
  └─ custom/ (custom components)
stores/
  ├─ products.ts
  ├─ gondolas.ts
  ├─ assignments.ts
  └─ solver-config.ts
utils/
  ├─ csv-parser.ts
  └─ solver-algorithm.ts
types/
  └─ index.ts
```

## 5. Configure Development Tools

- Set up ESLint with Next.js recommended config
- Configure Prettier with formatting rules
- Create `.prettierrc` and `.eslintrc.json`
- Add format and lint scripts to `package.json`

## 6. Deploy to Vercel

- Connect project to Vercel (via CLI or GitHub)
- Configure build settings
- Deploy initial version
- Verify deployment URL works

## Key Files to Create/Modify

- `package.json` - all dependencies
- `tailwind.config.ts` - Tailwind configuration
- `components.json` - Shadcn configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier formatting
- Folder structure as outlined above

### To-dos

- [ ] Initialize Next.js project with TypeScript and App Router
- [ ] Configure Tailwind CSS and Shadcn UI with base components
- [ ] Install Zustand, Konva, PapaParse, and Recharts with types
- [ ] Create folder structure (components, stores, utils, types)
- [ ] Configure ESLint and Prettier
- [ ] Deploy project to Vercel and verify