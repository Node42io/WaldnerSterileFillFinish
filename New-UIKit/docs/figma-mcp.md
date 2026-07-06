# Connecting the Figma Dev Mode MCP to Claude Code

The **Dev Mode MCP server** is Figma's official integration. It exposes variables, component properties, and code-gen of selected frames directly inside Claude Code.

> Requirement: Figma plan with a Dev/Full seat (Professional, Organization, or Enterprise) and the Figma desktop app installed.

## 1. Enable the MCP server in Figma

1. Open **Figma desktop**
2. Top-left menu → **Preferences**
3. Tick **"Enable Dev Mode MCP server"**
4. Check that the confirmation message appears: the server runs locally on `http://127.0.0.1:3845/sse`

The server stays active as long as Figma desktop is open. It needs to be restarted every session.

## 2. Register it in Claude Code

Run from the terminal, inside the project folder:

```bash
claude mcp add --transport sse figma-dev-mode http://127.0.0.1:3845/sse
```

To make it available across **all** projects, add `--scope user`:

```bash
claude mcp add --scope user --transport sse figma-dev-mode http://127.0.0.1:3845/sse
```

Verify it's registered:

```bash
claude mcp list
```

## 3. Use it

In Claude Code:

1. **Select a frame or a component** in Figma desktop (keep the selection active)
2. Ask Claude something like:
   - "Extract tokens from the selection and update `src/styles/tokens.css`"
   - "Generate the React + CSS Module component for the selected Button following the pattern in `src/components/Button`"
   - "List the variants and properties of the currently selected component"

The model will call the MCP tools (`get_code`, `get_variable_defs`, `get_image`, etc.) on the selected node.

## Security

- The Dev Mode MCP **does not use Personal Access Tokens**: authentication goes through Figma desktop.
- Never commit PATs (tokens that start with `figd_...`) to the repo. If you exposed one, revoke it immediately at [figma.com/settings](https://www.figma.com/settings), "Personal access tokens" section.

## Troubleshooting

- **"connection refused" on `127.0.0.1:3845`** → Figma desktop is closed, or the option is not enabled in Preferences.
- **MCP doesn't show up in Claude Code** → restart Claude Code after `claude mcp add`.
- **The tool doesn't see any selection** → make sure the selection is active in the **same Figma desktop instance**, not in the browser.
