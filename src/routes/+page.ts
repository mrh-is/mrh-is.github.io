import type { Project } from '$lib/types/Project';
import type { PageLoad } from './$types';

export const load = (() => {
  return {
    projects: [
      {
        title: "The Archipelago platform",
        subtitle: "Product design for customer-facing web app",
        imageSrc: "https://assets-global.website-files.com/644f069ff64cdc5300138063/64623c2863f7ec6c82456d1d_Archipelago%20platform%20thumbnail.png",
        link: "/projects/archipelago-platform",
      },
      {
        title: "Archipelago data tooling",
        subtitle: "Workflow & product design for internal data management",
        imageSrc: "https://assets-global.website-files.com/644f069ff64cdc5300138063/64623c2876d640a4b6d28e61_Archipelago%20tooling%20thumbnail.png",
        link: "/projects/archipelago-tooling",
      },
      {
        title: "Kidfund",
        subtitle: "Product design & development for consumer iOS app",
        imageSrc: "https://assets-global.website-files.com/644f069ff64cdc5300138063/64623c28d5aa9d203caa49c8_Kidfund%20thumbnail.png",
        link: "/projects/kidfund",
      },
    ] as Project[]
  }
}) satisfies PageLoad;