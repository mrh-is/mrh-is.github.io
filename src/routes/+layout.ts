import { navLinkForProject, projects } from "$lib/types/Project";

export const prerender = true;

export const load = () => {
  return {
    projects: projects.map(navLinkForProject),
  };
};
