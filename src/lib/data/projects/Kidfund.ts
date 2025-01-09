import type { Project } from "$lib/types/Project";
import thumbnail from "$lib/assets/projects/kidfund/Kidfund thumbnail.png";
import home from "$lib/assets/projects/kidfund/Kidfund home.png";
import memoryBank from "$lib/assets/projects/kidfund/Kidfund memory bank.png";
import celebration from "$lib/assets/projects/kidfund/Kidfund celebration.png";
import gifting from "$lib/assets/projects/kidfund/Kidfund gifting.png";
import giftHistory from "$lib/assets/projects/kidfund/Kidfund gift history.png";

const kidfund: Project = {
  title: "Kidfund",
  slug: "kidfund",
  description:
    "I managed the entire customer-facing iOS app for a social savings app for parents.",
  tile: {
    subtitle: "Product design & development for consumer iOS app",
    imageSrc: thumbnail,
  },
  colorScheme: {
    light: {
      blob: "#EFD8B6",
      link: "#745629",
    },
    dark: {
      blob: "#745629",
      link: "#EFD8B6",
    },
  },
  tagline: "Save for your kids, with help from your friends",
  content: [
    {
      kind: "carousel",
      slides: [
        {
          src: home,
          caption:
            "The home page of the app gives parents an instant sense of how their kids’ funds are growing, plus easy access to gifting for kids they follow.",
        },
        {
          src: memoryBank,
          caption:
            "Each kid has a “memory bank” for a super-private way to share photos with family & friends.",
        },
        {
          src: gifting,
          caption: "Sending a gift is simple!",
        },
        {
          src: celebration,
          caption: "Woohoo! You just helped a kid’s future grow brighter.",
        },
        {
          src: giftHistory,
          caption:
            "You can see all the gifts your kid has received (plus any referral bonuses you earned!).",
        },
      ],
    },
    {
      kind: "text",
      text: "With <a href='https://www.kidfund.us/'>Kidfund</a> (now part of <a href='https://web.unest.co/us/acquisitions/kidfund'>UNest</a>), anyone could help parents save for their kids’ futures, by giving the most flexible (and least space-intensive) gift of all: money.",
    },
    {
      kind: "text",
      title: "Project brief",
      text: "Own the iOS app, with input from the co-founders. Build features & changes to grow users & usage.",
    },
    {
      kind: "text",
      title: "My role",
      text: "I managed the entire product lifecycle. This might start with foundational user research I conducted, or a feature the co-founders wanted to introduce. I designed the experiences & UIs in the app, validated with users, then implemented & deployed the changes. Some key projects that I built:",
    },
    {
      kind: "list",
      elements: [
        "Iterating several times on the onboarding flow, to improve retention",
        "A complete home screen redesign",
        "Easier integration with social networks for greater reach",
        "Allowing gifts to be pledged to kids who didn’t have accounts yet",
      ],
    },
    {
      kind: "text",
      title: "Outcome",
      text: "I boosted our onboarding completion by ~10% through research & iterative design. The app grew to over 30,000 users & was ultimately acquired.",
    },
  ],
  priority: 1,
};
export default kidfund;
