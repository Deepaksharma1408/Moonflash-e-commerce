'use client';

import React, { useState } from 'react';
import { X, Sparkles, Layers, Grid, Check, ShoppingBag, UploadCloud, Info } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUIStore, useCartStore, formatCurrency, useDevStore } from '@/store';
import { GALLERY_WALL_LAYOUTS, GRAPHIC_STYLES } from '@/data/mockData';

const SAMPLE_TRIPTYCH_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&q=80',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
];

export const GalleryWallBuilderModal: React.FC = () => {
  const isGalleryBuilderOpen = useUIStore((s) => s.isGalleryBuilderOpen);
  const closeGalleryBuilder = useUIStore((s) => s.closeGalleryBuilder);
  const addItemToCart = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  const [selectedLayoutId, setSelectedLayoutId] = useState<string>('triptych-split');
  const [selectedStyleId, setSelectedStyleId] = useState<string>('watercolor-botanica');
  const [spacingInches, setSpacingInches] = useState<number>(2.0);
  const [masterImageUrl, setMasterImageUrl] = useState<string>(SAMPLE_TRIPTYCH_IMAGES[0]);

  if (!isGalleryBuilderOpen) return null;

  const currentLayout =
    GALLERY_WALL_LAYOUTS.find((l) => l.id === selectedLayoutId) || GALLERY_WALL_LAYOUTS[0];
  const currentStyle =
    GRAPHIC_STYLES.find((s) => s.id === selectedStyleId) || GRAPHIC_STYLES[0];

  const tileUnitPrice = 49.0;
  const standardTotal = tileUnitPrice * currentLayout.tileCount;
  const bundleDiscount = standardTotal * (currentLayout.discountPct / 100);
  const bundlePrice = standardTotal - bundleDiscount;

  const formattedBundle = formatCurrency(bundlePrice, activeCurrency);
  const formattedStandard = formatCurrency(standardTotal, activeCurrency);

  const handleAddWallToCart = () => {
    // Add gallery wall bundle
    for (let i = 0; i < currentLayout.tileCount; i++) {
      addItemToCart({
        productId: 'single-tile-6x8',
        productTitle: `${currentLayout.name} — Panel ${i + 1} of ${currentLayout.tileCount}`,
        styleId: currentStyle.id,
        selectedSize: 'Standard 8x8',
        quantity: 1,
        unitPrice: bundlePrice / currentLayout.tileCount,
        customArtUrl: masterImageUrl,
        originalPhotoUrl: masterImageUrl,
        isGalleryWall: true,
        galleryWallType: currentLayout.name,
      });
    }

    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#B47B36', '#111827', '#E2E8F0'],
      });
    } catch {}

    addToast(`Added complete ${currentLayout.name} to cart! (Saved ${currentLayout.discountPct}%)`, 'success');
    closeGalleryBuilder();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={closeGalleryBuilder}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 bg-brand-linen flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-dark flex items-center justify-center text-white">
              <Layers className="h-4 w-4 text-brand-gold" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Multi-Tile Wall Builder
              </span>
              <h3 className="font-serif text-lg font-bold text-brand-dark">
                Design Your Gallery Wall Bundle
              </h3>
            </div>
          </div>

          <button
            onClick={closeGalleryBuilder}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* 1. Layout Template Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-serif text-sm font-bold text-brand-dark uppercase tracking-wider">
                1. Select Gallery Wall Format
              </h4>
              <span className="text-xs text-green-700 font-bold bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                Multi-Pack Savings up to 30% Off
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {GALLERY_WALL_LAYOUTS.map((layout) => {
                const isSelected = layout.id === selectedLayoutId;
                return (
                  <div
                    key={layout.id}
                    onClick={() => setSelectedLayoutId(layout.id)}
                    className={`cursor-pointer rounded-2xl border-2 p-4 transition-all relative ${
                      isSelected
                        ? 'border-brand-gold bg-brand-linen shadow-lg scale-[1.02]'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                        {layout.badge}
                      </span>
                      <span className="rounded-full bg-brand-dark px-2 py-0.5 text-[10px] font-bold text-white">
                        {layout.tileCount} Tiles
                      </span>
                    </div>

                    <h5 className="font-serif text-sm font-bold text-brand-dark">{layout.name}</h5>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                      {layout.description}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-700">{layout.dimensions}</span>
                      <span className="font-bold text-green-700">Save {layout.discountPct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Interactive Wall Preview with Magnetic Spacing */}
          <div className="rounded-3xl bg-neutral-900 p-6 sm:p-8 text-white relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between mb-4 text-xs">
              <span className="text-neutral-400 font-medium">
                Live Simulated Preview: {currentLayout.name} with {spacingInches}&quot; Magnetic Gap
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-neutral-400">Tile Spacing:</span>
                <input
                  type="range"
                  min="1.0"
                  max="3.5"
                  step="0.5"
                  value={spacingInches}
                  onChange={(e) => setSpacingInches(parseFloat(e.target.value))}
                  className="w-20 accent-brand-gold"
                />
                <span className="font-bold text-brand-gold text-[11px]">{spacingInches}&quot;</span>
              </div>
            </div>

            {/* Simulated Living Room Wall Grid */}
            <div
              className={`grid gap-4 sm:gap-6 justify-center items-center py-6 mx-auto ${
                currentLayout.tileCount === 3
                  ? 'grid-cols-3 max-w-2xl'
                  : currentLayout.tileCount === 4
                  ? 'grid-cols-2 max-w-md'
                  : 'grid-cols-3 max-w-2xl'
              }`}
              style={{ gap: `${spacingInches * 10}px` }}
            >
              {[...Array(currentLayout.tileCount)].map((_, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white/20 bg-neutral-800 shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SAMPLE_TRIPTYCH_IMAGES[idx % SAMPLE_TRIPTYCH_IMAGES.length]}
                    alt={`Panel ${idx + 1}`}
                    className="h-full w-full object-cover"
                    style={{ filter: currentStyle.filterRecipe }}
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-brand-dark shadow">
                      Panel {idx + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Spacing Guide Hint */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 mt-2">
              <Info className="h-3.5 w-3.5 text-brand-gold" />
              <span>Includes free peel-and-stick magnetic wall templates for zero-damage laser-straight mounting.</span>
            </div>
          </div>

          {/* 3. Style Selector & Image Swapper */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              2. Signature Art Style
            </span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              {GRAPHIC_STYLES.slice(0, 6).map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedStyleId === style.id
                      ? 'bg-brand-dark text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <Sparkles className="h-3 w-3 text-brand-gold" />
                  <span>{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Pricing & Add to Cart */}
        <div className="border-t border-neutral-200 bg-brand-linen px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-brand-dark">
                {formattedBundle.formatted}
              </span>
              <span className="text-sm text-neutral-400 line-through">
                {formattedStandard.formatted}
              </span>
              <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                Save {currentLayout.discountPct}% Bundle Discount
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Includes {currentLayout.tileCount} handcrafted physical tiles + damage-free mounting kits + free shipping
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={closeGalleryBuilder}
              className="flex-1 sm:flex-initial rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
            >
              Cancel
            </button>
            <button
              onClick={handleAddWallToCart}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-brand-dark px-7 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Add Complete Wall to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

