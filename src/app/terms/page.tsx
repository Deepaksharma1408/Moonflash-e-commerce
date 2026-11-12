import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Legal & Commercial Policy
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Terms & Conditions of Sale
          </h1>
          <p className="text-xs text-neutral-500">Effective Date: November 2026</p>
        </div>

        <div className="rounded-3xl bg-white p-8 md:p-12 border border-brand-border shadow-sm space-y-6 text-xs text-neutral-600 leading-relaxed">
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              1. Custom Personalized Product Manufacturing
            </h3>
            <p>
              Moonflash manufactures custom bespoke fine art products based upon user-provided photographs and aesthetic style selections. Because each product is individually manufactured upon order, sales are final subject only to our 100% Love-It Guarantee.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              2. 100% Love-It Guarantee & Replacement Policy
            </h3>
            <p>
              If a customer is dissatisfied with print quality or artistic interpretation, Moonflash will produce one (1) complimentary replacement using an alternative style or adjusted crop, or provide a full refund upon return of the original item within 30 days of receipt.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              3. Guaranteed Holiday Delivery Cutoff
            </h3>
            <p>
              Orders placed prior to 11:59 PM EST on December 18 with Standard Tracked Shipping are guaranteed for physical delivery prior to December 25. If carrier delays cause an order to arrive after December 24, shipping costs are refunded in full.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              4. Currency Settlement
            </h3>
            <p>
              All transactions settle in United States Dollars (USD). Local currency estimates (EUR, GBP, CAD, AUD) are provided for convenience based on daily exchange rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

