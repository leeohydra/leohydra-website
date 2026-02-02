export type Artwork = {
  slug: string;
  image: string;
  status: string;
  year: string;
  title: string;
  description: string[];
};

export const artworks: Artwork[] = [
  {
    slug: "fractured_spectrum",
    image: "/artworks/fractured_spectrum.jpg",
    status: "Available",
    year: "2024",
    title: "Fractured Spectrum",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "prisoner-of-the-sun",
    image: "/artworks/pots.jpg",
    status: "Sold",
    year: "2023",
    title: "Prisoner Of The Sun",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "theg",
    image: "/artworks/theG.jpg",
    status: "Available",
    year: "2024",
    title: "The G",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "chromatic",
    image: "/artworks/chromatic.jpg",
    status: "Reserved",
    year: "2022",
    title: "Chromatic",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "mask",
    image: "/artworks/mask.jpg",
    status: "Available",
    year: "2025",
    title: "Mask",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
  {
    slug: "voodoo",
    image: "/artworks/voodoo.jpg",
    status: "Sold",
    year: "2021",
    title: "Voodoo",
    description: [
      "Original artwork on okume wood canvas.",
      "Size: 100 x 80 cms (39'' x 31'')",
      "Mixed media on okume wood canvas.",
      "Mediums: epoxy resin, acrylics, spray, oil pastel, rust ink.",
      "Signed by the artist. Certificate of Authenticity included.",
    ],
  },
];

export function getArtworkBySlug(slug: string): Artwork | undefined {
  return artworks.find((a) => a.slug === slug);
}
