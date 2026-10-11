// Data and SVG are kept separate so the same illustration can serve all three folders.
export const folders = [
  { id: "cv", title: "my cv", subtitle: "A little about me.", route: "/cv", colors: ["#98EBE9", "#7978E3", "#4229E8"] },
  { id: "portfolio", title: "selected work", subtitle: "LegalTrace — product case study", route: "/portfolio", colors: ["#E9A0D9", "#F06B76", "#D9485C"] },
  { id: "demo", title: "watch the demo", subtitle: "See LegalTrace in action.", route: "/demo", colors: ["#BCAAF5", "#7978E3", "#4229E8"] },
];

// Editable layers: back tab, angled side, two paper sheets, front tab/cover.
// Noise is clipped to the cover and blends into its colour, rather than the page.
export function FolderIllustration(folder, instance) {
  const [light, mid, dark] = folder.colors;
  const id = `folder-${instance}`;
  // Visible silhouette: 388 × 292 (1.33:1). The side is a narrow connected fold.
  const front = "M36 100H151Q172 100 180 125H357L387 322H76Z";
  return `<svg class="folder-illustration" viewBox="0 0 460 350" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="${id}-front" x1=".7" y1=".08" x2=".12" y2="1"><stop offset="0" stop-color="${light}"/><stop offset=".48" stop-color="${light}"/><stop offset="1" stop-color="${mid}"/></linearGradient>
      <linearGradient id="${id}-side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${mid}"/><stop offset=".4" stop-color="${dark}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
      <filter id="${id}-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="1" seed="17" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope="2.8" intercept="-.9"/><feFuncG type="linear" slope="2.8" intercept="-.9"/><feFuncB type="linear" slope="2.8" intercept="-.9"/><feFuncA type="linear" slope=".82"/></feComponentTransfer><feComposite in2="SourceAlpha" operator="in"/><feBlend in2="SourceGraphic" mode="soft-light"/></filter>
      <clipPath id="${id}-clip"><path d="${front}"/></clipPath>
    </defs>
    <path d="M98 65H185L194 30H294Q323 30 332 63L398 70L424 87L398 322H76Z" fill="${dark}" filter="url(#${id}-grain)"/>
    <path d="m398 87 26 0-26 235h-11Z" fill="url(#${id}-side)"/>
    <path d="m105 85 289-10 2 237-301 3Z" fill="#E6E0DC"/>
    <path d="m93 91 292-7 9 229-299 3Z" fill="#F0EBE5"/>
    <path d="m82 97 292-9 14 225-297 5Z" fill="#FFFCF5"/>
    <g stroke="#756E76" stroke-width="1.6" opacity=".5"><path d="m199 99 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14m21-15 1 14"/></g>
    <path d="${front}" fill="url(#${id}-front)"/>
    <g clip-path="url(#${id}-clip)"><path d="${front}" fill="url(#${id}-front)" filter="url(#${id}-grain)"/></g>
  </svg>`;
}

