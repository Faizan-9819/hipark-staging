# Fix: homepage navbar logo stuck black / background wrong on live (Vercel)

You are fixing a production-only hydration bug in this Next.js 16.0.7 + React 19 App Router site. The root cause has already been diagnosed and confirmed against the live site (evidence below). Apply exactly the changes in **The fix**, follow **Do not**, then run **Verify**. Do not commit or push unless asked.

> **Status (2026-10-15):** applied in the working tree (uncommitted). The production build passes, and the hook and the build output were verified (see **Verify**). The final check, live HTML after a regeneration, can only happen after deploying.

---

## Symptoms (live hiparks.com, desktop, homepage `/` only)

| State | Expected | Live |
|---|---|---|
| First load, at top | transparent bg, white logos, no border, 150px | **white bg + grey bottom border, black logos**, 150px |
| Scrolled down | black bg, white logos, 80px | black bg, **black logos**, 80px |
| Scrolled back to top | transparent bg, white logos, 150px | transparent bg, **black logos**, 150px |

The logos stay black for the whole visit. Inside pages are fine, and `npm run dev` on localhost is fine.

The pasted live DOM is self-contradictory. State 2 has `bg-black border-0`, which needs `isTransparentPage === true`. It also has `src="/nav/Horizon_black.svg"`, which needs `isTransparentPage === false`. One render can't produce both, so the DOM is a mix of the server render and the client render.

---

## Root cause

### 1. On the regenerated homepage, `usePathname()` is `"/index"` on the server and `"/"` in the browser

`/` is an ISR page that revalidates every 60 seconds. The build route table shows `○ /  1m  1y`, and `.next/prerender-manifest.json` lists `/` with `initialRevalidateSeconds: 60` and data route `/index.rsc`. Inside pages such as `/know-us` are fully static, with no revalidation.

- **The build-time HTML is correct.** A local `next build` produces `.next/server/app/index.html` with `"c":["",""]`, i.e. `/`.
- **Vercel's ISR regeneration renders the page through its output path, `/index`.** The server-side router state is built from the request URL (`prepareInitialCanonicalUrl(url)` in `node_modules/next/dist/server/app-render/app-render.js`). So in every regenerated copy, `usePathname()` returns `"/index"` during the server render.
- Because the page revalidates every 60 seconds, the cached homepage turns into the broken version within about a minute of each deploy, and stays that way.

Evidence from the live site (`curl https://www.hiparks.com/`):

- Response headers: `X-Matched-Path: /`, `X-Nextjs-Prerender: 1`, `X-Vercel-Cache: HIT`, `X-Nextjs-Stale-Time: 300`, and a low `Age`. This is a cached, regenerated copy.
- The RSC payload embedded in that HTML has `"c":["","index"]`, so the server's canonical URL is `/index`.
- The prerendered TopBarF markup is the **inside-page** variant: `bg-white border-b border-gray-300`, `style="height:80px"`, `src="/nav/Horizon_black.svg"`.
- Inside pages are unaffected. `/know-us` has `"c":["","know-us"]` and `/culture` has `"c":["","culture"]`. Only the root route gets `index`.
- The deployed JS chunk matches local `HEAD` (`250dc97`, which has `atTop` initialised to `true`), so this is **not** a stale deploy.

### 2. Server and client compute different props in `TopBarF`

With `atTop = true` on both sides:

| Prop | Server (`/index`) | Client (`/`) |
|---|---|---|
| className | `bg-white border-b border-gray-300` | `bg-transparent border-0` |
| logo `src` | `Horizon_black.svg`, `blackstone_black.svg` | `Horizon_White.svg`, `blackstone_white.svg` |
| height | 80 | 150 |

### 3. React 19 does not repair attribute mismatches during hydration

React keeps the server's DOM attributes and assumes they already equal the client's props. In production it also logs nothing about it. After hydration, React only writes an attribute when the client-computed value changes between two client renders. That explains every state:

- **className** depends on `atTop`. Nothing changes while you stay at the top, so the server's `bg-white border-b` stays (state 1). The first scroll changes the client value, so React writes `bg-black border-0` (state 2), and later `bg-transparent border-0` (state 3).
- **Logo `src`**: on transparent pages the client value is always `Horizon_White.svg`, whatever `atTop` is. React never sees it change, so it never writes it, and the server's black logo stays for the whole visit. The `key` on each `motion.img` is also constant on the client, so the image never remounts either.
- **height** is driven by framer-motion's `animate`, which writes inline styles itself. That's why it shows 150px correctly even though the server sent 80px.

