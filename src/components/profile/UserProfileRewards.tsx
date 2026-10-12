import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { REWARD_TIERS, REWARD_VOUCHERS } from '../../data/mockData';
import {
  Award,
  Gift,
  Coins,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Copy,
  Clock,
  ChevronRight,
  ShoppingBag,
  Ticket,
} from 'lucide-react';
import { RewardVoucher } from '../../types';

export const UserProfileRewards: React.FC = () => {
  const {
    user,
    redeemVoucher,
    applyCoupon,
    setIsCartOpen,
    language,
    showToast,
    setIsB2BRegisterOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rewards' | 'history' | 'profile'>('rewards');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | 'retail' | 'wholesale'>('all');

  // Tier calculation
  const points = user.loyaltyPoints;
  const currentTierIndex = REWARD_TIERS.findIndex(
    (t, idx) => points >= t.minPoints && (points <= t.maxPoints || idx === REWARD_TIERS.length - 1)
  );
  const currentTier = REWARD_TIERS[Math.max(0, currentTierIndex)];
  const nextTier =
    currentTierIndex < REWARD_TIERS.length - 1
      ? REWARD_TIERS[currentTierIndex + 1]
      : null;

  // Progress percentage calculation
  let progressPercent = 100;
  let pointsNeeded = 0;
  if (nextTier) {
    const range = nextTier.minPoints - currentTier.minPoints;
    const currentProgress = points - currentTier.minPoints;
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));
    pointsNeeded = nextTier.minPoints - points;
  }

  const handleRedeem = (voucher: RewardVoucher) => {
    const res = redeemVoucher(voucher);
    if (!res.success) {
      showToast(res.message);
    }
  };

  const handleApplyToCart = (code: string) => {
    applyCoupon(code);
    setIsCartOpen(true);
  };

  const filteredVouchers = REWARD_VOUCHERS.filter(
    (v) => selectedRoleFilter === 'all' || v.applicableRole === 'all' || v.applicableRole === selectedRoleFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Profile Header */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-xs">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  {user.name}
                </h1>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full">
                  {currentTier.name}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                +977 {user.phone} · {user.email} · {user.addresses[0]?.municipality || 'Kathmandu'}
              </p>
            </div>
          </div>

          {/* Quick Context & B2B Status */}
          <div className="flex items-center gap-3">
            {user.b2bProfile && (
              <button
                onClick={() => setIsB2BRegisterOpen(true)}
                className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-800" />
                <span>{user.b2bProfile.companyName} (PAN Verified)</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>My Mart Rewards & Vouchers</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Points Ledger History ({user.pointsHistory?.length || 0})</span>
          </button>
        </div>
      </div>

      {activeTab === 'rewards' && (
        <div className="space-y-8">
          {/* Main Loyalty Points & Tier Progress Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Points Summary Card */}
            <div className="lg:col-span-4 bg-gradient-to-br from-neutral-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-md relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-3">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    <span>My Mart Loyalty Balance</span>
                  </span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">
                    1 Pt = Rs. 1.00
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black tracking-tight tabular-nums mt-1">
                  {points.toLocaleString()}
                </div>
                <span className="text-xs text-neutral-300 block mt-1">
                  Earned Loyalty Points (= Rs. {points.toLocaleString()} Store Credit)
                </span>
              </div>

              <div className="mt-8 pt-4 border-t border-white/15 relative z-10 text-xs text-neutral-300 space-y-1.5">
                <div className="flex justify-between">
                  <span>Current Tier Multiplier:</span>
                  <strong className="text-white">{currentTier.multiplier}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Redeemed Vouchers:</span>
                  <strong className="text-emerald-300">
                    {user.redeemedVouchers?.filter((v) => !v.isUsed).length || 0} Ready
                  </strong>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-emerald-600/20 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Visual Tier Progress Bar & Milestones Card */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
                      Tier Progression
                    </span>
                    <h3 className="text-lg font-bold text-neutral-900">
                      Current Status: {currentTier.name} ({language === 'ne' ? currentTier.nepaliName : currentTier.multiplier})
                    </h3>
                  </div>

                  {nextTier ? (
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-neutral-900 block tabular-nums">
                        {pointsNeeded} points needed
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        to reach {nextTier.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      Highest Tier Reached 🎉
                    </span>
                  )}
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between text-xs text-neutral-600 font-medium">
                    <span>{currentTier.name} ({currentTier.minPoints} pts)</span>
                    <span className="font-bold tabular-nums text-emerald-800">
                      {progressPercent}% towards {nextTier ? nextTier.name : 'Diamond Max'}
                    </span>
                    <span>{nextTier ? `${nextTier.name} (${nextTier.minPoints} pts)` : '2,500+ pts'}</span>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-3 p-0.5 border border-neutral-200 overflow-hidden">
                    <div
                      className="bg-emerald-700 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-100">
                  {REWARD_TIERS.map((tier, idx) => {
                    const isUnlocked = points >= tier.minPoints;
                    const isCurrent = currentTier.name === tier.name;

                    return (
                      <div
                        key={tier.name}
                        className={`p-3 rounded-2xl border text-xs transition-all ${
                          isCurrent
                            ? 'border-emerald-700 bg-emerald-50/60 ring-1 ring-emerald-700 shadow-2xs'
                            : isUnlocked
                            ? 'border-neutral-200 bg-neutral-50/80 text-neutral-800'
                            : 'border-neutral-200/60 bg-neutral-50/30 text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold truncate text-[11px] text-neutral-900">
                            {tier.name}
                          </span>
                          {isUnlocked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          )}
                        </div>
                        <span className="font-mono text-[10px] block tabular-nums text-neutral-500">
                          {tier.minPoints.toLocaleString()} pts
                        </span>
                        <span className="text-[10px] text-emerald-800 font-semibold block mt-1 truncate">
                          {tier.perks[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Tier Perks list */}
              <div className="mt-4 pt-3 text-xs text-neutral-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span className="font-semibold text-neutral-800">Your Active Perks:</span>
                {currentTier.perks.map((p, i) => (
                  <span key={i} className="flex items-center gap-1 text-neutral-700">
                    <span className="text-emerald-700 font-bold">✓</span> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Active Redeemed Vouchers Wallet */}
          {user.redeemedVouchers && user.redeemedVouchers.filter((v) => !v.isUsed).length > 0 && (
            <div className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    My Active Vouchers Wallet ({user.redeemedVouchers.filter((v) => !v.isUsed).length})
                  </h3>
                </div>
                <span className="text-xs text-emerald-300">
                  Ready to apply at cart checkout
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {user.redeemedVouchers
                  .filter((v) => !v.isUsed)
                  .map((rv) => (
                    <div
                      key={rv.id}
                      className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-xs flex flex-col justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="text-[11px] text-emerald-300 font-semibold block">
                          {rv.title}
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-mono text-sm font-bold text-white bg-black/30 px-2 py-0.5 rounded">
                            {rv.code}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-300 block mt-1">
                          Min. Order: Rs. {rv.minOrder.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleApplyToCart(rv.code)}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Apply Code to Cart</span>
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Redeemable Vouchers Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-800" />
                  <span>Redeemable Loyalty Vouchers</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Convert your earned My Mart points into instant discount coupons and free delivery credits
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-neutral-200/70 rounded-xl text-xs font-semibold shrink-0">
                <button
                  onClick={() => setSelectedRoleFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedRoleFilter === 'all'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All Vouchers
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('retail')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedRoleFilter === 'retail'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Retail Grocery
                </button>
                <button
                  onClick={() => setSelectedRoleFilter('wholesale')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedRoleFilter === 'wholesale'
                      ? 'bg-white text-neutral-900 shadow-2xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  B2B Wholesale
                </button>
              </div>
            </div>

            {/* Vouchers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVouchers.map((voucher) => {
                const canAfford = points >= voucher.pointsCost;

                return (
                  <div
                    key={voucher.id}
                    className={`bg-white rounded-3xl border p-5 flex flex-col justify-between space-y-4 transition-all shadow-2xs ${
                      canAfford
                        ? 'border-neutral-200 hover:border-emerald-700/50 hover:shadow-xs'
                        : 'border-neutral-200/70 opacity-90'
                    }`}
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {voucher.applicableRole === 'wholesale'
                            ? 'B2B Kirana Bulk'
                            : voucher.applicableRole === 'retail'
                            ? 'Retail Pack'
                            : 'All Orders'}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 tabular-nums">
                          <Coins className="w-3.5 h-3.5 text-amber-600" />
                          <span>{voucher.pointsCost} Points</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-neutral-900 text-sm leading-snug">
                        {voucher.title}
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                        {voucher.description}
                      </p>

                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                        <span>Min. Purchase: Rs. {voucher.minOrder.toLocaleString()}</span>
                        <span className="font-mono text-neutral-700 font-semibold">{voucher.code}</span>
                      </div>
                    </div>

                    {/* Redeem CTA */}
                    <div>
                      <button
                        onClick={() => handleRedeem(voucher)}
                        disabled={!canAfford}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                          canAfford
                            ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        }`}
                      >
                        {canAfford ? (
                          <>
                            <Gift className="w-3.5 h-3.5" />
                            <span>Redeem for {voucher.pointsCost} Points</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Need {voucher.pointsCost - points} More Points</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Points History Ledger View */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="font-bold text-neutral-900 text-base">
                Loyalty Points Activity History
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every purchase at My Mart earns real points based on your tier multiplier.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block">Current Balance</span>
              <span className="text-lg font-bold text-neutral-900 tabular-nums">
                {points.toLocaleString()} Points
              </span>
            </div>
          </div>

          <div className="divide-y divide-neutral-100 text-xs">
            {user.pointsHistory?.map((entry) => (
              <div key={entry.id} className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-neutral-900 block">
                    {entry.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 block mt-0.5 font-mono">
                    {entry.date}
                  </span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold tabular-nums text-sm ${
                      entry.points > 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    {entry.points > 0 ? `+${entry.points}` : entry.points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
