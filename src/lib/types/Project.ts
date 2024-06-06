import { archipelagoDataTooling } from "$lib/data/projects/ArchipelagoDataTooling";
import { archipelagoPlatform } from "$lib/data/projects/ArchipelagoPlatform";
import { kidfund } from "$lib/data/projects/Kidfund";

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
  src: string;
  caption: string;
}
export interface ImageCarousel {
  kind: "image";
  slides: ImageCarouselSlide[];
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
  | Subsection;

export interface Project {
  title: string;
  slug: string;
  tile: {
    subtitle: string;
    imageSrc: string;
  };
  tagline: string;
  content: ContentBlock[];
}

export interface ProjectPreview {
  title: string;
  slug: string;
  subtitle: string;
  imageSrc: string;
}

export function previewForProject(project: Project): ProjectPreview {
  return {
    title: project.title,
    slug: project.slug,
    subtitle: project.tile.subtitle,
    imageSrc: project.tile.imageSrc,
  };
}

export const projects: Project[] = [
  archipelagoPlatform,
  archipelagoDataTooling,
  kidfund,
];
