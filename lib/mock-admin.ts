export type AdminOrder = {
  id: string
  customer: string
  email: string
  product: string
  image: string
  amount: number
  date: string
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled'
}

export type AdminProduct = {
  id: string
  name: string
  image: string
  price: number
  category: string
  stock: number
  sales: number
  revenue: number
}

export type AdminUser = {
  id: string
  name: string
  email: string
  joined: string
  orders: number
  spent: number
  status: 'Active' | 'Inactive'
}

export type MonthlyRevenue = {
  month: string
  revenue: number
  orders: number
}

// ── Monthly revenue (12 months) ──────────────────────────────────────────────
export const MONTHLY_REVENUE: MonthlyRevenue[] = [
  { month: 'May',  revenue: 8_540,  orders: 9  },
  { month: 'Jun',  revenue: 11_230, orders: 13 },
  { month: 'Jul',  revenue: 9_870,  orders: 11 },
  { month: 'Aug',  revenue: 13_450, orders: 15 },
  { month: 'Sep',  revenue: 16_780, orders: 18 },
  { month: 'Oct',  revenue: 14_320, orders: 16 },
  { month: 'Nov',  revenue: 21_650, orders: 24 },
  { month: 'Dec',  revenue: 28_940, orders: 32 },
  { month: 'Jan',  revenue: 18_760, orders: 21 },
  { month: 'Feb',  revenue: 22_380, orders: 25 },
  { month: 'Mar',  revenue: 19_540, orders: 22 },
  { month: 'Apr',  revenue: 26_820, orders: 30 },
]

// ── Sparkline data (weekly points for each KPI) ──────────────────────────────
export const REVENUE_SPARKLINE  = [8540, 11230, 9870, 13450, 16780, 14320, 21650, 28940, 18760, 22380, 19540, 26820]
export const ORDERS_SPARKLINE   = [9, 13, 11, 15, 18, 16, 24, 32, 21, 25, 22, 30]
export const CUSTOMERS_SPARKLINE = [42, 47, 51, 58, 63, 69, 75, 84, 89, 96, 102, 111]
export const AOV_SPARKLINE      = [949, 864, 897, 897, 932, 895, 902, 904, 893, 895, 888, 894]

// ── KPI summary ──────────────────────────────────────────────────────────────
export const KPI = {
  revenue:   { value: 212_280, trend: +12.4, label: 'Total Revenue',       unit: '€', period: 'vs last month' },
  orders:    { value: 236,     trend: +8.7,  label: 'Orders',              unit: '',  period: 'vs last month' },
  customers: { value: 111,     trend: +9.3,  label: 'Active Customers',    unit: '',  period: 'vs last month' },
  aov:       { value: 894,     trend: -2.1,  label: 'Avg. Order Value',    unit: '€', period: 'vs last month' },
}

// ── All orders ───────────────────────────────────────────────────────────────
export const ADMIN_ORDERS: AdminOrder[] = [
  { id: 'VOID-2026-042', customer: 'Maxime Laurent',  email: 'maxime@example.com',  product: 'VØID Studio — AW25',       image: '/images/void-studio.png',         amount: 1290, date: 'Apr 21, 2026', status: 'Processing' },
  { id: 'VOID-2026-041', customer: 'Sara Ibáñez',     email: 'sara@example.com',    product: 'VØID Pro White — AW25',    image: '/images/void-pro-white.png',      amount: 890,  date: 'Apr 20, 2026', status: 'Processing' },
  { id: 'VOID-2026-040', customer: 'Jonas Meier',     email: 'jonas@example.com',   product: 'VØID Air — Obsidian',      image: '/images/void-air-transparent.png',amount: 590,  date: 'Apr 19, 2026', status: 'Shipped'    },
  { id: 'VOID-2026-039', customer: 'Léa Moreau',      email: 'lea@example.com',     product: 'VØID Pro — Obsidian',      image: '/images/void-pro-transparent.png',amount: 890,  date: 'Apr 18, 2026', status: 'Shipped'    },
  { id: 'VOID-2026-038', customer: 'Ryo Tanaka',      email: 'ryo@example.com',     product: 'VØID Studio — AW25',       image: '/images/void-studio.png',         amount: 1290, date: 'Apr 17, 2026', status: 'Delivered'  },
  { id: 'VOID-2026-037', customer: 'Amina Diallo',    email: 'amina@example.com',   product: 'VØID Air White — AW25',    image: '/images/void-air-white.png',      amount: 590,  date: 'Apr 16, 2026', status: 'Delivered'  },
  { id: 'VOID-2026-036', customer: 'Thomas Becker',   email: 'thomas@example.com',  product: 'VØID Pro — Obsidian',      image: '/images/void-pro-transparent.png',amount: 890,  date: 'Apr 15, 2026', status: 'Delivered'  },
  { id: 'VOID-2026-035', customer: 'Chiara Romano',   email: 'chiara@example.com',  product: 'VØID Pro White — AW25',    image: '/images/void-pro-white.png',      amount: 890,  date: 'Apr 14, 2026', status: 'Cancelled'  },
]

