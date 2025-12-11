## SANKATMOCHAN Crisis Support Web

Responsive Next.js 14 (App Router + TypeScript + Tailwind CSS) rebuild of the original Flutter “SANKATMOCHAN” crisis-support web app. The experience mirrors the Flutter flows while embracing desktop-first layouts and rich micro-interactions.

### Key Features
- Brand faithful theming (primary `#FF7300`, secondary `#0175C2`) with Roboto headings and Inter body copy via `next/font`.
- Sticky header with desktop navigation, mobile drawer, and slide-in profile panel replicating the Flutter bottom sheet (quick links, avatar, contextual tips).
- Rich route parity:
	- `/` hero with background overlay and feature cards linking into NGOs, Social Feed, Ops, Donations, Anonymous reports.
	- `/ngos` funding cards with progress, modal confirmation, and success dialog powered by mock async calls.
	- `/social` filterable intelligence feed with chip filters and responsive media cards.
	- `/ops` orange operations dashboard, quick-action sidebars, and animated command stats.
	- `/donations` tri-state management dashboard with animated view switching.
	- `/sos` pulsing SOS trigger, async feedback modal, and action grid.
	- `/report`, `/anonymous` secure reporting forms with validation, previews, and toasts.
	- `/login`, `/signup`, `/forgot` authentication cards with validation, mock async flows, and navigation links.
- `react-hot-toast`, `headlessui`, `framer-motion`, and `react-countup` supply toasts, modals, transitions, and animated metrics.
- Global Zustand-powered UI store for profile panel and responsive navigation state.
- Mock async layer (`src/utils/mockApi.ts`) to emulate Firebase latency across interactions.

### Project Structure
- `src/app/(site)/*` – App Router routes for each primary surface.
- `src/components` – Layout shell (header, profile panel, auth card) and UI primitives (button, chip, modal, progress bar, feature card).
- `src/data` – Sample datasets for NGOs, social posts, donations, and crime categories.
- `src/stores/ui-store.ts` – Shared UI state (profile panel + mobile nav) managed with Zustand.
- `public/assets` – Placeholder assets (`app_logo.png`, `background_image.png`) mirroring the Flutter bundle. Replace with high-resolution originals when available.

### Commands
- `npm run dev` – Start local development on [http://localhost:3000](http://localhost:3000).
- `npm run build` – Create a production build.
- `npm run start` – Serve the production build.
- `npm run lint` – Lint the project.

### Mock Interactions & Feedback
- Toasts surface validation errors and success events across forms.
- `mockApi` introduces artificial latency to keep interactions feeling realistic.
- Modals (Headless UI) and animated transitions (Framer Motion) provide smooth feedback similar to the Flutter implementation.

### Accessibility & Responsiveness
- Desktop-first layout that gracefully scales down to tablets and mobile (navigation collapses, grids reorder, buttons stay reachable).
- Focus styling adheres to WCAG contrast, and ARIA attributes annotate interactive UI (e.g., modals, profile panel, SOS trigger).

### Next Steps
- Swap placeholder assets in `public/assets` with production imagery from the Flutter bundle.
- Connect to real APIs/Firebase once available by replacing the utilities in `src/utils/mockApi.ts`.
