'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Sparkles, Heart, ShoppingBag, Palette } from 'lucide-react';
import { useCartStore, useVisionStore, useUIStore } from '@/store';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const cartItems = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const savedVisions = useVisionStore((s) => s.savedVisions);
  const openAppModal = useUIStore((s) => s.openAppModal);

  const handleCreateClick = () => {
    openAppModal({
      productId: 'single-tile-6x8',
      productTitle: 'Single Tile — Graphic Print',
      basePrice: 49.0,
      initialStyleId: 'watercolor-botanica',
    });
  };

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-neutral-200/80 bg-white/92 backdrop-blur-xl shadow-[0_-4px_25px_rgba(0,0,0,0.08)] pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] pt-2 px-3"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-scale ${
            pathname === '/'
              ? 'text-brand-dark font-bold'
              : 'text-neutral-500 hover:text-brand-dark'
          }`}
        >
          <Home className={`h-5 w-5 ${pathname === '/' ? 'text-brand-dark stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1">Home</span>
          {pathname === '/' && (
            <span className="h-1 w-1 rounded-full bg-brand-gold mt-0.5" />
          )}
        </Link>

        {/* 2. Explore / Collections */}
        <Link
          href="/collections"
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-scale ${
            pathname.startsWith('/collections')
              ? 'text-brand-dark font-bold'
              : 'text-neutral-500 hover:text-brand-dark'
          }`}
        >
          <Compass className={`h-5 w-5 ${pathname.startsWith('/collections') ? 'text-brand-dark stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-1">Explore</span>
          {pathname.startsWith('/collections') && (
            <span className="h-1 w-1 rounded-full bg-brand-gold mt-0.5" />
          )}
        </Link>

        {/* 3. Center Elevated Action: CREATE ART */}
        <button
          onClick={handleCreateClick}
          aria-label="Create personalized art"
          className="relative -top-4 flex flex-col items-center justify-center touch-scale focus:outline-none group"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-dark text-white shadow-xl ring-4 ring-white/90 group-hover:scale-105 transition-all overflow-hidden relative">
            <Sparkles className="h-5 w-5 text-brand-gold relative z-10 animate-bounce-soft" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-gold/30 via-transparent to-brand-gold/20" />
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
          </div>
          <span className="text-[10px] font-bold text-brand-dark mt-1">Create</span>
        </button>

        {/* 4. My Visions */}
        <Link
          href="/my-art"
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-scale ${
            pathname === '/my-art'
              ? 'text-brand-dark font-bold'
              : 'text-neutral-500 hover:text-brand-dark'
          }`}
        >
          <div className="relative">
            <Palette className={`h-5 w-5 ${pathname === '/my-art' ? 'text-brand-dark stroke-[2.5]' : ''}`} />
            {savedVisions.length > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-white shadow">
                {savedVisions.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Visions</span>
          {pathname === '/my-art' && (
            <span className="h-1 w-1 rounded-full bg-brand-gold mt-0.5" />
          )}
        </Link>

        {/* 5. Cart Drawer Trigger */}
        <button
          onClick={openCart}
          aria-label="Open Shopping Bag"
          className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-neutral-500 hover:text-brand-dark transition-all touch-scale"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-brand-dark text-[9px] font-bold text-white shadow">
                {totalCartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1">Cart</span>
        </button>
      </div>
    </nav>
  );
};

