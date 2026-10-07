export type Department = 'electronics' | 'fashion';

export interface Product {
  id: string;
  slug: string;
  department: Department;
  category: string;
  subcategory?: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badges: string[];
  stock: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  // Electronics specs
  specs?: { label: string; value: string }[];
  keySpec?: string;
  // Fashion attributes
  colors?: { name: string; hex: string }[];
  material?: string;
  bagType?: string;
  closure?: string;
  dimensions?: string;
  careInstructions?: string;
  whatsIncluded?: string[];
}

export interface Category {
  id: string;
  slug: string;
  department: Department;
  name: string;
  image: string;
  description?: string;
  subcategories?: { name: string; slug: string }[];
}

export const categories: Category[] = [
  {
    id: 'cat-mobile',
    slug: 'mobile-phones',
    department: 'electronics',
    name: 'Mobile Phones',
    image: 'https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Latest smartphones for every need',
    subcategories: [
      { name: 'Smartphones', slug: 'smartphones' },
      { name: 'Accessories', slug: 'mobile-accessories' },
      { name: 'Chargers', slug: 'chargers' },
      { name: 'Cables', slug: 'cables' },
    ],
  },
  {
    id: 'cat-laptops',
    slug: 'laptops',
    department: 'electronics',
    name: 'Laptops',
    image: 'https://images.pexels.com/photos/8533587/pexels-photo-8533587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Laptops and computers for work and play',
    subcategories: [
      { name: 'Laptops', slug: 'laptops' },
      { name: 'Monitors', slug: 'monitors' },
      { name: 'Storage', slug: 'storage' },
    ],
  },
  {
    id: 'cat-audio',
    slug: 'audio',
    department: 'electronics',
    name: 'Audio',
    image: 'https://images.pexels.com/photos/33298188/pexels-photo-33298188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Earbuds, headphones and speakers',
    subcategories: [
      { name: 'Earbuds', slug: 'earbuds' },
      { name: 'Headphones', slug: 'headphones' },
      { name: 'Speakers', slug: 'speakers' },
    ],
  },
  {
    id: 'cat-smartwatches',
    slug: 'smart-watches',
    department: 'electronics',
    name: 'Smart Watches',
    image: 'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Wearable tech for fitness and connectivity',
    subcategories: [
      { name: 'Smart Watches', slug: 'smart-watches' },
    ],
  },
  {
    id: 'cat-gaming',
    slug: 'gaming',
    department: 'electronics',
    name: 'Gaming',
    image: 'https://images.pexels.com/photos/14642107/pexels-photo-14642107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Controllers and gaming accessories',
    subcategories: [
      { name: 'Controllers', slug: 'controllers' },
      { name: 'Accessories', slug: 'gaming-accessories' },
    ],
  },
  {
    id: 'cat-storage',
    slug: 'storage',
    department: 'electronics',
    name: 'Storage',
    image: 'https://images.pexels.com/photos/5951759/pexels-photo-5951759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'External drives and memory solutions',
    subcategories: [
      { name: 'External Drives', slug: 'external-drives' },
      { name: 'Memory Cards', slug: 'memory-cards' },
    ],
  },
  {
    id: 'cat-networking',
    slug: 'networking',
    department: 'electronics',
    name: 'Networking',
    image: 'https://images.pexels.com/photos/4218546/pexels-photo-4218546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Routers and connectivity devices',
    subcategories: [
      { name: 'Routers', slug: 'routers' },
      { name: 'Switches', slug: 'switches' },
    ],
  },
  {
    id: 'cat-tablets',
    slug: 'tablets',
    department: 'electronics',
    name: 'Tablets',
    image: 'https://images.pexels.com/photos/38639/mockup-psd-ipad-iphone-38639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Tablets for work and entertainment',
    subcategories: [
      { name: 'Tablets', slug: 'tablets' },
    ],
  },
  // Fashion categories
  {
    id: 'cat-handbags',
    slug: 'ladies-handbags',
    department: 'fashion',
    name: 'Ladies Handbags',
    image: 'https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Handbags selected for everyday style',
    subcategories: [
      { name: 'Shoulder Bags', slug: 'shoulder-bags' },
      { name: 'Tote Bags', slug: 'tote-bags' },
      { name: 'Crossbody', slug: 'crossbody' },
    ],
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    department: 'fashion',
    name: 'Accessories',
    image: 'https://images.pexels.com/photos/22434780/pexels-photo-22434780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    description: 'Wallets and fashion accessories',
    subcategories: [
      { name: 'Wallets', slug: 'wallets' },
      { name: 'Accessories', slug: 'fashion-accessories' },
    ],
  },
];

