import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShoppingBag,
  Search,
  Sparkles,
  MapPin,
  Building2,
  Truck,
  ShieldCheck,
  Globe,
  SlidersHorizontal,
  X,
  Mic,
  ChevronDown,
} from 'lucide-react';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    cartCount,
    cartSubtotal,
    setIsCartOpen,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    setIsAiAssistantOpen,
    setIsB2BRegisterOpen,
    user,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState('Kathmandu Valley');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const cities = ['Kathmandu Valley', 'Pokhara Metropolitan', 'Birgunj Industrial Hub', 'Chitwan / Bharatpur', 'Butwal'];

  const roleLabels: { id: UserRole; title: string; subtitle: string; icon: any }[] = [
    { id: 'retail', title: 'Retail Grocery', subtitle: 'Household FMCG', icon: ShoppingBag },
    { id: 'wholesale', title: 'B2B Wholesale', subtitle: 'Kirana Store & Bulk', icon: Building2 },
    { id: 'delivery', title: 'Delivery Partner', subtitle: 'Fleet Dispatch', icon: Truck },
    { id: 'admin', title: 'Staff Admin', subtitle: 'Operations Hub', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Utility Top Announcement Strip */}
      <div className="bg-emerald-950 text-emerald-100 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-emerald-300">My Mart Industries Pvt. Ltd.</span>
            <span className="text-emerald-500 hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              {role === 'wholesale'
                ? 'Nepal B2B Wholesale Distribution: Free freight on orders > Rs. 10,000'
                : 'Fresh Himalayan Groceries: Free Valley Delivery on orders > Rs. 1,500'}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Delivery Location dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[120px]">{currentCity}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isCityDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white text-neutral-800 rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setCurrentCity(city);
                        setIsCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 hover:text-emerald-900 transition-colors ${
                        currentCity === city ? 'font-semibold text-emerald-700 bg-emerald-50/60' : ''
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
              className="flex items-center gap-1 text-xs text-emerald-200 hover:text-white transition-colors font-medium cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Top Bar Contract: Brand — 4-5 Nav Links — 1 Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-white font-black text-xl tracking-tighter shadow-sm group-hover:bg-emerald-900 transition-colors">
              MM
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 block leading-tight">
                MY MART
              </span>
              <span className="text-[11px] font-medium text-emerald-700 block leading-none">
                Nepal Grocery & Wholesale
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, concise) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            {language === 'en' ? 'Storefront' : 'गृहपृष्ठ'}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'categories'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            {language === 'en' ? 'All Categories' : 'सबै वर्गहरू'}
          </button>

          <button
            onClick={() => setActiveTab('wholesale-quick')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'wholesale-quick'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            {language === 'en' ? 'Wholesale Quick-Order' : 'थोक अर्डर तालिका'}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            {language === 'en' ? 'Orders & Tracking' : 'अर्डर तथा ट्र्याकिङ'}
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'offers'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            {language === 'en' ? 'Deals & Coupons' : 'अफर र कुपन'}
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'rewards'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800 pb-0.5'
                : 'hover:text-neutral-900'
            }`}
          >
            {language === 'en' ? 'My Rewards' : 'रिवार्ड्स'}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Assistants */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Rewards Points Badge Button */}
          <button
            onClick={() => setActiveTab('rewards')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
            }`}
            title="My Mart Rewards & Loyalty Points"
          >
            <span className="text-amber-700">★</span>
            <span className="tabular-nums">{user.loyaltyPoints} Pts</span>
          </button>

          {/* AI Shopping Assistant Button */}
          <button
            onClick={() => setIsAiAssistantOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Ask MartSaathi AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden md:inline">MartSaathi AI</span>
          </button>

          {/* Cart Primary CTA */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-neutral-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left leading-none">
              <span className="text-[10px] text-emerald-200 font-medium">Cart</span>
              <span className="text-xs font-semibold tabular-nums">
                Rs. {cartSubtotal.toLocaleString()}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Role Switcher & Live Search Row */}
      <div className="bg-neutral-50/80 border-t border-neutral-200/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Role Mode Segmented Control */}
          <div className="flex items-center p-0.5 bg-neutral-200/70 rounded-lg w-full md:w-auto overflow-x-auto scrollbar-none">
            {roleLabels.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-neutral-500'}`} />
                  <span>{r.title}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Context & Search Input */}
          <div className="w-full md:w-96 flex items-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  role === 'wholesale'
                    ? 'Search bulk SKU, brand, or carton item...'
                    : 'Search groceries, basmati rice, mustard oil, tea...'
                }
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-white border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* B2B Registration Status Button for Shopkeepers */}
            {role === 'wholesale' && (
              <button
                onClick={() => setIsB2BRegisterOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {user.b2bProfile?.verificationStatus === 'verified'
                  ? 'PAN Verified ✓'
                  : 'Verify PAN/Credit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
