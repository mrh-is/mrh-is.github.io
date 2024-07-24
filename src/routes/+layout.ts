import { navLinkForProject, projects } from "$lib/types/Project";
import type { LayoutLoad } from "./$types";

export const prerender = true;

export const load = (() => {
  return {
    projects: projects.map(navLinkForProject),
  };
}) satisfies LayoutLoad;
