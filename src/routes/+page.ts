import { previewForProject, projects } from "$lib/types/Project";
import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    title: "Michael Helmbrecht 😎",
    colorScheme: {
      light: {
        blob: "#EAC9D9",
        link: "#684054",
      },
      dark: {
        blob: "#684054",
        link: "#EAC9D9",
      },
    },
    projects: projects.map(previewForProject),
  };
}) satisfies PageLoad;
