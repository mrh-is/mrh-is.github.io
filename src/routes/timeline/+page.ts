import { projects } from "$lib/types/Project";

const platformSlug =
  projects.find((proj) => proj.slug.includes("platform"))?.slug ??
  "COULDN'T FIND PLATFORM";
const toolingSlug =
  projects.find((proj) => proj.slug.includes("tooling"))?.slug ??
  "COULDN'T FIND TOOLING";

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
    work: [
      {
        title: "Adjunct instructor",
        institution: {
          name: "Carnegie Mellon HCII",
          link: "https://hcii.cmu.edu/",
        },
        dates: {
          type: "current",
          start: new Date(2025, 0),
        },
        description: [
          "Advising masters students’ <a href='https://hcii.cmu.edu/academics/mhci/capstone' target='_blank'>Capstone projects</a>.",
        ],
      },
      {
        title: "Lead designer / product manager",
        institution: {
          name: "Archipelago",
          link: "https://onarchipelago.com/",
        },
        dates: {
          type: "past",
          start: new Date(2019, 0),
          end: new Date(2022, 10),
        },
        description: [
          "Designed & shepherded products, processes, & features for a new data-centric application for commercial real estate insurance.",
          `See more details about my work on <a href="/projects/${platformSlug}">the customer-facing application</a> & <a href="/projects/${toolingSlug}">the internal data tooling</a>.`,
          "Founded the design team! Led or advised almost all major projects for the first 4 years of the company, as both the product designer & the product manager.",
        ],
      },
      {
        title: "Product designer & developer",
        institution: {
          name: "Kidfund",
          link: "https://www.kidfund.us/",
        },
        dates: {
          type: "past",
          start: new Date(2017, 0),
          end: new Date(2019, 0),
        },
        description: [
          "Designed & developed new product features in collaboration with founders.",
          "Started with product vision and insights obtained from conducting user interviews. Defined new & updated features, then designed UX through visuals & wrote copy. Quickly validated designs with users. Finished by implementing changes to the iOS app & shipping to the App Store.",
        ],
      },
      {
        title: "Designer & marketer",
        institution: {
          name: "Realm",
          link: "https://realm.io/",
        },
        dates: {
          type: "past",
          start: new Date(2015, 6),
          end: new Date(2017, 0),
        },
        description: [
          "Designed & built website, including marketing pages & developer documentation. Wrote website copy. Directed branding.",
          "Advised strategy for developer-focused content marketing. Edited blog posts for tone & technical correctness.",
        ],
      },
      {
        title: "iOS developer",
        institution: {
          name: "Motiv",
          link: "https://mymotiv.com/",
        },
        dates: {
          type: "past",
          start: new Date(2014, 4),
          end: new Date(2015, 1),
        },
        description: ["Developed iOS apps & device SDK for wearable device."],
      },
      {
        title: "Designer",
        institution: {
          name: "Fino Consulting",
          link: "http://www.finoconsulting.com/",
        },
        dates: {
          type: "past",
          start: new Date(2013, 7),
          end: new Date(2014, 4),
        },
        description: ["Designed iPad apps for teachers & energy salespersons."],
      },
    ],
    education: [
      {
        title: "Master of human-computer interaction",
        institution: {
          name: "Carnegie Mellon University",
        },
        dates: {
          type: "graduation",
          date: new Date(2013, 8),
        },
      },
      {
        title: "Bachelors in electrical engineering",
        institution: {
          name: "Mississippi State University",
        },
        dates: {
          type: "graduation",
          date: new Date(2012, 4),
        },
        description: [
          "Minors in Spanish & mathematics, plus certificate in cognitive science",
        ],
      },
    ],
  };
};
