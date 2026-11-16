import ringPhoto from "../assets/images/Products/reveal/ring-photo.webp";
import ringSprite from "../assets/images/Products/reveal/ring-sprite.webp";
import ballPhoto from "../assets/images/Products/reveal/ball-photo.webp";
import ballSprite from "../assets/images/Products/reveal/ball-sprite.webp";
import bandPhoto from "../assets/images/Products/reveal/band-photo.webp";
import bandSprite from "../assets/images/Products/reveal/band-sprite.webp";
import slidersPhoto from "../assets/images/Products/reveal/sliders-photo.webp";
import slidersSprite from "../assets/images/Products/reveal/sliders-sprite.webp";
import guidePhoto from "../assets/images/Products/reveal/guide-photo.webp";
import guideSprite from "../assets/images/Products/reveal/guide-sprite.webp";

// Each product reveal swaps the product's cut-out from the 1672x941 kit photo for a 6x6 sprite of 3D render
// frames (Blender, rendered with the kit photo's own camera): frame 0 sits exactly on the photo, the last
// frame is the product's detail pose. All boxes are percentages:
//  - layer: the product's bounding box inside the kit image
//  - sprite: the render cell relative to that box (the kit camera cropped to a 640px square)
//  - room: space the callouts need [above, below] the enlarged cell, as fractions of the cell
//  - shift: sideways nudge of the cell, as a fraction of the cell
//  - lines: callout leader lines in the cell's 0-100 coordinate space
export const productReveals = [
  {
    id: "ring", photo: ringPhoto, sprite: ringSprite,
    layer: { left: 38.4569, top: 50.5845, width: 30.9211, aspect: "517 / 261" },
    cell: { left: -14.502, top: -93.37, width: 129.87 },
    room: { narrow: [0.30, 0.34], wide: [0.20, 0.20] }, shift: { narrow: -0.06, wide: 0.10 },
    lines: [{ points: "12,4 12,16 40,16", dot: [40, 16] }, { points: "74,54 92,54 92,66", dot: [74, 54] }],
  },
  {
    id: "ball", photo: ballPhoto, sprite: ballSprite,
    layer: { left: 66.9856, top: 24.6546, width: 16.3876, aspect: "274 / 292" },
    cell: { left: -67.153, top: -59.589, width: 233.577 },
    room: { narrow: [0.14, 0.44], wide: [0.06, 0.26] }, shift: { narrow: 0, wide: 0 },
    lines: [{ points: "44,7 52,7 52,30", dot: [52, 30] }, { points: "50,70 50,93 55,93", dot: [50, 70] }],
  },
  {
    id: "band", photo: bandPhoto, sprite: bandSprite,
    layer: { left: 22.6675, top: 64.0808, width: 14.1746, aspect: "237 / 185" },
    cell: { left: -33.333, top: -217.838, width: 270.042 },
    room: { narrow: [0.13, 0.16], wide: [0.02, 0.14] }, shift: { narrow: 0, wide: 0.04 },
    lines: [{ points: "70,15.5 70,31 42,31", dot: [42, 31] }, { points: "16,74 16,64 58,64", dot: [58, 64] }],
  },
  {
    id: "sliders", photo: slidersPhoto, sprite: slidersSprite,
    layer: { left: 9.0311, top: 61.7428, width: 14.6531, aspect: "245 / 115" },
    cell: { left: -45.306, top: -348.696, width: 261.224 },
    room: { narrow: [0.13, 0.14], wide: [0.02, 0.12] }, shift: { narrow: 0, wide: 0.04 },
    lines: [{ points: "78,14 78,27 56,27", dot: [56, 27] }, { points: "12,57 12,68 47,68", dot: [47, 68] }],
  },
  {
    id: "guide", photo: guidePhoto, sprite: guideSprite,
    layer: { left: 68.6603, top: 58.7673, width: 20.0957, aspect: "336 / 264" },
    cell: { left: -44.048, top: -110.985, width: 190.476 },
    room: { narrow: [0.26, 0.10], wide: [0.14, 0.08] }, shift: { narrow: 0.02, wide: 0.02 },
    lines: [{ points: "70,-1 70,22", dot: [70, 22] }, { points: "16,44 16,71 27,71", dot: [27, 71] }],
  },
];
