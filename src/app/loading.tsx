function LoadingCard({ delayMs }: { delayMs: number }) {
  return (
    <article
      className="rounded-xl border border-white/5 bg-black/40 p-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-backwards"
      style={{ animationDelay: `${delayMs}ms` }}
      aria-hidden="true"
    >
      <div className="h-48 w-full rounded-lg bg-white/6" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="mt-2 h-4 w-24 rounded bg-white/6" />
        </div>
        <div className="h-4 w-20 rounded bg-white/6" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-white/6" />
        <div className="h-4 w-5/6 rounded bg-white/6" />
      </div>
      <div className="mt-5 flex justify-end">
        <div className="h-10 w-28 rounded-md bg-white/10" />
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <div className="home-shell flex h-[90vh] w-full flex-col items-center px-3 py-3 sm:px-4 lg:px-6">
      <main className="home-shell-main flex h-[90vh] w-full flex-col gap-4 lg:flex-row">
        <section
          aria-labelledby="loading-map-title"
          className="home-shell-pane relative h-[55vh] w-full overflow-hidden border border-white/5 bg-black/70 lg:h-full lg:flex-1"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_20%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.06),transparent_18%),radial-gradient(circle_at_55%_70%,rgba(255,255,255,0.05),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]" />
          <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6">
            <div className="max-w-lg space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
                Live Lost And Found Map
              </p>
              <h1
                id="loading-map-title"
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
              >
                Browse recent lost-and-found reports around UC Irvine.
              </h1>
              <p className="max-w-md text-sm leading-6 text-white/70">
                ZotNFound is loading the latest item posts, map markers, and
                recovery details so you can search, report, and reconnect items
                quickly.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="loading-list-title"
          className="home-shell-pane h-[40vh] w-full overflow-hidden border-r border-white/5 bg-black/80 p-4 backdrop-blur-xl lg:h-full lg:w-105 xl:w-105"
        >
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-white/55">
              Latest Reports
            </p>
            <h2
              id="loading-list-title"
              className="mt-2 text-lg font-semibold text-white"
            >
              Loading item cards and recovery actions.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Recent reports stay visible here with item details, status, and
              quick actions for people who found or lost something.
            </p>
          </div>

          <div className="space-y-4 overflow-hidden">
            <LoadingCard delayMs={0} />
            <LoadingCard delayMs={75} />
          </div>
        </section>
      </main>
    </div>
  );
}
