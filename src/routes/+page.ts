import { previewForProject, projects } from "$lib/types/Project";
import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    title: "Michael Helmbrecht 😎",
    colorScheme: {
      light: {
        link: "#970049",
      },
      dark: {
        link: "#d5a2aa",
      },
    },
    projects: projects.map(previewForProject),
  };
}) satisfies PageLoad;
