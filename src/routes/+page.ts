import { previewForProject, projects } from "$lib/types/Project";
import parque from "$lib/assets/Parque.jpg";

export const load = () => {
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
    ogImage: parque,
    projects: projects.map(previewForProject),
  };
};
