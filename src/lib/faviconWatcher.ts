let _hasBeenRun = false;

export default function watchForColorSchemeChanges() {
  if (_hasBeenRun || !window.matchMedia) return;
  _hasBeenRun = true;

  // Technique from https://stackoverflow.com/a/58551905
  const head = document.head;
  const links = head.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"][media]',
  );
  links.forEach((link) => {
    const match = window.matchMedia(link.media);
    const swap = () => {
      if (match.matches) {
        link.remove();
        head?.appendChild(link);
      }
    };
    match.onchange = swap;
    swap();
  });
}
