# Next.js Security Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Next.js toolchain and its vulnerable transitive dependencies until the complete npm audit is clean.

**Architecture:** Keep the application code unchanged and perform a narrow dependency-only upgrade. Upgrade the runtime framework and matching ESLint configuration together, inspect the resolved tree, then address only any remaining vulnerable transitive packages.

**Tech Stack:** npm, Next.js 16, React 19, TypeScript, ESLint, MDX, Turbopack

## Global Constraints

- Target `next` 16.3.0 and `eslint-config-next` 16.3.0 together.
- Do not run `npm audit fix --force`.
- Do not hide development dependencies with `npm audit --omit=dev`.
- Do not change application code, UI, content, environment variables or deployment configuration.
- Prefer normal dependency resolution; use a precise npm override only when an upstream declared range blocks a fixed transitive version and tests prove compatibility.
- Success requires zero vulnerabilities in the full `npm audit --json` output.

---

### Task 1: Upgrade and verify the Next.js dependency tree

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: the existing Next.js 16.2.6 / React 19.2.4 application and npm lockfile.
- Produces: a deterministic lockfile with `next` 16.3.0, `eslint-config-next` 16.3.0 and no audited vulnerabilities.

- [ ] **Step 1: Capture the failing security baseline**

Run `npm audit --json` and record that it exits nonzero with exactly five high-severity vulnerable packages: `next`, `postcss`, `sharp`, `brace-expansion`, and `js-yaml`.

- [ ] **Step 2: Perform the narrow direct upgrade**

Run:

```bash
npm install next@16.3.0 eslint-config-next@16.3.0
```

Do not use `--force`. Inspect `git diff -- package.json package-lock.json` before doing anything else.

- [ ] **Step 3: Inspect the resolved dependency tree**

Run:

```bash
npm ls next eslint-config-next postcss sharp brace-expansion js-yaml
npm audit --json
```

If audit is already clean, do not add overrides or update unrelated packages. If only `brace-expansion` or `js-yaml` remains, identify its owning dependency with `npm explain`, update that existing dependency chain within declared ranges, and rerun both commands. Add a precise `overrides` entry only if normal resolution cannot select the fixed version.

- [ ] **Step 4: Run the full verification gate**

Generate ignored Next.js type declarations with `npx next typegen` if the fresh worktree needs them, then run:

```bash
npm run verify
```

Expected: 31 content tests, ESLint, TypeScript, contrast checks and the Next.js 16.3.0 Turbopack build all pass.

- [ ] **Step 5: Smoke-check framework-sensitive surfaces**

Using the production build, verify:

- `/pos?lang=en`, `/pos?lang=zh-Hant`, and `/pos?lang=zh-Hans` render;
- at least one MDX blog page renders;
- `/opengraph-image` and `/pos/opengraph-image` return image responses;
- `/api/contact` retains its existing method/validation boundary without sending a real enquiry.

- [ ] **Step 6: Review dependency-only scope**

Confirm `git diff --name-only` contains only `package.json` and `package-lock.json` apart from this plan/spec documentation. Review all lockfile package changes and record why each changed group is expected from the Next.js or ESLint upgrade.

- [ ] **Step 7: Commit after review**

After the task review has no findings and all verification remains green:

```bash
git add package.json package-lock.json
git commit -m "chore: update Next.js security dependencies"
```

