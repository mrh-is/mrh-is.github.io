import { navLinkForProject, projects } from "#lib/types/Project.js";

export const prerender = true;

export const load = () => {
  return {
    projects: projects.map(navLinkForProject),
  };
};
