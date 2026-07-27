export interface SelectionItem {
  id: string;
  name: string;
  image: string;
  category?: string;
  available: boolean;
  targetPath?: string;
  subtext?: string;
  brandColor?: string;
  badge?: string;
  flagEmoji?: string;
}

export const COUNTRIES: SelectionItem[] = [
  {
    id: 'nigeria',
    name: 'Nigeria',
    image: '/assets/nigeria.png',
    flagEmoji: '🇳🇬',
    available: true,
    targetPath: '/nigeria-banks',
    subtext: 'Instant Bank Transfer',
    brandColor: 'from-emerald-500/10 to-green-500/10',
    badge: 'Popular'
  },
  {
    id: 'usa',
    name: 'USA',
    image: '/assets/usa.png',
    flagEmoji: '🇺🇸',
    available: false,
    targetPath: '/not-available',
    subtext: 'ACH & Wire Transfer',
    brandColor: 'from-blue-500/10 to-indigo-500/10'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    image: '/assets/uk.png',
    flagEmoji: '🇬🇧',
    available: false,
    targetPath: '/not-available',
    subtext: 'FPS & BACS System',
    brandColor: 'from-sky-500/10 to-blue-500/10'
  },
  {
    id: 'southafrica',
    name: 'South Africa',
    image: '/assets/southafrica.png',
    flagEmoji: '🇿🇦',
    available: false,
    targetPath: '/not-available',
    subtext: 'EFT & Real-time Pay',
    brandColor: 'from-amber-500/10 to-emerald-500/10'
  }
];

export const OTHER_SERVICES: SelectionItem[] = [
  {
    id: 'gcash',
    name: 'GCash',
    image: '/assets/gcash.png',
    available: true,
    targetPath: '/gcash/receipt',
    subtext: 'Express Send Receipt',
    brandColor: 'from-blue-500/10 to-cyan-500/10',
    badge: 'Popular'
  },
  {
    id: 'cashapp',
    name: 'Cash App',
    image: '/assets/cashapp.png',
    available: true,
    targetPath: '/cashapp',
    subtext: '$Cashtag Payout',
    brandColor: 'from-emerald-500/10 to-green-500/10',
    badge: 'Templates'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    image: '/assets/paypal.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'Global Email Payout',
    brandColor: 'from-indigo-500/10 to-blue-500/10'
  },
  {
    id: 'wallets',
    name: 'Crypto Wallets',
    image: '/assets/wallets.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'USDT, BTC & Multi-chain',
    brandColor: 'from-purple-500/10 to-amber-500/10',
    badge: 'Web3'
  }
];

export const ALL_NIGERIAN_BANKS = [
  'Access Bank',
  'GTBank',
  'Zenith Bank',
  'UBA',
  'First Bank',
  'Fidelity Bank',
  'Stanbic IBTC',
  'FCMB',
  'Union Bank',
  'Wema Bank (ALAT)',
  'Polaris Bank',
  'Sterling Bank',
  'Keystone Bank',
  'Ecobank',
  'Providus Bank',
  'Titan Trust Bank',
  'Kuda',
  'OPay',
  'PalmPay',
  'Moniepoint',
];

export const NIGERIA_BANKS: SelectionItem[] = [
  {
    id: 'access',
    name: 'Access Bank',
    image: '/assets/access.png',
    available: true,
    targetPath: '/nigeria-banks/access/receipt',
    subtext: 'Commercial Bank Preview',
    brandColor: 'from-orange-500/10 to-amber-500/10',
    badge: 'Receipt Layout'
  },
  {
    id: 'gtbank',
    name: 'GTBank',
    image: '/assets/gtbank.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'Guaranty Trust Bank',
    brandColor: 'from-orange-600/10 to-red-500/10'
  },
  {
    id: 'uba',
    name: 'UBA',
    image: '/assets/uba.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'United Bank for Africa',
    brandColor: 'from-red-600/10 to-rose-500/10'
  },
  {
    id: 'zenith',
    name: 'Zenith Bank',
    image: '/assets/zenith.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'Zenith Bank Plc',
    brandColor: 'from-rose-600/10 to-red-600/10'
  },
  {
    id: 'firstbank',
    name: 'First Bank',
    image: '/assets/firstbank.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'First Bank of Nigeria',
    brandColor: 'from-blue-900/10 to-amber-500/10'
  },
  {
    id: 'fidelity',
    name: 'Fidelity Bank',
    image: '/assets/fidelity.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'Fidelity Commercial',
    brandColor: 'from-emerald-600/10 to-blue-600/10'
  },
  {
    id: 'stanbic',
    name: 'Stanbic IBTC',
    image: '/logo.png',
    available: true,
    targetPath: '/nigeria-banks/stanbic/receipt',
    subtext: 'Stanbic IBTC Mobile Banking',
    brandColor: 'from-blue-600/10 to-indigo-600/10',
    badge: 'Receipt Layout'
  },
  {
    id: 'opay',
    name: 'OPay',
    image: '/assets/opay.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'OPay Digital Services',
    brandColor: 'from-emerald-500/10 to-teal-500/10',
    badge: 'Popular Fintech'
  },
  {
    id: 'palmpay',
    name: 'PalmPay',
    image: '/assets/palmpay.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'PalmPay Financials',
    brandColor: 'from-purple-600/10 to-violet-500/10'
  },
  {
    id: 'moniepoint',
    name: 'Moniepoint',
    image: '/moniepoint.png',
    available: true,
    targetPath: '/nigeria-banks/moniepoint/receipt',
    subtext: 'Moniepoint MFB',
    brandColor: 'from-blue-700/10 to-amber-500/10',
    badge: 'Popular MFB'
  },
  {
    id: 'kuda',
    name: 'Kuda',
    image: '/assets/kuda.png',
    available: false,
    targetPath: '/not-available',
    subtext: 'Kuda Microfinance Bank',
    brandColor: 'from-purple-700/10 to-indigo-600/10',
    badge: 'Digital Bank'
  }
];