### 4. Why it showed up now

Commit `250dc97` ("Resources and Media page live", 2026-10-15) changed `const [atTop, setAtTop] = useState(false)` to `useState(true)`. With `atTop = false`, both pathnames produced identical markup (`bg-black`, white logos, 80px), so the pathname mismatch was invisible. The `/index` problem existed before; the `atTop` change only exposed it. **Do not "fix" this by reverting `atTop`** (see **Do not**).

### 5. Why localhost doesn't show it

Nothing local reproduces it. These were all tried on 2026-10-15:

- `next dev` renders each request on demand with the real URL `/`.
- `next build`, then `next start`, still renders `/` with `"c":["",""]`, both at build time and after a local ISR regeneration.
- Locally, requesting `/index` doesn't help either. It falls through to the `[slug]` dynamic route, which looks up a state with the slug "index" in the CMS. Vercel's router is what maps `/index` to the homepage's prerender output.

So the bug only appears on Vercel, after the first regeneration.

---

## Audit: everything that renders on `/` and reads the pathname

The same root cause affects these four files:

| File | What differs between server and client | Visible effect on live |
|---|---|---|
| `components/navbar/topbar/TopBarF.jsx` | `isHomePage` and `isTransparentPage` drive the background class, border, logo `src` and height | The reported bug |
| `components/navbar/mobnav/MobileMenu.jsx` | `isHome` drives `transform: translateY(...)` | Live HTML ships `translateY(0px)` where the client expects `35px`. On first load at the top of `/`, the mobile bar sits at 0 and covers the marquee until the first scroll. |
| `components/global/Footer.jsx` | `pageName` sets the hidden `<input name="Page_name">` | Live HTML ships `value="Index"` instead of `"Home"`. `emailjs.sendForm` reads this field, so homepage footer-form leads may be labelled "Index". |
| `components/home/Newsletter/Newsletter.jsx` | Same `Page_name` field (rendered inside Footer) | Same as Footer, for newsletter sign-ups |

These were checked and are **not** affected. Leave them alone:

- `src/app/ClientWrapper.jsx`: its classes and styles are gated on `mounted`, so nothing pathname-dependent is rendered on the server.
- `src/app/context/PageLoaderProvider.jsx`: the pathname is only an effect dependency.
- `src/app/TransitionLink.jsx`: the pathname is only read inside the click handler, which always runs on the client.
- `src/app/TrackingScripts.jsx`: `/index` and `/` take the same branch.
- `components/global/EnquiryForm/EnquiryForm.jsx` and `components/global/Book-site/Book_SiteForm.jsx`: the form markup only renders after `show` becomes true, so it never goes through SSR.
- `components/global/conversation_form.jsx` and the page-specific forms: not rendered on `/`.
- `TopDropF.jsx`, `SearchInput.jsx`, `HoverDrop.jsx`, the `megamenu/*` files and `icons/*`: they don't read the pathname, and all their `window` access is inside effects.

---

## The fix

Normalize the pathname in one small hook and use it in the four affected components. The server and client then both see `"/"`, the prerendered HTML is the correct homepage variant, and hydration has nothing to repair.

### 1. Create `src/app/hooks/useNormalizedPathname.js`

Follow the convention of the existing `src/app/hooks/useMediaQuery.js`: a named export with no `"use client"` directive. Every caller is already a client component.

```js
import { usePathname } from "next/navigation";

// On Vercel, ISR regeneration renders the homepage through its output path
// "/index", so usePathname() is "/index" on the server but "/" in the browser.
// Anything rendered from it (classNames, img src, inline styles, hidden input
// values) then mismatches during hydration, and React keeps the server value.
export function useNormalizedPathname() {
  const pathname = usePathname();
  return pathname === "/index" ? "/" : pathname;
}
```

### 2. Swap the hook into the four components

Each of these files begins with one or more **commented-out legacy copies** of the component, including `// import { usePathname } ...` lines. **Only edit the active (uncommented) code at the line numbers below. Never edit or uncomment the legacy blocks.**

| File | Active import line | Active call line |
|---|---|---|
| `components/navbar/topbar/TopBarF.jsx` | 221 | 240 |
| `components/navbar/mobnav/MobileMenu.jsx` | 703 | 1169 |
| `components/global/Footer.jsx` | 473 | 515 |
| `components/home/Newsletter/Newsletter.jsx` | 10 | 15 |

In each file:

```diff
-import { usePathname } from "next/navigation";
+import { useNormalizedPathname } from "@/src/app/hooks/useNormalizedPathname";
```

