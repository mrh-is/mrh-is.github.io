import type { Project } from "$lib/types/Project";

import thumbnail from "$lib/assets/projects/archipelago-platform/Archipelago platform thumbnail.png";

import stream from "$lib/assets/projects/archipelago-platform/platform/Archipelago stream.png";
import buildingDetails from "$lib/assets/projects/archipelago-platform/platform/Archipelago building details.png";
import provenance from "$lib/assets/projects/archipelago-platform/platform/Archipelago provenance.png";

import v1 from "$lib/assets/projects/archipelago-platform/v1/Archipelago v1.png";
import v1Building from "$lib/assets/projects/archipelago-platform/v1/Archipelago v1 building.png";
import ia from "$lib/assets/projects/archipelago-platform/v1/IA.png";
import wireframeStreamSpaced from "$lib/assets/projects/archipelago-platform/v1/Wireframe stream spaced.png";
import wireframeBuildingSpaced from "$lib/assets/projects/archipelago-platform/v1/Wireframe building spaced.png";

import editingWorkflow from "$lib/assets/projects/archipelago-platform/editing/Editing workflow spaced.png";
import editingSelect from "$lib/assets/projects/archipelago-platform/editing/Editing select.png";
import editingSelectError from "$lib/assets/projects/archipelago-platform/editing/Editing select error.png";
import editingValidation from "$lib/assets/projects/archipelago-platform/editing/Editing validation.png";
import editingSuccess from "$lib/assets/projects/archipelago-platform/editing/Editing success.png";

const archipelagoPlatform: Project = {
  title: "The Archi\u00ADpelago plat\u00ADform",
  slug: "archipelago-platform",
  description:
    "I started & helped grow the design team, & was the sole or lead designer on almost every major project for the company's first 4 years.",
  tile: {
    subtitle: "Product design for customer-facing web app",
    imageSrc: thumbnail,
  },
  colorScheme: {
    light: {
      blob: "#B4D9CB",
      link: "#466559",
    },
    dark: {
      blob: "#466559",
      link: "#B4D9CB",
    },
  },
  tagline: "Understand your building data, get better insurance",
  content: [
    {
      kind: "text",
      text: "I started & helped grow the design team, & was the sole or lead designer on almost every major project for the company's first 4 years.",
    },
    {
      kind: "carousel",
      slides: [
        {
          src: stream,
          caption:
            'The heart of the Archipelago platform. This page shows one "placement", the industry term for a group of buildings insured together.',
        },
        {
          src: buildingDetails,
          caption:
            "Clicking on a building brings up a detail modal. It starts by summarizing the property, then more granular data is available in the other tabs.",
        },
        {
          src: provenance,
          caption:
            "Hovering over a data element shows its source, which increases confidence in the accuracy of the data. (You wouldn't believe how many typos there are in multi-million dollar spreadsheets.)",
        },
      ],
    },
    {
      kind: "text",
      text: "<a href='https://onarchipelago.com'>Archipelago</a> provides an online platform for commercial real estate insurance, which serves both owners & insurers. Owners can record hundreds of data points on each of thousands of buildings, and insurers can trust the data due to evidentiary documents.",
    },
    {
      kind: "text",
      text: "I started & helped grow the design team, & was involved in almost every major project for the company's first 4 years. I'd like to highlight a couple that I'm especially proud of:",
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "carousel",
          slides: [
            {
              src: v1,
              caption:
                "Ah, v1. Simpler times. Swap in a nicer UI library & a few extra capabilities, and you've got something pretty good.",
            },
            {
              src: v1Building,
              caption:
                "Examining building details. Users told us the first thing they need to know is location, so I put that front and center.",
            },
            {
              src: ia,
              caption:
                "My first step toward getting a handle on this new product was understanding the information architecture. I used this diagram to check my understanding with the executive team.",
            },
            {
              src: wireframeStreamSpaced,
              caption:
                "After some whiteboarding sessions with the team (sadly not documented), I started working on some UIs. Things are getting a little crowded here, but we've got a lot of the right pieces in play.",
            },
            {
              src: wireframeBuildingSpaced,
              caption:
                "An important question was always how to show the details of a specific building, since users need to understand both the portfolio & be able to examine details. This stacking navigation turned out to be too tricky to implement, so I moved to the modal seen in the other UIs.",
            },
          ],
        },
        {
          kind: "title",
          text: "Initial product launch",
        },
        {
          kind: "text",
          title: "Project brief",
          text: "Archipelago's founders had pitched investors on a concept; now turn that into working software. Critically, our pilot customer had a go-live date that could not be moved, which was a make-or-break event for Archipelago.",
        },
        {
          kind: "text",
          title: "My role",
          text: "I transformed their vision into an MVP design. I held frequent meetings with Archipelago executives & flagship customers to understand the problem space and iterate on product directions. I was the sole designer at the company for the initial phase of this project, with a second designer joining partway through.",
        },
        {
          kind: "text",
          title: "Outcome",
          text: "A successful launch! The customer's go-live date went smoothly, and resulted in ~90% of potential insurer customers being introduced to Archipelago.",
        },
        {
          kind: "text",
          text: "We solicited feedback from our pilot customer, which was uniformly positive. They were receiving praise from insurers for making their data understandable & trustable, with specific notes given for how easy the Archipelago platform was to navigate.",
        },
        {
          kind: "text",
          text: "In addition, those insurers reached out directly to Archipelago, which led to signing deals with 2 of the largest insurers in the world over the following year.",
        },
      ],
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "carousel",
          slides: [
            {
              src: editingWorkflow,
              caption:
                "The basic editing workflow: Prevent conflicts by checking out the data you need to edit, then edit in the tool you already know. Ensure your changes are all valid, and you're done!",
            },
            {
              src: editingSelect,
              caption:
                "Start by checking out the data. Just pick which buildings (aka properties) & which data attributes you need.",
            },
            {
              src: editingSelectError,
              caption:
                "Before edits can be applied, they are validated by the system, including expert– & AI–written rules.",
            },
            {
              src: editingValidation,
              caption: "",
            },
            {
              src: editingSuccess,
              caption: "",
            },
          ],
        },
        {
          kind: "title",
          text: "Editing",
        },
        {
          kind: "text",
          title: "Project brief",
          text: "Enable customers to directly edit their own data. (Prior to this, all data management was done through our internal tooling.)",
        },
        {
          kind: "text",
          title: "My role",
          text: "I was the sole designer (and sometimes PM!) on this project. I first gathered requirements from internal experts & customers, then identified a long-term vision & the shorter-term MVP.",
        },
        {
          kind: "text",
          text: "Focused on the MVP scope, I outlined a workflow that would integrate with our existing infrastructure. I designed the accompanying interfaces & validated with customers. Finally, I worked closely with engineering to adjust designs to work with limited development bandwidth.",
        },
        {
          kind: "text",
          title: "Outcome",
          text: "We deployed an MVP editing capability, which allowed customers to self-serve their most common use cases, an estimated 20% of all edits. This both reduced the workload on our internal data management team, and unblocked 10 sales motions.",
        },
        {
          kind: "text",
          text: "Since I had designed the MVP with the longer-term vision in mind, the implementation was built to be forward-compatible, reducing the time for the upgrades shipped over the following year.",
        },
      ],
    },
  ],
  priority: 12,
};
export default archipelagoPlatform;
