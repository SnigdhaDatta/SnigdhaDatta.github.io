import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, type CSSProperties } from "react";
import { CodeXml, Github, Linkedin, X } from "lucide-react";
import { Highlighter } from "@/components/Highlighter";
import { GithubStars } from "@/components/GithubStars";
import avatarImage from "@/assets/avatar.jpg";
import googleLogo from "@/assets/google.svg";
import geeksForGeeksLogo from "@/assets/geeksforgeeks.svg";
import {
  profile,
  links,
  openSource,
  projects,
  skillGroups,
  timeline,
  achievements,
  publications,
  community,
} from "@/lib/profile";
import { contributions } from "@/lib/contributions";
import { githubActivityQueryOptions } from "@/lib/github.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Snigdha Datta — Backend Developer Portfolio" },
      {
        name: "description",
        content:
          "Backend developer in Kolkata building real-time streaming engines with Node.js, Kafka, Redis and AWS. Projects, skills and experience — drawn like a manga.",
      },
      { property: "og:title", content: "Snigdha Datta — Backend Developer Portfolio" },
      {
        property: "og:description",
        content:
          "Event-driven backends, live streaming engines and full-stack products — the story so far, drawn like a manga.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(githubActivityQueryOptions),
  pendingComponent: LoadingScreen,
  component: Home,
});

function LoadingScreen() {
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="manga-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="font-display text-xl tracking-[0.18em] uppercase">Loading chapter...</p>
      </div>
    </main>
  );
}

function Home() {
  return (
    <main className="relative flex flex-col gap-16 pb-12 sm:gap-20 sm:pb-16">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogsSection />
      <JourneySection />
      <ContactSection />
    </main>
  );
}

/* ------------------------------------------------------------------ hero */

