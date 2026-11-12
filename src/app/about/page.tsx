import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Sparkles, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Our Studio Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-brand-dark">
            Art, Personally Yours
          </h1>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Moonflash was founded on a simple conviction: photographs capture fleeting seconds, but true art endures for generations.
          </p>
        </div>

        {/* Story Section */}
        <div className="rounded-3xl bg-white p-8 md:p-12 border border-brand-border shadow-sm space-y-6 text-sm text-neutral-700 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-brand-dark">
            Bridging Personal Memories and Museum Fine Art
          </h2>
          <p>
            Standard photo printing is functional, but lacks tactile soul. Mass-market prints sit flat beneath cheap glass. At Moonflash, we engineered a digital-to-physical art studio where every uploaded photograph undergoes computational fine art synthesis.
          </p>
          <p>
            Whether rendered as a Renaissance chiaroscuro oil on heavy cotton canvas, a delicate botanical watercolor wash, or a luminous stained glass suncatcher, each piece is transformed by our proprietary art engine into an original aesthetic work.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
            <div className="p-4 rounded-2xl bg-brand-linen border border-brand-border space-y-2">
              <Award className="h-6 w-6 text-brand-gold" />
              <h4 className="font-serif text-base font-bold text-brand-dark">
                100-Year Archival Inks
              </h4>
              <p className="text-xs text-neutral-600">
                We formulate our prints with 12-color pigment giclée inks that never fade or yellow under standard residential lighting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-brand-linen border border-brand-border space-y-2">
              <ShieldCheck className="h-6 w-6 text-brand-gold" />
              <h4 className="font-serif text-base font-bold text-brand-dark">
                Zero-Damage Wall Hardware
              </h4>
              <p className="text-xs text-neutral-600">
                Our frameless tiles stick and restick effortlessly using magnetic adhesive pads designed to leave drywall completely pristine.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <Link
            href="/collections"
            className="rounded-full bg-brand-dark px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl transition-all"
          >
            Explore the Catalog →
          </Link>
        </div>
      </div>
    </div>
  );
}

