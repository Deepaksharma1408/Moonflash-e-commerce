'use client';

import React, { useState } from 'react';
import { MessageSquare, Mail, Phone, Clock, Send } from 'lucide-react';
import { useUIStore } from '@/store';

export default function ContactPage() {
  const addToast = useUIStore((s) => s.addToast);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Message received! Our concierge team will reply within 2 hours.', 'success');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-brand-linen min-h-screen py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Real Customer Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-dark">
            Talk with Our Studio Team
          </h1>
          <p className="text-sm text-neutral-600">
            Every day from 7am to midnight EST. Real human support, zero automated robotic runarounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Info (5 Cols) */}
          <div className="md:col-span-5 rounded-3xl bg-brand-dark text-white p-8 shadow-xl space-y-6">
            <h3 className="font-serif text-xl font-bold text-brand-gold">Concierge Channels</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-brand-gold flex-shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Hours of Operation:</strong>
                  <span className="text-neutral-300">Monday–Sunday, 7:00 AM – 12:00 Midnight EST</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-gold flex-shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Email Concierge:</strong>
                  <a href="mailto:support@moonflash.com" className="text-neutral-300 hover:text-white underline">
                    support@moonflash.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-brand-gold flex-shrink-0" />
                <div>
                  <strong className="block text-white font-semibold">Live Chat Response Time:</strong>
                  <span className="text-neutral-300">Under 3 minutes during business hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form (7 Cols) */}
          <div className="md:col-span-7 rounded-3xl bg-white p-8 border border-brand-border shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:border-brand-dark focus:outline-none"
                  placeholder="Elena Rostova"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:border-brand-dark focus:outline-none"
                  placeholder="elena@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">How can we help?</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:border-brand-dark focus:outline-none"
                  placeholder="Ask about photo resolution, delivery cutoffs, or custom bulk sizing..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-dark py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-all"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Send Message to Concierge</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

