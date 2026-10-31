// Shared by the client router and the static-entry build plugin.
export const supportedLanguages = ["en", "de", "nl", "es"];

export const routineSlugs = {
  ring: "ring",
  ball: "ball",
  sliders: "sliders",
  band: "band",
  fullBody: "full-body",
};

export const pagePaths = [
  "",
  "guided-routines/",
  ...Object.values(routineSlugs).map((slug) => `guided-routines/${slug}/`),
  "privacy/",
  "about-us/",
  "wholesale/",
  "newsletter-confirmed/",
];
