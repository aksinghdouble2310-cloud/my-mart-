export type UserRole = 'retail' | 'wholesale' | 'delivery' | 'admin';

export type Language = 'en' | 'ne';

export interface Product {
  id: string;
  sku: string;
  name: string;
  nepaliName: string;
  brand: string;
  category: string;
  subcategory: string;
  image: string;
  description: string;
  nepaliDescription?: string;
  unit: string;
  retailPrice: number;
  originalRetailPrice?: number;
  wholesalePrice: number; // per carton / case or bulk unit
  cartonUnits: number; // e.g. 24 pieces per carton
  minWholesaleOrderQty: number; // minimum cartons to order
  inStock: boolean;
  stockCount: number;
  warehouseLocation: string;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tags: string[];
  shelfLife?: string;
  origin: string;
  hsnCode?: string;
  vatPercent: number; // 0 for basic food grains, 13 for standard FMCG
}

export interface CartItem {
  product: Product;
  quantity: number; // units if retail, cartons if wholesale
  isWholesaleTier: boolean;
}

export interface Address {
  id: string;
  label: string; // "Home", "Shop - Balaju", "Main Kirana Branch"
  recipientName: string;
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  streetAddress: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface B2BProfile {
  companyName: string;
  panNumber: string;
  vatRegistered: boolean;
  businessType: 'Kirana Store' | 'Supermarket' | 'Restaurant / Hotel' | 'Wholesale Distributor' | 'Office / Corporate';
  verificationStatus: 'verified' | 'pending' | 'unverified';
  creditLimit: number;
  usedCredit: number;
  paymentTermsDays: number;
  contactPerson: string;
  contactPhone: string;
  taxClearanceUploaded?: boolean;
}

export interface RedeemedVoucher {
  id: string;
  code: string;
  title: string;
  discountAmount: number;
  discountPercentage?: number;
  discountType: 'fixed' | 'shipping' | 'percentage';
  minOrder: number;
  redeemedAt: string;
  isUsed: boolean;
}

export interface PointsHistoryEntry {
  id: string;
  title: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed';
}

export interface RewardVoucher {
  id: string;
  title: string;
  pointsCost: number;
  discountAmount: number;
  discountPercentage?: number;
  discountType: 'fixed' | 'shipping' | 'percentage';
  code: string;
  minOrder: number;
  description: string;
  applicableRole: 'retail' | 'wholesale' | 'all';
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  addresses: Address[];
  b2bProfile?: B2BProfile;
  loyaltyPoints: number;
  redeemedVouchers?: RedeemedVoucher[];
  pointsHistory?: PointsHistoryEntry[];
}

export type OrderStatus =
  | 'confirmed'
  | 'packed'
  | 'dispatched'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned';

export type PaymentMethod =
  | 'esewa'
  | 'khalti'
  | 'fonepay'
  | 'cod'
  | 'wholesale_credit'
  | 'bank_transfer';

export interface OrderTrackingEvent {
  status: OrderStatus;
  title: string;
  timestamp: string;
  description: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerRole: 'retail' | 'wholesale';
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxVat: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'invoiced_30_days';
  deliverySlot: string;
  deliveryAddress: Address;
  status: OrderStatus;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
    vehiclePlate: string;
  };
  trackingEvents: OrderTrackingEvent[];
  deliveryOtp: string;
  returnReason?: string;
  returnDecision?: 'pending' | 'approved' | 'rejected';
}

export interface Category {
  id: string;
  name: string;
  nepaliName: string;
  iconName: string;
  itemCount: number;
  image?: string;
}

export interface PromotionCoupon {
  code: string;
  discountPercentage: number;
  minOrderAmount: number;
  description: string;
  applicableRole?: 'retail' | 'wholesale' | 'all';
}
