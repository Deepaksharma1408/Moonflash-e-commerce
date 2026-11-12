'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Eye } from 'lucide-react';
import { useUIStore } from '@/store';

export default function HomePage() {
  const openAppModal = useUIStore((s) => s.openAppModal);
  const openRoomVisualizer = useUIStore((s) => s.openRoomVisualizer);

  // Hero interactive state: 'art' = Framed Maritime Tall Ship Oil Painting, 'photo' = Raw Camera Roll Dog Photo
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

  return (
    <main className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-brand-linen py-8 lg:py-16 relative overflow-hidden">
      {/* Subtle Ambient Radial Glows & Dynamic Aurora */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-100/40 via-brand-linen to-brand-sand/30 pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 h-96 w-96 rounded-full bg-brand-sand/80 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-1.5 shadow-sm text-xs font-semibold text-brand-dark animate-float">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
              <span>Museum-Grade Personalized Physical Art</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brand-dark leading-[1.12]">
              Art, Personally<br className="hidden sm:inline" /> Yours.
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
                <span className="relative z-10">UPLOAD YOUR PHOTO</span>
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

          {/* Right Column: Hero Artwork Showcase */}
          <div className="lg:col-span-6 relative perspective-1000">
            {/* Top-Left Floating Badge */}
            <div className="hidden sm:flex absolute -top-4 -left-4 z-30 items-center gap-1.5 rounded-full glass-pill px-4 py-2 text-xs font-bold text-brand-dark shadow-xl animate-float">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
              <span>100% Archival Cotton Linen</span>
            </div>

            {/* Bottom-Right Floating Badge */}
            <div className="hidden sm:flex absolute -bottom-4 -right-2 z-30 items-center gap-2 rounded-full glass-pill px-4 py-2 text-xs font-bold text-brand-dark shadow-xl animate-float-delayed bg-white/90">
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

              {/* Main Artwork Image Area with Seamless Crossfade */}
              <div className="relative h-[340px] sm:h-[440px] md:h-[480px] w-full overflow-hidden bg-neutral-950">
                {/* Mode: Tall Ship Maritime Oil Painting */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&q=80"
                  alt="Tall Ship Handcrafted Canvas"
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

              {/* Interactive Controls Overlay in Top-Right Corner */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-2">
                <button
                  onClick={() =>
                    openRoomVisualizer({
                      imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&q=80',
                      title: 'Maritime Tall Ship Canvas',
                      frameId: 'natural-oak',
                      frameName: 'Natural European Oak',
                      filterRecipe: 'contrast(115%) saturate(135%) brightness(105%)',
                    })
                  }
                  className="hidden sm:flex items-center gap-1.5 rounded-full glass-panel px-3.5 py-1.5 text-xs font-bold text-brand-dark shadow-md hover:bg-white transition-all active:scale-95 touch-scale"
                  title="Open 3D Wall Visualizer"
                >
                  <Eye className="h-3.5 w-3.5 text-brand-gold" />
                  <span>View on Wall</span>
                </button>

                <div className="flex rounded-full glass-panel p-1 shadow-lg border border-white/60">
                  <button
                    onClick={() => setHeroMode('art')}
                    className={`rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-bold transition-all touch-scale ${
                      heroMode === 'art'
                        ? 'bg-brand-dark text-white shadow-md'
                        : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    Framed Art
                  </button>
                  <button
                    onClick={() => setHeroMode('photo')}
                    className={`rounded-full px-3.5 py-1 text-[11px] sm:text-xs font-bold transition-all touch-scale ${
                      heroMode === 'photo'
                        ? 'bg-brand-dark text-white shadow-md'
                        : 'text-neutral-700 hover:text-black'
                    }`}
                  >
                    Raw Photo
                  </button>
                </div>
              </div>

              {/* Floating "THEIR SMARTPHONE PHOTO" Pill in Bottom-Left */}
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
                    <span>THEIR SMARTPHONE PHOTO</span>
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-brand-dark block mt-0.5 truncate">
                    Synthesized into Handcrafted Canvas
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Feature Badges (Visible on small screens) */}
            <div className="flex sm:hidden items-center justify-between gap-2 mt-3 text-[11px] font-bold text-neutral-700">
              <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm border border-neutral-200">
                <Sparkles className="h-3 w-3 text-brand-gold" />
                <span>100% Archival Linen</span>
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
    </main>
  );
}
