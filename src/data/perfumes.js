import bottle from '../assets/bottle.png'
import perfume1 from '../assets/perfume1.png'
import perfume2 from '../assets/perfume2.png'
import perfume3 from '../assets/perfume3.png'
import perfume4 from '../assets/perfume4.png'
import gallery1 from '../assets/gallery-1.png'
import gallery2 from '../assets/gallery-2.png'
import gallery3 from '../assets/gallery-3.png'
import fallen1 from '../assets/blue-perfume.png'
import fallen2 from '../assets/mergenta-perfume.png'
import fallen3 from '../assets/green-perfume.png'
import fallen4 from '../assets/pink-crown-perfume.png'
import fallen5 from '../assets/brown-perfume.png'
import yellowPerfume from '../assets/yellow-perfume.png'
import pinkishPerfume from '../assets/babypink-perfume.png'
import skybluePerfume from '../assets/skyblue-perfume.png'
import greenPerfume from '../assets/green-perfume.png'
import brownPerfume from '../assets/brown-perfume.png'
import peachPerfume from '../assets/peach-perfume.png'
import darkPinkPerfume from '../assets/darkpink-perfume.png'
import pinkCrwonPerfume from '../assets/pink-crown-perfume.png'
import mergentaPerfume from '../assets/mergenta-perfume.png'
import { greaterThanEqual } from 'three/tsl'

/** Catalog used by the boutique diorama and infinite scatter shop. */

export const perfumes = [
  {
    id: 'rose-n-roses',
    name: 'Rose n’Roses',
    note: 'A sparkling rose bouquet with a bright citrus opening.',
    image: perfume1,
    accent: '#f7c6d0',
    glass: '#e8a0b0',
  },
  {
    id: 'blooming-bouquet',
    name: 'Blooming Bouquet',
    note: 'Peony and damask rose — soft, airy, and luminous.',
    image: perfume2,
    accent: '#f9e4ea',
    glass: '#d4a5b0',
  },
  {
    id: 'absolutely-blooming',
    name: 'Absolutely Blooming',
    note: 'An intense floral trail with a creamy musk base.',
    image: perfume3,
    accent: '#e8a0b0',
    glass: '#c97890',
  },
  {
    id: 'parfum',
    name: 'NIVA Parfum',
    note: 'The richest expression — roses wrapped in warm woods.',
    image: perfume4,
    accent: '#f3b8c4',
    glass: '#b86b80',
  },
  {
    id: 'eau-de-parfum',
    name: 'Eau de Parfum',
    note: 'The signature heart — romantic, modern, unmistakably NIVA.',
    image: bottle,
    accent: '#f7c6d0',
    glass: '#dea0ae',
  },
  {
    id: 'rose-essence',
    name: 'Rose Essence',
    note: 'Centifolia rose distilled into a silk-soft trail.',
    image: fallen1,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },
  {
    id: 'cherie',
    name: 'NIVA Chérie',
    note: 'A playful strawberry-rose spark with a velvet finish.',
    image: fallen1,
    accent: '#f3b8c4',
    glass: '#d48a9c',
  },
  {
    id: 'blooming-rose',
    name: 'Blooming Rose',
    note: 'Fresh petals over a sheer white-musk base.',
    image: bottle,
    accent: '#f7c6d0',
    glass: '#e0a8b6',
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    note: 'Deep damask rose with a powdery, intimate dry-down.',
    image: gallery1,
    accent: '#e8a0b0',
    glass: '#a85c72',
  },
  {
    id: 'light-bouquet',
    name: 'Light Bouquet',
    note: 'A sheer, daylight rose for skin that glows.',
    image: gallery2,
    accent: '#f9e4ea',
    glass: '#ecc0ca',
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    note: 'Green stems and peony — a garden at first light.',
    image: gallery3,
    accent: '#f3b8c4',
    glass: '#c9a0aa',
  },
  {
    id: 'amour',
    name: 'NIVA Amour',
    note: 'A love letter in musk, rose, and soft woods.',
    image: bottle,
    accent: '#f7c6d0',
    glass: '#d892a4',
  },
]

// scatter images //
export const scatterPerfumes = [
  {
    id: 'rose-n-roses',
    name: 'Rose n’Roses',
    note: 'A sparkling rose bouquet with a bright citrus opening.',
    image: fallen1,
    accent: '#f7c6d0',
    glass: '#e8a0b0',
  },
  {
    id: 'blooming-bouquet',
    name: 'Blooming Bouquet',
    note: 'Peony and damask rose — soft, airy, and luminous.',
    image: fallen2,
    accent: '#f9e4ea',
    glass: '#d4a5b0',
  },
  {
    id: 'absolutely-blooming',
    name: 'Absolutely Blooming',
    note: 'An intense floral trail with a creamy musk base.',
    image: fallen3,
    accent: '#e8a0b0',
    glass: '#c97890',
  },
  {
    id: 'parfum',
    name: 'NIVA Parfum',
    note: 'The richest expression — roses wrapped in warm woods.',
    image: darkPinkPerfume,
    accent: '#f3b8c4',
    glass: '#b86b80',
  },
  {
    id: 'eau-de-parfum',
    name: 'Eau de Parfum',
    note: 'The signature heart — romantic, modern, unmistakably NIVA.',
    image: fallen5,
    accent: '#f7c6d0',
    glass: '#dea0ae',
  },
  {
    id: 'rose-essence',
    name: 'Rose Essence',
    note: 'Centifolia rose distilled into a silk-soft trail.',
    image: yellowPerfume,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },
  {
    id: 'cherie',
    name: 'NIVA Chérie',
    note: 'A playful strawberry-rose spark with a velvet finish.',
    image: pinkishPerfume,
    accent: '#f3b8c4',
    glass: '#d48a9c',
  },
  {
    id: 'blooming-rose',
    name: 'Blooming Rose',
    note: 'Fresh petals over a sheer white-musk base.',
    image: fallen3,
    accent: '#f7c6d0',
    glass: '#e0a8b6',
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    note: 'Deep damask rose with a powdery, intimate dry-down.',
    image: fallen4,
    accent: '#e8a0b0',
    glass: '#a85c72',
  },
  {
    id: 'light-bouquet',
    name: 'Light Bouquet',
    note: 'A sheer, daylight rose for skin that glows.',
    image: fallen5,
    accent: '#f9e4ea',
    glass: '#ecc0ca',
  },
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    note: 'Green stems and peony — a garden at first light.',
    image: skybluePerfume,
    accent: '#f3b8c4',
    glass: '#c9a0aa',
  },
  {
    id: 'amour',
    name: 'NIVA Amour',
    note: 'A love letter in musk, rose, and soft woods.',
    image: peachPerfume,
    accent: '#f7c6d0',
    glass: '#d892a4',
  },
]



