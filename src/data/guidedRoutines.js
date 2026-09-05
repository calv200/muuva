const headerAssets = import.meta.glob(
  "../assets/images/guided-routines/headers/*",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
);

const thumbnailAssets = import.meta.glob(
  "../assets/images/guided-routines/thumbnails/*",
  {
    eager: true,
    import: "default",
    query: "?url",
  }
);

function findAsset(assets, filenames) {
  const names = Array.isArray(filenames) ? filenames : [filenames];
  const match = Object.entries(assets).find(([path]) =>
    names.some((filename) => path.endsWith(`/${filename}`))
  );

  return match ? match[1] : "";
}

export const allFilter = "All";

export const routineFilters = [
  allFilter,
  "Ring",
  "Ball",
  "Sliders",
  "Band",
  "Full body",
];

export const categoryHeroes = {
  ring: {
    filter: "Ring",
    title: "Pilates Ring Routines",
    description:
      "Add resistance and control to familiar movements while engaging your core, legs and upper body.",
    image: findAsset(headerAssets, ["ring-header.webp", "ring-header.png"]),
    imageAlt: "Pilates ring for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  ball: {
    filter: "Ball",
    title: "Pilates Ball Routines",
    description:
      "Small prop, endless possibilities. Use the ball to challenge stability, alignment and deeper muscle control.",
    image: findAsset(headerAssets, ["ball-header.webp", "ball-header.png"]),
    imageAlt: "Pilates ball for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  sliders: {
    filter: "Sliders",
    title: "Slider Routines",
    description:
      "Turn simple movements into controlled, full-range exercises that challenge strength, stability and coordination.",
    image: findAsset(headerAssets, [
      "sliders-header.webp",
      "sliders-header.png",
    ]),
    imageAlt: "Pilates sliders for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  band: {
    filter: "Band",
    title: "Resistance Band Routines",
    description:
      "Add just the right amount of resistance to strengthen, activate and move with more intention.",
    image: findAsset(headerAssets, ["band-header.webp", "band-header.png"]),
    imageAlt: "Resistance band for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  "full-body": {
    filter: "Full body",
    title: "Full Body Routines",
    description:
      "Balanced sessions designed to connect strength, control and mobility from head to toe.",
    image: findAsset(headerAssets, [
      "full-body-header.webp",
      "full-body-header.png",
    ]),
    imageAlt: "Full body Pilates routine in a calm studio setting",
    imageKind: "lifestyle",
    kitCta: false,
  },
};

export const routines = [
  {
    id: "ring-routine",
    slug: "ring",
    title: "Pilates Ring Routine",
    meta: "Pilates Ring",
    filters: ["Ring"],
    thumbnail: findAsset(thumbnailAssets, [
      "ring-routine-thumbnail.webp",
      "ring-routine-thumbnail.png",
    ]),
    thumbnailAlt: "Pilates ring routine thumbnail",
    youtubeUrl: "https://www.youtube.com/watch?v=Ns9PKZRh2j4",
    youtubeEmbedUrl: "https://www.youtube.com/embed/Ns9PKZRh2j4",
    hero: categoryHeroes.ring,
  },
  {
    id: "ball-routine",
    slug: "ball",
    title: "Pilates Ball Routine",
    meta: "Pilates Ball",
    filters: ["Ball"],
    thumbnail: findAsset(thumbnailAssets, [
      "ball-routine-thumbnail.webp",
      "ball-routine-thumbnail.png",
    ]),
    thumbnailAlt: "Pilates ball routine thumbnail",
    youtubeUrl: "https://www.youtube.com/watch?v=eZBYO-GSlVk",
    youtubeEmbedUrl: "https://www.youtube.com/embed/eZBYO-GSlVk",
    hero: categoryHeroes.ball,
  },
  {
    id: "sliders-routine",
    slug: "sliders",
    title: "Slider Routine",
    meta: "Sliders",
    filters: ["Sliders"],
    thumbnail: findAsset(thumbnailAssets, [
      "sliders-routine-thumbnail.webp",
      "sliders-routine-thumbnail.png",
    ]),
    thumbnailAlt: "Slider routine thumbnail",
    youtubeUrl: "",
    youtubeEmbedUrl: "",
    hero: categoryHeroes.sliders,
  },
  {
    id: "band-routine",
    slug: "band",
    title: "Resistance Band Routine",
    meta: "Resistance Band",
    filters: ["Band"],
    thumbnail: findAsset(thumbnailAssets, [
      "band-routine-thumbnail.webp",
      "band-routine-thumbnail.png",
    ]),
    thumbnailAlt: "Resistance band routine thumbnail",
    youtubeUrl: "https://www.youtube.com/watch?v=i9Ev0n22PYc",
    youtubeEmbedUrl: "https://www.youtube.com/embed/i9Ev0n22PYc",
    hero: categoryHeroes.band,
  },
  {
    id: "full-body-routine",
    slug: "full-body",
    title: "Full Body Pilates Routine",
    meta: "Full Body",
    filters: ["Full body"],
    thumbnail: findAsset(thumbnailAssets, [
      "full-body-routine-thumbnail.webp",
      "full-body-routine-thumbnail.png",
    ]),
    thumbnailAlt: "Full body Pilates routine thumbnail",
    youtubeUrl: "https://www.youtube.com/watch?v=7X87YbXHo9c",
    youtubeEmbedUrl: "https://www.youtube.com/embed/7X87YbXHo9c",
    hero: categoryHeroes["full-body"],
  },
];

export function slugForFilter(filter) {
  if (!filter) return "";
  return filter.toLowerCase().replace(/\s+/g, "-");
}

export function filterForSlug(slug) {
  const hero = categoryHeroes[slug];
  return hero ? hero.filter : "";
}