```diff
-  const pathname = usePathname();
+  const pathname = useNormalizedPathname();
```

Before each edit, confirm that `usePathname` isn't used anywhere else in the active code of that file. As of `250dc97`, each file has exactly one active import and one active call. If the line numbers have shifted, find the active code by its first uncommented `"use client";`.

That is the whole change: one new file and four two-line swaps. Keep the variable name `pathname` so the rest of each component is untouched.

---

## Do not

- **Do not revert `atTop` to `useState(false)`.** It hides the desktop symptom but leaves the mobile `translateY` and `Page_name` mismatches in place. It also brings back the height animation on every page load that `250dc97` removed on purpose.
- **Do not add `suppressHydrationWarning`.** It only silences the warning; it doesn't make React repair the attribute.
- **Do not render the navbar client-only** (a `mounted` gate, `dynamic(..., { ssr: false })`, and so on). The header would pop in after hydration, causing a visible flash and layout shift.
- **Do not add `export const dynamic = "force-dynamic"`** (or `revalidate = 0`, `headers()` calls, etc.) to the homepage. It "works" by switching off static prerendering for `/`, which makes every visit slower.
- **Do not add `topBarHeight` to the dependency array of TopBarF's scroll effect.** The effect intentionally subscribes once per pathname, so its "at top" threshold stays fixed (150 on `/`, 80 elsewhere). Adding the dependency would make the threshold flip between 150 and 80 as `atTop` changes, which changes when the bar turns transparent. That's a behavior change outside this fix.
- **Do not change** `isTransparentPage`, the logo selection logic, the `key` props, the framer-motion `initial`/`animate` values, or anything else in these files.
- **Do not upgrade Next.js** as part of this fix. A later release might change the `/index` behavior, but that hasn't been verified, and the hook is correct either way.

---

## Verify

### A. Local production build (a regression check; it can't reproduce the bug, see Root cause §5)

```bash
# On the office network, next/font can't reach Google Fonts through the TLS-intercepting proxy.
# This makes Turbopack trust the Windows certificate store; it doesn't disable verification.
NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build
npx next start -p 3100     # use a port that won't clash with a running dev server
```

> ⚠️ **`next build` creates `tsconfig.json`** (because the repo has `.ts` files: `middleware.ts`, `robots.ts`) and rewrites `next-env.d.ts`. The generated `tsconfig.json` has no `"@/*"` path alias, and it takes precedence over `jsconfig.json`. Every `@/` import then breaks, and a running `next dev` starts returning 500 `Module not found` on every page. **After building locally, always run:** `rm tsconfig.json && git checkout -- next-env.d.ts`. The dev server recovers by itself, without a restart.

Prove the hook's mapping directly. It stubs `usePathname`, imports the real hook file, and expects all PASS:

```bash
node --input-type=module -e '
import fs from "node:fs";
const stub = "data:text/javascript," + encodeURIComponent("export function usePathname(){return globalThis.__p}");
const src = fs.readFileSync("src/app/hooks/useNormalizedPathname.js","utf8").replace("\"next/navigation\"", JSON.stringify(stub));
const { useNormalizedPathname } = await import("data:text/javascript," + encodeURIComponent(src));
for (const [i, w] of Object.entries({"/index":"/","/":"/","/know-us":"/know-us","/index-of-parks":"/index-of-parks","/blog/index":"/blog/index"})) { globalThis.__p = i; const g = useNormalizedPathname(); console.log(g === w ? "PASS" : "FAIL", i, "->", g); }'
```

Then check the server HTML. The build output can be read straight from disk (`.next/server/app/index.html`), or fetched:

```bash
curl -s http://localhost:3100/ -o home.html

# Desktop bar (TopBarF)
node -e "const s=require('fs').readFileSync('home.html','utf8');const i=s.indexOf('z-[100000]');console.log(s.slice(i,i+650))"
#   expect: "... bg-transparent border-0" style="height:150px;..."
#   expect: src="/nav/Horizon_White.svg" and src="/nav/blackstone_white.svg"

# Mobile bar (MobileMenu)
node -e "const s=require('fs').readFileSync('home.html','utf8');const i=s.indexOf('transition-transform duration-300');console.log(s.slice(i,i+140))"
#   expect: transform:translateY(35px)

# Hidden form fields (Footer + Newsletter)
grep -o 'name="Page_name" value="[^"]*"' home.html
#   expect: value="Home" twice
```

Notes:

