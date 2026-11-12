'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Heart, ArrowRight } from 'lucide-react';
import { useWishlistStore, useDevStore, formatCurrency } from '@/store';
import { PRODUCTS } from '@/data/mockData';

export const WishlistDrawer: React.FC = () => {
  const isWishlistOpen = useWishlistStore((s) => s.isWishlistOpen);
  const toggleWishlistDrawer = useWishlistStore((s) => s.toggleWishlistDrawer);
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  if (!isWishlistOpen) return null;

  const savedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={toggleWishlistDrawer}
      />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-600 fill-red-600" />
            <h3 className="font-serif text-lg font-bold text-brand-dark">Saved Favorites</h3>
            <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700">
              {savedProducts.length}
            </span>
          </div>
          <button
            onClick={toggleWishlistDrawer}
            className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-safe space-y-4">
          {savedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-red-300" />
              </div>
              <h4 className="font-serif text-base font-bold text-brand-dark">No favorites yet</h4>
              <p className="text-xs text-neutral-500 max-w-xs mt-1">
                Click the heart icon on any product or category card to save items to your wishlist.
              </p>
            </div>
          ) : (
            savedProducts.map((p) => {
              const formatted = formatCurrency(p.basePrice, activeCurrency);
              return (
                <div
                  key={p.id}
                  className="flex gap-4 p-3 rounded-xl border border-neutral-200 bg-white shadow-sm"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-brand-dark line-clamp-1">{p.title}</h4>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="text-neutral-400 hover:text-red-600 p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-brand-gold uppercase font-semibold">
                        {p.categoryTag}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                      <span className="text-xs font-bold text-brand-dark">{formatted.formatted}</span>
                      <Link
                        href={`/product/${p.slug}`}
                        onClick={toggleWishlistDrawer}
                        className="rounded-full bg-brand-dark px-3 py-1 text-[11px] font-bold text-white hover:bg-neutral-800"
                      >
                        Customize →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

