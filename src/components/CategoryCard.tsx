'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useUIStore, useDevStore, formatCurrency } from '@/store';
import { Product } from '@/types';

interface CategoryCardProps {
  product: Product;
  templateTitle?: string;
  roomMockupImage: string;
  sourcePhotoBubbles: string[];
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  product,
  templateTitle,
  roomMockupImage,
  sourcePhotoBubbles,
}) => {
  const openAppModal = useUIStore((s) => s.openAppModal);
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  const formattedBase = formatCurrency(product.basePrice, activeCurrency);
  const formattedCompare = formatCurrency(product.compareAtPrice, activeCurrency);
  const discountPct = Math.round(
    ((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100
  );

  const handleCreate = (e: React.MouseEvent) => {
    e.preventDefault();
    openAppModal({
      productId: product.id,
      productTitle: product.title,
      basePrice: product.basePrice,
      initialStyleId: product.defaultStyleId,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5">
      {/* 1. Mixtiles Room Mockup Image Container */}
      <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        {/* Room Mockup Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={roomMockupImage}
          alt={templateTitle || product.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Source Photo Inset Bubbles (Mixtiles signature) */}
        <div className="absolute bottom-3.5 left-3.5 flex items-center -space-x-2 rounded-full glass-panel p-1.5 shadow-xl border border-white/80">
          {sourcePhotoBubbles.map((src, idx) => (
            <div
              key={idx}
              className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-neutral-200 shadow-md transition-transform group-hover:scale-105"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Source memory" className="h-full w-full object-cover" />
            </div>
          ))}
          {sourcePhotoBubbles.length >= 2 && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-dark text-[10px] font-bold text-white shadow">
              +{sourcePhotoBubbles.length}
            </div>
          )}
        </div>

        {/* Discount Badge */}
        {discountPct > 0 && (
          <div className="absolute top-3.5 left-3.5 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg border border-red-400">
            <span>Save {discountPct}%</span>
          </div>
        )}
      </Link>

      {/* 2. Mixtiles Content Block + Moonflash Prices */}
      <div className="flex flex-col p-5 bg-white">
        <div className="flex items-center justify-between">
          <Link href={`/product/${product.slug}`}>
            <h4 className="font-serif text-base font-bold text-brand-dark group-hover:text-brand-gold transition-colors">
              {templateTitle || product.title}
            </h4>
          </Link>

          {/* Create CTA Button (Mixtiles style) */}
          <button
            onClick={handleCreate}
            className="flex items-center gap-1.5 rounded-full bg-brand-dark px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-all shadow-md active:scale-95 hover:scale-105"
          >
            <Sparkles className="h-3 w-3 text-brand-gold" />
            <span>Create</span>
          </button>
        </div>

        {/* Visible Price & Discounted Compare-At */}
        <div className="mt-3 flex items-baseline gap-2 pt-2.5 border-t border-neutral-100">
          <span className="text-base font-bold text-brand-dark tracking-tight">
            {formattedBase.formatted}
          </span>
          {product.compareAtPrice > product.basePrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formattedCompare.formatted}
            </span>
          )}
          <span className="text-[11px] text-neutral-400 italic ml-auto">
            Includes custom frame
          </span>
        </div>
      </div>
    </div>
  );
};
