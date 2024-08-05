import type { Project } from "$lib/types/Project";

import thumbnail from "$lib/assets/projects/archipelago-data-tooling/Archipelago tooling thumbnail.png";

import myJobs from "$lib/assets/projects/archipelago-data-tooling/Archipelago My Jobs.png";
import jobDetails from "$lib/assets/projects/archipelago-data-tooling/Archipelago job details.png";
import onboardingFlow from "$lib/assets/projects/archipelago-data-tooling/Archipelago onboarding flow.png";
import jobState from "$lib/assets/projects/archipelago-data-tooling/Archipelago job state.png";

const archipelagoDataTooling: Project = {
  title: "Archi\u00ADpelago data tool\u00ADing",
  slug: "archipelago-tooling",
  description:
    "I designed workflows and systems to ingest millions of data points across many parallel human & AI workers, plus most associated UIs.",
  tile: {
    subtitle: "Workflow & product design for internal data management",
    imageSrc: thumbnail,
  },
  colorScheme: {
    light: {
      blob: "#D3D0E8",
      link: "#524E6C",
    },
    dark: {
      blob: "#524E6C",
      link: "#D3D0E8",
    },
  },
  tagline: "Ingest building data from any spreadsheet or PDF",
  content: [
    {
      kind: "text",
      text: "I designed workflows and systems to ingest millions of data points across many parallel human & AI workers, plus most associated UIs.",
    },
    {
      kind: "carousel",
      slides: [
        {
          src: myJobs,
          caption:
            "The \"My jobs\" page is a worker's home base, where it's clear what's assigned to them and what to do next.",
        },
        {
          src: jobDetails,
          caption:
            "A job has a complete history that can be easily tracked, including who did what and any issues at each step.",
        },
        {
          src: onboardingFlow,
          caption:
            "The tooling is only a part of this larger process to get a new customer onto Archipelago. It was important that each player understand both their work and how it integrated with everyone else's.",
        },
        {
          src: jobState,
          caption:
            'Part of building out this system was defining a simple state machine for the fundamental unit of work, the "job". Being able to reason about each job enabled the team to confidently reason about higher-order abstractions.',
        },
      ],
    },
    {
      kind: "text",
      text: "A huge part of the <a href='https://onarchipelago.com/'>Archipelago</a> magic was standardizing & enhancing customers' data. This was all powered by a suite of internal tools that enabled ingesting data from all manner of customer Excel spreadsheets, and then enhancing and correcting that data with evidentiary documents like engineering reports.",
    },
    {
      kind: "text",
      title: "Project brief",
      text: "Design & continually improve a system for ingesting customer data. This system needed to handle arbitrarily-formatted spreadsheets for initial ingest, then be able to supplement with any reports the customer had. This system needed to support all existing customers updating their data, plus all new customers coming via sales.",
    },
    {
      kind: "text",
      title: "My role",
      text: "I was the lead designer on this pillar of the company. I designed workflows and systems that could ingest millions of data points across many parallel human & AI workers, plus most associated UIs. I worked very closely with engineering to work within technical constraints, and with our internal data team to identify their needs & easy wins.",
    },
    {
      kind: "text",
      title: "Outcome",
      text: "We built a system with two major motions (spreadsheet ingest & document-based enhancement) that could successfully ingest hundreds of thousands of data points each month.",
    },
    {
      kind: "text",
      text: "This allowed the same number of workers to handle increasing amounts of customers data, maintaining response times even with a growing customer base.",
    },
  ],
};
export default archipelagoDataTooling;
