import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, Plus, Minus, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    role,
    language,
    addToCart,
    cart,
    updateCartQuantity,
    wishlist,
    toggleWishlist,
    setSelectedProductDetail,
  } = useApp();

  const isWholesale = role === 'wholesale';
  const isWishlisted = wishlist.includes(product.id);

  // Check if item is already in cart for current role mode
  const cartItem = cart.find(
    (item) => item.product.id === product.id && item.isWholesaleTier === isWholesale
  );

  const displayPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const unitLabel = isWholesale
    ? `Master Carton (${product.cartonUnits} pcs)`
    : product.unit;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, isWholesale);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateCartQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateCartQuantity(product.id, cartItem.quantity - 1);
    }
  };

  return (
    <div
      onClick={() => setSelectedProductDetail(product)}
      className="group bg-white rounded-xl border border-neutral-200/80 hover:border-emerald-700/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-4/3 bg-neutral-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-xs ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/90 text-neutral-500 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Stock Status Badge & Wholesale MOQ Note */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5">
          {product.inStock ? (
            <span className="bg-white/90 backdrop-blur-xs text-neutral-700 text-[11px] font-medium px-2 py-0.5 rounded shadow-2xs">
              {product.stockCount < 20 ? `Low: ${product.stockCount} left` : 'In Stock'}
            </span>
          ) : (
            <span className="bg-rose-600 text-white text-[11px] font-medium px-2 py-0.5 rounded shadow-2xs">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category & Brand (Clean unboxed text) */}
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[10px] text-emerald-800">
              {product.brand}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{unitLabel}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-neutral-900 text-sm leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
            {language === 'ne' ? product.nepaliName : product.name}
          </h3>

          {/* Subtitle / Nepali tag */}
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            {product.nepaliName}
          </p>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-neutral-500">Rs.</span>
                <span className="text-lg font-bold text-neutral-900 tabular-nums">
                  {displayPrice.toLocaleString()}
                </span>
                {product.originalRetailPrice && !isWholesale && (
                  <span className="text-xs text-neutral-400 line-through tabular-nums">
                    Rs. {product.originalRetailPrice}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-500 block">
                {isWholesale ? `MOQ: ${product.minWholesaleOrderQty} cartons` : `per ${product.unit}`}
              </span>
            </div>

            {/* Wholesale Savings Tag */}
            {isWholesale ? (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Save ~18%
              </span>
            ) : (
              <span className="text-[11px] text-neutral-400">
                VAT {product.vatPercent}%
              </span>
            )}
          </div>

          {/* Cart Stepper or Quick Add Button */}
          {cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between bg-emerald-800 text-white rounded-lg px-2 py-1.5"
            >
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-emerald-900 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-xs tabular-nums px-2">
                {cartItem.quantity} {isWholesale ? 'ctn' : ''}
              </span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-emerald-900 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                product.inStock
                  ? 'bg-neutral-900 hover:bg-emerald-800 text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isWholesale ? 'Add Carton' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
