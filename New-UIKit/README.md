# Node42 UI Kit

React + TypeScript UI kit generated from the Figma design system.

- Typed React components with CSS Modules
- Design tokens as CSS custom properties (light + dark)
- Storybook published as interactive documentation
- Vite library-mode build (ESM + CJS + d.ts)

## Installation

```bash
npm install @node42/ui-kit
```

`peerDependencies`: `react >= 18`, `react-dom >= 18`.

## Usage

```tsx
import { Button } from "@node42/ui-kit";
import "@node42/ui-kit/styles.css"; // tokens + globals

export function App() {
  return <Button variant="primary">Hello</Button>;
}
```

Tokens are exposed as CSS variables on `:root` (see `src/styles/tokens.css`) and can be overridden by the consumer.

## Development

```bash
npm install
npm run storybook   # interactive docs at http://localhost:6006
npm run build       # build the library into /dist
npm run typecheck
```

## Adding a component

1. Create `src/components/<Name>/<Name>.tsx` and `<Name>.module.css`
2. Export from `src/components/<Name>/index.ts`
3. Re-export from `src/index.ts`
4. Add `<Name>.stories.tsx`

## Color rules (read before touching styles)

1. **Components reference tokens, never hex values.** Inside any `*.module.css`, every color (background, border, text, fill, outline, shadow tint, ...) must be a `var(--mapped-token)` from `src/styles/tokens.css`. No `#hex`, no `rgb(...)`, no named colors. The only colors allowed in a component file are the ones provided by the design system.

2. **To change a component's color, edit the token — not the component.** If a Button looks wrong in production, the fix lives in `tokens.css` (or in Figma, which then propagates to `tokens.css`), not in `Button.module.css`. This keeps light/dark variants in sync, preserves parity with Figma, and avoids one-off colors that drift over time.

3. **Need a color that doesn't exist yet?** Add it as a mapped token in Figma first, re-import it into `tokens.css`, then consume it from the component. Don't shortcut by hardcoding a hex "just for now" — those hexes never get cleaned up.

The only exception is genuinely component-local visual effects that have no design-system equivalent (e.g. a focus ring opacity), and even then prefer composing tokens (`color-mix(in srgb, var(--token), transparent 40%)`) over raw values.

## Icons

The kit uses [Phosphor Icons](https://phosphoricons.com/) (`@phosphor-icons/react`) as the icon library. It's declared as a `peerDependency`, so consumers install it once alongside the kit.

```bash
npm install @phosphor-icons/react
```

**Conventions**

- **Weight**: always `light`. Other weights (regular, bold, fill, etc.) are not used in the design system — keep usage consistent.
- **Default size**: `20`px. Allowed sizes: `16` / `20` / `24` (plus larger sizes when explicitly needed, e.g. empty states or hero illustrations).
- **Color**: Phosphor icons inherit `color` from their parent via `currentColor`. Don't pass a `color` prop hardcoded — wrap the icon in an element whose color is set via an `--icon-*` mapped token. The kit's components that accept icons (e.g. `Button`'s `leftIcon`/`rightIcon`) already do this for you.

**Usage**

```tsx
import { Button } from "@node42/ui-kit";
import { Heart } from "@phosphor-icons/react";

<Button leftIcon={<Heart size={20} weight="light" />}>Like</Button>
```

Standalone icon with a semantic color:

```tsx
import { WarningCircle } from "@phosphor-icons/react";

<span style={{ color: "var(--icon-warning)" }}>
  <WarningCircle size={20} weight="light" />
</span>
```

## Figma workflow (Dev Mode MCP)

This repo is designed to be used together with the **Figma Dev Mode MCP** in Claude Code. Once connected, you can ask the model to:

- Extract Figma tokens and update `tokens.css`
- Generate the scaffold of a component from a selected frame
- Keep variant/property names aligned between Figma and code

See `docs/figma-mcp.md` for setup.

## Viewing Storybook

The repo is private and GitHub Pages is not enabled. To browse the interactive docs, each developer clones the repo and runs Storybook locally:

```bash
git clone https://github.com/annalisarusconi/ui-kit.git
cd ui-kit
npm install
npm run storybook
```

It opens at `http://localhost:6006`.

If/when the repo becomes public, re-enabling the `push` trigger in `.github/workflows/storybook.yml` and turning on Pages in Settings is enough to have the docs published online automatically.
