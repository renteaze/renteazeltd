import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Hello World" },
      { name: "description", content: "A minimal Hello World hero section." },
    ],
  }),
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.18 264) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200) 0%, transparent 70%)" }}
      />

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Welcome to the web
        </span>

        <h1 className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl md:text-8xl lg:text-9xl">
          Hello, World.
        </h1>

        <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          A simple greeting. The start of something new.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#get-started"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Get started
          </a>
          <a
            href="#learn-more"
            className="inline-flex items-center justify-center rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground backdrop-blur transition-colors hover:bg-accent"
          >
            Learn more
          </a>
        </div>
      </section>
    </main>
  );
}
