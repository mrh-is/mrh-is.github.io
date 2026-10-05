import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  PUBLIC_ORIGIN: { public: true, static: true },
});
