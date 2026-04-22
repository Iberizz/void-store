export interface ProductDetail { label: string; value: string }

export interface ProductData {
  id:          string
  slug:        string
  name:        string
  category:    string
  tagline:     string
  price:       number
  priceLabel:  string
  description: string
  specs:       string[]
  images:      { black: string[]; white: string[] }
  details:     ProductDetail[]
}

export const PRODUCTS_DATA: Record<string, ProductData> = {
  'void-pro': {
    id:          'void-pro',
    slug:        'void-pro',
    name:        'VØID Pro',
    category:    'Over-ear',
    tagline:     'VØID PRO — AW25',
    price:       890,
    priceLabel:  '€890',
    description: 'Dual beryllium drivers. Active noise cancellation at −42 dB. Forty-eight hours of autonomy on a single charge. The Pro is the instrument.',
    specs:       ['40MM', 'BERYLLIUM', 'ANC −42dB', '48H'],
    images: {
      black: ['/images/void-pro.png'],
      white: ['/images/void-pro-white.png'],
    },
    details: [
      { label: 'Drivers',       value: '40mm Beryllium — dual configuration' },
      { label: 'ANC',           value: '−42 dB active noise cancellation' },
      { label: 'Battery',       value: '48 hours · USB-C fast charge (15min → 5h)' },
      { label: 'Weight',        value: '285g' },
      { label: 'Connectivity',  value: 'Bluetooth 5.3 · aptX Lossless · multipoint' },
      { label: 'Warranty',      value: '2 years international' },
    ],
  },
  'void-air': {
    id:          'void-air',
    slug:        'void-air',
    name:        'VØID Air',
    category:    'In-ear',
    tagline:     'VØID AIR — AW25',
    price:       590,
    priceLabel:  '€590',
    description: 'Micro beryllium drivers in a featherweight form. Thirty-two hours total. Silence, wherever you go.',
    specs:       ['10MM', 'BERYLLIUM', 'ANC −38dB', '32H'],
    images: {
      black: ['/images/void-air.png'],
      white: ['/images/void-air-white.png'],
    },
    details: [
      { label: 'Drivers',       value: '10mm Beryllium' },
      { label: 'ANC',           value: '−38 dB active noise cancellation' },
      { label: 'Battery',       value: '8h buds + 24h case · wireless charging' },
      { label: 'Weight',        value: '5.4g per bud' },
      { label: 'Connectivity',  value: 'Bluetooth 5.3 · aptX Adaptive' },
      { label: 'Warranty',      value: '2 years international' },
    ],
  },
  'void-studio': {
    id:          'void-studio',
    slug:        'void-studio',
    name:        'VØID Studio',
    category:    'Studio',
    tagline:     'VØID STUDIO — AW25',
    price:       1290,
    priceLabel:  '€1,290',
    description: 'Open-back. Reference-grade. For those who need to hear everything exactly as it is. No flattery. No compromise.',
    specs:       ['50MM', 'BERYLLIUM', 'OPEN-BACK', '150Ω'],
    images: {
      black: ['/images/void-studio.png'],
      white: ['/images/void-studio-white.png'],
    },
    details: [
      { label: 'Drivers',       value: '50mm Beryllium open-back' },
      { label: 'Type',          value: 'Wired · balanced XLR + 3.5mm jack' },
      { label: 'Impedance',     value: '150Ω' },
      { label: 'Weight',        value: '380g' },
      { label: 'Cable',         value: '3m detachable OFC copper' },
      { label: 'Warranty',      value: '2 years international' },
    ],
  },
}
