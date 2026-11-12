'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { COLLECTIONS, PRODUCTS } from '@/data/mockData';
import { useDevStore, formatCurrency } from '@/store';
import { MediumType } from '@/types';

export default function CollectionsPage() {
  const [filterType, setFilterType] = useState<string>('all');
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  const filteredCollections = filterType === 'all'
    ? COLLECTIONS
    : COLLECTIONS.filter((c) => c.type === filterType);

  return (
    <div className="bg-brand-linen min-h-screen py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Archival Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mt-2">
            Museum-Grade Physical Art Mediums
          </h1>
          <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
            Every memory deserves an enduring physical medium. From frameless magnetic wall tiles to hand-stretched cotton canvases and optical glass suncatchers.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Curations' },
              { id: 'medium', label: 'Physical Mediums' },
              { id: 'audience', label: 'Audience Hubs' },
              { id: 'seasonal', label: 'Seasonal & Events' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                  filterType === tab.id
                    ? 'bg-brand-dark text-white shadow-md'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:border-brand-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCollections.map((col) => {
            const formattedPrice = formatCurrency(col.startingPrice, activeCurrency);
            const routePrefix =
              col.type === 'medium'
                ? '/collections/'
                : col.type === 'audience'
                ? '/category/'
                : '/seasonal/';

            return (
              <Link
                key={col.id}
                href={`${routePrefix}${col.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-brand-border shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={col.heroImage}
                    alt={col.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-brand-dark backdrop-blur-md shadow">
                    From {formattedPrice.formatted}
                  </div>
                </div>

                <div className="p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                      {col.type === 'medium' ? 'Physical Medium' : 'Curated Hub'}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-brand-dark mt-1 group-hover:text-brand-gold transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-neutral-100">
                    <span className="text-xs font-bold text-brand-dark group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                      <span>Explore Collection</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {col.featuredProductIds.length} Products
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

