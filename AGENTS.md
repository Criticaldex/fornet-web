<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Layout & responsive conventions

- **Viewport meta:** configured in `app/layout.tsx` via `export const viewport: Viewport = {...}` (Next.js 16 API). Never add `<meta name="viewport">` to `<head>`. `viewportFit: "cover"` is set so `env(safe-area-inset-*)` works.
- **Section padding:** use `className="section-pad"` instead of inline `padding: "90px 0"`. It scales: 90→64→48→36px at 900/640/420.
- **Section inner wrapper:** use `className="section-container"` instead of inline `width: "90%", maxWidth: 1500, margin: "auto"`. It uses `clamp(16px, 5%, 100px)` for side padding so margins shrink on small phones.
- **Standardized breakpoints:** `≤900px` (tablet/grid collapse), `≤640px` (phone — hamburger appears, `.header-nav` hidden, inputs forced to 16px), `≤420px` (small phone refinements). Don't introduce 768/560 again.
- **iOS input zoom:** form inputs MUST be `font-size: 16px` at ≤640px. Already enforced for `.contact-form`.
- **Mobile menu:** hamburger lives in `Header.tsx`. Body scroll is locked while open; close on ESC, backdrop click, link click, or `matchMedia("(min-width: 641px)")` match. Link click does `setOpen(false)` then `requestAnimationFrame(scrollIntoView)` — don't skip the RAF or smooth scroll fights the scroll-lock release.
- **Hero `background-attachment: fixed`** is disabled at ≤640px (`scroll`) because iOS Safari janks. Don't re-enable.
- **Aria-labels** must come from `LangContext.tsx` (i18n strings like `nav_menu_open`, `pricing_nodes_decrease`, `carousel_prev`). No hardcoded Spanish strings.
