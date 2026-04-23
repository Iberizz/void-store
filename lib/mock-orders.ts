export type Order = {
  id: string
  product: string
  image: string
  amount: number
  date: string
  status: 'Delivered' | 'Shipped' | 'Processing'
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'VOID-2025-001',
    product: 'VØID Pro — Obsidian Black',
    image: '/images/void-pro-transparent.png',
    amount: 890,
    date: 'Dec 14, 2025',
    status: 'Delivered',
  },
  {
    id: 'VOID-2025-002',
    product: 'VØID Air — Obsidian Black',
    image: '/images/void-air-transparent.png',
    amount: 590,
    date: 'Jan 03, 2026',
    status: 'Delivered',
  },
  {
    id: 'VOID-2026-001',
    product: 'VØID Studio — AW25',
    image: '/images/void-studio.png',
    amount: 1290,
    date: 'Mar 22, 2026',
    status: 'Shipped',
  },
  {
    id: 'VOID-2026-002',
    product: 'VØID Pro White — AW25',
    image: '/images/void-pro-white.png',
    amount: 890,
    date: 'Apr 18, 2026',
    status: 'Processing',
  },
]
