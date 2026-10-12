import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { INITIAL_CATEGORIES } from '../../data/mockData';
import { ArrowRight, Sparkles, Building2, Package, Check } from 'lucide-react';

export const Storefront: React.FC = () => {
  const {
    products,
    role,
    setRole,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
  } = useApp();

  const isWholesale = role === 'wholesale';

  // Filter products by active category or search query
  const displayedProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Best sellers for homepage showcase
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* If search query is active, show Search Results header */}
      {searchQuery ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5">
                Found {displayedProducts.length} matching products
              </p>
            </div>
          </div>

          {displayedProducts.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-neutral-200 text-center text-neutral-500 text-xs">
              No products found matching "{searchQuery}". Try searching for "rice", "oil", "wai wai", or "carton".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      ) : activeTab === 'categories' ? (
        /* Full Category Catalog View */
        <div className="space-y-8">
          <CategoryNav />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  {selectedCategory
                    ? INITIAL_CATEGORIES.find((c) => c.id === selectedCategory)?.name
                    : 'All FMCG Products'}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Showing {displayedProducts.length} items available in Kathmandu and Birgunj depots
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Default Home View */
        <>
          <HeroBanner />

          <CategoryNav />

          {/* Section 1: Everyday FMCG Staples & Best Sellers */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-neutral-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
                  <span>Authentic Himalayan Essentials</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Everyday FMCG Staples & Family Packs
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('categories')}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestSellers.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>

          {/* Section 2: Wholesale Callout & Master Cartons */}
          <section className="space-y-6">
            <div className="flex items-end justify-between border-b border-neutral-200/80 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Direct FMCG Factory Distribution</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Master Cartons & Wholesale Sacks for Kirana Stores
                </h2>
              </div>
              <button
                onClick={() => {
                  setRole('wholesale');
                  setActiveTab('wholesale-quick');
                }}
                className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Quick-Order Table</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(4, 8).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
