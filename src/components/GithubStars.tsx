import { useEffect, useState } from "react";

const cache = new Map<string, number>();

/**
 * Live star count for a GitHub repository ("owner/name"), fetched from the
 * official GitHub REST API on mount. Keeps the chip visible while the
 * request is pending so the project layout does not shift.
 */
export function GithubStars({ repo }: { repo: string }) {
  const cached = cache.get(repo);
  const [stars, setStars] = useState<number | null>(typeof cached === "number" ? cached : null);

  useEffect(() => {
    if (typeof cache.get(repo) === "number") return;
    let cancelled = false;
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        return response.json();
      })
      .then((data: { stargazers_count?: number }) => {
        if (typeof data.stargazers_count !== "number") throw new Error("no star count");
        cache.set(repo, data.stargazers_count);
        if (!cancelled) setStars(data.stargazers_count);
      })
      .catch(() => {
        // Offline or rate-limited: keep the loading indicator visible.
      });
    return () => {
      cancelled = true;
    };
  }, [repo]);

  return (
    <span
      className="tag-ink flex shrink-0 items-center gap-1 text-[0.6rem] font-bold"
      title={stars === null ? "Loading GitHub stars" : `${stars} stars on GitHub`}
    >
      <svg viewBox="0 0 16 16" className="fill-primary size-3" aria-hidden="true">
        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      {stars ?? "…"}
    </span>
  );
}