// ── Products ─────────────────────────────────────────────────────────────────
export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'void-pro',          name: 'VØID Pro',          image: '/images/void-pro-transparent.png',  price: 890,  category: 'Over-ear', stock: 48, sales: 94,  revenue: 83_660 },
  { id: 'void-air',          name: 'VØID Air',          image: '/images/void-air-transparent.png',  price: 590,  category: 'In-ear',   stock: 62, sales: 71,  revenue: 41_890 },
  { id: 'void-studio',       name: 'VØID Studio',       image: '/images/void-studio.png',           price: 1290, category: 'Studio',   stock: 19, sales: 38,  revenue: 49_020 },
  { id: 'void-pro-white',    name: 'VØID Pro White',    image: '/images/void-pro-white.png',        price: 890,  category: 'Over-ear', stock: 31, sales: 22,  revenue: 19_580 },
  { id: 'void-air-white',    name: 'VØID Air White',    image: '/images/void-air-white.png',        price: 590,  category: 'In-ear',   stock: 44, sales: 11,  revenue:  6_490 },
  { id: 'void-studio-white', name: 'VØID Studio White', image: '/images/void-studio-white.png',     price: 1290, category: 'Studio',   stock: 8,  sales:  9,  revenue: 11_610 },
]

// ── Users ────────────────────────────────────────────────────────────────────
export const ADMIN_USERS: AdminUser[] = [
  { id: '1', name: 'Maxime Laurent',  email: 'maxime@example.com',  joined: 'Jan 2025', orders: 6,  spent: 5_340, status: 'Active'   },
  { id: '2', name: 'Sara Ibáñez',     email: 'sara@example.com',    joined: 'Mar 2025', orders: 4,  spent: 3_560, status: 'Active'   },
  { id: '3', name: 'Jonas Meier',     email: 'jonas@example.com',   joined: 'Jun 2025', orders: 3,  spent: 2_670, status: 'Active'   },
  { id: '4', name: 'Léa Moreau',      email: 'lea@example.com',     joined: 'Sep 2025', orders: 5,  spent: 4_450, status: 'Active'   },
  { id: '5', name: 'Ryo Tanaka',      email: 'ryo@example.com',     joined: 'Oct 2025', orders: 2,  spent: 2_580, status: 'Active'   },
  { id: '6', name: 'Amina Diallo',    email: 'amina@example.com',   joined: 'Nov 2025', orders: 3,  spent: 2_370, status: 'Active'   },
  { id: '7', name: 'Thomas Becker',   email: 'thomas@example.com',  joined: 'Dec 2025', orders: 4,  spent: 3_560, status: 'Active'   },
  { id: '8', name: 'Chiara Romano',   email: 'chiara@example.com',  joined: 'Jan 2026', orders: 1,  spent: 890,   status: 'Inactive' },
]
