import { previewForProject, projects } from '$lib/types/Project';
import type { PageLoad } from './$types';

export const load = (() => {
  return {
    projects: projects.map(previewForProject)
  };
}) satisfies PageLoad;