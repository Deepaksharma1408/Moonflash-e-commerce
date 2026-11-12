'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Mail, ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';
import { useDevStore, useUIStore } from '@/store';

export const Footer: React.FC = () => {
  const toggleDevPanel = useDevStore((s) => s.toggleDevPanel);
  const addToast = useUIStore((s) => s.addToast);
  const [clickCount, setClickCount] = useState(0);

  const handleCopyrightClick = () => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      toggleDevPanel();
      addToast('Developer Control Panel Activated!', 'info');
      setClickCount(0);
    }
  };

  return (
    <footer className="border-t border-neutral-200 bg-brand-linen text-neutral-800">
      {/* Credibility Ribbon above Directory */}
      <div className="border-b border-brand-border bg-brand-sand/60 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <ShieldCheck className="h-6 w-6 text-brand-gold flex-shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  100% Love-It Guarantee
                </h5>
                <p className="text-[11px] text-neutral-600">Free replacement or full refund</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Award className="h-6 w-6 text-brand-gold flex-shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  Museum Archival Inks
                </h5>
                <p className="text-[11px] text-neutral-600">100-year fade-resistant pigments</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Sparkles className="h-6 w-6 text-brand-gold flex-shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  Handcrafted in Studio
                </h5>
                <p className="text-[11px] text-neutral-600">Every piece individually inspected</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Heart className="h-6 w-6 text-brand-gold flex-shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  4,000,000+ Happy Walls
                </h5>
                <p className="text-[11px] text-neutral-600">Loved by art & memory lovers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Directory (Mixtiles Style) */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Products */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Products
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/collections/tiles" className="hover:text-brand-dark transition-colors">
                  Frameless Wall Tiles
                </Link>
              </li>
              <li>
                <Link href="/collections/canvas" className="hover:text-brand-dark transition-colors">
                  Museum Stretched Canvas
                </Link>
              </li>
              <li>
                <Link href="/collections/glass" className="hover:text-brand-dark transition-colors">
                  Glass Suncatchers
                </Link>
              </li>
              <li>
                <Link href="/collections/mugs" className="hover:text-brand-dark transition-colors">
                  Artisan Ceramic Mugs
                </Link>
              </li>
              <li>
                <Link href="/collections/ornaments" className="hover:text-brand-dark transition-colors">
                  Holiday Birch Ornaments
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-dark font-semibold text-brand-gold">
                  Explore All Mediums →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Follow Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Follow Us
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#instagram" className="hover:text-brand-dark transition-colors">
                  Instagram (@moonflash.art)
                </a>
              </li>
              <li>
                <a href="#facebook" className="hover:text-brand-dark transition-colors">
                  Facebook (/moonflashart)
                </a>
              </li>
              <li>
                <a href="#pinterest" className="hover:text-brand-dark transition-colors">
                  Pinterest (@moonflashstudio)
                </a>
              </li>
              <li>
                <a href="#tiktok" className="hover:text-brand-dark transition-colors">
                  TikTok (@moonflashart)
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-brand-dark transition-colors">
                  Our Studio Story
                </Link>
              </li>
              <li>
                <Link href="/installation-guide" className="hover:text-brand-dark transition-colors">
                  Damage-Free Hanging Guide
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-dark transition-colors">
                  Shipping & Turnaround Times
                </Link>
              </li>
              <li>
                <Link href="/about#craftsmanship" className="hover:text-brand-dark transition-colors">
                  Archival Pigments & Materials
                </Link>
              </li>
              <li>
                <Link href="/my-art" className="hover:text-brand-dark transition-colors">
                  My Saved Art Visions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Need Help? (Mixtiles benchmark) */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
              Need Help?
            </h4>
            <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
              Talk with our real concierge support team. Every day 7am to midnight EST.
            </p>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-dark px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Start Live Concierge</span>
              </Link>
              <a
                href="mailto:support@moonflash.com"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <Mail className="h-3.5 w-3.5 text-neutral-500" />
                <span>support@moonflash.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Strip: Legal & Dev Panel Activation */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-brand-border pt-6 text-[11px] text-neutral-500 gap-4">
          <div
            onClick={handleCopyrightClick}
            className="cursor-pointer select-none hover:text-brand-dark transition-colors"
            title="Triple click to toggle Dev Panel (or press Ctrl+Shift+D)"
          >
            © 2026 Moonflash Inc. All rights reserved. Made with love for your memories.
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/terms" className="hover:text-brand-dark underline">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-brand-dark underline">
              Privacy Policy & EULA
            </Link>
            <button
              onClick={toggleDevPanel}
              className="text-[10px] text-brand-gold font-bold uppercase tracking-wider hover:underline"
            >
              [Dev Panel]
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

