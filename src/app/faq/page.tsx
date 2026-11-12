import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      q: 'How long does production and shipping take?',
      a: 'Each piece is custom printed and hand-framed in our studio within 2 business days. Standard Tracked Shipping takes 3–5 business days with guaranteed FedEx/DHL delivery. For Christmas 2026, order by Dec 18 for guaranteed delivery.',
    },
    {
      q: 'What is the 100% Love-It Guarantee?',
      a: 'If you are not head-over-heels in love with how your artwork looks in person, simply let our concierge support team know within 30 days. We will either re-print your piece in a different graphic style free of charge, or refund your purchase 100%.',
    },
    {
      q: 'Do the wall tiles really leave zero damage?',
      a: 'Yes! Our magnetic adhesive strips use a clean-release elastomer that holds firmly on painted drywall, plaster, and wallpaper, but pops cleanly off without stripping paint or leaving sticky residue.',
    },
    {
      q: 'What resolution should my photo be?',
      a: 'We recommend uploading photos with a minimum of 1200x1200px. High-resolution camera roll photos from modern smartphones produce breathtaking clarity on physical canvas and tiles.',
    },
    {
      q: 'Can I preview my artwork before buying?',
      a: 'Absolutely. Our interactive generator shows a live before-and-after split slider in 3.2 seconds so you can see exactly how your photo renders in watercolor, oil, stained glass, or pop art.',
    },
  ];

  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Help Center
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="rounded-3xl bg-white p-8 border border-brand-border shadow-sm divide-y divide-neutral-200">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5 first:pt-0 last:pb-0 space-y-2">
              <h3 className="font-serif text-base font-bold text-brand-dark">{faq.q}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-neutral-500">
          Still have questions?{' '}
          <Link href="/contact" className="font-bold text-brand-dark underline">
            Talk to our concierge team (7am to midnight EST)
          </Link>
        </div>
      </div>
    </div>
  );
}

