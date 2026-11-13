import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode, useEffect, useRef, useState } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-muted-foreground text-sm font-semibold tracking-[0.3em] uppercase">
        Page not found
      </p>
      <h1 className="font-display text-8xl">404</h1>
      <p className="text-muted-foreground mt-2 max-w-md text-center text-sm">
        This chapter doesn't exist yet. The story continues back home.
      </p>
      <Link to="/" className="btn-manga bg-primary text-primary-foreground mt-8">
        Return home
      </Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <p className="text-muted-foreground text-sm font-semibold tracking-[0.3em] uppercase">
        Something went wrong
      </p>
      <h1 className="font-display text-7xl">
        This page didn't <span className="text-primary">load</span>
      </h1>
      <p className="text-muted-foreground mt-2 max-w-md text-center text-sm">
        Try again, or head back home.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="btn-manga bg-primary text-primary-foreground"
        >
          Try again
        </button>
        <a href="/" className="btn-manga bg-card text-foreground">
          Go home
        </a>
      </div>
    </div>
  );
}

const NAV = [
  { label: "About", href: "#about" },
  { label: "My Work", href: "#projects" },
  { label: "Blog", href: "#blogs" },
  { label: "Work Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Snigdha Datta — Backend Developer Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Snigdha Datta, a backend developer in Kolkata building real-time systems with Node.js, Kafka, Redis and AWS — told manga-style, chapter by chapter.",
      },
      { name: "author", content: "Snigdha Datta" },
      { property: "og:title", content: "Snigdha Datta — Backend Developer Portfolio" },
      {
        property: "og:description",
        content:
          "Event-driven backends, live streaming engines and full-stack products — the story so far, drawn like a manga.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@Snigdha_Datta7" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const pendingTarget = useRef<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const probe = window.scrollY + 140;
      let current = "";
      for (const item of NAV) {
        const section = document.getElementById(item.href.slice(1));
        const sectionTop = section
          ? section.getBoundingClientRect().top + window.scrollY
          : Infinity;
        if (sectionTop <= probe) current = item.href;
      }
      if (pendingTarget.current) {
        const target = document.getElementById(pendingTarget.current.slice(1));
        if (target && target.getBoundingClientRect().top <= 160) {
          pendingTarget.current = null;
        } else {
          return;
        }
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`bg-background/80 mx-auto flex w-full items-center justify-between gap-2 rounded-full border backdrop-blur-xl transition-[height,box-shadow,border-color] duration-300 md:w-fit md:px-1 ${
          scrolled
            ? "border-foreground/25 h-11 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.4)] sm:h-13 md:h-14"
            : "border-foreground/10 h-14 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] sm:h-15 md:h-16"
        }`}
      >
        <nav
          className="mx-auto flex min-w-0 flex-1 items-center justify-around gap-0 px-0.5 md:flex-none md:justify-start md:gap-1 md:pl-1.5"
          aria-label="Sections"
        >
          {NAV.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => {
                  pendingTarget.current = item.href;
                  setActive(item.href);
                }}
                aria-current={isActive ? "true" : undefined}
                className={`relative whitespace-nowrap rounded-full px-1 py-1 text-[0.76rem] font-semibold tracking-[0em] uppercase transition-colors max-[359px]:px-0.5 max-[359px]:text-[0.62rem] sm:px-1.5 sm:py-1.5 sm:text-[0.8rem] sm:tracking-[0.02em] md:px-3 md:text-[0.7rem] md:tracking-[0.18em] ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`bg-primary absolute inset-x-3 -bottom-0.5 h-[2px] origin-left transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-background text-foreground relative flex min-h-screen flex-col">
        <SiteNav />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  );
}
