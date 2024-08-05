import { previewForProject, projects } from "$lib/types/Project";
import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    title: "Michael Helmbrecht 😎",
    description:
      "The most fun designer you ever could meet! Also will make your product better.",
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