function HeroSection() {
  return (
    <section id="top" className="relative pt-28 pb-10 sm:pt-32 sm:pb-14">
      <div className="speed-lines pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex w-full max-w-2xl flex-col justify-between gap-4 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="order-2 flex flex-col gap-2 md:order-1">
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I&apos;m <Highlighter className="text-primary">Snigdha</Highlighter>
          </h1>
          <p className="text-muted-foreground max-w-[560px] text-base sm:text-lg">
            {profile.tagline} — building event-driven backends and full-stack products with Node.js,
            Kafka, Redis and AWS.
          </p>
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.3em] uppercase">
            {profile.location} · Open to opportunities
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <a href="#projects" className="btn-manga bg-primary text-primary-foreground">
              View my work
            </a>
            <a href="#contact" className="btn-manga bg-card text-foreground">
              Get in touch
            </a>
          </div>
        </div>
        <div className="order-1 hidden shrink-0 self-start md:order-2 md:block">
          <div className="panel-red rounded-full">
            <img
              src={avatarImage}
              alt={`Manga avatar of ${profile.name}`}
              width={1024}
              height={1024}
              className="size-24 rounded-full object-cover object-top sm:size-32"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- about */

function AboutSection() {
  const { data: github } = useSuspenseQuery(githubActivityQueryOptions);

  // Live calendar cells are contribution counts; bucket them into GitHub's
  // 0-4 intensity levels with quartile thresholds. Fallback = baked snapshot.
  let rows: number[][] = contributions.rows.map((week) => [...week]);
  let total = contributions.total;
  if (github.live) {
    const counts = github.calendar.weeks;
    const max = Math.max(1, ...counts.flat());
    const q = max / 4;
    rows = counts.map((week) =>
      week.map((count) =>
        count === 0 ? 0 : count <= q ? 1 : count <= 2 * q ? 2 : count <= 3 * q ? 3 : 4,
      ),
    );
    total = github.calendar.total;
  }

  const prList = (
    github.live && github.prs.length > 0
      ? github.prs.map((pr) => ({
          title: pr.title,
          repo: pr.repo,
          href: pr.url,
          status: pr.status,
        }))
      : openSource
  ).slice(0, 6);

  return (
    <section id="about" className="mx-auto -mt-14 w-full max-w-2xl px-4 sm:-mt-20 sm:px-6">
      <div className="flex min-h-0 flex-col gap-y-4">
        <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
          About <span className="text-primary">·</span>{" "}
          <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">自己紹介</span>
        </h2>
        <div className="text-muted-foreground space-y-3 leading-relaxed">
          <p>
            I&apos;m a backend developer from Kolkata who loves building{" "}
            <a
              href="#projects"
              className="text-foreground font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              event-driven, real-time systems
            </a>
            . Right now I&apos;m on a training arc through{" "}
            <span className="text-foreground font-semibold">DevOps &amp; System Design</span>.
          </p>
          <p>
            I&apos;ve shipped a{" "}
            <a
              href="#projects"
              className="text-foreground font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              live crypto streaming engine
            </a>{" "}
            with Kafka, an AI-powered watchlist with{" "}
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="text-foreground font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              30+ real users
            </a>
            , and 200+ DSA solutions along the way. When I&apos;m not coding, I&apos;m{" "}
            <a
              href="#experience"
              className="text-foreground font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              running Cloud workshops and writing
            </a>
            .
          </p>
        </div>
        <div className="panel bg-card mt-2 p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-xl tracking-wide sm:text-2xl">
              <span className="text-primary">{total}</span> contributions in the last year
            </p>
            <a
              href={links.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground text-[0.65rem] font-semibold tracking-[0.2em] uppercase hover:text-primary transition-colors"
            >
              github.com/SnigdhaDatta ↗
            </a>
          </div>
          <div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ContributionGraph rows={rows} total={total} />
          </div>
          <p className="text-muted-foreground mt-2 text-[0.65rem] font-semibold tracking-wider uppercase">
            Less
            <span className="mx-2 inline-flex gap-1 align-middle">
              {[0, 1, 2, 3, 4].map((level) => (
                <span key={level} className={cellClass(level)} style={cellColor(level)} />
              ))}
            </span>
            More
          </p>
          <div className="border-foreground mt-4 border-t-2 border-dashed pt-3">
            <p className="font-display text-lg tracking-wide sm:text-xl">
              <span className="text-primary">Open source</span> — PRs to other repos
            </p>
            <ul className="mt-2 space-y-2">
              {prList.map((pr) => (
                <li key={pr.href} className="min-w-0">
                  <a
                    href={pr.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex min-w-0 items-start gap-2"
                  >
                    <span className="font-display text-primary shrink-0 text-base leading-none transition-transform group-hover:translate-x-0.5">
                      ▸
                    </span>
                    <span className="block min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="text-foreground block min-w-0 flex-1 truncate text-sm font-semibold transition-colors group-hover:text-primary">
                          {pr.title}
                        </span>
                        <span className="font-display border-2 border-foreground bg-primary text-primary-foreground shrink-0 px-1.5 py-0.5 text-[0.55rem] leading-none tracking-[0.15em] uppercase">
                          {pr.status}
                        </span>
                      </span>
                      <span className="text-muted-foreground text-[0.65rem] font-semibold tracking-[0.15em] uppercase">
                        {pr.repo}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- skills */

function SkillsSection() {
  return (
    <section id="skills" className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <div className="flex min-h-0 flex-col gap-y-4">
        <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
          Skills <span className="text-primary">·</span>{" "}
          <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">スキル</span>
        </h2>
        <dl className="border-foreground/80 divide-foreground/20 divide-y border-y-2">
          {skillGroups.map((group) => (
            <div
              key={group.name}
              className="group grid gap-1 py-3 sm:grid-cols-[10rem_1fr] sm:gap-6"
            >
              <dt className="font-display text-sm tracking-[0.18em] uppercase transition-colors group-hover:text-primary">
                {group.name}
              </dt>
              <dd className="text-muted-foreground text-sm leading-relaxed">
                {group.items.map((skill, index) => (
                  <span key={skill}>
                    {index > 0 && (
                      <span aria-hidden="true" className="text-foreground/25">
                        {" · "}
                      </span>
                    )}
                    <span className="whitespace-nowrap">{skill}</span>
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- projects */

function SectionBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center w-full">
      <div className="halftone h-[3px] flex-1 opacity-60" />
      <span className="tag-ink bg-primary text-primary-foreground z-10 -mx-1 px-4 py-1 text-xs">
        {label}
      </span>
      <div className="halftone h-[3px] flex-1 opacity-60" />
    </div>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-3 items-center justify-center">
          <span className="tag-ink bg-primary text-primary-foreground z-10 px-4 py-1 text-xs">
            My Work
          </span>
          <h2 className="font-display text-3xl tracking-tight text-center sm:text-4xl">
            Check out my latest <span className="text-primary">work</span>
          </h2>
          <p className="text-muted-foreground max-w-[520px] text-balance text-center text-sm sm:text-base">
            If something here helped or inspired you, a <span className="text-primary">★</span> on
            GitHub is a token of support — it keeps these projects going.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-[800px] mx-auto w-full">
          {projects.map((project) => {
            const repo = project.code?.replace(/^https:\/\/github\.com\//, "");
            return (
              <article
                key={project.title}
                className="panel bg-card group relative flex h-full flex-col p-4 transition-all duration-200 hover:-translate-y-1.5 hover:shadow-[8px_8px_0_0_var(--color-primary)] sm:p-5"
              >
                {/* accent bar slides in along the top edge on hover */}
                <span className="bg-primary absolute top-0 left-0 h-[3px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="font-display min-w-0 truncate text-2xl tracking-wide transition-colors group-hover:text-primary">
                    {project.title}
                  </h3>
                  {project.ongoing && (
                    <span className="tag-ink shrink-0 bg-primary text-primary-foreground">
                      Ongoing
                    </span>
                  )}
                  {repo && (
                    <span className="ml-auto shrink-0">
                      <GithubStars repo={repo} />
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {project.summary}
                </p>
                <div className="mt-3 mb-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="tag-ink text-[0.6rem] transition-colors group-hover:border-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="border-foreground mt-auto flex items-center justify-between gap-2 border-t-2 border-dashed pt-3">
                  <span className="text-muted-foreground text-[0.6rem] font-semibold tracking-[0.2em] uppercase transition-colors group-hover:text-primary">
                    {project.jp}
                  </span>
                  <span className="flex items-center gap-3">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="font-display text-sm tracking-wider transition-colors hover:text-primary"
                      >
                        Live demo{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                    {project.code && (
                      <a
                        href={project.code}
                        target="_blank"
                        rel="noreferrer"
                        className="font-display text-sm tracking-wider transition-colors hover:text-primary"
                      >
                        Source{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                          ↗
                        </span>
                      </a>
                    )}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- experience */

function JourneySection() {
  const timelineLogos = {
    google: googleLogo,
    geeksforgeeks: geeksForGeeksLogo,
  };

  return (
    <section id="experience" className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <div className="flex flex-col gap-y-8">
        <div className="flex flex-col gap-y-3 items-center justify-center">
          <span className="tag-ink bg-primary text-primary-foreground z-10 px-4 py-1 text-xs">
            The Journey
          </span>
          <h2 className="font-display text-3xl tracking-tight text-center sm:text-4xl">
            The training arcs <span className="text-primary">so far</span>
          </h2>
          <p className="text-muted-foreground max-w-[520px] text-balance text-center text-sm sm:text-base">
            Cloud workshops, technical writing and hackathons — every arc leveled me up.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="bg-foreground absolute top-2 bottom-2 left-[7px] w-[3px]" />
          <div className="space-y-8">
            {timeline.map((entry) => (
              <div key={entry.title} className="relative pl-9">
                <span className="bg-primary border-foreground absolute top-1 left-0 size-4 rounded-full border-[3px]" />
                <p className="font-display text-primary text-lg tracking-wider">{entry.period}</p>
                <h3 className="font-display text-xl tracking-wide sm:text-2xl">{entry.arc}</h3>
                <p className="mt-0.5 flex items-center gap-2 font-semibold text-sm sm:text-base">
                  <img
                    src={timelineLogos[entry.logo]}
                    alt=""
                    aria-hidden="true"
                    className="size-6 shrink-0 rounded-sm object-contain"
                    width={24}
                    height={24}
                  />
                  {entry.title}
                </p>
                <p className="text-muted-foreground mt-1 max-w-xl text-sm leading-relaxed">
                  {entry.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="grid gap-4 sm:grid-cols-3">
          {achievements.map((a, i) => (
            <div key={a.title} className="panel relative bg-card p-4">
              <span className="font-display text-muted-foreground absolute top-3 right-4 text-xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-lg leading-tight tracking-wide">{a.title}</p>
              <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">{a.detail}</p>
            </div>
          ))}
        </div>

        {/* Community */}
        <div className="panel bg-card p-5">
          <div className="flex items-baseline justify-between gap-2 border-b-[3px] border-dashed pb-2.5">
            <h3 className="font-display text-2xl tracking-wide">Guild Activities</h3>
            <span className="text-muted-foreground text-[0.6rem] font-semibold tracking-[0.2em]">
              コミュニティ
            </span>
          </div>
          <ul className="mt-4 space-y-4">
            {community.map((c) => (
              <li key={c.role}>
                <p className="font-semibold text-sm">{c.role}</p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{c.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- blogs */

function BlogsSection() {
  return (
    <section id="blogs" className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <div className="flex min-h-0 flex-col gap-y-4">
        <h2 className="font-display flex items-baseline justify-between gap-2 text-2xl tracking-wide sm:text-3xl">
          <span>
            Blogs <span className="text-primary">·</span>{" "}
            <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">記事</span>
          </span>
          <a
            href="https://snigdhadatta.hashnode.dev"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground text-[0.6rem] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-primary"
          >
            All posts ↗
          </a>
        </h2>
        <ul className="border-foreground/80 divide-foreground/20 divide-y border-y-2">
          {publications.map((post, index) => (
            <li key={post.url}>
              <a
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-3 py-4"
              >
                <span className="font-display text-primary w-6 shrink-0 text-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-lg leading-tight tracking-wide transition-colors group-hover:text-primary sm:text-xl">
                    {post.title}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-[0.65rem] font-semibold tracking-[0.2em] uppercase">
                    {post.venue}
                  </span>
                </span>
                <span className="font-display text-muted-foreground shrink-0 text-sm transition-all group-hover:translate-x-1 group-hover:text-primary">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

function ContactSection() {
  const channels = [
    { label: "GitHub", href: links.github, icon: Github },
    { label: "LinkedIn", href: links.linkedin, icon: Linkedin },
    { label: "LeetCode", href: links.leetcode, icon: CodeXml },
    { label: "X / Twitter", href: links.twitter, icon: X },
  ];

  return (
    <section id="contact" className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <div className="panel panel-red bg-card relative p-6 sm:p-10">
        <span className="tag-ink bg-primary text-primary-foreground absolute -top-4 left-1/2 z-10 -translate-x-1/2 px-4 py-1 text-xs">
          Contact
        </span>
        <div className="halftone-red pointer-events-none absolute inset-x-0 top-0 h-16 opacity-50" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-5xl">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg text-balance text-sm sm:text-base">
            Want to chat? Email me at{" "}
            <a
              href={links.email}
              className="text-foreground font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              {profile.email}
            </a>{" "}
            or{" "}
            <a
              href={links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-foreground font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              send a message on LinkedIn
            </a>{" "}
            — I&apos;ll respond whenever I can. Open to backend and full-stack opportunities.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="btn-manga bg-card px-4 py-2 text-sm"
              >
                <channel.icon aria-hidden="true" className="size-4" />
                {channel.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- contribution helpers */

const CELL_CLASSES = [
  "h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3",
  "h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3",
  "h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3",
  "h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3",
  "h-2.5 w-2.5 rounded-[2px] sm:h-3 sm:w-3",
];

function cellClass(level: number): string {
  return CELL_CLASSES[level] ?? CELL_CLASSES[0]!;
}

// GitHub-style intensity scale, drawn in the site's ink-and-crimson palette
// (empty days are paper, active days step toward crimson) instead of green.
function cellColor(level: number): CSSProperties {
  const primary = "var(--color-primary)";
  const card = "var(--color-card)";
  const fills = [
    "var(--color-muted)",
    `color-mix(in oklab, ${primary} 30%, ${card})`,
    `color-mix(in oklab, ${primary} 55%, ${card})`,
    `color-mix(in oklab, ${primary} 80%, ${card})`,
    primary,
  ];
  return { backgroundColor: fills[level] ?? fills[0] };
}

function ContributionGraph({ rows, total }: { rows: number[][]; total: number }) {
  return (
    <div
      className="grid min-w-max grid-rows-7 grid-flow-col gap-[2px]"
      role="img"
      aria-label={`GitHub contribution graph: ${total} contributions in the last year`}
    >
      {rows.map((week, wi) =>
        week.map((level, di) => (
          <span key={`${wi}-${di}`} className={cellClass(level)} style={cellColor(level)} />
        )),
      )}
    </div>
  );
}
