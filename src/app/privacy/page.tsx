import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Biometric & Data Protection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Privacy Policy & Biometric EULA
          </h1>
          <p className="text-xs text-neutral-500">Effective Date: November 2026</p>
        </div>

        <div className="rounded-3xl bg-white p-8 md:p-12 border border-brand-border shadow-sm space-y-6 text-xs text-neutral-600 leading-relaxed">
          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              1. Customer Photograph Processing & Non-Retention
            </h3>
            <p>
              Uploaded photographs are ingested solely for computational art synthesis and print manufacturing. Moonflash does not use customer photographs to train public artificial intelligence models. Raw photographs are permanently purged from cloud storage thirty (30) days after order fulfillment.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              2. Local Browser Storage
            </h3>
            <p>
              In our frontend prototype, generated artworks and shopping cart states are stored locally within your private browser storage (`localStorage`). This data never leaves your device unless you initiate checkout.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-bold text-brand-dark mb-1">
              3. Payment Security & PCI-DSS Compliance
            </h3>
            <p>
              Payment credentials are encrypted and tokenized directly via Stripe Elements. Moonflash servers never access or store raw credit card numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

