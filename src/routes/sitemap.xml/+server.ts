import { projects } from "$lib/types/Project";
import { PUBLIC_ORIGIN } from "$env/static/public";

export const prerender = true;

export const GET = () => {
  const paths = [
    "/",
    "/timeline",
    ...projects.map((project) => `/projects/${project.slug}`),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => `  <url><loc>${PUBLIC_ORIGIN}${path}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};
