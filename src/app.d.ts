import type { ColorScheme } from "$lib/types/Colors";

declare global {
  namespace App {
    interface Platform {
      env: {
        COUNTER: DurableObjectNamespace;
      };
      context: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
    interface PageData {
      title: string;
      description: string;
      colorScheme: ColorScheme;
    }
  }
}

export {};
