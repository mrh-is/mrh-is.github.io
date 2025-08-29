import type { ColorScheme } from "./Colors";
import type { ImageSource } from "$lib/utils/imageUrl";

// Re-export for convenience
export type { ImageSource };

export interface TextBlock {
  kind: "text";
  title?: string;
  text: string;
}
export interface TitleBlock {
  kind: "title";
  text: string;
}
export interface ListBlock {
  kind: "list";
  elements: string[];
}
export interface ImageCarouselSlide {
  src: ImageSource;
  caption: string;
}
export interface ImageCarousel {
  kind: "carousel";
  coverSrc?: ImageSource;
  slides: ImageCarouselSlide[];
}
export interface SingleImage {
  kind: "image";
  src: ImageSource;
  caption: string;
  rounded?: boolean;
}
export interface Subsection {
  kind: "subsection";
  content: ContentBlock[];
}
export type ContentBlock =
  | TextBlock
  | TitleBlock
  | ListBlock
  | ImageCarousel
  | SingleImage
  | Subsection;

export interface Project {
  title: string;
  slug: string;
  description: string;
  tile: {
    subtitle: string;
    imageSrc: ImageSource;
  };
  colorScheme: ColorScheme;
  tagline: string;
  content: ContentBlock[];
  priority?: number;
}

export interface ProjectPreview {
  title: string;
  slug: string;
  subtitle: string;
  imageSrc: ImageSource;
}

export function previewForProject(project: Project): ProjectPreview {
  return {
    title: project.title,
    slug: project.slug,
    subtitle: project.tile.subtitle,
    imageSrc: project.tile.imageSrc,
  };
}

export interface ProjectNavLink {
  title: string;
  slug: string;
}

export function navLinkForProject(project: Project): ProjectNavLink {
  return {
    title: project.title,
    slug: project.slug,
  };
}

const projectsRecord = import.meta.glob<Project>("../data/projects/*.ts", {
  eager: true,
  import: "default",
});
export const projects = Object.keys(projectsRecord)
  .map((key) => projectsRecord[key])
  .sort((a, b) => {
    return (b.priority ?? 0) - (a.priority ?? 0);
  });
