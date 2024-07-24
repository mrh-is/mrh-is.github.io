import type { ColorScheme } from "$lib/types/Colors";

declare global {
  namespace App {
    interface Platform {
      env: {
        COUNTER: DurableObjectNamespace;
      };
      context: {
        waitUntil(promise: Promise<any>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
    interface PageData {
      title: string;
      colorScheme: ColorScheme;
    }
  }
}

export {};
