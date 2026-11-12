'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Download, Package, Truck, ArrowRight, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = (params?.orderId as string) || 'ORD-89421';

  useEffect(() => {
    // Trigger celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B47B36', '#111827', '#E2E8F0', '#15803D'],
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        {/* Celebration Header */}
        <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
          <CheckCircle2 className="h-10 w-10 text-green-700" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
          Order Confirmed • Receipt Sent
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mt-2 mb-3">
          Your Masterpiece is in the Studio!
        </h1>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          Thank you for trusting Moonflash with your memory. Order <span className="font-bold text-brand-dark">{orderId}</span> has been queued for archival pigment crafting.
        </p>

        {/* Craftsmanship Timeline Stepper */}
        <div className="my-10 rounded-3xl bg-white p-8 border border-brand-border shadow-xl text-left">
          <h3 className="font-serif text-lg font-bold text-brand-dark mb-6">
            Production & Delivery Milestones
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            {/* Stage 1 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-700 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>1. Order Placed</span>
              </div>
              <p className="text-[11px] text-neutral-500">Confirmed today</p>
            </div>

            {/* Stage 2 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-brand-gold font-bold text-xs">
                <Clock className="h-4 w-4 animate-spin" />
                <span>2. Digital Studio</span>
              </div>
              <p className="text-[11px] text-neutral-500">Fine art synthesis active</p>
            </div>

            {/* Stage 3 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs">
                <Package className="h-4 w-4" />
                <span>3. Archival Print</span>
              </div>
              <p className="text-[11px] text-neutral-500">Dec 14 - Framing & inspection</p>
            </div>

            {/* Stage 4 */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-neutral-400 font-bold text-xs">
                <Truck className="h-4 w-4" />
                <span>4. Delivered</span>
              </div>
              <p className="text-[11px] text-neutral-500">Guaranteed by Fri, Dec 18</p>
            </div>
          </div>
        </div>

        {/* Digital Asset Download Box */}
        <div className="rounded-3xl bg-brand-sand/60 p-6 border border-brand-border text-left flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
              Bonus Complimentary Asset
            </span>
            <h4 className="font-serif text-base font-bold text-brand-dark mt-0.5">
              High-Resolution Digital Wallpaper
            </h4>
            <p className="text-xs text-neutral-600 mt-1">
              Download a 4K resolution version of your synthesized artwork for smartphone and desktop backgrounds.
            </p>
          </div>

          <button
            onClick={() => alert('Downloading high-resolution 4K digital art wallpaper...')}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-brand-dark hover:bg-neutral-100 shadow border border-neutral-300 flex-shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download 4K Art</span>
          </button>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/collections"
            className="w-full sm:w-auto rounded-full bg-brand-dark px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl transition-all"
          >
            Create Another Vision →
          </Link>

          <Link
            href="/my-art"
            className="w-full sm:w-auto rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-xs font-bold text-neutral-800 hover:bg-neutral-50"
          >
            View Saved Art Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}

