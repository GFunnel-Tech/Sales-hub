## What's already done
The 7 phase cards on `/sales-process` are now compact "Step 1 … Step 7" pills with a hover popover showing the phase title and subtitle. Current step is highlighted, completed steps show a check.

## What's next: full admin script editor

Goal: let an admin edit every part of the 7 phases (title, subtitle, hints/tips, common objections, and the script blocks/capture fields) at any time, with changes reflected live on `/sales-process`.

### 1. Database
New table `sales_phases` storing one row per phase:
- `phase_key` (text, unique) — e.g. `handshake_authority`
- `sort_order` (int) — controls Step 1…7 ordering
- `title`, `subtitle` (text)
- `script_blocks` (jsonb) — array of speech/instruction/question/action/capture blocks
- `fields` (jsonb) — capture field configs
- `hints` (jsonb) — `{ dos, donts, listenFor, commonMistake, powerMove }`
- `objections` (jsonb) — array of `{ trigger, response }` for the side-panel objection tracker
- `is_active` (bool)
- `org_id` (uuid, nullable) — multi-tenant ready

RLS:
- Anyone can `SELECT` active phases (members use Open Access)
- Only admins can `INSERT/UPDATE/DELETE` (`has_role(auth.uid(), 'admin')`)

Seed the table from the existing `src/lib/salesScriptContent.ts` so nothing changes visually on first load.

### 2. Read path (member-facing)
- New hook `useSalesPhases()` — fetches active phases ordered by `sort_order`.
- `SalesProcess.tsx` switches from importing `PHASE_ORDER` / `getPhaseByIndex` to using the hook. Keeps the static file as a fallback if the fetch fails.

### 3. Admin editor (`/admin/sales-phases`)
New page added behind `<AdminRoute>` and linked from the existing admin nav:
- Left rail: list of the 7 phases (drag to reorder updates `sort_order`)
- Right pane tabs:
  - **Overview** — title, subtitle, active toggle
  - **Script blocks** — add / reorder / delete blocks; per-block type, content, highlight, capture field config
  - **Capture fields** — id, label, type, placeholder, options, required
  - **Hints & tips** — dos, don'ts, listen-for, common mistake, power move
  - **Objections** — trigger + response pairs
- "Save" writes to `sales_phases`; "Reset to defaults" reseeds from the static file.

### 4. Cleanup
- `salesScriptContent.ts` becomes the seed source only; runtime reads from DB.
- Add a small admin nav link "Sales Phases" alongside the existing Scripts editor.

### Notes for the user (non-technical)
- After this ships, you can change any wording, add or remove a step, tweak hints, or add new objection responses without a developer.
- Edits go live for everyone immediately on the next page load.
- A "Reset to defaults" button restores the original 7-phase script if needed.

Approve and I'll run the migration and build the editor.