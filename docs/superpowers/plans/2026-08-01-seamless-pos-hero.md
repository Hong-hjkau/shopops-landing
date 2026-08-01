# Seamless POS Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the framed POS logo image with one continuous responsive black-and-orange Hero scene while keeping all three languages as live website text.

**Architecture:** Keep `PosHero` as the single shared Hero component used by the homepage and `/pos`. Add one generated 16:9 bitmap asset, render it as a decorative responsive image on mobile and as an absolute full-section visual on desktop, and layer the existing semantic copy over the quiet right side. No new dependency or shared abstraction is needed.

**Tech Stack:** Next.js 16, React 19, `next/image`, Tailwind CSS 4, Node test runner, in-app browser visual QA.

## Global Constraints

- Store the new artwork as `public/pos-hero-wide.png`; keep `public/logo.png` unchanged.
- Do not bake text into the image. English, Traditional Chinese and Simplified Chinese remain live HTML from `PosSharedContent["hero"]`.
- Update only the shared `PosHero` used by the homepage and `/pos`.
- Do not alter the sticky header logo, Open Graph artwork, Rota hero, blog header, approved POS wording, trial terms, pricing facts or language switching.
- Desktop shows the complete logo on the left with copy on the right; mobile shows artwork above copy in one continuous black Hero section.
- Keep the global `--color-hero-bg: #0A0A0B` token unchanged; any pure-black match is local to `PosHero`.
- Preserve semantic heading order, CTA focus behaviour and readable contrast.
- Do not push or deploy until HONG has visually approved the local preview.

---

### Task 1: Add a contract for the responsive Hero

**Files:**
- Modify: `tests/pos-content.test.mjs`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**
- Consumes: existing `components/PosHero.tsx` source file.
- Produces: a source-level contract requiring `/pos-hero-wide.png`, decorative image semantics, responsive desktop/mobile layout markers, and the existing live-copy bindings.

- [ ] **Step 1: Add the failing Hero contract test**

Add this test beside the existing homepage/POS composition tests:

```js
test("shared POS hero uses one seamless responsive artwork with live copy", () => {
  const hero = readFileSync(
    new URL("../components/PosHero.tsx", import.meta.url),
    "utf8",
  );

  assert.match(hero, /src="\/pos-hero-wide\.png"/);
  assert.match(hero, /alt=""/);
  assert.match(hero, /aria-hidden="true"/);
  assert.match(hero, /sm:absolute/);
  assert.match(hero, /sm:grid-cols-2/);
  assert.match(hero, /copy\.eyebrow/);
  assert.match(hero, /copy\.title/);
  assert.match(hero, /copy\.subtitle/);
  assert.match(hero, /copy\.cta/);
  assert.match(hero, /copy\.reassurance/);
  assert.doesNotMatch(hero, /src="\/logo\.png"/);
});
```

- [ ] **Step 2: Run the focused test and verify the red state**

Run: `node --test --test-name-pattern="shared POS hero uses one seamless responsive artwork" tests/pos-content.test.mjs`

Expected: FAIL because `PosHero` still references `/logo.png` and has no full-section responsive artwork.

- [ ] **Step 3: Commit the red contract**

Run:

```bash
git add tests/pos-content.test.mjs
git commit -m "test: define seamless POS hero contract"
```

---

### Task 2: Install the generated artwork and implement the Hero

**Files:**
- Create: `public/pos-hero-wide.png`
- Modify: `components/PosHero.tsx`
- Test: `tests/pos-content.test.mjs`

**Interfaces:**
- Consumes: `PosSharedContent["hero"]`, generated source `/Users/hong/.codex/generated_images/019fa51a-fff0-74e0-b2fd-72e13d7dbc11/exec-0d84f6f5-fe50-4516-b5e4-81e958ee45da.png`.
- Produces: the unchanged `PosHero({ copy }: { copy: PosSharedContent["hero"] })` component interface and the new public asset URL `/pos-hero-wide.png`.

- [ ] **Step 1: Copy the approved generated image into the project without replacing the legacy logo**

Run:

```bash
cp /Users/hong/.codex/generated_images/019fa51a-fff0-74e0-b2fd-72e13d7dbc11/exec-0d84f6f5-fe50-4516-b5e4-81e958ee45da.png public/pos-hero-wide.png
sips -g pixelWidth -g pixelHeight -g hasAlpha public/pos-hero-wide.png public/logo.png
```

Expected: `pos-hero-wide.png` is 1672×941; `logo.png` remains present and unchanged.

- [ ] **Step 2: Replace only the internal `PosHero` layout**

Implement this structure while preserving the existing copy and CTA classes:

