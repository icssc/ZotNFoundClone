# Performance Change Explanation

This document explains what changed, why it changed, and how it affected speed, rendering mode, and perceived bundle/runtime cost.

## Goals of This Refactor

- Make first paint faster.
- Avoid root-level blocking work.
- Reduce hydration flicker.
- Keep cache behavior simple and predictable.
- Keep only required `Suspense` boundaries.

## What Was Changed

### 1) Root auth/session composition was simplified

- Removed the dedicated `SessionProvider` wrapper file.
- Root layout now uses `Providers` directly.
- Session is resolved client-side in `ContextProvider` with `authClient.getSession()` after hydration.

Why:

- Server-side session calls at root can force request-time rendering and delay initial HTML.
- Client-side session resolution preserves a fast static shell.

### 2) Auth UI now waits for hydration

- Added `isUserHydrated` state in `ContextProvider`.
- Navbar hides Sign In/Sign Out until hydration completes.
- Shows a pulsing placeholder instead of flashing between auth states.

Why:

- Prevents hydration flicker and auth-button state jumps.

### 3) Suspense boundaries were minimized but kept where required

Kept:

- `Suspense` around `PostHogPageView` in layout.
- `Suspense` around `ItemDisplayList` on home.
- `Suspense` around async settings content in `/settings`.

Removed:

- Extra page-level `Suspense` around `LazyMap` section (not needed, `dynamic(..., { ssr: false, loading })` already handles client loading).

Why:

- With `cacheComponents`, Next.js requires some dynamic reads to be under `Suspense`.
- Removing all Suspense around `ItemDisplayList` caused a build error (`blocking-route`) because it uses navigation/search param APIs.

### 4) Cache strategy was reduced to minimal behavior

- `getAllItems()` keeps `"use cache"` only.
- Removed explicit `cacheLife(...)`.
- Removed `cacheTag(...)`.
- Item mutations use `revalidatePath("/")` (create/edit/delete/update).

Why:

- This is the smallest setup that still keeps homepage fresh after writes.
- Matches the request to avoid extra cache complexity.

### 5) CSS animation stability tweaks

- Added animation stabilization hints in global CSS:
  - `animation-fill-mode: both`
  - `backface-visibility: hidden`
  - GPU/compositor hints for animated shell elements
- Reduced over-broad transition usage on homepage wrappers.

Why:

- Lowers repaint artifacts and dithering during hydration.

## Why `/` Is Static Instead of PPR

Homepage (`/`) is static because:

- It is cacheable (`"use cache"`).
- It does not perform request-time server APIs like `headers()` at root render.
- Dynamic client concerns are isolated under required `Suspense`.

Build output reflects this as:

- `/` => `○ Static`

## Why `/settings` Is PPR

`/settings` is partial prerender because:

- It loads user-specific async data (`findPhoneNumber`).
- That async section is wrapped in `Suspense`, so static shell can stream dynamic content.

Build output reflects this as:

- `/settings` => `◐ Partial Prerender`

## Why It Feels Faster and "Smaller"

Even without a formal bundle analyzer comparison, runtime cost dropped because:

- Root server session blocking was removed.
- Redundant provider layer was removed.
- Auth-guess/cookie machinery was removed.
- Unnecessary Suspense wrappers were removed.
- Hydration state transitions were simplified.

This reduces:

- work before first meaningful HTML,
- hydration churn,
- unnecessary UI state corrections.

## Important Build Constraints Learned

1. With `cacheComponents`, dynamic reads can require `Suspense` to avoid build-time blocking-route errors.
2. `revalidate` route segment config conflicts with `cacheComponents`.
3. If using `revalidateTag` in this Next version, it requires a second argument/profile.
4. Simpler invalidation (`revalidatePath("/")`) is often enough if your freshness scope is homepage-only.

## Net Result

- Build passes.
- `/` is static and faster to first paint.
- `/settings` remains PPR for personalized data.
- Auth button flicker is controlled by hydration gating.
- Cache behavior is simple and minimal.
