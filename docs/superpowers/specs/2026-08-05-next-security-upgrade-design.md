# Next.js Security Upgrade Design

**Date:** 2026-08-05  
**Status:** Approved

## Goal

Remove the five current high-severity npm audit findings without using forced upgrades or hiding development dependencies from the audit.

## Approved direction

- Upgrade `next` and `eslint-config-next` together from 16.2.6 to 16.3.0 using a normal npm install.
- Allow npm to refresh compatible transitive packages in `package-lock.json`.
- If `brace-expansion` or `js-yaml` remains vulnerable, update the owning ESLint dependency chain within its declared compatible ranges; use a precise override only if the upstream ranges genuinely block a fixed version and compatibility is verified.
- Do not run `npm audit fix --force`.
- Do not use `npm audit --omit=dev` as the success criterion.
- Do not change application behaviour, UI, content or environment configuration.

## Verification

- `npm audit --json` reports zero vulnerabilities across production and development dependencies.
- `npm ls next eslint-config-next postcss sharp brace-expansion js-yaml` reports no invalid packages.
- `npm run verify` passes, including the Next.js 16.3.0 Turbopack production build.
- Smoke-check the three-language POS page, MDX blog pages, generated OG image routes and contact API boundary.
- Review the lockfile diff for expected dependency-only churn.

