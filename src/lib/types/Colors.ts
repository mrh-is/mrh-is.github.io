interface Palette {
  blob: string,
  link: string,
};

export interface ColorScheme {
  light: Palette,
  dark: Palette,
};

export function styleStringFromScheme(scheme: ColorScheme): string {
  return `
  --color-light-link: ${scheme.light.link};
  --color-dark-link: ${scheme.dark.link};
  --color-light-blob: ${scheme.light.blob};
  --color-dark-blob: ${scheme.dark.blob};
  `;
}