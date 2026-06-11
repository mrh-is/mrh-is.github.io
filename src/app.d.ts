import type { ColorScheme } from "$lib/types/Colors";

declare global {
  namespace App {
    interface PageData {
      title?: string;
      description?: string;
      colorScheme?: ColorScheme;
    }
  }
}

export {};
