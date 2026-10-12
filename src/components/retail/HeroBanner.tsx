import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Building2, ShoppingBag } from 'lucide-react';
import { HERO_GROCERY_IMG, WHOLESALE_WAREHOUSE_IMG } from '../../data/mockData';

export const HeroBanner: React.FC = () => {
  const { role, setRole, setActiveTab, setSelectedCategory } = useApp();

  const isWholesale = role === 'wholesale';

  return (
    <div className="space-y-6">
      {/* Split Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-3 tracking-wide uppercase">
                <span>My Mart Industries Pvt. Ltd.</span>
                <span>·</span>
                <span>Nepal Grocery & Wholesale Network</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
                {isWholesale ? (
                  <>
                    Direct Factory FMCG Supply for{' '}
                    <span className="text-emerald-400">Kirana Stores</span> & Bulk Buyers
                  </>
                ) : (
                  <>
                    Fresh Himalayan Groceries Delivered to Your{' '}
                    <span className="text-emerald-400">Doorstep</span>
                  </>
                )}
              </h1>

              <p className="mt-4 text-neutral-300 text-sm sm:text-base leading-relaxed max-w-xl">
                {isWholesale
                  ? 'Access master carton pricing, verified PAN/VAT invoicing, 30-day revolving credit, and nationwide freight distribution across all 7 provinces of Nepal.'
                  : 'Premium Basmati rice, cold-pressed mustard oil, pure Himalayan cow ghee, and everyday household essentials with guaranteed same-day delivery across Kathmandu Valley.'}
              </p>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (isWholesale) {
                    setActiveTab('wholesale-quick');
                  } else {
                    setSelectedCategory('rice-grains');
                    setActiveTab('categories');
                  }
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>{isWholesale ? 'Open Quick-Order Matrix' : 'Shop Everyday Groceries'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setRole(isWholesale ? 'retail' : 'wholesale');
                }}
                className="px-5 py-3 bg-neutral-800/90 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs sm:text-sm font-medium border border-neutral-700 transition-colors cursor-pointer"
              >
                <span>{isWholesale ? 'Switch to Retail Grocery' : 'Switch to B2B Kirana Bulk'}</span>
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full">
            <img
              src={isWholesale ? WHOLESALE_WAREHOUSE_IMG : HERO_GROCERY_IMG}
              alt="My Mart Nepal"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-neutral-900/40 to-transparent" />

            {/* Floating Trust Badge */}
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-neutral-200 text-xs text-neutral-900 max-w-[210px] hidden sm:block">
              <span className="font-bold block text-emerald-900">
                {isWholesale ? 'Wholesale Advantage' : 'Freshness Guarantee'}
              </span>
              <span className="text-[11px] text-neutral-600 block mt-0.5">
                {isWholesale
                  ? 'MOQ discounts + 30-day payment term'
                  : 'Aged 18mo Basmati & Cold-Pressed Mustard Oil'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Item Feature Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-900 block">Kathmandu Express</span>
            <span className="text-[11px] text-neutral-500 block">Same-day delivery slots</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-900 block">100% Genuine FMCG</span>
            <span className="text-[11px] text-neutral-500 block">DFTQC verified standards</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-900 block">30-Day B2B Credit</span>
            <span className="text-[11px] text-neutral-500 block">For verified Kirana stores</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200/90 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-900 block">eSewa / Khalti / COD</span>
            <span className="text-[11px] text-neutral-500 block">Zero transaction fees</span>
          </div>
        </div>
      </div>
    </div>
  );
};
