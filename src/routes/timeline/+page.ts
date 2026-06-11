import { education, work } from "$lib/data/timeline";

export const load = () => {
  return {
    title: "Timeline | Michael Helmbrecht",
    description:
      "My long, loooooooong career history, including work experience & education.",
    colorScheme: {
      light: {
        blob: "#E1BFE6",
        link: "#5B3F5F",
      },
      dark: {
        blob: "#5B3F5F",
        link: "#E1BFE6",
      },
    },
    work,
    education,
  };
};
