import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  Product,
  CartItem,
  Order,
  UserProfile,
  PromotionCoupon,
  OrderStatus,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_USER,
  INITIAL_ORDERS,
  PROMO_COUPONS,
} from '../data/mockData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  user: UserProfile;
  updateUser: (u: Partial<UserProfile>) => void;
  products: Product[];
  updateProductStock: (id: string, newStock: number) => void;
  updateProductPrices: (id: string, retail: number, wholesale: number) => void;
  addProduct: (product: Product) => void;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, isWholesaleTier?: boolean) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartVat: number;
  cartDeliveryFee: number;
  cartTotal: number;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  appliedCoupon: PromotionCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  redeemVoucher: (voucher: any) => { success: boolean; message: string };
  orders: Order[];
  placeOrder: (orderDetails: {
    paymentMethod: any;
    deliverySlot: string;
    deliveryAddress: any;
    customerNotes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  requestReturn: (orderId: string, reason: string) => void;
  processReturnDecision: (orderId: string, decision: 'approved' | 'rejected') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  isB2BRegisterOpen: boolean;
  setIsB2BRegisterOpen: (open: boolean) => void;
  selectedTrackingOrderId: string | null;
  setSelectedTrackingOrderId: (id: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('retail');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-001', 'prod-003']);
  const [appliedCoupon, setAppliedCoupon] = useState<PromotionCoupon | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isB2BRegisterOpen, setIsB2BRegisterOpen] = useState<boolean>(false);
  const [selectedTrackingOrderId, setSelectedTrackingOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // If user shifts to wholesale, adapt active tab if on retail specific tab
    if (newRole === 'delivery') {
      setActiveTab('delivery-fleet');
    } else if (newRole === 'admin') {
      setActiveTab('admin');
    } else if (newRole === 'wholesale') {
      // wholesale user can use home or quick-order
      showToast('Switched to B2B Wholesale Pricing Mode');
    } else {
      showToast('Switched to Retail Grocery Mode');
    }
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const updateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockCount: newStock, inStock: newStock > 0 } : p))
    );
    showToast('Inventory updated successfully');
  };

  const updateProductPrices = (id: string, retail: number, wholesale: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, retailPrice: retail, wholesalePrice: wholesale } : p))
    );
    showToast('Product pricing updated successfully');
  };

  const addProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added product "${newProduct.name}" to catalogue`);
  };

  const addToCart = (product: Product, quantity = 1, isWholesaleTier = role === 'wholesale') => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.isWholesaleTier === isWholesaleTier
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.isWholesaleTier === isWholesaleTier
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, isWholesaleTier }];
    });
    showToast(
      isWholesaleTier
        ? `Added ${quantity} carton(s) of ${product.name} at wholesale price`
        : `Added ${quantity} x ${product.name} to cart`
    );
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  // Cart financial calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const cartSubtotal = cart.reduce((acc, item) => {
    const price = item.isWholesaleTier ? item.product.wholesalePrice : item.product.retailPrice;
    return acc + price * item.quantity;
  }, 0);

  const couponDiscount = appliedCoupon
    ? appliedCoupon.discountPercentage > 0
      ? Math.round((cartSubtotal * appliedCoupon.discountPercentage) / 100)
      : (appliedCoupon as any).discountAmount || 0
    : 0;

  const cartDiscount = couponDiscount;

  // Free delivery threshold: Retail = Rs. 1500, Wholesale = Rs. 10000
  const isWholesaleOrder = cart.some((item) => item.isWholesaleTier);
  const deliveryThreshold = isWholesaleOrder ? 10000 : 1500;
  const isFreeDeliveryCoupon = appliedCoupon && (appliedCoupon as any).discountType === 'shipping';
  const cartDeliveryFee =
    isFreeDeliveryCoupon || cartSubtotal === 0 || cartSubtotal >= deliveryThreshold
      ? 0
      : isWholesaleOrder
      ? 350
      : 75;

  // 13% VAT on taxable FMCG items
  const cartVat = Math.round(
    cart.reduce((acc, item) => {
      const price = item.isWholesaleTier ? item.product.wholesalePrice : item.product.retailPrice;
      const taxable = item.product.vatPercent > 0 ? price * item.quantity : 0;
      return acc + (taxable * item.product.vatPercent) / 100;
    }, 0)
  );

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee + cartVat);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    // Check standard promo coupons
    let found: any = PROMO_COUPONS.find((c) => c.code.toUpperCase() === clean);

    // Also check user's redeemed rewards vouchers
    if (!found && user.redeemedVouchers) {
      const redeemedMatch = user.redeemedVouchers.find(
        (v) => v.code.toUpperCase() === clean && !v.isUsed
      );
      if (redeemedMatch) {
        found = {
          code: redeemedMatch.code,
          discountPercentage: redeemedMatch.discountPercentage || 0,
          discountAmount: redeemedMatch.discountAmount,
          discountType: redeemedMatch.discountType,
          minOrderAmount: redeemedMatch.minOrder,
          description: redeemedMatch.title,
        };
      }
    }

    if (!found) {
      return { success: false, message: 'Invalid coupon code' };
    }
    if (cartSubtotal < found.minOrderAmount) {
      return {
        success: false,
        message: `Requires minimum order of Rs. ${found.minOrderAmount.toLocaleString()}`,
      };
    }
    setAppliedCoupon(found);
    showToast(
      found.discountPercentage > 0
        ? `Coupon "${found.code}" applied! ${found.discountPercentage}% discount`
        : `Reward voucher "${found.code}" applied!`
    );
    return { success: true, message: `Coupon applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const redeemVoucher = (voucher: any) => {
    if (user.loyaltyPoints < voucher.pointsCost) {
      return {
        success: false,
        message: `Insufficient loyalty points. You need ${voucher.pointsCost} points, but have ${user.loyaltyPoints}.`,
      };
    }

    const uniqueCode = `${voucher.code}-${Math.floor(100 + Math.random() * 900)}`;
    const newPoints = user.loyaltyPoints - voucher.pointsCost;

    const newRedeemedItem = {
      id: `red-${Date.now()}`,
      code: uniqueCode,
      title: voucher.title,
      discountAmount: voucher.discountAmount,
      discountPercentage: voucher.discountPercentage || 0,
      discountType: voucher.discountType,
      minOrder: voucher.minOrder,
      redeemedAt: new Date().toISOString().split('T')[0],
      isUsed: false,
    };

    const newPointsLog = {
      id: `ph-${Date.now()}`,
      title: `Redeemed: ${voucher.title}`,
      points: -voucher.pointsCost,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'redeemed' as const,
    };

    setUser((prev) => ({
      ...prev,
      loyaltyPoints: newPoints,
      redeemedVouchers: [newRedeemedItem, ...(prev.redeemedVouchers || [])],
      pointsHistory: [newPointsLog, ...(prev.pointsHistory || [])],
    }));

    showToast(`Voucher redeemed! Code "${uniqueCode}" added to your wallet.`);
    return { success: true, message: `Successfully redeemed! Code: ${uniqueCode}` };
  };

  const placeOrder = ({
    paymentMethod,
    deliverySlot,
    deliveryAddress,
  }: {
    paymentMethod: any;
    deliverySlot: string;
    deliveryAddress: any;
    customerNotes?: string;
  }) => {
    const isWholesale = cart.some((item) => item.isWholesaleTier);
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = isWholesale
      ? `MM-B2B-2026-${orderNum}`
      : `MM-KTM-2026-${orderNum}`;

    const newOrder: Order = {
      id: newOrderId,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      customerName: user.name,
      customerPhone: user.phone,
      customerRole: isWholesale ? 'wholesale' : 'retail',
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryFee: cartDeliveryFee,
      taxVat: cartVat,
      total: cartTotal,
      paymentMethod,
      paymentStatus:
        paymentMethod === 'wholesale_credit'
          ? 'invoiced_30_days'
          : paymentMethod === 'cod'
          ? 'pending'
          : 'paid',
      deliverySlot,
      deliveryAddress: deliveryAddress || user.addresses[0],
      status: 'confirmed',
      deliveryPartner: {
        id: 'driver-04',
        name: 'Ramesh Thapa',
        phone: '9818456789',
        vehiclePlate: 'BA 2 PA 8920 (Electric Delivery Van)',
      },
      trackingEvents: [
        {
          status: 'confirmed',
          title: 'Order Confirmed',
          timestamp: 'Just now',
          description: `Order received and assigned to Balaju Central Warehouse.`,
        },
      ],
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.find((c) => c.product.id === prod.id);
        if (cartMatch) {
          const qtyDeducted = cartMatch.isWholesaleTier
            ? cartMatch.quantity * (prod.cartonUnits || 1)
            : cartMatch.quantity;
          const nextStock = Math.max(0, prod.stockCount - qtyDeducted);
          return { ...prod, stockCount: nextStock, inStock: nextStock > 0 };
        }
        return prod;
      })
    );

    // If wholesale credit used, update B2B credit limit
    if (paymentMethod === 'wholesale_credit' && user.b2bProfile) {
      setUser((prev) => ({
        ...prev,
        b2bProfile: prev.b2bProfile
          ? {
              ...prev.b2bProfile,
              usedCredit: prev.b2bProfile.usedCredit + cartTotal,
            }
          : undefined,
      }));
    }

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedTrackingOrderId(newOrder.id);
    showToast(`Order #${newOrder.id} successfully placed!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const eventTitle =
            status === 'packed'
              ? 'Packed & Verified at Depot'
              : status === 'dispatched'
              ? 'Dispatched from Hub'
              : status === 'out_for_delivery'
              ? 'Out for Delivery to Destination'
              : status === 'delivered'
              ? 'Delivered & Handed Over'
              : status === 'cancelled'
              ? 'Order Cancelled'
              : 'Status Updated';

          const newEvent = {
            status,
            title: eventTitle,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            description: note || `Order transitioned to ${status}`,
          };

          return {
            ...order,
            status,
            trackingEvents: [...order.trackingEvents, newEvent],
          };
        }
        return order;
      })
    );
    showToast(`Order #${orderId} marked as ${status}`);
  };

  const requestReturn = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'return_requested',
            returnReason: reason,
            returnDecision: 'pending',
            trackingEvents: [
              ...order.trackingEvents,
              {
                status: 'return_requested',
                title: 'Return Claim Filed',
                timestamp: 'Just now',
                description: `Reason: ${reason}. Under inspection by Quality Assurance team.`,
              },
            ],
          };
        }
        return order;
      })
    );
    showToast('Return claim filed for review');
  };

  const processReturnDecision = (orderId: string, decision: 'approved' | 'rejected') => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nextStatus: OrderStatus = decision === 'approved' ? 'returned' : 'delivered';
          return {
            ...order,
            status: nextStatus,
            returnDecision: decision,
            trackingEvents: [
              ...order.trackingEvents,
              {
                status: nextStatus,
                title: decision === 'approved' ? 'Return Claim Approved' : 'Return Claim Declined',
                timestamp: 'Just now',
                description:
                  decision === 'approved'
                    ? 'Credit refund voucher issued to customer account.'
                    : 'Inspection did not meet return policy criteria.',
              },
            ],
          };
        }
        return order;
      })
    );
    showToast(`Return claim ${decision}`);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        user,
        updateUser,
        products,
        updateProductStock,
        updateProductPrices,
        addProduct,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartVat,
        cartDeliveryFee,
        cartTotal,
        wishlist,
        toggleWishlist,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        redeemVoucher,
        orders,
        placeOrder,
        updateOrderStatus,
        requestReturn,
        processReturnDecision,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProductDetail,
        setSelectedProductDetail,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isB2BRegisterOpen,
        setIsB2BRegisterOpen,
        selectedTrackingOrderId,
        setSelectedTrackingOrderId,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
