# CLAUDE.md — Project instructions for the @node42/ui-kit

React + TypeScript UI Kit generated from a Figma design system.
Components: `src/components/<Name>/{<Name>.tsx, <Name>.module.css, <Name>.stories.tsx, index.ts}`.
Tokens: `src/styles/tokens.css` — 3 levels (brand → alias → mapped). **Never invent tokens.** If a needed color/space/type isn't mapped, stop and ask the user which existing token to use.

Storybook is the canonical playground (`npm run storybook` → http://localhost:6006). Build with `npm run build`, typecheck with `npm run typecheck`, lint with `npm run lint`.

---

## Component validation workflow (MANDATORY)

**Trigger:** every time a component under `src/components/` is created or modified, run the loop below **before** declaring the work done or proposing a commit.

The loop is driven by a single front-end agent that iterates against the Figma source until the implementation matches. (Playwright was removed — it was too heavy. Validation is now code-vs-Figma, no browser driver and no pixel diffing.)

### Step 0 — Anchor on Figma
- Read the user's current Figma selection via the Figma Dev Mode MCP: design context, variable definitions, and a reference screenshot.
- If no frame is selected, **stop and ask** which Figma node is the target. Do not guess.

### Step 1 — Front-end expert pass (`subagent_type: claude`, name: `fe-expert`)
- Persona: senior React/TS engineer who knows this repo's conventions (CSS Modules, token usage, CSF stories, `index.ts` re-exports, `src/index.ts` barrel).
- Input: paths to current component files + the Figma context payload (variables, screenshot, layout/spec) collected in Step 0.
- Output: a prioritized diff list — spacing, color tokens, typography, radii, shadows, states (default/hover/focus-visible/active/disabled), props API, a11y attributes. Each item names the Figma value and the code value.
- Sanity-check states and a11y by reading the code and the Storybook stories (`npm run storybook` → http://localhost:6006 to eyeball variants if needed): role, accessible name, keyboard reachability, visible focus ring, contrast on text vs background.

### Step 2 — Apply
- Apply every Figma-grounded item from the diff list.

### Step 3 — Loop
Re-run Steps 0–2 until the agent returns zero diffs.

### Stopping conditions
- Zero diffs → done. Propose a commit.
- Same finding survives 3 iterations → stop and surface it to the user; do not silently give up.
- Figma source unavailable, ambiguous, or no selection → stop and ask.
- A fix would require a new design token → stop and ask the user which existing token to use.

---

## House rules (do not violate)
- One folder per component; always add a `.stories.tsx` covering every variant/state visible in Figma.
- Re-export new components from `src/index.ts`.
- CSS Modules only; class names lowercase-kebab; all values come from `tokens.css`.
- Never add tokens autonomously — ask first.
- Don't cite MCP tool names in user-facing messages (say "reading from the selection", not "calling get_design_context").
- Italian or English in chat: follow the user's last message.
