// Server-only helper: reads Snigdha's public GitHub data directly from the
// GitHub REST and GraphQL APIs. Never imported from client code (*.server.ts
// boundary).
//
// Everything except the contribution calendar works without credentials.
// A GITHUB_TOKEN (with read:user access) enables the GraphQL calendar; when it
// is missing the baked snapshot from contributions.ts is used instead.

import { contributions } from "./contributions";

const API_URL = "https://api.github.com";
const GRAPHQL_URL = "https://api.github.com/graphql";
const USER = "SnigdhaDatta";

function baseHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "snigdha-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env["GITHUB_TOKEN"];
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghFetch(path: string): Promise<unknown> {
  const response = await fetch(`${API_URL}/${path}`, { headers: baseHeaders() });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub request failed [${response.status}]: ${body.slice(0, 300)}`);
  }
  return response.json();
}

type ContributionCalendar = { total: number; weeks: number[][] };

async function fetchLiveCalendar(): Promise<ContributionCalendar | null> {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) return null;

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { ...baseHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
          user(login: "${USER}") {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks { contributionDays { contributionCount } }
              }
            }
          }
        }`,
      }),
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions?: number;
              weeks?: { contributionDays: { contributionCount: number }[] }[];
            };
          };
        };
      };
    };
    const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar?.weeks) return null;
    return {
      total: calendar.totalContributions ?? 0,
      weeks: calendar.weeks.map((week) =>
        week.contributionDays.map((day) => day.contributionCount),
      ),
    };
  } catch {
    return null;
  }
}

// The baked snapshot stores 7 weekday rows x 52 week columns; the live calendar
// is weeks x days. Convert so both shapes match.
function bakedCalendar(): ContributionCalendar {
  const weeks: number[][] = [];
  const width = Math.max(...contributions.rows.map((row) => row.length));
  for (let w = 0; w < width; w++) {
    weeks.push(contributions.rows.map((row) => row[w] ?? 0));
  }
  return { total: contributions.total, weeks };
}

export type PrSummary = {
  title: string;
  repo: string;
  url: string;
  status: "Ongoing" | "Merged" | "Closed";
};

export type GithubActivity = {
  profile: { repos: number; followers: number; stars: number };
  calendar: ContributionCalendar;
  prs: PrSummary[];
  mergedPrs: number;
};

interface CacheEntry {
  at: number;
  data: GithubActivity;
}

// The server keeps this in memory per instance; it just smooths bursts between
// visitors. GitHub data a few minutes old is fine for a portfolio.
const TTL_MS = 10 * 60 * 1000;
let cache: CacheEntry | null = null;

export async function fetchGithubActivity(): Promise<GithubActivity> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  const [profileRes, reposRes, prSearch, mergedSearch, liveCalendar] = await Promise.all([
    ghFetch(`users/${USER}`),
    ghFetch(`users/${USER}/repos?per_page=100&type=owner&sort=updated`),
    ghFetch(
      `search/issues?q=${encodeURIComponent(
        `author:${USER} -user:${USER} type:pr`,
      )}&sort=created&order=desc&per_page=30`,
    ),
    ghFetch(`search/issues?q=${encodeURIComponent(`author:${USER} type:pr is:merged`)}&per_page=1`),
    fetchLiveCalendar(),
  ]);

  const p = profileRes as { public_repos?: number; followers?: number };
  const repos = reposRes as { stargazers_count?: number }[];
  const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

  const search = prSearch as {
    items?: {
      title: string;
      html_url: string;
      state: string;
      pull_request?: { merged_at?: string | null };
      repository_url: string;
    }[];
  };
  const seenRepos = new Set<string>();
  const prs: PrSummary[] = [];
  for (const item of search.items ?? []) {
    const repo = item.repository_url.replace("https://api.github.com/repos/", "");
    if (seenRepos.has(repo)) continue;
    seenRepos.add(repo);
    prs.push({
      title: item.title,
      repo,
      url: item.html_url,
      status:
        item.state === "open" ? "Ongoing" : item.pull_request?.merged_at ? "Merged" : "Closed",
    });
    if (prs.length >= 6) break;
  }

  const mergedPrs = (mergedSearch as { total_count?: number }).total_count ?? 0;

  const data: GithubActivity = {
    profile: { repos: p.public_repos ?? 0, followers: p.followers ?? 0, stars },
    calendar: liveCalendar ?? bakedCalendar(),
    prs,
    mergedPrs,
  };
  cache = { at: Date.now(), data };
  return data;
}
