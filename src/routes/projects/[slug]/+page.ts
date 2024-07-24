import { previewForProject, projects } from "$lib/types/Project";
import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load = (({ params }) => {
  const project = projects.find((proj) => proj.slug === params.slug);

  if (!project) {
    error(404, {
      message:
        "I hate to say it, I hope I don't sound ridiculous, I don't know who this project is. I mean, it could be walking down the street, and I wouldn't know a thing. Sorry to this project.",
    });
  }

  const otherProjects = projects
    .filter((proj) => proj.slug !== params.slug)
    .map(previewForProject);
  return {
    title: `${project.title} | Michael Helmbrecht`,
    colorScheme: project.colorScheme,
    project,
    otherProjects,
  };
}) satisfies PageLoad;
