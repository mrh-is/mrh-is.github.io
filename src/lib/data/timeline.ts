import { projects } from "$lib/types/Project";
import type { TimelineEntry } from "$lib/types/TimelineEntry";

function requireSlug(slug: string): string {
  if (!projects.some((proj) => proj.slug === slug)) {
    throw new Error(`Timeline references unknown project slug "${slug}"`);
  }
  return slug;
}

const platformSlug = requireSlug("archipelago-platform");
const toolingSlug = requireSlug("archipelago-tooling");

export const work: TimelineEntry[] = [
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
      "Advising masters students’ [Capstone projects](https://hcii.cmu.edu/academics/mhci/capstone).",
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
      `See more details about my work on [the customer-facing application](/projects/${platformSlug}) & [the internal data tooling](/projects/${toolingSlug}).`,
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
];

export const education: TimelineEntry[] = [
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
];
