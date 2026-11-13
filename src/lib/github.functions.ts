// Live GitHub activity for the About section, fetched server-side from the
// GitHub API. Falls back to the baked snapshot when the API is unavailable.

import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { fetchGithubActivity } from "./github.server";

export type GithubActivityResult =
  ({ live: true } & Awaited<ReturnType<typeof fetchGithubActivity>>) | { live: false };

export const getGithubActivity = createServerFn({ method: "GET" }).handler(
  async (): Promise<GithubActivityResult> => {
    try {
      return { live: true, ...(await fetchGithubActivity()) };
    } catch (error) {
      console.error("GitHub activity fetch failed:", error);
      return { live: false };
    }
  },
);

export const githubActivityQueryOptions = queryOptions({
  queryKey: ["github-activity"],
  queryFn: () => getGithubActivity(),
  staleTime: 5 * 60 * 1000,
});
