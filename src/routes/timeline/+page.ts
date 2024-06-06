import type { TimelineEntry } from "$lib/types/TimelineEntry";
import type { PageLoad } from "./$types";

export const load = (() => {
  return {
    work: [
      {
        title: "Lead designer / product manager",
        institution: {
          name: "Archipelago",
          link: "https://onarchipelago.com/",
        },
        startDate: new Date(2019, 0),
        endDate: new Date(2022, 10),
        description: [
          "Designed & shepherded products, processes, & features for a new data-centric application for commercial real estate insurance.",
          'See more details about my work on <a href="/projects/archipelago-platform">the customer-facing application</a> & <a href="/projects/archipelago-tooling">the internal data tooling</a>.',
          "Founded the design team! Led or advised almost all major projects for the first 4 years of the company, as both the product designer & the product manager.",
        ],
      },
      {
        title: "Product designer & developer",
        institution: {
          name: "Kidfund",
          link: "https://www.kidfund.us/",
        },
        startDate: new Date(2017, 0),
        endDate: new Date(2019, 0),
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
        startDate: new Date(2015, 6),
        endDate: new Date(2017, 0),
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
        startDate: new Date(2014, 4),
        endDate: new Date(2015, 1),
        description: ["Developed iOS apps & device SDK for wearable device."],
      },
      {
        title: "Designer",
        institution: {
          name: "Fino Consulting",
          link: "http://www.finoconsulting.com/",
        },
        startDate: new Date(2013, 7),
        endDate: new Date(2014, 4),
        description: ["Designed iPad apps for teachers & energy salespersons."],
      },
    ] as TimelineEntry[],
    education: [
      {
        title: "Master of human-computer interaction",
        institution: {
          name: "Carnegie Mellon University",
        },
        endDate: new Date(2013, 8),
      },
      {
        title: "Bachelors in electrical engineering",
        institution: {
          name: "Mississippi State University",
        },
        endDate: new Date(2012, 4),
        description: [
          "Minors in Spanish & mathematics, plus certificate in cognitive science",
        ],
      },
    ] as TimelineEntry[],
  };
}) satisfies PageLoad;
