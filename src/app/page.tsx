'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Award, ShieldCheck, RotateCcw, Check, Eye, Layers } from 'lucide-react';
import { PRODUCTS } from '@/data/mockData';
import { ProductCard } from '@/components/ProductCard';
import { UgcWallSection } from '@/components/UgcWallSection';
import { useVisionStore, useDevStore, useUIStore, useCartStore, formatCurrency } from '@/store';

export default function HomePage() {
  const savedVisions = useVisionStore((s) => s.savedVisions);
  const forceMyVisions = useDevStore((s) => s.forceMyVisions);
  const souvenirsLayout = useDevStore((s) => s.souvenirsLayout);
  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const openAppModal = useUIStore((s) => s.openAppModal);
  const openRoomVisualizer = useUIStore((s) => s.openRoomVisualizer);
  const openGalleryBuilder = useUIStore((s) => s.openGalleryBuilder);
  const addItemToCart = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);

  // Hero interactive state: 0 = Framed Artwork, 1 = Raw Camera Roll Photo
  const [heroMode, setHeroMode] = useState<'art' | 'photo'>('art');
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });
  const [heroMousePos, setHeroMousePos] = useState({ x: 50, y: 50 });
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const heroCardRef = useRef<HTMLDivElement>(null);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHeroMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = -((y / rect.height) - 0.5) * 8;
    setHeroTilt({ x: rotateX, y: rotateY });
  };

  const handleHeroMouseLeave = () => {
    setIsHeroHovered(false);
    setHeroTilt({ x: 0, y: 0 });
  };

  const shouldShowVisions =
    forceMyVisions !== null ? forceMyVisions : savedVisions.length > 0;

  const popularProducts = PRODUCTS.slice(0, 4);

  const handleOrderVisionAgain = (v: (typeof savedVisions)[0]) => {
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

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ============================================================= */}
      {/* SECTION 1: HERO ("Art, Personally Yours.")                     */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-brand-linen py-8 sm:py-16 md:py-24 border-b border-brand-border">
        {/* Subtle Ambient Radial Glows & Dynamic Aurora */}
        <div className="absolute inset-0 animate-aurora opacity-70 pointer-events-none" />
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-brand-sand/80 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full glass-panel px-3.5 sm:px-4 py-1.5 shadow-sm text-xs font-semibold text-brand-dark animate-float">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold animate-spin" style={{ animationDuration: '6s' }} />
                <span>Museum-Grade Personalized Physical Art</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark leading-[1.12]">
                Art, Personally Yours.
              </h1>

              <p className="text-sm sm:text-lg text-neutral-600 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Made from your memories. Designed in our studio. Upload your favorite photo and watch it synthesize into an archival masterpiece in 3 seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button
                  onClick={() =>
                    openAppModal({
                      productId: 'single-tile-6x8',
                      productTitle: 'Single Tile — Graphic Print',
                      basePrice: 49.0,
                      initialStyleId: 'watercolor-botanica',
                    })
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-brand-dark px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-xl hover:scale-105 active:scale-95 group relative overflow-hidden touch-scale"
                >
                  <span className="relative z-10">Upload Your Photo</span>
                  <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                </button>

                <Link
                  href="/collections"
                  className="w-full sm:w-auto rounded-full border border-neutral-300 bg-white/80 backdrop-blur-md px-7 sm:px-8 py-3.5 sm:py-4 text-center text-xs sm:text-sm font-bold text-neutral-800 hover:bg-white hover:border-brand-dark transition-all shadow-sm active:scale-95 touch-scale"
                >
                  Explore Mediums
                </Link>
              </div>

              {/* Social Proof Mini Bar */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 text-xs text-neutral-600">
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
                  ].map((url, i) => (
                    <div
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-neutral-300 overflow-hidden shadow-sm"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="Customer" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start text-brand-gold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-3.5 w-3.5 fill-brand-gold" />
                    ))}
                  </div>
                  <div>
                    <span className="font-bold text-brand-dark">4.9 / 5</span> from 156,000+ happy customers
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Living Room Mockup with 3D Tilt & Live Comparison */}
            <div className="lg:col-span-6 relative perspective-1000">
              {/* Floating Luxury Badges in 3D Space (Desktop / Tablet) */}
              <div className="hidden sm:flex absolute -top-4 -left-4 z-30 items-center gap-1.5 rounded-full glass-pill px-4 py-2 text-xs font-bold text-brand-dark shadow-xl animate-float">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                <span>100% Archival Cotton Linen</span>
              </div>

              <div className="hidden sm:flex absolute -bottom-4 -right-2 z-30 items-center gap-2 rounded-full glass-pill px-4 py-2 text-xs font-bold text-brand-dark shadow-xl animate-float-delayed">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Live Studio: 18 synthesized today</span>
              </div>

              <div
                ref={heroCardRef}
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={handleHeroMouseLeave}
                style={{
                  transform: isHeroHovered
                    ? `perspective(1000px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg) scale(1.02)`
                    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
                  transition: isHeroHovered ? 'transform 0.15s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-900 group will-change-transform"
              >
                {/* Dynamic Spotlight Glare Following Mouse */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
                  style={{
                    background: `radial-gradient(600px circle at ${heroMousePos.x}% ${heroMousePos.y}%, rgba(255, 255, 255, 0.2), transparent 50%)`,
                  }}
                />

                {/* Main Hero Image with Smooth Crossfade */}
                <div className="relative h-[320px] sm:h-[420px] md:h-[460px] w-full overflow-hidden">
                  {/* Mode: Artwork on living room wall */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=1200&q=80"
                    alt="Moonflash Art in designer interior"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                      heroMode === 'art' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                  />

                  {/* Mode: Raw Original Camera Roll Photo */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80"
                    alt="Original raw camera photo"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                      heroMode === 'photo' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                  />
                </div>

                {/* Interactive Toggle Control Badge in Corner */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
                  <button
                    onClick={() =>
                      openRoomVisualizer({
                        imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&q=80',
                        title: 'Golden Retriever Fine Art Canvas',
                        frameId: 'natural-oak',
                        frameName: 'Natural European Oak',
                        filterRecipe: 'contrast(115%) saturate(135%) brightness(105%)',
                      })
                    }
                    className="hidden sm:flex items-center gap-1.5 rounded-full glass-panel px-3 py-1 text-xs font-bold text-brand-dark shadow-md hover:bg-white transition-all active:scale-95 touch-scale"
                    title="Open 3D Wall Visualizer"
                  >
                    <Eye className="h-3.5 w-3.5 text-brand-gold" />
                    <span>View on Wall</span>
                  </button>

                  <div className="flex rounded-full glass-panel p-1 shadow-lg border border-white/60">
                    <button
                      onClick={() => setHeroMode('art')}
                      className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold transition-all touch-scale ${
                        heroMode === 'art'
                          ? 'bg-brand-dark text-white shadow-md'
                          : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      Framed Art
                    </button>
                    <button
                      onClick={() => setHeroMode('photo')}
                      className={`rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold transition-all touch-scale ${
                        heroMode === 'photo'
                          ? 'bg-brand-dark text-white shadow-md'
                          : 'text-neutral-700 hover:text-black'
                      }`}
                    >
                      Raw Photo
                    </button>
                  </div>
                </div>

                {/* Floating "THEIR PHOTO" Before/After Pill */}
                <div className="absolute bottom-3 inset-x-3 sm:inset-x-auto sm:left-5 sm:bottom-5 z-30 rounded-2xl glass-panel p-2.5 sm:p-3.5 shadow-2xl border border-white/80 flex items-center gap-3 backdrop-blur-xl">
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&q=80"
                      alt="Raw customer photo"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-brand-gold/15 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 flex-shrink-0" />
                      <span>Their Smartphone Photo</span>
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-brand-dark block mt-0.5 truncate">
                      Synthesized into Handcrafted Canvas
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Luxury Feature Badges (Visible on small screens) */}
              <div className="flex sm:hidden items-center justify-between gap-2 mt-3 text-[11px] font-bold text-neutral-700">
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm border border-neutral-200">
                  <Sparkles className="h-3 w-3 text-brand-gold" />
                  <span>Archival Cotton Linen</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm border border-neutral-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Live Studio: 18 today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 2: "MY VISIONS" (PREVIOUSLY DESIGNED ARTWORKS)        */}
      {/* ============================================================= */}
      {shouldShowVisions && (
        <section className="py-8 sm:py-12 bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-brand-linen flex items-center justify-center border border-brand-border">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark">
                    My Visions ({savedVisions.length})
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-500">Your personalized artworks ready for 1-click ordering</p>
                </div>
              </div>
              <Link
                href="/my-art"
                className="text-xs font-bold text-brand-dark hover:text-brand-gold underline flex items-center gap-1"
              >
                <span>Studio Hub</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Horizontal Touch-Swipe Carousel on Mobile, Responsive Grid on Desktop */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-3 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {savedVisions.map((v) => {
                const formattedPrice = formatCurrency(v.price, activeCurrency);
                return (
                  <div
                    key={v.id}
                    className="min-w-[170px] sm:min-w-0 snap-start flex-shrink-0 sm:flex-shrink group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 mb-2.5 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={v.customArtUrl}
                        alt={v.productTitle}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-1.5 right-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                        Saved
                      </div>
                    </div>
                    <h5 className="font-serif text-xs font-bold text-brand-dark truncate">
                      {v.productTitle}
                    </h5>
                    <p className="text-[10px] text-neutral-500 mb-2 truncate">
                      Style: <span className="font-semibold text-neutral-700">{v.styleName}</span>
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                      <span className="text-xs font-bold text-brand-dark">
                        {formattedPrice.formatted}
                      </span>
                      <button
                        onClick={() => handleOrderVisionAgain(v)}
                        className="flex items-center gap-1 rounded-full bg-brand-dark px-2.5 sm:px-3 py-1 text-[10px] font-bold text-white hover:bg-neutral-800 shadow transition-transform active:scale-95 touch-scale"
                      >
                        <RotateCcw className="h-2.5 w-2.5" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= */}
      {/* SECTION 3: FULL SCREEN LINER / MARQUEE BANNER (Tedoo Style)   */}
      {/* Enhanced with sleek Edge Gradient Masks                       */}
      {/* ============================================================= */}
      <section className="relative overflow-hidden bg-brand-dark py-6 sm:py-7 text-white shadow-inner">
        <div
          className="flex items-center whitespace-nowrap animate-marquee hover:[animation-play-state:paused]"
          style={{
            maskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 sm:gap-8 text-xl sm:text-3xl font-bold uppercase tracking-wider mx-3 sm:mx-4">
              <span>NOVEMBER SALE</span>
              <span className="text-brand-gold animate-pulse">•</span>
              <span className="text-brand-gold">50% OFF EVERYTHING</span>
              <span className="text-brand-gold animate-pulse">•</span>
              <span>LIMITED HOLIDAY EDITION</span>
              <span className="text-brand-gold animate-pulse">•</span>
            </div>
          ))}
        </div>

        {/* Center Glass Pill CTA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link
            href="/seasonal/black-friday"
            className="pointer-events-auto rounded-full bg-white px-5 sm:px-7 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold tracking-wider uppercase text-brand-dark hover:bg-neutral-200 shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white touch-scale"
          >
            SHOP THE SALE →
          </Link>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 4: 3 CENTERED SQUARES (Pet Lovers, Family, Travel)   */}
      {/* ============================================================= */}
      <section id="your-story" className="py-12 sm:py-20 bg-brand-linen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Editorial Collections
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-brand-dark mt-1">
              Curated for the Moments that Matter
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Explore audience-specific fine art styles designed to complement your living space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Square 1: Pet Lovers */}
            <Link
              href="/category/pet-lovers"
              className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-brand-border touch-scale"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80"
                alt="Pet Lovers Art"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                  Audience Hub
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold group-hover:text-brand-gold transition-colors">
                  Pet Lovers
                </h3>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                  Comic pop-art, stained glass, and royal portraits of your furry companions.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold mt-3 sm:mt-4 text-brand-gold group-hover:translate-x-1.5 transition-transform">
                  Explore Pet Art →
                </span>
              </div>
            </Link>

            {/* Square 2: Family Portraits */}
            <Link
              href="/category/family"
              className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-brand-border touch-scale"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80"
                alt="Family Portraits Art"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                  Cherished Memories
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold group-hover:text-brand-gold transition-colors">
                  Family Portraits
                </h3>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                  Multi-generational fine art canvases preserving newborn and wedding milestones.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold mt-3 sm:mt-4 text-brand-gold group-hover:translate-x-1.5 transition-transform">
                  Explore Family Canvas →
                </span>
              </div>
            </Link>

            {/* Square 3: Travel & Hobbies */}
            <Link
              href="/category/travel-hobbies"
              className="group relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-brand-border touch-scale"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
                alt="Travel & Hobbies Art"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-gold mb-1">
                  Wanderlust Art
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold group-hover:text-brand-gold transition-colors">
                  Travel & Hobbies
                </h3>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                  Transform vacation landscapes into vintage gouache travel lithographs.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold mt-3 sm:mt-4 text-brand-gold group-hover:translate-x-1.5 transition-transform">
                  Explore Travel Posters →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 5: POPULAR ITEMS ("Start with these." - 4 Squares)    */}
      {/* ============================================================= */}
      <section className="py-12 sm:py-20 bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                Most Coveted Physical Art
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
                Start with these.
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs font-bold text-brand-dark hover:text-brand-gold underline flex items-center gap-1.5"
            >
              <span>Explore All 14 Mediums</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 2 columns on mobile, 4 on desktop for an authentic native shopping app experience */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION: MULTI-PANEL GALLERY WALL BUILDER SUITE               */}
      {/* ============================================================= */}
      <section className="py-12 sm:py-16 bg-brand-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 animate-aurora opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3.5 py-1 text-xs font-bold text-brand-gold border border-brand-gold/40 animate-bounce-soft">
                <Layers className="h-3.5 w-3.5" />
                <span>Multi-Tile Wall Designer • Up to 30% Off</span>
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Span 1 Photo Across 3 Tiles. Or Create a 6-Piece Heritage Wall.
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Use our interactive builder to preview panoramic triptychs and multi-moment grids with magnetic spacing guides. Bundles automatically apply multi-pack savings.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={openGalleryBuilder}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-brand-gold hover:bg-amber-500 px-7 py-4 text-xs font-bold uppercase tracking-wider text-brand-dark transition-all shadow-xl hover:scale-105 active:scale-95 touch-scale"
                >
                  <Layers className="h-4 w-4" />
                  <span>Launch Gallery Wall Builder →</span>
                </button>

                <button
                  onClick={() =>
                    openRoomVisualizer({
                      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
                      title: 'The Panoramic Triptych (3-Piece)',
                      frameId: 'natural-oak',
                      frameName: 'Natural European Oak',
                    })
                  }
                  className="w-full sm:w-auto rounded-full border border-neutral-600 px-6 py-4 text-xs font-bold text-neutral-300 hover:text-white hover:border-white transition-all active:scale-95 touch-scale"
                >
                  Preview in Room Visualizer
                </button>
              </div>
            </div>

            {/* Right: Interactive 3-Tile Triptych Preview */}
            <div className="lg:col-span-5">
              <div
                onClick={openGalleryBuilder}
                className="cursor-pointer group relative rounded-3xl overflow-hidden border-2 border-white/20 bg-neutral-950 p-4 shadow-2xl hover:scale-[1.02] transition-transform"
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
                    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80',
                  ].map((url, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden border border-white/20 relative shadow-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Tile ${idx + 1}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-brand-dark shadow-2xl flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                    <span>Customize This 3-Pack Bundle</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 6: GIFTS FOR THE SEASON ("Souvenirs of the season")   */}
      {/* ============================================================= */}
      <section className="py-12 sm:py-20 bg-brand-linen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
              Keepsakes Worth Holding Onto
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
              Souvenirs of the season
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Start from a photo, a pet, or the moment you are marking.
            </p>
          </div>

          <div
            className={`grid gap-6 sm:gap-8 ${
              souvenirsLayout === '2-up'
                ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {/* Card 1 */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-md border border-brand-border flex flex-col group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1512474932049-78ac69ede12c?w=800&q=80"
                  alt="Gifts with memories"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h4 className="font-serif text-base sm:text-lg font-bold text-brand-dark">Gifts with memories</h4>
                <p className="text-xs text-neutral-600 mt-1 mb-4">
                  Turn any photo into an emotional heirloom keepsake ready for holiday gift unwrapping.
                </p>
                <Link
                  href="/collections/ornaments"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-gold underline"
                >
                  Explore Holiday Gifts →
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-md border border-brand-border flex flex-col group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80"
                  alt="For your pet"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h4 className="font-serif text-base sm:text-lg font-bold text-brand-dark">For your pet</h4>
                <p className="text-xs text-neutral-600 mt-1 mb-4">
                  Made from your pet&apos;s photo with comic pop-art or regal oil brushwork.
                </p>
                <Link
                  href="/category/pet-lovers"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-gold underline"
                >
                  Create Pet Art →
                </Link>
              </div>
            </div>

            {/* Card 3 (3-up) */}
            {souvenirsLayout === '3-up' && (
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white shadow-md border border-brand-border flex flex-col group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80"
                    alt="By occasion"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-brand-dark">By occasion</h4>
                  <p className="text-xs text-neutral-600 mt-1 mb-4">
                    A portrait for the milestone you are marking: weddings, milestones, new homes.
                  </p>
                  <Link
                    href="/category/family"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-gold underline"
                  >
                    View Occasion Art →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION: REAL CUSTOMER WALLS (#MyMoonflashWall UGC GALLERY)    */}
      {/* ============================================================= */}
      <UgcWallSection />

      {/* ============================================================= */}
      {/* SECTION 7: CREDIBILITY STRIP (Mixtiles Style)                 */}
      {/* ============================================================= */}
      <section id="reviews" className="py-12 sm:py-20 bg-white border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Verified Excellence
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1 mb-8 sm:mb-12">
            The Best Place to Print Your Photos
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <div className="flex flex-col items-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-linen border border-brand-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center gap-1 text-brand-gold mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-5 w-5 fill-brand-gold text-brand-gold animate-bounce-soft" style={{ animationDelay: `${s * 0.1}s` }} />
                ))}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">4.9 / 5</h3>
              <p className="text-xs font-semibold text-neutral-600 mt-1">156,000+ Verified Reviews</p>
            </div>

            <div className="flex flex-col items-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-linen border border-brand-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <Award className="h-8 w-8 text-brand-gold mb-2 animate-bounce-soft" style={{ animationDelay: '0.2s' }} />
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">4,000,000+</h3>
              <p className="text-xs font-semibold text-neutral-600 mt-1">Happy Customers Worldwide</p>
            </div>

            <div className="flex flex-col items-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-brand-linen border border-brand-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <ShieldCheck className="h-8 w-8 text-brand-gold mb-2 animate-bounce-soft" style={{ animationDelay: '0.4s' }} />
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">100M+</h3>
              <p className="text-xs font-semibold text-neutral-600 mt-1">Photos Printed with Archival Inks</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
