import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDiscount,
    cartVat,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const isWholesaleCart = cart.some((i) => i.isWholesaleTier);
  const threshold = isWholesaleCart ? 10000 : 1500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / threshold) * 100));
  const amountNeeded = Math.max(0, threshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-neutral-200">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-neutral-900">Your Shopping Cart</h2>
              <span className="text-xs font-semibold text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded-full">
                {cartCount} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Threshold Progress Bar */}
          <div className="px-4 sm:px-6 py-2.5 bg-emerald-50/80 border-b border-emerald-100 text-xs">
            <div className="flex items-center justify-between text-emerald-900 font-medium mb-1.5">
              <span>
                {amountNeeded === 0
                  ? '🎉 You unlocked FREE Delivery!'
                  : `Add Rs. ${amountNeeded.toLocaleString()} more for FREE Delivery`}
              </span>
              <span className="font-bold tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-neutral-800 text-sm">Your cart is empty</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Browse our everyday retail groceries or switch to B2B Wholesale for master cartons and kirana supply.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const price = item.isWholesaleTier
                  ? item.product.wholesalePrice
                  : item.product.retailPrice;
                const lineTotal = price * item.quantity;

                return (
                  <div
                    key={`${item.product.id}-${item.isWholesaleTier ? 'ws' : 'rt'}`}
                    className="flex gap-3 p-3 rounded-xl border border-neutral-200/80 bg-white hover:border-neutral-300 transition-colors"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-lg bg-neutral-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-semibold text-neutral-900 text-xs line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[11px] text-neutral-500 block truncate">
                          {item.isWholesaleTier
                            ? `Master Carton (${item.product.cartonUnits} pcs)`
                            : item.product.unit}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-300 rounded-md overflow-hidden">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 hover:bg-neutral-100 text-neutral-700 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 font-semibold text-xs tabular-nums text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 hover:bg-neutral-100 text-neutral-700 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-neutral-900 tabular-nums">
                            Rs. {lineTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-neutral-400 block tabular-nums">
                            @ Rs. {price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Order Calculation */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-200 bg-neutral-50/70 space-y-4">
              {/* Coupon Form */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="font-semibold">Code: {appliedCoupon.code}</span>
                    <span className="text-emerald-700">({appliedCoupon.discountPercentage}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-neutral-500 hover:text-rose-600 font-medium text-xs cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError(null);
                      }}
                      placeholder="Try: MYMARTNEPAL or KIRANA10"
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg uppercase placeholder:normal-case placeholder:text-neutral-400 focus:outline-hidden focus:border-emerald-700"
                    />
                    <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600 -mt-2">{couponError}</p>
              )}

              {/* Financial Breakup */}
              <div className="space-y-1.5 text-xs text-neutral-600 border-t border-neutral-200/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    Rs. {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold tabular-nums">
                      - Rs. {cartDiscount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Freight</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    {cartDeliveryFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      `Rs. ${cartDeliveryFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nepal VAT (13% on Taxable Items)</span>
                  <span className="font-medium text-neutral-900 tabular-nums">
                    Rs. {cartVat.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-neutral-900 border-t border-neutral-200 pt-2">
                  <span>Total Amount</span>
                  <span className="text-emerald-900 tabular-nums">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedCheckout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
