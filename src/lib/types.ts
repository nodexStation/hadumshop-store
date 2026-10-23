export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  image: string;
  description?: string;
}

export interface ProductVariant {
  id: string;
  label: string; // e.g. "Size: M" or "Colour: Sand"
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  price: number; // BDT
  compareAtPrice?: number | null;
  description: string;
  images: string[];
  variants: ProductVariant[];
  stock: number; // total when no variants used
  featured: boolean;
  bestSeller: boolean; // owner-marked only — never fabricated rankings
  isNew: boolean;
  demo: boolean; // true = demo data, replace in admin
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  variantLabel?: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string; // HDM-YYYYMMDD-XXXX
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    notes?: string;
  };
  paymentMethod: "cod";
  status: OrderStatus;
  demo: boolean;
  createdAt: string;
}

export interface StoreSettings {
  announcement: string;
  heroHeadline: string;
  heroSubtext: string;
  heroImage: string;
  promoTitle: string;
  promoText: string;
  promoCta: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryAbove: number | null;
  instagram: string;
  email: string;
}

export interface StoreData {
  settings: StoreSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  subscribers: { email: string; createdAt: string }[];
  testimonials: { name: string; text: string; verified: boolean }[];
}
