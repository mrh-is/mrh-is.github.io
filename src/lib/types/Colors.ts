interface Palette {
  blob: string;
  link: string;
}

export interface ColorScheme {
  light: Palette;
  dark: Palette;
}

// Matches the home page scheme; used when a page provides none (e.g. error pages).
export const defaultColorScheme: ColorScheme = {
  light: {
    blob: "#EAC9D9",
    link: "#684054",
  },
  dark: {
    blob: "#684054",
    link: "#EAC9D9",
  },
};

export function styleStringFromScheme(
  scheme: ColorScheme = defaultColorScheme,
): string {
  return `
  --color-light-link: ${scheme.light.link};
  --color-dark-link: ${scheme.dark.link};
  --color-light-blob: ${scheme.light.blob};
  --color-dark-blob: ${scheme.dark.blob};
  `;
}