- `Horizon_black.svg` will still appear elsewhere in `home.html`, and that's fine. `TopDropF` always renders its own black-logo top bar (collapsed to height 0), and React emits `<link rel="preload">` tags for SSR images. Only check the TopBarF snippet above.
- Locally the RSC payload shows `"c":["",""]`. On Vercel, after a regeneration, it shows `"c":["","index"]`, and the navbar markup must still be the transparent variant. That is the real test, and it can only happen in section C.
- Regression check for an inside page: run the same TopBarF snippet against `curl -s http://localhost:3100/know-us`. Expect `bg-white border-b border-gray-300`, `height:80px` and `Horizon_black.svg`, the same as before the fix.
- Stop the local `next start` afterwards. On Windows, killing the shell can leave the `node ... next start -p 3100` process listening; check with `netstat -ano | grep :3100`.

### B. Browser checks (production build or Vercel preview)

Desktop, width ≥ 1024px:

1. **`/`, first load at top:** transparent background, white Horizon and Blackstone logos, no bottom border, 150px tall.
2. **Scroll down past ~150px:** the bar hides. Scroll up a little: it returns with a black background, white logos, 80px tall.
3. **Scroll back to the very top:** transparent, white logos, 150px.
4. **Hard refresh (Ctrl+Shift+R) 3–4 times:** the same result as check 1 every time.
5. **Inside page (e.g. `/know-us/`):** at the top, white background, grey border, black logos. Scrolled, black background, white logos. This should be unchanged from before the fix.
6. **Client-side navigation:** go from `/` to an inside page via the menu, then back to `/` via the Horizon logo. Each page shows its correct variant immediately.
7. **MENU button on `/` and on an inside page:** the dropdown opens and closes as before, and search still opens.

Mobile, width < 1024px:

8. **`/` at the top:** the dark mobile bar sits 35px down, below the orange marquee. After scrolling, it moves to 0. Inside pages: the bar is at 0.

Console on `/`:

9. `[...document.querySelectorAll('input[name=Page_name]')].map(i => i.value)` returns `["Home", "Home"]`.

### C. After deploying to production

This is the only place the actual bug condition exists. Because the broken copy comes from ISR regeneration, **check a regenerated copy, not the first one served after the deploy**:

1. Deploy. Then load `https://www.hiparks.com/` once, wait **more than 60 seconds**, and load it again. The second request triggers a background regeneration.
2. A few seconds later, fetch it a third time and run the section A checks on that HTML. Add `-k` to curl if the office proxy breaks TLS.
3. Expect `"c":["","index"]` in the RSC payload, together with `bg-transparent border-0`, `height:150px`, the white logos, `translateY(35px)` and `Page_name` = `Home`. That combination proves the hook is handling `/index`.
4. Check `https://www.hiparks.com/know-us` as well. It should be unchanged.
5. In a browser, repeat checks B1–B4 and B9 on the live homepage.

---

## Acceptance criteria

- [x] The hook check passes (`/index` → `/`, everything else unchanged), verified 2026-10-15.
- [x] The production build passes, and `.next/server/app/index.html` has the transparent variant, `translateY(35px)` and `Page_name` = `Home`. `/know-us` is unchanged. Verified 2026-10-15.
- [x] The diff touches exactly 5 files: 1 new hook and 4 two-line swaps. No legacy commented code is modified, and no `tsconfig.json` or `next-env.d.ts` change is left behind.
- [ ] Live HTML for `/` **after a regeneration** (`"c":["","index"]`) has the transparent variant: `bg-transparent border-0`, `height:150px`, `Horizon_White.svg`, `blackstone_white.svg`, plus `translateY(35px)` and `Page_name` = `Home`.
- [ ] Live HTML for `/know-us` is unchanged (inside-page variant).
- [ ] All browser checks B1–B9 pass.

---

## Out of scope (noticed during the audit; do not change now)

- `isTransparentPage` in TopBarF includes `"/sustainability"`, but `next.config.mjs` 308-redirects `/sustainability` to `/sustainability-overview`, so that branch never matches. Meanwhile `ClientWrapper` removes the top padding for `/sustainability-overview` (`pathname.startsWith("/sustainability")`), so that page has a full-bleed hero under a white inside-page navbar. If it was meant to get the transparent navbar, that's a separate design decision.
- Other components with `pathname === "/"` checks (contact, culture and campaign forms, `conversation_form`, `PopForm`) aren't rendered on `/` during SSR, so the `/index` quirk doesn't reach them. Switching them to the hook for consistency is optional and not part of this fix.
