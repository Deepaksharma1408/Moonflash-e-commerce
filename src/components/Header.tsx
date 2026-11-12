'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Sparkles, Layers } from 'lucide-react';
import { useCartStore, useVisionStore, useWishlistStore, useUIStore, useDevStore } from '@/store';
import { CURRENCIES, COLLECTIONS } from '@/data/mockData';
import { CurrencyCode } from '@/types';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const cartItems = useCartStore((s) => s.items);
  const openCart = useCartStore((s) => s.openCart);
  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const savedVisions = useVisionStore((s) => s.savedVisions);
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const toggleWishlistDrawer = useWishlistStore((s) => s.toggleWishlistDrawer);
  const openSearch = useUIStore((s) => s.openSearch);
  const openAppModal = useUIStore((s) => s.openAppModal);
  const openGalleryBuilder = useUIStore((s) => s.openGalleryBuilder);

  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const setActiveCurrency = useDevStore((s) => s.setActiveCurrency);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. ANNOUNCEMENT BAR */}
      <div className="relative z-50 bg-brand-dark px-4 py-2 text-center text-xs font-medium text-white tracking-wide">
        <span className="font-semibold uppercase tracking-wider text-brand-gold mr-2">
          Holiday Guarantee:
        </span>
        Order by Dec 18 for guaranteed Christmas delivery • Free Worldwide Shipping on orders over $75
      </div>

      {/* 2. GLOBAL STICKY HEADER */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'border-b border-neutral-200/80 bg-white/95 backdrop-blur-md shadow-sm'
            : 'border-b border-transparent bg-white'
        }`}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-neutral-800 lg:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-brand-dark group-hover:text-brand-gold transition-colors">
                MOONFLASH
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {/* Shop Mega Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                href="/collections"
                className="flex items-center gap-1 text-sm font-medium text-neutral-800 hover:text-brand-gold transition-colors py-4"
              >
                Shop <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </Link>

              {/* Desktop Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 w-[840px] rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-4 gap-6">
                    {/* Col 1: Editorial Feature */}
                    <div className="rounded-xl overflow-hidden bg-brand-linen p-4 flex flex-col justify-between border border-brand-border">
                      <div>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-brand-gold">
                          Featured Art
                        </span>
                        <h4 className="font-serif text-base font-bold text-brand-dark mt-1">
                          Transform Memories
                        </h4>
                        <p className="text-xs text-neutral-600 mt-1">
                          Museum-grade archival art handcrafted in our studio.
                        </p>
                      </div>
                      <Link
                        href="/collections/tiles"
                        className="inline-block mt-4 rounded-full bg-brand-dark px-4 py-2 text-center text-xs font-bold text-white hover:bg-neutral-800"
                      >
                        Explore Wall Tiles →
                      </Link>
                    </div>

                    {/* Col 2: Art Collections */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                        Art Mediums
                      </h5>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/collections/tiles" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Frameless Wall Tiles
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections/canvas" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Stretched Canvas
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections/glass" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Glass Suncatchers
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections/mugs" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Artisan Ceramic Mugs
                          </Link>
                        </li>
                        <li>
                          <Link href="/collections/ornaments" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Holiday Wood Ornaments
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 3: Customer Types */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                        Audiences & Hubs
                      </h5>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/category/pet-lovers" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Pet Lovers Collection
                          </Link>
                        </li>
                        <li>
                          <Link href="/category/family" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Family Portraits
                          </Link>
                        </li>
                        <li>
                          <Link href="/category/travel-hobbies" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Travel & Hobbies
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Col 4: Seasonal */}
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                        Occasions & Sales
                      </h5>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <Link href="/seasonal/christmas" className="text-red-700 hover:text-red-800 font-semibold flex items-center gap-1">
                            Christmas Delivery 2026
                          </Link>
                        </li>
                        <li>
                          <Link href="/seasonal/black-friday" className="text-brand-dark hover:text-brand-gold font-semibold">
                            Black Friday 50% Off
                          </Link>
                        </li>
                        <li>
                          <Link href="/seasonal/mothers-day" className="text-neutral-700 hover:text-brand-dark font-medium">
                            Mother&apos;s Day Keepsakes
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/#your-story"
              className="text-sm font-medium text-neutral-800 hover:text-brand-gold transition-colors"
            >
              Your Story
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-neutral-800 hover:text-brand-gold transition-colors"
            >
              Our Studio
            </Link>
            <Link
              href="/#reviews"
              className="text-sm font-medium text-neutral-800 hover:text-brand-gold transition-colors"
            >
              Reviews
            </Link>
            <button
              onClick={openGalleryBuilder}
              className="text-sm font-medium text-neutral-800 hover:text-brand-gold transition-colors flex items-center gap-1.5"
            >
              <Layers className="h-3.5 w-3.5 text-brand-gold" />
              <span>Wall Suite</span>
            </button>
          </nav>

          {/* Right: Utility Icons Stack */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Currency Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                {activeCurrency} ({CURRENCIES[activeCurrency].symbol})
                <ChevronDown className="h-3 w-3 opacity-60" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-32 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in">
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setActiveCurrency(code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-medium rounded-lg ${
                        activeCurrency === code
                          ? 'bg-brand-dark text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <span>{code}</span>
                      <span>{CURRENCIES[code].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Icon */}
            <button
              onClick={openSearch}
              className="p-2 text-neutral-700 hover:text-brand-dark rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* My Visions Pill (Desktop) */}
            <Link
              href="/my-art"
              className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                savedVisions.length > 0
                  ? 'bg-brand-linen text-brand-dark border border-brand-gold shadow-sm hover:bg-neutral-100'
                  : 'text-neutral-600 hover:text-brand-dark border border-transparent'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
              <span>Visions</span>
              {savedVisions.length > 0 && (
                <span className="rounded-full bg-brand-dark px-1.5 py-0.2 text-[10px] font-bold text-white">
                  {savedVisions.length}
                </span>
              )}
            </Link>

            {/* Wishlist Heart */}
            <button
              onClick={toggleWishlistDrawer}
              className="relative p-2 text-neutral-700 hover:text-brand-dark rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="View favorites"
            >
              <Heart className="h-5 w-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Bag Icon with Tedoo Right Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center rounded-full bg-brand-dark p-2.5 text-white hover:bg-neutral-800 transition-colors shadow-sm touch-scale active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-[11px] font-bold text-white shadow">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Create Your Art Header Pill CTA */}
            <button
              onClick={() =>
                openAppModal({
                  productId: 'single-tile-6x8',
                  productTitle: 'Single Tile — Graphic Print',
                  basePrice: 49.0,
                  initialStyleId: 'watercolor-botanica',
                })
              }
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#7C5A37] hover:bg-[#684a2d] px-4 py-2 text-xs font-bold text-white shadow-md hover:scale-105 active:scale-95 transition-all touch-scale"
            >
              <Sparkles className="h-3 w-3 text-brand-gold animate-bounce-soft" />
              <span>Create Your Art</span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex w-[85vw] max-w-sm flex-col bg-white p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <span className="font-serif text-xl font-bold tracking-tight text-brand-dark">
                MOONFLASH
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-neutral-600 rounded-full hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Quick Upload CTA Button in Drawer */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAppModal({
                    productId: 'single-tile-6x8',
                    productTitle: 'Single Tile — Graphic Print',
                    basePrice: 49.0,
                    initialStyleId: 'watercolor-botanica',
                  });
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-dark py-3 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md active:scale-95 touch-scale"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                <span>Upload & Create Art</span>
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="mt-6 flex flex-col space-y-4 text-base font-medium">
              <Link
                href="/collections"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-900 hover:text-brand-gold"
              >
                All Collections
              </Link>
              <Link
                href="/collections/tiles"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-700 pl-3 hover:text-brand-gold"
              >
                • Frameless Wall Tiles
              </Link>
              <Link
                href="/collections/canvas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-700 pl-3 hover:text-brand-gold"
              >
                • Stretched Canvas
              </Link>
              <Link
                href="/collections/glass"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-700 pl-3 hover:text-brand-gold"
              >
                • Glass Suncatchers
              </Link>
              <Link
                href="/category/pet-lovers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-900 hover:text-brand-gold"
              >
                Pet Lovers Hub
              </Link>
              <Link
                href="/category/family"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-900 hover:text-brand-gold"
              >
                Family Portraits
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openGalleryBuilder();
                }}
                className="text-neutral-900 hover:text-brand-gold flex items-center justify-between text-left py-1"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-brand-gold" />
                  <span>Gallery Wall Suite</span>
                </span>
                <span className="rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-[10px] font-bold">
                  Save 30%
                </span>
              </button>
              <Link
                href="/seasonal/christmas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-red-700 font-bold"
              >
                Christmas Delivery Guarantee
              </Link>
              <Link
                href="/my-art"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-900 hover:text-brand-gold flex items-center justify-between"
              >
                <span>My Saved Visions</span>
                <span className="rounded-full bg-brand-dark px-2 py-0.5 text-xs text-white">
                  {savedVisions.length}
                </span>
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-700"
              >
                Our Studio Story
              </Link>
              <Link
                href="/installation-guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-neutral-700"
              >
                Damage-Free Hanging Guide
              </Link>
            </div>

            {/* Mobile Footer Utility */}
            <div className="mt-auto border-t border-neutral-200 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500">Currency</span>
                <select
                  value={activeCurrency}
                  onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
                  className="rounded-lg border border-neutral-200 p-1 text-xs font-semibold"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} ({CURRENCIES[c].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
