import type { ColorScheme } from "#lib/types/Colors.js";

declare global {
  namespace App {
    interface PageData {
      title?: string;
      description?: string;
      colorScheme?: ColorScheme;
      ogImage?: string;
    }
  }
}

export {};
