import type { Project } from "$lib/types/Project";

import thumbnail from "$lib/assets/projects/archipelago-platform/Archipelago platform thumbnail.png";

import stream from "$lib/assets/projects/archipelago-platform/platform/Archipelago stream.png";
import buildingDetails from "$lib/assets/projects/archipelago-platform/platform/Archipelago building details.png";
import provenance from "$lib/assets/projects/archipelago-platform/platform/Archipelago provenance.png";

const archipelagoPlatform: Project = {
  title: "The Archi­pelago plat­form",
  slug: "archipelago-platform",
  description:
    "I designed interactive systems that transformed commercial real estate " +
    "insurance from Excel chaos into trusted, transparent experiences. " +
    "This cross-disciplinary project bridged user psychology, operational " +
    "constraints, and technical innovation to create industry-wide change.",
  tile: {
    subtitle: "Creative systems design for industry workflow transformation",
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
  tagline: "Building trust through transparent data",
  content: [
    {
      kind: "image",
      src: stream,
      caption:
        "Hero image showing the main placement grid interface — " +
        "demonstrates the scope and complexity of data being managed",
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "title",
          text: "The challenge",
        },
        {
          kind: "text",
          text:
            "Commercial real estate insurance has had a decades-old " +
            "problem built on broken workflows that breed mistrust. The " +
            "entire industry operated on a fragile system of Excel " +
            "spreadsheets passed through multiple hands, accumulating " +
            "errors and assumptions at every step.",
        },
        {
          kind: "text",
          title: "The broken workflow",
          text:
            "Risk managers would frantically collect data from property " +
            "managers in urgent, year-end pushes, often resulting in typos " +
            "(accidental extra zeros were alarmingly common) and " +
            "coordination failures. These inconsistent Excel files would " +
            "pass through brokers who reformatted them, then to insurers " +
            "who, faced with suspicious or blank data points, would assume " +
            "the worst possible values.",
        },
        {
          kind: "text",
          title: "The design challenge",
          text:
            "How do you design an entire industry’s data workflow for " +
            "trust & understandability? How do you continuously improve " +
            "the data quality while lowering the workload?",
        },
        {
          kind: "image",
          src: stream,
          caption:
            "Process flow diagram showing the transformation from " +
            "Excel chaos to Archipelago's systematic approach",
        },
      ],
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "title",
          text: "Design process",
        },
        {
          kind: "text",
          text:
            "With no existing platform solutions in the market, I began " +
            "by deeply understanding the problem space through executive " +
            "stakeholder workshops with customer Chief Risk Officers, " +
            "field research including site visits across multiple customer " +
            "companies, and workflow mapping to understand existing " +
            "Excel-based submission processes. I needed to balance " +
            "executive-level clarity with the detailed data needs of " +
            "technical users, while working across engineering teams with " +
            "very different capabilities.",
        },
        {
          kind: "text",
          text:
            "Working within significant constraints became creative drivers " +
            "that shaped innovative solutions. To work within limited " +
            "end-user access, I positioned research as ‘early access " +
            "pilot programs’ and joined customer success meetings. And " +
            "those same users’ tech setups drove innovative approaches to " +
            "data loading and grid performance optimization — one user " +
            "told me they waited for colleagues to leave at 5pm so they " +
            "could get more internet bandwidth.",
        },
      ],
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "title",
          text: "The solution",
        },
        {
          kind: "text",
          text:
            "I designed several key interface concepts that transformed " +
            "how the insurance industry approached building data:",
        },
        {
          kind: "text",
          title: "Multi-Level Data Grid",
          text:
            "An interactive property grid allows users to scan thousands " +
            "of buildings at once, while maintaining quick access to " +
            "detailed information. The grid offers both high-level " +
            "scannability & drill-down capabilities, including " +
            "performance optimizations for users with limited internet " +
            "bandwidth or lower-power hardware.",
        },
        {
          kind: "image",
          src: stream,
          caption:
            "Property grid screenshot showing the data density and " +
            "visual hierarchy, maybe grouping?",
        },
        {
          kind: "text",
          title: "Integrated Geographic Context",
          text:
            "Embedded Google Maps, with satellite imagery and 3D building " +
            "models directly within property details, provides spatial " +
            "context that helps users understand location-based risks and " +
            "property relationships.",
        },
        {
          kind: "image",
          src: buildingDetails,
          caption:
            "Property modal screenshot showing the integrated map and " +
            "data organization",
        },
        {
          kind: "text",
          title: "Trust-Through-Transparency System",
          text:
            "Hovering over a data point reveals evidentiary documents, " +
            "making the chain of custody visible. Rather than hiding " +
            "complexity, the interface makes data sources and validation " +
            "status immediately accessible.",
        },
        {
          kind: "image",
          src: provenance,
          caption: "Evidentiary document popover",
        },
        {
          kind: "text",
          title: "Systematic Workflow Transformation",
          text:
            "A new industry process creates better data for less stress: " +
            "Risk managers maintain data year-round on Archipelago, with " +
            "property managers having direct access to update their own " +
            "records. When submission time arrives, brokers access the " +
            "platform directly, and insurers receive data they can " +
            "trust.",
        },
        {
          kind: "image",
          src: stream,
          caption:
            "Side-by-side workflow comparison showing Excel chaos vs. " +
            "Archipelago's systematic approach",
        },
      ],
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "title",
          text: "Key insights",
        },
        {
          kind: "text",
          text:
            "Moving users from Excel to a web platform meant understanding " +
            "not just what they needed, but how their existing mental " +
            "models could be evolved. Two discoveries shaped how we " +
            "bridged this transition:",
        },
        {
          kind: "text",
          title: "Excel mental models run deep",
          text:
            "Users frequently talked about ‘all the data’, but their " +
            "actual workflows started with a set of Excel pivot tables " +
            "to quickly assess submissions. This led to designing the " +
            "‘Explorers’, interactive widgets that provided instant " +
            "visual breakdowns across multiple data dimensions, updating " +
            "dynamically as users filter & explore the data.",
        },
        {
          kind: "image",
          src: stream,
          caption:
            "Screenshot of the placement screen showing the explorers " +
            "widgets on the right side",
        },
        {
          kind: "text",
          title: "Trust through presence, not inspection",
          text:
            "Evidentiary documents were simultaneously absolutely " +
            "critical and rarely viewed. New users would inspect a few " +
            "initially, but once they understood the feature, they almost " +
            "never opened documents again. The simple visual indicator, " +
            "a dotted underline, was enough to generate the trust they " +
            "needed.",
        },
        {
          kind: "image",
          src: provenance,
          caption:
            "Screenshot showing hover state with document preview, " +
            "demonstrating the trust-building interface",
        },
      ],
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "title",
          text: "Impact",
        },
        {
          kind: "text",
          text:
            "The platform didn’t aim to simply improve individual " +
            "interfaces, it transformed an entire industry ecosystem. " +
            "By designing a shared schema developed with input from " +
            "structural experts, owners, brokers, and insurers, we " +
            "eliminated the format inconsistencies that plagued the old " +
            "Excel-based system. Risk managers now maintain data " +
            "year-round rather than in frantic year-end pushes, brokers " +
            "access live data directly, and insurers receive trusted " +
            "submissions configured to match their specific processes. " +
            "The shift from ‘assume the worst for missing data’ to " +
            "‘trust the transparent data’ represented a fundamental " +
            "change in industry relationships.",
        },
        {
          kind: "text",
          title: "Business outcomes",
          text:
            ">90% of potential insurer customers were introduced to " +
            "Archipelago through the platform, leading to 2 major " +
            "insurer partnerships within a year of the launch. Customers " +
            "across the industry praised the platform for making complex " +
            "insurance data ‘understandable and trustable’, and owners " +
            "loved earning points (and lower rates) from insurers for " +
            "data transparency.",
        },
      ],
    },
    {
      kind: "subsection",
      content: [
        {
          kind: "title",
          text: "Reflection",
        },
        {
          kind: "text",
          text:
            "This project reinforced for me that the most impactful " +
            "design work often happens at the intersection of user " +
            "experience and business operations. Early in Archipelago’s " +
            "life, creating something visually impressive was crucial — " +
            "the product demos closed sales. But as we grew, I learned " +
            "to focus design efforts on the operational improvements " +
            "that brought genuine business value.",
        },
      ],
    },
  ],
  priority: 12,
};
export default archipelagoPlatform;
