export default function AboutHeader() {
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
    <div className="space-y-4 animate-in slide-in-from-left duration-700">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
        <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent">
          About ZotNFound
        </span>
      </h1>
      <p className="text-lg text-muted-foreground">
        Helping UCI students locate and recover lost belongings faster with a
        map-first experience, smart subscriptions, and community support.
      </p>
      <div className="flex gap-4">
        <a
          href="/"
          className="inline-flex items-center rounded-lg bg-primary text-primary-foreground px-4 py-2 hover:opacity-90 animate-smooth"
        >
          Get Started
        </a>
        <a
          href="#explore"
          className="inline-flex items-center rounded-lg bg-secondary text-secondary-foreground px-4 py-2 hover:opacity-90 animate-smooth"
        >
          Explore Features
        </a>
      </div>
    </div>
  
    {/* Replaced screenshot with CSS-only placeholder (no image asset) */}
    <div className="relative rounded-xl overflow-hidden border border-border animate-in slide-in-from-right duration-700">
      <div className="aspect-[3/2] w-full bg-gradient-to-br from-neutral-800 via-neutral-900 to-black" />
    </div>
  </div>
}
