'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { useUIStore, useDevStore, formatCurrency } from '@/store';
import { PRODUCTS, COLLECTIONS } from '@/data/mockData';

export const SearchModal: React.FC = () => {
  const isSearchOpen = useUIStore((s) => s.isSearchOpen);
  const closeSearch = useUIStore((s) => s.closeSearch);
  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = searchTerm.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.categoryTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : PRODUCTS.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeSearch} />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden animate-in slide-in-from-top-4 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-neutral-200 p-4">
          <Search className="h-5 w-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products, styles, collections (e.g., 'cat', 'canvas', 'tiles')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="flex-1 text-sm outline-none placeholder:text-neutral-400 text-neutral-800"
          />
          <button
            onClick={closeSearch}
            className="p-1 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto p-4 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {searchTerm ? `Results for "${searchTerm}"` : 'Popular Searches'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((p) => {
              const formattedPrice = formatCurrency(p.basePrice, activeCurrency);
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  onClick={closeSearch}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 p-2.5 hover:border-brand-gold hover:bg-brand-linen transition-colors group"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[10px] font-semibold text-brand-gold block uppercase">
                      {p.categoryTag}
                    </span>
                    <h5 className="text-xs font-bold text-brand-dark truncate">{p.title}</h5>
                    <span className="text-xs font-bold text-neutral-800">
                      {formattedPrice.formatted}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

