import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-brand-linen min-h-screen flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="h-20 w-20 rounded-3xl bg-white border border-brand-border flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="h-8 w-8 text-brand-gold" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Error 404
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-dark mt-1">
            This Canvas is Blank
          </h1>
          <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
            The artwork, collection, or page you were looking for has been moved or archived.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto rounded-full bg-brand-dark px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md"
          >
            Return to Homepage
          </Link>
          <Link
            href="/collections"
            className="w-full sm:w-auto rounded-full border border-neutral-300 bg-white px-6 py-3 text-xs font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    </div>
  );
}

