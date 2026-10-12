import React from 'react';
import { useApp } from '../../context/AppContext';
import { PROMO_COUPONS } from '../../data/mockData';
import { Tag, Sparkles, Check, ArrowRight, ShieldCheck, Wallet } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { applyCoupon, setIsCartOpen, showToast } = useApp();

  const handleCopyAndApply = (code: string) => {
    applyCoupon(code);
    setIsCartOpen(true);
    showToast(`Code "${code}" applied to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Deals, Promotions & Cashback Offers
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Save on everyday grocery essentials, bulk Kirana cartons, and payment gateway cashback
        </p>
      </div>

      {/* Coupon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PROMO_COUPONS.map((promo) => (
          <div
            key={promo.code}
            className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {promo.applicableRole === 'wholesale'
                    ? 'B2B Wholesale'
                    : promo.applicableRole === 'retail'
                    ? 'Retail Grocery'
                    : 'All Orders'}
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  {promo.discountPercentage > 0 ? `${promo.discountPercentage}% OFF` : 'FREE FREIGHT'}
                </span>
              </div>
              <h3 className="font-bold text-neutral-900 text-base">{promo.description}</h3>
              <p className="text-xs text-neutral-500 mt-2">
                Min. Order Amount: Rs. {promo.minOrderAmount.toLocaleString()}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div className="font-mono font-bold text-sm bg-neutral-100 px-3 py-1.5 rounded-lg text-neutral-800 border border-neutral-200">
                {promo.code}
              </div>
              <button
                onClick={() => handleCopyAndApply(promo.code)}
                className="px-4 py-2 bg-neutral-900 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Apply to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Nepal Digital Wallet Cashback Promotions */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-neutral-900 text-white shadow-md space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
          <Wallet className="w-4 h-4" />
          <span>Payment Partner Cashback Deals</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold">
          Pay with eSewa, Khalti, or Fonepay QR for Instant 5% Cashback
        </h2>
        <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
          Link your preferred Nepal digital wallet or scan dynamic QR at checkout to enjoy automatic rewards on all transactions above Rs. 2,000.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">
            🟢 eSewa: Flat Rs. 150 cashback on 1st order
          </div>
          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">
            🟣 Khalti: 100 Khalti Points on every Rs. 500
          </div>
          <div className="px-3 py-1.5 bg-white/10 rounded-lg text-xs font-medium">
            🔴 Fonepay: Direct bank account rebate
          </div>
        </div>
      </div>
    </div>
  );
};
