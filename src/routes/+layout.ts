import { navLinkForProject, projects } from "$lib/types/Project";
import type { LayoutLoad } from "./$types";

export const load = (() => {
  return {
    projects: projects.map(navLinkForProject),
  };
}) satisfies LayoutLoad;
