'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Trash2, RotateCcw, ArrowRight, Download, Edit3 } from 'lucide-react';
import { useVisionStore, useCartStore, useUIStore, useDevStore, formatCurrency } from '@/store';
import { GRAPHIC_STYLES, PRODUCTS } from '@/data/mockData';

export default function MyArtPage() {
  const savedVisions = useVisionStore((s) => s.savedVisions);
  const removeVision = useVisionStore((s) => s.removeVision);
  const addItemToCart = useCartStore((s) => s.addItem);
  const openAppModal = useUIStore((s) => s.openAppModal);
  const addToast = useUIStore((s) => s.addToast);
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  const handleOrderAgain = (v: (typeof savedVisions)[0]) => {
    addItemToCart({
      productId: v.productId,
      styleId: v.styleId,
      selectedSize: 'Standard',
      quantity: 1,
      unitPrice: v.price,
      customArtUrl: v.customArtUrl,
      originalPhotoUrl: v.originalPhotoUrl,
    });
    addToast(`Added "${v.productTitle}" to cart!`, 'success');
  };

  const handleEditStyle = (v: (typeof savedVisions)[0]) => {
    openAppModal({
      productId: v.productId,
      productTitle: v.productTitle,
      basePrice: v.price,
      initialStyleId: v.styleId,
    });
  };

  return (
    <div className="bg-brand-linen min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-brand-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Private Studio Archive
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-1">
              My Visions & Custom Artworks
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-xl">
              All artworks you have generated are preserved here in your private browser archive. Order on physical canvas, download digital copies, or try new styles.
            </p>
          </div>

          <Link
            href="/collections"
            className="rounded-full bg-brand-dark px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-lg self-start md:self-auto"
          >
            + Create New Vision
          </Link>
        </div>

        {/* Visions Grid */}
        {savedVisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-brand-border p-8 shadow-sm">
            <div className="h-20 w-20 rounded-full bg-brand-linen flex items-center justify-center mb-4 border border-brand-border">
              <Sparkles className="h-8 w-8 text-brand-gold" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-dark">No Saved Visions Yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mt-2 mb-6 leading-relaxed">
              Upload your first memory photograph to generate custom wall art in watercolor, stained glass, or renaissance oil.
            </p>
            <Link
              href="/collections/tiles"
              className="rounded-full bg-brand-dark px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md"
            >
              Start Customizing →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedVisions.map((v) => {
              const formattedPrice = formatCurrency(v.price, activeCurrency);
              return (
                <div
                  key={v.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-white border border-brand-border shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-square overflow-hidden bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={v.customArtUrl}
                      alt={v.productTitle}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-500"
                    />
                    <button
                      onClick={() => {
                        removeVision(v.id);
                        addToast('Vision deleted from your archive', 'info');
                      }}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-500 hover:text-red-600 shadow backdrop-blur-md"
                      aria-label="Delete vision"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                        Style: {v.styleName}
                      </span>
                      <h4 className="font-serif text-base font-bold text-brand-dark mt-0.5 line-clamp-1">
                        {v.productTitle}
                      </h4>
                      <p className="text-xs font-bold text-neutral-900 mt-1">
                        {formattedPrice.formatted}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
                      <button
                        onClick={() => handleOrderAgain(v)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-full bg-brand-dark py-2.5 text-xs font-bold text-white hover:bg-neutral-800 shadow transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Order Physical Print</span>
                      </button>

                      <button
                        onClick={() => handleEditStyle(v)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-full border border-neutral-300 bg-white py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                      >
                        <Edit3 className="h-3 w-3" />
                        <span>Try Another Style</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