export const products: Product[] = [
  // ===== ELECTRONICS =====
  // Mobile Phones
  {
    id: 'p-001',
    slug: 'aurora-x5-pro-smartphone',
    department: 'electronics',
    category: 'mobile-phones',
    brand: 'Aurora',
    name: 'Aurora X5 Pro Smartphone',
    description: 'A powerful smartphone with a stunning AMOLED display, triple camera system, and all-day battery life. Designed for those who demand performance and style in equal measure.',
    price: 89990,
    oldPrice: 99990,
    rating: 4.8,
    reviewCount: 342,
    images: [
      'https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/20360361/pexels-photo-20360361.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/11772523/pexels-photo-11772523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE', 'BEST SELLER'],
    stock: 15,
    isBestSeller: true,
    isFeatured: true,
    keySpec: '6.7" AMOLED • 5G • 256GB',
    specs: [
      { label: 'Display', value: '6.7" AMOLED 120Hz' },
      { label: 'Processor', value: 'Octa-core 3.2GHz' },
      { label: 'RAM', value: '12GB' },
      { label: 'Storage', value: '256GB' },
      { label: 'Camera', value: '50MP Triple' },
      { label: 'Battery', value: '5000mAh' },
      { label: 'Connectivity', value: '5G / Wi-Fi 6 / Bluetooth 5.3' },
      { label: 'Operating System', value: 'Android 14' },
    ],
    whatsIncluded: ['Smartphone', 'USB-C Cable', 'Fast Charger', 'Case', 'Documentation'],
  },
  {
    id: 'p-002',
    slug: 'aurora-x3-smartphone',
    department: 'electronics',
    category: 'mobile-phones',
    brand: 'Aurora',
    name: 'Aurora X3 Smartphone',
    description: 'A balanced smartphone with a vibrant display, capable dual camera, and reliable performance for everyday use.',
    price: 54990,
    rating: 4.5,
    reviewCount: 189,
    images: [
      'https://images.pexels.com/photos/20360361/pexels-photo-20360361.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/7068406/pexels-photo-7068406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 23,
    isNew: true,
    keySpec: '6.4" OLED • 128GB',
    specs: [
      { label: 'Display', value: '6.4" OLED 90Hz' },
      { label: 'Processor', value: 'Octa-core 2.4GHz' },
      { label: 'RAM', value: '8GB' },
      { label: 'Storage', value: '128GB' },
      { label: 'Camera', value: '48MP Dual' },
      { label: 'Battery', value: '4500mAh' },
      { label: 'Connectivity', value: '4G / Wi-Fi 5 / Bluetooth 5.1' },
      { label: 'Operating System', value: 'Android 14' },
    ],
    whatsIncluded: ['Smartphone', 'USB-C Cable', 'Charger', 'Documentation'],
  },
  // Laptops
  {
    id: 'p-003',
    slug: 'nimbus-pro-15-laptop',
    department: 'electronics',
    category: 'laptops',
    brand: 'Nimbus',
    name: 'Nimbus Pro 15 Laptop',
    description: 'A premium ultrabook with a stunning 15.6-inch display, powerful processor, and exceptional build quality. Perfect for professionals who need performance on the go.',
    price: 149990,
    oldPrice: 169990,
    rating: 4.9,
    reviewCount: 256,
    images: [
      'https://images.pexels.com/photos/8533587/pexels-photo-8533587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8533592/pexels-photo-8533592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/93405/pexels-photo-93405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE', 'BEST SELLER'],
    stock: 8,
    isBestSeller: true,
    isFeatured: true,
    keySpec: 'Intel i7 • 16GB RAM • 512GB SSD',
    specs: [
      { label: 'Processor', value: 'Intel Core i7-13700H' },
      { label: 'RAM', value: '16GB DDR5' },
      { label: 'Storage', value: '512GB NVMe SSD' },
      { label: 'Display', value: '15.6" IPS 2.5K' },
      { label: 'Resolution', value: '2560 × 1600' },
      { label: 'Graphics', value: 'Intel Iris Xe' },
      { label: 'Operating System', value: 'Windows 11' },
      { label: 'Connectivity', value: 'Wi-Fi 6E / Bluetooth 5.3' },
      { label: 'Ports', value: '2× Thunderbolt 4, USB-A, HDMI' },
      { label: 'Battery', value: '12 hours' },
    ],
    whatsIncluded: ['Laptop', 'Power Adapter', 'USB-C Cable', 'Documentation'],
  },
  {
    id: 'p-004',
    slug: 'nimbus-air-13-laptop',
    department: 'electronics',
    category: 'laptops',
    brand: 'Nimbus',
    name: 'Nimbus Air 13 Laptop',
    description: 'An ultra-thin and lightweight laptop designed for everyday productivity. Features a beautiful display and all-day battery life in a remarkably portable form factor.',
    price: 99990,
    rating: 4.6,
    reviewCount: 178,
    images: [
      'https://images.pexels.com/photos/8533592/pexels-photo-8533592.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8533587/pexels-photo-8533587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 12,
    isNew: true,
    keySpec: 'Intel i5 • 8GB RAM • 256GB SSD',
    specs: [
      { label: 'Processor', value: 'Intel Core i5-1335U' },
      { label: 'RAM', value: '8GB DDR4' },
      { label: 'Storage', value: '256GB NVMe SSD' },
      { label: 'Display', value: '13.3" IPS FHD' },
      { label: 'Resolution', value: '1920 × 1080' },
      { label: 'Graphics', value: 'Intel Iris Xe' },
      { label: 'Operating System', value: 'Windows 11' },
      { label: 'Connectivity', value: 'Wi-Fi 6 / Bluetooth 5.2' },
      { label: 'Ports', value: 'USB-C, USB-A, HDMI' },
      { label: 'Battery', value: '15 hours' },
    ],
    whatsIncluded: ['Laptop', 'Power Adapter', 'Documentation'],
  },
  // Audio - Earbuds
  {
    id: 'p-005',
    slug: 'pulse-buds-pro-wireless-earbuds',
    department: 'electronics',
    category: 'audio',
    brand: 'Pulse',
    name: 'Pulse Buds Pro Wireless Earbuds',
    description: 'Active noise cancellation, premium sound quality, and a comfortable fit. These wireless earbuds deliver an immersive listening experience with up to 30 hours of total battery life.',
    price: 18990,
    oldPrice: 24990,
    rating: 4.7,
    reviewCount: 512,
    images: [
      'https://images.pexels.com/photos/33298188/pexels-photo-33298188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/33298189/pexels-photo-33298189.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/30981655/pexels-photo-30981655.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE', 'BEST SELLER'],
    stock: 45,
    isBestSeller: true,
    isFeatured: true,
    keySpec: 'ANC • 30h Battery • Bluetooth 5.3',
    specs: [
      { label: 'Type', value: 'True Wireless Earbuds' },
      { label: 'Driver', value: '11mm Dynamic' },
      { label: 'Battery', value: '8h earbuds / 30h with case' },
      { label: 'Charging', value: 'USB-C / Wireless' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Features', value: 'ANC, Transparency Mode' },
      { label: 'Water Resistance', value: 'IPX4' },
    ],
    whatsIncluded: ['Earbuds', 'Charging Case', 'Ear Tips (3 sizes)', 'USB-C Cable', 'Documentation'],
  },
  {
    id: 'p-006',
    slug: 'pulse-buds-lite-earbuds',
    department: 'electronics',
    category: 'audio',
    brand: 'Pulse',
    name: 'Pulse Buds Lite Earbuds',
    description: 'Quality sound at an accessible price. These comfortable wireless earbuds offer reliable performance for everyday listening.',
    price: 7990,
    rating: 4.3,
    reviewCount: 234,
    images: [
      'https://images.pexels.com/photos/33797659/pexels-photo-33797659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/34444233/pexels-photo-34444233.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: [],
    stock: 67,
    keySpec: '20h Battery • Bluetooth 5.2',
    specs: [
      { label: 'Type', value: 'True Wireless Earbuds' },
      { label: 'Driver', value: '10mm Dynamic' },
      { label: 'Battery', value: '6h earbuds / 20h with case' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Connectivity', value: 'Bluetooth 5.2' },
      { label: 'Water Resistance', value: 'IPX4' },
    ],
    whatsIncluded: ['Earbuds', 'Charging Case', 'Ear Tips (2 sizes)', 'USB-C Cable'],
  },
  // Audio - Headphones
  {
    id: 'p-007',
    slug: 'pulse-studio-headphones',
    department: 'electronics',
    category: 'audio',
    brand: 'Pulse',
    name: 'Pulse Studio Over-Ear Headphones',
    description: 'Studio-quality over-ear headphones with active noise cancellation and plush memory foam ear cushions for extended listening comfort.',
    price: 27990,
    oldPrice: 32990,
    rating: 4.6,
    reviewCount: 198,
    images: [
      'https://images.pexels.com/photos/33936400/pexels-photo-33936400.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4812923/pexels-photo-4812923.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE'],
    stock: 18,
    isFeatured: true,
    keySpec: 'ANC • 40h Battery • Hi-Res Audio',
    specs: [
      { label: 'Type', value: 'Over-Ear Wireless' },
      { label: 'Driver', value: '40mm Dynamic' },
      { label: 'Battery', value: '40 hours' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Connectivity', value: 'Bluetooth 5.3 / 3.5mm' },
      { label: 'Features', value: 'ANC, Ambient Mode, Multipoint' },
      { label: 'Weight', value: '250g' },
    ],
    whatsIncluded: ['Headphones', 'USB-C Cable', '3.5mm Cable', 'Carrying Case', 'Documentation'],
  },
  // Audio - Speaker
  {
    id: 'p-008',
    slug: 'pulse-boom-bluetooth-speaker',
    department: 'electronics',
    category: 'audio',
    brand: 'Pulse',
    name: 'Pulse Boom Bluetooth Speaker',
    description: 'A portable Bluetooth speaker with deep bass, waterproof design, and 24-hour battery life. Perfect for indoor and outdoor use.',
    price: 12990,
    rating: 4.4,
    reviewCount: 167,
    images: [
      'https://images.pexels.com/photos/14017595/pexels-photo-14017595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4917455/pexels-photo-4917455.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 34,
    isNew: true,
    keySpec: 'IPX7 Waterproof • 24h Battery',
    specs: [
      { label: 'Type', value: 'Portable Bluetooth Speaker' },
      { label: 'Output', value: '20W RMS' },
      { label: 'Battery', value: '24 hours' },
      { label: 'Charging', value: 'USB-C' },
      { label: 'Connectivity', value: 'Bluetooth 5.2' },
      { label: 'Water Resistance', value: 'IPX7' },
      { label: 'Weight', value: '580g' },
    ],
    whatsIncluded: ['Speaker', 'USB-C Cable', 'Carry Strap', 'Documentation'],
  },
  // Smart Watches
  {
    id: 'p-009',
    slug: 'verve-watch-active-smartwatch',
    department: 'electronics',
    category: 'smart-watches',
    brand: 'Verve',
    name: 'Verve Watch Active Smartwatch',
    description: 'A premium smartwatch with health tracking, GPS, and a vibrant AMOLED display. Track your fitness, monitor your health, and stay connected.',
    price: 34990,
    oldPrice: 39990,
    rating: 4.7,
    reviewCount: 289,
    images: [
      'https://images.pexels.com/photos/437038/pexels-photo-437038.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/267391/pexels-photo-267391.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/51011/pexels-photo-51011.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE', 'BEST SELLER'],
    stock: 21,
    isBestSeller: true,
    isFeatured: true,
    keySpec: 'AMOLED • GPS • Heart Rate • 7-day Battery',
    specs: [
      { label: 'Display', value: '1.43" AMOLED' },
      { label: 'Resolution', value: '466 × 466' },
      { label: 'Battery', value: '7 days typical' },
      { label: 'Connectivity', value: 'Bluetooth 5.2 / Wi-Fi' },
      { label: 'Sensors', value: 'Heart Rate, SpO2, Accelerometer, GPS' },
      { label: 'Water Resistance', value: '5 ATM' },
      { label: 'Compatibility', value: 'Android 8+ / iOS 12+' },
    ],
    whatsIncluded: ['Smartwatch', 'Magnetic Charger', 'Extra Strap', 'Documentation'],
  },
  {
    id: 'p-010',
    slug: 'verve-watch-lite-smartwatch',
    department: 'electronics',
    category: 'smart-watches',
    brand: 'Verve',
    name: 'Verve Watch Lite Smartwatch',
    description: 'An affordable smartwatch with essential fitness tracking, notifications, and a sleek design for everyday wear.',
    price: 16990,
    rating: 4.2,
    reviewCount: 156,
    images: [
      'https://images.pexels.com/photos/18662969/pexels-photo-18662969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/31406895/pexels-photo-31406895.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: [],
    stock: 38,
    keySpec: 'Fitness Tracking • 10-day Battery',
    specs: [
      { label: 'Display', value: '1.3" IPS LCD' },
      { label: 'Resolution', value: '360 × 360' },
      { label: 'Battery', value: '10 days typical' },
      { label: 'Connectivity', value: 'Bluetooth 5.1' },
      { label: 'Sensors', value: 'Heart Rate, Accelerometer' },
      { label: 'Water Resistance', value: '3 ATM' },
      { label: 'Compatibility', value: 'Android 7+ / iOS 11+' },
    ],
    whatsIncluded: ['Smartwatch', 'Magnetic Charger', 'Documentation'],
  },
  // Gaming
  {
    id: 'p-011',
    slug: 'apex-controller-pro-gaming-controller',
    department: 'electronics',
    category: 'gaming',
    brand: 'Apex',
    name: 'Apex Controller Pro Gaming Controller',
    description: 'A premium wireless gaming controller with Hall effect sticks, customizable back paddles, and low-latency wireless connectivity.',
    price: 9990,
    oldPrice: 12990,
    rating: 4.5,
    reviewCount: 143,
    images: [
      'https://images.pexels.com/photos/14642107/pexels-photo-14642107.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/15592023/pexels-photo-15592023.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/19931377/pexels-photo-19931377.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE'],
    stock: 29,
    isFeatured: true,
    keySpec: 'Hall Effect Sticks • Wireless • 40h Battery',
    specs: [
      { label: 'Type', value: 'Wireless Gaming Controller' },
      { label: 'Connectivity', value: '2.4GHz / Bluetooth / USB-C' },
      { label: 'Battery', value: '40 hours' },
      { label: 'Sticks', value: 'Hall Effect (no drift)' },
      { label: 'Features', value: 'Back Paddles, Turbo, Vibration' },
      { label: 'Compatibility', value: 'PC, Android, iOS' },
    ],
    whatsIncluded: ['Controller', 'USB-C Cable', '2.4GHz Dongle', 'Documentation'],
  },
  {
    id: 'p-012',
    slug: 'apex-gaming-headset',
    department: 'electronics',
    category: 'gaming',
    brand: 'Apex',
    name: 'Apex Gaming Headset',
    description: 'Immersive gaming headset with surround sound, detachable microphone, and comfortable memory foam ear cushions.',
    price: 8990,
    rating: 4.3,
    reviewCount: 98,
    images: [
      'https://images.pexels.com/photos/374110/pexels-photo-374110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/17112932/pexels-photo-17112932.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 41,
    isNew: true,
    keySpec: '7.1 Surround • Detachable Mic',
    specs: [
      { label: 'Type', value: 'Over-Ear Wired Gaming' },
      { label: 'Driver', value: '50mm' },
      { label: 'Microphone', value: 'Detachable Cardioid' },
      { label: 'Connectivity', value: '3.5mm / USB' },
      { label: 'Features', value: '7.1 Surround, RGB Lighting' },
      { label: 'Weight', value: '320g' },
    ],
    whatsIncluded: ['Headset', 'Detachable Mic', 'USB Adapter', 'Documentation'],
  },
  // Storage
  {
    id: 'p-013',
    slug: 'vault-1tb-external-ssd',
    department: 'electronics',
    category: 'storage',
    brand: 'Vault',
    name: 'Vault 1TB External SSD',
    description: 'Ultra-fast portable SSD with USB 3.2 Gen 2 connectivity. Compact, durable, and perfect for expanding your storage on the go.',
    price: 12990,
    oldPrice: 15990,
    rating: 4.6,
    reviewCount: 212,
    images: [
      'https://images.pexels.com/photos/5951759/pexels-photo-5951759.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/4675007/pexels-photo-4675007.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE'],
    stock: 52,
    isFeatured: true,
    keySpec: '1TB • USB 3.2 Gen 2 • 1050 MB/s',
    specs: [
      { label: 'Capacity', value: '1TB' },
      { label: 'Interface', value: 'USB 3.2 Gen 2 (10Gbps)' },
      { label: 'Read Speed', value: 'Up to 1050 MB/s' },
      { label: 'Write Speed', value: 'Up to 1000 MB/s' },
      { label: 'Form Factor', value: 'Portable SSD' },
      { label: 'Durability', value: 'Shock & Vibration Resistant' },
    ],
    whatsIncluded: ['SSD', 'USB-C Cable', 'USB-A Adapter', 'Documentation'],
  },
  // Networking
  {
    id: 'p-014',
    slug: 'linkpro-wifi6-router',
    department: 'electronics',
    category: 'networking',
    brand: 'LinkPro',
    name: 'LinkPro Wi-Fi 6 Router',
    description: 'A powerful Wi-Fi 6 router with MU-MIMO technology, covering up to 2000 sq ft with fast, reliable connectivity for all your devices.',
    price: 15990,
    rating: 4.4,
    reviewCount: 134,
    images: [
      'https://images.pexels.com/photos/4218546/pexels-photo-4218546.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/29711663/pexels-photo-29711663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 26,
    isNew: true,
    keySpec: 'Wi-Fi 6 • 2000 sq ft • 3 Gbps',
    specs: [
      { label: 'Standard', value: 'Wi-Fi 6 (802.11ax)' },
      { label: 'Coverage', value: 'Up to 2000 sq ft' },
      { label: 'Speed', value: 'Up to 3 Gbps' },
      { label: 'Bands', value: 'Dual Band (2.4 + 5GHz)' },
      { label: 'Ports', value: '4× Gigabit LAN, 1× Gigabit WAN' },
      { label: 'Features', value: 'MU-MIMO, OFDMA, WPA3' },
    ],
    whatsIncluded: ['Router', 'Power Adapter', 'Ethernet Cable', 'Documentation'],
  },
  // Tablets
  {
    id: 'p-015',
    slug: 'aurora-tab-11-tablet',
    department: 'electronics',
    category: 'tablets',
    brand: 'Aurora',
    name: 'Aurora Tab 11 Tablet',
    description: 'An 11-inch tablet with a stunning display, powerful processor, and support for stylus and keyboard. Perfect for work, creativity, and entertainment.',
    price: 64990,
    oldPrice: 74990,
    rating: 4.5,
    reviewCount: 178,
    images: [
      'https://images.pexels.com/photos/38639/mockup-psd-ipad-iphone-38639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE'],
    stock: 14,
    isFeatured: true,
    keySpec: '11" Display • 128GB • Stylus Support',
    specs: [
      { label: 'Display', value: '11" IPS 2K' },
      { label: 'Resolution', value: '2000 × 1200' },
      { label: 'Processor', value: 'Octa-core 2.8GHz' },
      { label: 'RAM', value: '6GB' },
      { label: 'Storage', value: '128GB' },
      { label: 'Battery', value: '7600mAh' },
      { label: 'Connectivity', value: 'Wi-Fi 6 / Bluetooth 5.2' },
      { label: 'Operating System', value: 'Android 13' },
    ],
    whatsIncluded: ['Tablet', 'USB-C Cable', 'Charger', 'Documentation'],
  },

  // ===== FASHION =====
  // Ladies Handbags
  {
    id: 'p-101',
    slug: 'milano-classic-leather-handbag',
    department: 'fashion',
    category: 'ladies-handbags',
    brand: 'Milano',
    name: 'Milano Classic Leather Handbag',
    description: 'A timeless handbag crafted from premium leather with a structured silhouette. Features a spacious interior with multiple compartments for everyday organization.',
    price: 18990,
    oldPrice: 24990,
    rating: 4.8,
    reviewCount: 156,
    images: [
      'https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/27174573/pexels-photo-27174573.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/27046143/pexels-photo-27046143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE', 'BEST SELLER'],
    stock: 10,
    isBestSeller: true,
    isFeatured: true,
    colors: [
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Beige', hex: '#D2B48C' },
    ],
    material: 'Premium Leather',
    bagType: 'Shoulder Bag',
    closure: 'Zip',
    dimensions: '30 × 22 × 12 cm',
    careInstructions: 'Wipe with a soft dry cloth. Store in dust bag when not in use. Avoid prolonged exposure to sunlight and moisture.',
    whatsIncluded: ['Handbag', 'Dust Bag', 'Care Card'],
  },
  {
    id: 'p-102',
    slug: 'milano-elegant-tote-bag',
    department: 'fashion',
    category: 'ladies-handbags',
    brand: 'Milano',
    name: 'Milano Elegant Tote Bag',
    description: 'A spacious tote bag in elegant dark leather with contrasting handles. Perfect for work or weekends, combining practicality with sophisticated style.',
    price: 22990,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.pexels.com/photos/27174573/pexels-photo-27174573.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 7,
    isNew: true,
    isFeatured: true,
    colors: [
      { name: 'Dark Brown', hex: '#654321' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    material: 'Leather',
    bagType: 'Tote Bag',
    closure: 'Magnetic Snap',
    dimensions: '35 × 28 × 14 cm',
    careInstructions: 'Wipe with a soft dry cloth. Store in dust bag when not in use.',
    whatsIncluded: ['Tote Bag', 'Dust Bag', 'Care Card'],
  },
  {
    id: 'p-103',
    slug: 'milano-crocodile-texture-handbag',
    department: 'fashion',
    category: 'ladies-handbags',
    brand: 'Milano',
    name: 'Milano Crocodile Texture Handbag',
    description: 'A statement handbag with luxurious crocodile-textured leather. The elegant design features refined hardware and a versatile crossbody strap.',
    price: 27990,
    oldPrice: 32990,
    rating: 4.9,
    reviewCount: 67,
    images: [
      'https://images.pexels.com/photos/27046143/pexels-photo-27046143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/27046146/pexels-photo-27046146.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE', 'BEST SELLER'],
    stock: 5,
    isBestSeller: true,
    isFeatured: true,
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Brown', hex: '#8B4513' },
    ],
    material: 'Textured Leather',
    bagType: 'Crossbody',
    closure: 'Zip',
    dimensions: '28 × 20 × 10 cm',
    careInstructions: 'Wipe with a soft dry cloth. Store in dust bag when not in use. Avoid contact with water.',
    whatsIncluded: ['Handbag', 'Adjustable Strap', 'Dust Bag', 'Care Card'],
  },
  {
    id: 'p-104',
    slug: 'milano-suspended-black-handbag',
    department: 'fashion',
    category: 'ladies-handbags',
    brand: 'Milano',
    name: 'Milano Suspended Black Handbag',
    description: 'A modern minimalist handbag with clean lines and a sleek silhouette. The understated design makes it a versatile addition to any wardrobe.',
    price: 16990,
    rating: 4.5,
    reviewCount: 112,
    images: [
      'https://images.pexels.com/photos/26736144/pexels-photo-26736144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/27046146/pexels-photo-27046146.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: [],
    stock: 15,
    colors: [
      { name: 'Black', hex: '#1A1A1A' },
    ],
    material: 'Leather',
    bagType: 'Shoulder Bag',
    closure: 'Magnetic Snap',
    dimensions: '26 × 18 × 8 cm',
    careInstructions: 'Wipe with a soft dry cloth. Store in dust bag when not in use.',
    whatsIncluded: ['Handbag', 'Dust Bag'],
  },
  {
    id: 'p-105',
    slug: 'milano-orange-accent-handbag',
    department: 'fashion',
    category: 'ladies-handbags',
    brand: 'Milano',
    name: 'Milano Orange Accent Handbag',
    description: 'A vibrant handbag with a striking orange leather and gold accent. A perfect statement piece to elevate any outfit.',
    price: 19990,
    oldPrice: 25990,
    rating: 4.6,
    reviewCount: 54,
    images: [
      'https://images.pexels.com/photos/8801079/pexels-photo-8801079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/10919291/pexels-photo-10919291.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE'],
    stock: 8,
    colors: [
      { name: 'Orange', hex: '#E85D04' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    material: 'Leather',
    bagType: 'Shoulder Bag',
    closure: 'Zip',
    dimensions: '29 × 21 × 11 cm',
    careInstructions: 'Wipe with a soft dry cloth. Store in dust bag when not in use. Keep away from direct sunlight.',
    whatsIncluded: ['Handbag', 'Dust Bag', 'Care Card'],
  },
  {
    id: 'p-106',
    slug: 'milano-pastel-collection-handbag',
    department: 'fashion',
    category: 'ladies-handbags',
    brand: 'Milano',
    name: 'Milano Pastel Collection Handbag',
    description: 'Part of our pastel collection, this handbag features soft tones and a contemporary design. Light, stylish, and perfect for spring.',
    price: 14990,
    rating: 4.4,
    reviewCount: 43,
    images: [
      'https://images.pexels.com/photos/8335273/pexels-photo-8335273.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/8801079/pexels-photo-8801079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 12,
    isNew: true,
    colors: [
      { name: 'Pastel Pink', hex: '#F4C2C2' },
      { name: 'Pastel Blue', hex: '#AAC6E2' },
      { name: 'Pastel Green', hex: '#B2D8B2' },
    ],
    material: 'Vegan Leather',
    bagType: 'Tote Bag',
    closure: 'Magnetic Snap',
    dimensions: '32 × 25 × 12 cm',
    careInstructions: 'Wipe with a damp cloth. Store in dust bag when not in use.',
    whatsIncluded: ['Handbag', 'Dust Bag'],
  },
  // Accessories
  {
    id: 'p-107',
    slug: 'milano-premium-leather-wallet',
    department: 'fashion',
    category: 'accessories',
    brand: 'Milano',
    name: 'Milano Premium Leather Wallet',
    description: 'A slim leather wallet with card slots, a note compartment, and a coin pocket. Crafted with the same attention to detail as our handbags.',
    price: 5990,
    oldPrice: 7990,
    rating: 4.6,
    reviewCount: 98,
    images: [
      'https://images.pexels.com/photos/22434780/pexels-photo-22434780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/6444094/pexels-photo-6444094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['SALE'],
    stock: 30,
    isFeatured: true,
    colors: [
      { name: 'Red', hex: '#DC2626' },
      { name: 'Beige', hex: '#D2B48C' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    material: 'Premium Leather',
    bagType: 'Wallet',
    closure: 'Zip',
    dimensions: '19 × 10 × 2 cm',
    careInstructions: 'Wipe with a soft dry cloth. Avoid overfilling to maintain shape.',
    whatsIncluded: ['Wallet', 'Gift Box'],
  },
  {
    id: 'p-108',
    slug: 'milano-studio-leather-wallet',
    department: 'fashion',
    category: 'accessories',
    brand: 'Milano',
    name: 'Milano Studio Leather Wallet',
    description: 'A compact bi-fold wallet with premium leather construction. Multiple card slots and a clear ID window for everyday convenience.',
    price: 4490,
    rating: 4.3,
    reviewCount: 67,
    images: [
      'https://images.pexels.com/photos/6444094/pexels-photo-6444094.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      'https://images.pexels.com/photos/20015770/pexels-photo-20015770.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ],
    badges: ['NEW'],
    stock: 25,
    isNew: true,
    colors: [
      { name: 'Red', hex: '#DC2626' },
      { name: 'Black', hex: '#1A1A1A' },
    ],
    material: 'Leather',
    bagType: 'Wallet',
    closure: 'Snap',
    dimensions: '18 × 9 × 2 cm',
    careInstructions: 'Wipe with a soft dry cloth.',
    whatsIncluded: ['Wallet', 'Gift Box'],
  },
];

// Helper functions
export function getProductsByDepartment(dept: Department): Product[] {
  return products.filter((p) => p.department === dept);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoriesByDepartment(dept: Department): Category[] {
  return categories.filter((c) => c.department === dept);
}

export function getBestSellers(dept: Department): Product[] {
  return products.filter((p) => p.department === dept && p.isBestSeller);
}

export function getNewArrivals(dept?: Department): Product[] {
  return products.filter((p) => (dept ? p.department === dept : true) && p.isNew);
}

export function getFeaturedProducts(dept: Department): Product[] {
  return products.filter((p) => p.department === dept && p.isFeatured);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return products
    .filter((p) => p.department === product.department && p.category === product.category && p.id !== product.id)
    .slice(0, count);
}

export function searchProducts(query: string): { electronics: Product[]; fashion: Product[] } {
  const q = query.toLowerCase().trim();
  if (!q) return { electronics: [], fashion: [] };
  const matches = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
  return {
    electronics: matches.filter((p) => p.department === 'electronics'),
    fashion: matches.filter((p) => p.department === 'fashion'),
  };
}

export function formatPrice(price: number): string {
  return 'LKR ' + price.toLocaleString('en-US');
}

export const brands = {
  electronics: ['Aurora', 'Nimbus', 'Pulse', 'Verve', 'Apex', 'Vault', 'LinkPro'],
  fashion: ['Milano'],
};

export const allBrands = [...new Set([...brands.electronics, ...brands.fashion])];