export const wavyPerfumes = [
  {
    id: 'rose-n-roses',
    name: 'Rose n’Roses',
    note: 'A sparkling rose bouquet with a bright citrus opening.',
    image: pinkCrwonPerfume,
    accent: '#f7c6d0',
    glass: '#e8a0b0',
  },
  {
    id: 'blooming-bouquet',
    name: 'Blooming Bouquet',
    note: 'Peony and damask rose — soft, airy, and luminous.',
    image: mergentaPerfume,
    accent: '#f9e4ea',
    glass: '#d4a5b0',
  },
  {
    id: 'absolutely-blooming',
    name: 'Absolutely Blooming',
    note: 'An intense floral trail with a creamy musk base.',
    image: yellowPerfume,
    accent: '#e8a0b0',
    glass: '#c97890',
  },
  {
    id: 'parfum',
    name: 'NIVA Parfum',
    note: 'The richest expression — roses wrapped in warm woods.',
    image: perfume3,
    accent: '#f3b8c4',
    glass: '#b86b80',
  },
  {
    id: 'eau-de-parfum',
    name: 'Eau de Parfum',
    note: 'The signature heart — romantic, modern, unmistakably NIVA.',
    image: darkPinkPerfume,
    accent: '#f7c6d0',
    glass: '#dea0ae',
  },
]

/**
 * Five bottles standing on the grass. Y is replaced with the curved ground height.
 */
export const dioramaPerfumes = [
  { perfumeId: 'rose-n-roses', position: [-1.2, 0, 0.45], scale: 0.82, rotation: 0.16 },
  { perfumeId: 'blooming-bouquet', position: [-0.45, 0, 0.95], scale: 0.9, rotation: -0.1 },
  { perfumeId: 'absolutely-blooming', position: [0.2, 0, 0.4], scale: 1, rotation: 0.04 },
  { perfumeId: 'parfum', position: [0.9, 0, 0.85], scale: 0.88, rotation: -0.16 },
  { perfumeId: 'eau-de-parfum', position: [1.5, 0, 0.3], scale: 0.78, rotation: 0.22 },
]

export function getPerfume(id) {
  return wavyPerfumes.find((p) => p.id === id)
}

// find yours section //


export const findYoursPerfumes = [
  {
    id: 'rose-n-roses',
    name: 'Rose n’Roses',
    note: 'A sparkling rose bouquet with a bright citrus opening.',
    image: darkPinkPerfume,
    accent: '#f7c6d0',
    glass: '#e8a0b0',
  },
  {
    id: 'blooming-bouquet',
    name: 'Blooming Bouquet',
    note: 'Peony and damask rose — soft, airy, and luminous.',
    image: greenPerfume,
    accent: '#f9e4ea',
    glass: '#d4a5b0',
  },
  {
    id: 'absolutely-blooming',
    name: 'Absolutely Blooming',
    note: 'An intense floral trail with a creamy musk base.',
    image: brownPerfume,
    accent: '#e8a0b0',
    glass: '#c97890',
  },
  {
    id: 'parfum',
    name: 'NIVA Parfum',
    note: 'The richest expression — roses wrapped in warm woods.',
    image: skybluePerfume,
    accent: '#f3b8c4',
    glass: '#b86b80',
  },
  {
    id: 'eau-de-parfum',
    name: 'Eau de Parfum',
    note: 'The signature heart — romantic, modern, unmistakably NIVA.',
    image: peachPerfume,
    accent: '#f7c6d0',
    glass: '#dea0ae',
  },
  

]

// fallen from //

export const fallenFromPerfumes = [
  {
    id: 'rose-essence',
    name: 'Rose Essence',
    note: 'Centifolia rose distilled into a silk-soft trail.',
    image: fallen1,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },
  {
    id: 'cherie',
    name: 'NIVA Chérie',
    note: 'A playful strawberry-rose spark with a velvet finish.',
    image: fallen2,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },
  {
    id: 'blooming-rose',
    name: 'Blooming Rose',
    note: 'Fresh petals over a sheer white-musk base.',
    image: fallen3,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },
  {
    id: 'velvet-rose',
    name: 'Velvet Rose',
    note: 'Deep damask rose with a powdery, intimate dry-down.',
    image: fallen4,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },
  {
    id: 'light-bouquet',
    name: 'Light Bouquet',
    note: 'A sheer, daylight rose for skin that glows.',
    image: fallen5,
    accent: '#f9e4ea',
    glass: '#e8b4c0',
  },

]