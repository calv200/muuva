import { routineSlugs } from "../routing/routeManifest.js";

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

// These IDs also appear in existing URLs; display labels are translated separately.
export const allFilter = "All";

export const filterLabelKeys = {
  All: "routines.filters.all",
  Ring: "routines.filters.ring",
  Ball: "routines.filters.ball",
  Sliders: "routines.filters.sliders",
  Band: "routines.filters.band",
  "Full body": "routines.filters.full-body",
};

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
    titleKey: "routines.categories.ring.title",
    descriptionKey: "routines.categories.ring.description",
    image: findAsset(headerAssets, ["ring-header.webp", "ring-header.png"]),
    imageAlt: "Pilates ring for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  ball: {
    filter: "Ball",
    titleKey: "routines.categories.ball.title",
    descriptionKey: "routines.categories.ball.description",
    image: findAsset(headerAssets, ["ball-header.webp", "ball-header.png"]),
    imageAlt: "Pilates ball for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  sliders: {
    filter: "Sliders",
    titleKey: "routines.categories.sliders.title",
    descriptionKey: "routines.categories.sliders.description",
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
    titleKey: "routines.categories.band.title",
    descriptionKey: "routines.categories.band.description",
    image: findAsset(headerAssets, ["band-header.webp", "band-header.png"]),
    imageAlt: "Resistance band for guided routines",
    imageKind: "product",
    kitCta: true,
  },
  "full-body": {
    filter: "Full body",
    titleKey: "routines.categories.full-body.title",
    descriptionKey: "routines.categories.full-body.description",
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
    slug: routineSlugs.ring,
    titleKey: "routines.workouts.ring.title",
    durationMinutes: 15,
    intensity: "medium",
    muscleGroups: ["fullBody"],
    equipment: ["ring"],
    meta: "Pilates Ring",
    filters: ["Ring"],
    thumbnail: findAsset(thumbnailAssets, [
      "ring-routine-thumbnail.webp",
      "ring-routine-thumbnail.png",
    ]),
    thumbnailAltKey: "routines.workouts.ring.thumbnailAlt",
    youtubeUrl: "https://www.youtube.com/watch?v=Ns9PKZRh2j4",
    youtubeEmbedUrl: "https://www.youtube.com/embed/Ns9PKZRh2j4",
    hero: categoryHeroes.ring,
  },
  {
    id: "ball-routine",
    slug: routineSlugs.ball,
    titleKey: "routines.workouts.ball.title",
    durationMinutes: 15,
    intensity: "medium",
    muscleGroups: ["fullBody"],
    equipment: ["ball"],
    meta: "Pilates Ball",
    filters: ["Ball"],
    thumbnail: findAsset(thumbnailAssets, [
      "ball-routine-thumbnail.webp",
      "ball-routine-thumbnail.png",
    ]),
    thumbnailAltKey: "routines.workouts.ball.thumbnailAlt",
    youtubeUrl: "https://www.youtube.com/watch?v=eZBYO-GSlVk",
    youtubeEmbedUrl: "https://www.youtube.com/embed/eZBYO-GSlVk",
    hero: categoryHeroes.ball,
  },
  {
    id: "sliders-routine",
    slug: routineSlugs.sliders,
    titleKey: "routines.workouts.sliders.title",
    durationMinutes: 15,
    intensity: "medium",
    muscleGroups: ["fullBody"],
    equipment: ["sliders"],
    meta: "Sliders",
    filters: ["Sliders"],
    thumbnail: findAsset(thumbnailAssets, [
      "sliders-routine-thumbnail.webp",
      "sliders-routine-thumbnail.png",
    ]),
    thumbnailAltKey: "routines.workouts.sliders.thumbnailAlt",
    youtubeUrl: "https://youtu.be/hcx_IU7NLf8",
    youtubeEmbedUrl: "https://www.youtube.com/embed/hcx_IU7NLf8",
    hero: categoryHeroes.sliders,
  },
  {
    id: "band-routine",
    slug: routineSlugs.band,
    titleKey: "routines.workouts.band.title",
    durationMinutes: 15,
    intensity: "medium",
    muscleGroups: ["fullBody"],
    equipment: ["band"],
    meta: "Resistance Band",
    filters: ["Band"],
    thumbnail: findAsset(thumbnailAssets, [
      "band-routine-thumbnail.webp",
      "band-routine-thumbnail.png",
    ]),
    thumbnailAltKey: "routines.workouts.band.thumbnailAlt",
    youtubeUrl: "https://www.youtube.com/watch?v=i9Ev0n22PYc",
    youtubeEmbedUrl: "https://www.youtube.com/embed/i9Ev0n22PYc",
    hero: categoryHeroes.band,
  },
  {
    id: "full-body-routine",
    slug: routineSlugs.fullBody,
    titleKey: "routines.workouts.full-body.title",
    durationMinutes: 20,
    intensity: "medium",
    muscleGroups: ["fullBody"],
    equipment: ["band", "ball", "ring", "sliders"],
    meta: "Full Body",
    filters: ["Full body"],
    thumbnail: findAsset(thumbnailAssets, [
      "full-body-routine-thumbnail.webp",
      "full-body-routine-thumbnail.png",
    ]),
    thumbnailAltKey: "routines.workouts.full-body.thumbnailAlt",
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
