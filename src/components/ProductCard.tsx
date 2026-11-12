'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useWishlistStore, useDevStore, formatCurrency, useUIStore } from '@/store';

interface ProductCardProps {
  product: Product;
  onQuickUpload?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickUpload }) => {
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const openAppModal = useUIStore((s) => s.openAppModal);
  const addToast = useUIStore((s) => s.addToast);
  const [isHovered, setIsHovered] = useState(false);

  const formattedBase = formatCurrency(product.basePrice, activeCurrency);
  const formattedCompare = formatCurrency(product.compareAtPrice, activeCurrency);
  const discountPct = Math.round(
    ((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100
  );

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    addToast(added ? 'Saved to your favorites' : 'Removed from favorites', 'info');
  };

  const handleQuickCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openAppModal({
      productId: product.id,
      productTitle: product.title,
      basePrice: product.basePrice,
      initialStyleId: product.defaultStyleId,
    });
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* Top Media Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-neutral-100 block">
        {/* Main Artwork Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Promotional / Savings Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 rounded-full bg-brand-dark/90 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow-md border border-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-ping" />
            <span>{product.badge}</span>
          </div>
        )}

        {/* Wishlist Heart Toggle */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-md backdrop-blur-md hover:bg-white hover:text-red-600 hover:scale-110 active:scale-95 transition-all touch-scale z-10"
          aria-label="Save to wishlist"
        >
          <Heart
            className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-colors ${
              isInWishlist ? 'fill-red-600 text-red-600' : 'stroke-neutral-700'
            }`}
          />
        </button>

        {/* Quick Customize Action Overlay (Desktop hover) */}
        <div className="hidden sm:block absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
          <button
            onClick={handleQuickCreate}
            className="w-full flex items-center justify-center gap-1.5 rounded-full bg-white/95 py-2 px-3 text-xs font-bold text-brand-dark shadow-xl backdrop-blur-md hover:bg-brand-dark hover:text-white transition-colors border border-white/60 active:scale-95"
          >
            <Sparkles className="h-3 w-3 text-brand-gold" />
            <span>Customize with Your Photo</span>
          </button>
        </div>
      </Link>

      {/* Info Content Block */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-5 bg-white">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-brand-gold uppercase tracking-wider mb-1">
            <span className="truncate mr-1">{product.categoryTag}</span>
            <div className="flex items-center gap-1 rounded-full bg-neutral-100 px-1.5 py-0.5 text-neutral-800 flex-shrink-0">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-brand-gold text-brand-gold" />
              <span className="font-bold text-[9px] sm:text-[10px]">{product.rating}</span>
            </div>
          </div>

          <Link href={`/product/${product.slug}`}>
            <h4 className="font-serif text-sm sm:text-base font-bold text-brand-dark group-hover:text-brand-gold transition-colors line-clamp-1">
              {product.title}
            </h4>
          </Link>
          <p className="hidden sm:block text-xs text-neutral-500 line-clamp-1 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Primary CTA */}
        <div className="mt-2.5 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between pt-2 sm:pt-3 border-t border-neutral-100 gap-2">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-base font-bold text-brand-dark tracking-tight">
                {formattedBase.formatted}
              </span>
              {product.compareAtPrice > product.basePrice && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through">
                  {formattedCompare.formatted}
                </span>
              )}
            </div>
            {discountPct > 0 && (
              <span className="text-[9px] sm:text-[10px] font-bold text-green-700 block sm:inline">
                Save {discountPct}% today
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Link
              href={`/product/${product.slug}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 rounded-full bg-brand-linen border border-brand-border px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold text-brand-dark hover:bg-brand-dark hover:text-white transition-all duration-200 group-hover:shadow-md touch-scale active:scale-95"
            >
              <span>Make yours</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
