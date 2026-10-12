import React, { useState } from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Heart, ShieldCheck, Truck, MapPin, Package, AlertCircle, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const {
    role,
    language,
    addToCart,
    wishlist,
    toggleWishlist,
    setIsCartOpen,
  } = useApp();

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPackTier, setSelectedPackTier] = useState<'retail' | 'wholesale'>(
    role === 'wholesale' ? 'wholesale' : 'retail'
  );

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const isWholesaleTier = selectedPackTier === 'wholesale';
  const unitPrice = isWholesaleTier ? product.wholesalePrice : product.retailPrice;
  const lineTotal = unitPrice * quantity;

  const handleAddAndClose = (openDrawer = false) => {
    addToCart(product, quantity, isWholesaleTier);
    if (openDrawer) {
      setIsCartOpen(true);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          {/* Left Column: Image & Badges */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 left-3 w-9 h-9 rounded-full bg-white/90 text-neutral-700 hover:text-rose-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>
            </div>

            {/* Warehouse Location & Stock Proof */}
            <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-neutral-800">Warehouse:</span>
                <span className="truncate">{product.warehouseLocation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-neutral-800">Available Stock:</span>
                <span className="tabular-nums font-semibold text-emerald-800">
                  {product.stockCount} units ready for immediate dispatch
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-medium text-neutral-800">Delivery SLA:</span>
                <span>Kathmandu Valley (Same-Day) · All Provinces (24-48 hrs)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Brand & SKU */}
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                <span className="uppercase tracking-wider font-bold text-emerald-800">
                  {product.brand}
                </span>
                <span className="font-mono text-[11px]">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-tight">
                {product.name}
              </h2>
              <p className="text-sm text-neutral-600 font-medium mt-0.5">
                {product.nepaliName}
              </p>

              {/* Description */}
              <p className="text-xs text-neutral-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Purchase Tier Selector: Retail vs Wholesale Carton */}
              <div className="mt-5 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="text-xs font-semibold text-neutral-700 block mb-2">
                  Select Purchase Mode & Packaging:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedPackTier('retail');
                      setQuantity(1);
                    }}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                      selectedPackTier === 'retail'
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-[11px] block text-neutral-500">Retail Pack</span>
                    <span className="text-sm font-bold block tabular-nums">
                      Rs. {product.retailPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate">
                      {product.unit}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPackTier('wholesale');
                      setQuantity(product.minWholesaleOrderQty || 2);
                    }}
                    className={`p-2.5 rounded-lg text-left border transition-all cursor-pointer ${
                      selectedPackTier === 'wholesale'
                        ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-700'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-800">Wholesale Carton</span>
                      <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1 rounded">
                        Bulk Save
                      </span>
                    </div>
                    <span className="text-sm font-bold block tabular-nums text-neutral-900">
                      Rs. {product.wholesalePrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate">
                      {product.cartonUnits} pcs / ctn (MOQ: {product.minWholesaleOrderQty})
                    </span>
                  </button>
                </div>
              </div>

              {/* Quantity Selector & Line Total */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    {isWholesaleTier ? 'Carton Quantity:' : 'Order Quantity:'}
                  </label>
                  <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() =>
                        setQuantity((prev) =>
                          Math.max(isWholesaleTier ? product.minWholesaleOrderQty : 1, prev - 1)
                        )
                      }
                      className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 font-bold transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-semibold text-xs tabular-nums text-neutral-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="px-3 py-1.5 hover:bg-neutral-100 text-neutral-700 font-bold transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-neutral-500 block">Line Total</span>
                  <div className="text-lg font-bold text-emerald-900 tabular-nums">
                    Rs. {lineTotal.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-neutral-400 block">
                    {product.vatPercent > 0 ? `+ 13% Nepal VAT included` : 'Zero VAT Tax-Exempt Grain'}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleAddAndClose(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors text-center cursor-pointer"
              >
                Add {quantity} {isWholesaleTier ? 'Cartons' : 'Units'} to Cart
              </button>

              <button
                onClick={() => handleAddAndClose(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors text-center cursor-pointer"
              >
                Buy Now & Checkout →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