```tsx
<section id="top" className="relative overflow-hidden bg-black">
  <div aria-hidden="true" className="relative aspect-[16/9] w-full sm:absolute sm:inset-0 sm:aspect-auto">
    <Image
      src="/pos-hero-wide.png"
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover object-left sm:object-center"
    />
  </div>
  <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-l from-black/70 via-black/25 to-transparent sm:block" />
  <div className="relative mx-auto grid max-w-6xl px-4 pb-14 sm:min-h-[34rem] sm:grid-cols-2 sm:items-center sm:px-6 sm:py-20">
    <div aria-hidden="true" className="hidden sm:block" />
    <div className="max-w-xl pt-8 sm:pt-0">
      <p className="text-sm font-semibold tracking-wide text-accent">{copy.eyebrow}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-hero-text sm:text-5xl">
        {copy.title}
      </h1>
      <p className="mt-5 text-lg leading-8 text-hero-text-secondary">{copy.subtitle}</p>
      <a
        href="#contact"
        className="glow-accent mt-8 inline-flex rounded-xl bg-accent px-5 py-3 font-bold text-on-accent transition hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-hero-bg"
      >
        {copy.cta}
      </a>
      <p className="mt-4 text-sm leading-6 text-hero-text-secondary">{copy.reassurance}</p>
    </div>
  </div>
</section>
```

Do not create a second mobile asset or change `CompanyHome.tsx`/`PosLanding.tsx`; both already consume the shared component.

- [ ] **Step 3: Run the focused contract and content suite**

Run:

```bash
node --test --test-name-pattern="shared POS hero uses one seamless responsive artwork" tests/pos-content.test.mjs
npm run test:content
```

Expected: focused test PASS; full content suite PASS with 0 failures.

- [ ] **Step 4: Run static checks**

Run:

```bash
npm run lint
npx tsc --noEmit
npm run contrast
git diff --check
```

Expected: every command exits 0; contrast output reports all colour pairs passing.

- [ ] **Step 5: Review and commit the implementation**

Run the project review gate read-only. Resolve findings until no actionable issue remains, then re-check git race state and commit only these files:

```bash
git add public/pos-hero-wide.png components/PosHero.tsx
git commit -m "feat: add seamless POS hero artwork"
```

---

### Task 3: Verify the real rendered experience

**Files:**
- Modify only if browser evidence exposes a scoped layout defect: `components/PosHero.tsx`
- Verify: `/`, `/pos`, `public/pos-hero-wide.png`

**Interfaces:**
- Consumes: the rendered `PosHero` from Task 2 and the existing EN/繁/简 language controls.
- Produces: desktop/mobile evidence that the same Hero works on both routes in all three languages.

- [ ] **Step 1: Start a local preview**

Run: `npm run dev -- --port 3115`

Expected: server reports ready at `http://localhost:3115`.

- [ ] **Step 2: Check the desktop matrix at 1440×900**

Using the in-app browser, inspect `/` and `/pos` in English, Traditional Chinese and Simplified Chinese. For all six states confirm:

- the artwork reaches the Hero edges without a rectangle;
- the full Logo remains visible on the left;
- copy sits on the quiet right side and remains readable;
- heading, paragraph and CTA do not overlap the Logo;
- no horizontal overflow occurs.

- [ ] **Step 3: Check the mobile matrix at 390×844**

For `/` and `/pos` in all three languages confirm:

- the artwork appears above the copy;
- the Logo is prominent and not clipped incorrectly;
- copy does not overlay the Logo;
- the transition into the text area reads as one continuous black Hero;
- no horizontal overflow or text clipping occurs.

- [ ] **Step 4: Make at most one targeted responsive adjustment if evidence requires it**

Limit any fix to `object-position`, Hero height, spacing or gradient opacity inside `PosHero.tsx`. Do not change wording, global colour tokens or other pages. Re-run Steps 2 and 3 after the adjustment.

- [ ] **Step 5: Run the full production verification**

Run: `npm run verify`

Expected: content tests, lint, TypeScript, contrast and Next.js production build all exit 0; all static pages generate successfully.

- [ ] **Step 6: Final read-only review and commit any visual adjustment**

If Step 4 changed the component, run the project review gate read-only, resolve findings, re-run `npm run verify`, re-check git race state, and commit:

```bash
git add components/PosHero.tsx
git commit -m "fix: refine responsive POS hero layout"
```

If Step 4 required no change, do not create an empty commit.

- [ ] **Step 7: Present the local preview for HONG's approval**

Keep the server open and navigate the in-app browser to `http://localhost:3115/#top`. Report the verification evidence and do not push or deploy until HONG explicitly approves.
