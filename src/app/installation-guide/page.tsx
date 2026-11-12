import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function InstallationGuidePage() {
  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Mixtiles-Inspired Mounting System
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark">
            Zero-Damage Installation Guide
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Hang, reposition, and curate your personal gallery wall without hammer, nails, or holes in your walls.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 md:p-12 border border-brand-border shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-brand-linen flex items-center justify-center font-serif text-xl font-bold text-brand-gold border border-brand-border">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-brand-dark">Peel the Liner</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Gently peel the protective red release liner off the magnetic adhesive backing strip on the back of your tile.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-brand-linen flex items-center justify-center font-serif text-xl font-bold text-brand-gold border border-brand-border">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-brand-dark">Press Against Wall</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Place the tile level against your wall and press firmly along the top edge for 10 seconds. Works on painted drywall, wood, and glass.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-brand-linen flex items-center justify-center font-serif text-xl font-bold text-brand-gold border border-brand-border">
                3
              </div>
              <h3 className="font-serif text-base font-bold text-brand-dark">Rearrange Freely</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Want to change your layout? Simply tilt the tile upward from the bottom to pop it off cleanly without peeling paint or leaving residue.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-green-700 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-green-900 uppercase tracking-wider">
                Our Wall Protection Guarantee
              </h4>
              <p className="text-xs text-green-800 mt-1 leading-relaxed">
                Our proprietary elastomer adhesive pads are lab-tested on standard residential interior latex paints. If your wall is ever marked or damaged during normal removal, we will cover the touch-up costs 100%.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/collections/tiles"
            className="rounded-full bg-brand-dark px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl transition-all inline-flex items-center gap-2"
          >
            <span>Design Your Tile Wall</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

