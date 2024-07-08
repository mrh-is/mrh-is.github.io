interface Palette {
  link: string,
};

export interface ColorScheme {
  light: Palette,
  dark: Palette,
};

export function styleStringFromScheme(scheme: ColorScheme): string {
  return `
  --link-color-light: ${scheme.light.link};
  --link-color-dark: ${scheme.dark.link};
  `;
}