'use client';

import React, { useState } from 'react';
import { Star, Heart, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { UGC_POSTS } from '@/data/mockData';
import { useUIStore } from '@/store';

export const UgcWallSection: React.FC = () => {
  const openAppModal = useUIStore((s) => s.openAppModal);
  const openRoomVisualizer = useUIStore((s) => s.openRoomVisualizer);
  const addToast = useUIStore((s) => s.addToast);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [likesState, setLikesState] = useState<Record<string, number>>(() =>
    UGC_POSTS.reduce((acc, p) => ({ ...acc, [p.id]: p.likes }), {})
  );
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked[id]) {
      setLikesState((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikesState((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: true }));
      addToast('Thank you for loving this customer wall design!', 'info');
    }
  };

  const handleCreateSimilar = (post: (typeof UGC_POSTS)[0]) => {
    openAppModal({
      productId: 'single-tile-6x8',
      productTitle: post.productTitle,
      basePrice: 49.0,
      initialStyleId: post.styleId,
    });
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-linen px-3.5 py-1 text-xs font-bold text-brand-dark border border-brand-border mb-3">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold animate-bounce-soft" />
              <span>Real Customer Walls • #MyMoonflashWall</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
              As Seen on 4,000,000+ Walls
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl leading-relaxed">
              Real homes. Real camera roll photos. See how everyday snapshots become conversational fine art centerpieces.
            </p>
          </div>

          <button
            onClick={() => {
              openAppModal({
                productId: 'single-tile-6x8',
                productTitle: 'Single Tile — Graphic Print',
                basePrice: 49.0,
                initialStyleId: 'watercolor-botanica',
              });
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-gold underline"
          >
            <span>Upload Your Wall Snapshot</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Masonry / Grid of Real Customer Photos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {UGC_POSTS.map((post) => {
            const isLiked = hasLiked[post.id];
            const currentLikes = likesState[post.id] || post.likes;

            return (
              <div
                key={post.id}
                className="group relative rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Media Container */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.wallImageUrl}
                    alt={post.roomType}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Customer Photo Snapshot Peek */}
                  {post.originalPhotoUrl && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-2xl glass-panel p-1.5 shadow-lg border border-white/80 max-w-[85%]">
                      <div className="h-9 w-9 rounded-xl overflow-hidden border border-white flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.originalPhotoUrl}
                          alt="Their camera photo"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 pr-1">
                        <span className="block text-[8px] uppercase tracking-wider font-bold text-brand-gold truncate">
                          Original Photo
                        </span>
                        <span className="block text-[10px] font-bold text-brand-dark truncate">
                          {post.styleName}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold shadow-md backdrop-blur-md hover:scale-105 active:scale-95 transition-all text-neutral-700"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        isLiked ? 'fill-red-600 text-red-600' : 'text-neutral-500'
                      }`}
                    />
                    <span className="text-[11px]">{currentLikes}</span>
                  </button>
                </div>

                {/* Review & Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Customer info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-brand-dark">
                          {post.customerName}
                        </span>
                        {post.verifiedBuyer && (
                          <span title="Verified Customer">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400">{post.location}</span>
                    </div>

                    {/* Star rating */}
                    <div className="flex items-center text-brand-gold mb-2">
                      {[...Array(post.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-brand-gold" />
                      ))}
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed italic">
                      &quot;{post.comment}&quot;
                    </p>
                  </div>

                  {/* 1-Click Action to replicate style */}
                  <div className="mt-4 pt-3 border-t border-neutral-100">
                    <button
                      onClick={() => handleCreateSimilar(post)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-full bg-brand-linen border border-brand-border py-2 text-xs font-bold text-brand-dark hover:bg-brand-dark hover:text-white transition-all shadow-sm active:scale-95"
                    >
                      <Sparkles className="h-3 w-3 text-brand-gold" />
                      <span>Make in {post.styleName}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
