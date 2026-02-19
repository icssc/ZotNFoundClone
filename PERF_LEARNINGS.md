## Performance Learnings (Homepage + OpenNext)

### Rendering and PPR

- With `cacheComponents` enabled, any dynamic hooks like `useSearchParams()` must sit under a `<Suspense>` boundary to avoid PPR build failures.
- Route segment config like `dynamic = "force-dynamic"` is incompatible with `cacheComponents`; use `"use cache"` and `cacheLife` instead.
- Keep client-only analytics (like `PostHogPageView`) under a `Suspense` boundary so it does not block PPR.

### Data and Payload

- Large server payloads on the homepage are the biggest TTFB and RSC weight factor.
- A trimmed DTO for homepage list/map reduces RSC payload without losing UI functionality.
- Fetch full item details on-demand for dialogs to keep the first payload light.

### Caching (ISR-like behavior)

- `cacheLife("days")` provides ISR-like stale-while-revalidate semantics with long-lived cache.
- `cacheTag(...)` + `revalidateTag(tag, "seconds")` makes cache update immediately after writes.
- Keep cache long-lived (days/weeks) when updates are slow and invalidate on write.

### Client JS Deferrals

- Defer large map bundles by gating on intersection/idle and keep a skeleton in place.
- Lazy-load modal/dialog flows so they do not inflate the first chunk.
- Lazy-load analytics initialization and event capture to keep the initial bundle small.

### Auth/Session

- Server session checks can block initial HTML if placed at the root; keep auth UI simple until the client session resolves.
- If server session is required for correctness, accept the tradeoff and keep Suspense only where needed (analytics).

### OpenNext/SST

- Warming the server function (`warm: 1`) helps reduce cold-start p95 without changing app semantics.
- PPR build logs confirm partial prerender; keep dynamic reads isolated behind `Suspense`.

### Build-time Gotchas

- `revalidateTag` requires a profile/config argument with `cacheComponents` enabled.
- Avoid mixing route segment configs that conflict with cache components.
