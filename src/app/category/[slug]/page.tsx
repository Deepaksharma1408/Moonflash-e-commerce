'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { COLLECTIONS, PRODUCTS } from '@/data/mockData';
import { CategoryCard } from '@/components/CategoryCard';
import { ProductCard } from '@/components/ProductCard';

export default function CategoryAudiencePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const collection = COLLECTIONS.find((c) => c.slug === slug);

  if (!collection) {
    return notFound();
  }

  const products = PRODUCTS.filter((p) => collection.featuredProductIds.includes(p.id));

  const sourceBubbles = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=100&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  ];

  return (
    <div className="bg-brand-linen min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/#your-story"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-brand-dark mb-4 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Stories</span>
          </Link>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Curated Audience Hub
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark mt-1">
              {collection.name}
            </h1>
            <p className="text-sm text-neutral-600 mt-2 max-w-2xl leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>

        {/* Mixtiles Layout with Prices & Discounts */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-brand-gold" />
            <h2 className="font-serif text-xl font-bold text-brand-dark">
              Artisan Room Mockups
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <CategoryCard
                key={product.id}
                product={product}
                templateTitle={product.title}
                roomMockupImage={product.images[0]}
                sourcePhotoBubbles={sourceBubbles}
              />
            ))}
          </div>
        </div>

        {/* Product Cards */}
        <div className="pt-8 border-t border-brand-border">
          <h2 className="font-serif text-xl font-bold text-brand-dark mb-6">
            Explore All {collection.name} Items
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

