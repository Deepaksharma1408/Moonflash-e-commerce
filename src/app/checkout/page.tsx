'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, ShieldCheck, CreditCard, CheckCircle2 } from 'lucide-react';
import { useCartStore, useDevStore, formatCurrency, useUIStore } from '@/store';
import { PRODUCTS, GRAPHIC_STYLES } from '@/data/mockData';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getShippingCost = useCartStore((s) => s.getShippingCost);
  const getTotal = useCartStore((s) => s.getTotal);
  const activeCoupon = useCartStore((s) => s.activeCoupon);

  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const addToast = useUIStore((s) => s.addToast);

  // Form states
  const [email, setEmail] = useState('elena.rostova@example.com');
  const [firstName, setFirstName] = useState('Elena');
  const [lastName, setLastName] = useState('Rostova');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('Springfield');
  const [stateCode, setStateCode] = useState('OR');
  const [zip, setZip] = useState('97477');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const baseShipping = getShippingCost();
  const shipping = shippingMethod === 'express' ? baseShipping + 14.99 : baseShipping;
  const total = Math.max(0, subtotal - discount + shipping);

  const formattedSubtotal = formatCurrency(subtotal, activeCurrency);
  const formattedDiscount = formatCurrency(discount, activeCurrency);
  const formattedShipping = shipping === 0 ? 'FREE' : formatCurrency(shipping, activeCurrency).formatted;
  const formattedTotal = formatCurrency(total, activeCurrency);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address) {
      addToast('Please complete shipping address details.', 'warning');
      return;
    }

    setIsSubmitting(true);
    addToast('Authorizing payment with Stripe...', 'info');

    // Simulate 1.2s processing
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
      clearCart();
      setIsSubmitting(false);
      router.push(`/order-success/${orderId}`);
    }, 1200);
  };

  return (
    <div className="bg-brand-linen min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Header / Breadcrumb */}
        <div className="flex items-center justify-between border-b border-brand-border pb-4 mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-brand-dark"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Cart</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Lock className="h-3.5 w-3.5 text-green-600" />
            <span>Encrypted 256-Bit SSL Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: CUSTOMER & PAYMENT FORM (60%)                */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* Express Checkout Options */}
            <div className="rounded-2xl bg-white p-5 border border-neutral-200 shadow-sm space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block text-center">
                Express Checkout
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => addToast('Simulating Express G Pay checkout...', 'info')}
                  className="flex items-center justify-center rounded-xl bg-black py-3 text-xs font-bold text-white hover:bg-neutral-900"
                >
                  G Pay
                </button>
                <button
                  type="button"
                  onClick={() => addToast('Simulating Express Apple Pay checkout...', 'info')}
                  className="flex items-center justify-center rounded-xl bg-black py-3 text-xs font-bold text-white hover:bg-neutral-900"
                >
                  Apple Pay
                </button>
                <button
                  type="button"
                  onClick={() => addToast('Simulating Express PayPal checkout...', 'info')}
                  className="flex items-center justify-center rounded-xl bg-[#0070BA] py-3 text-xs font-bold text-white hover:bg-[#005ea6]"
                >
                  PayPal
                </button>
              </div>
              <div className="relative text-center my-3">
                <span className="bg-white px-3 text-[10px] uppercase font-bold text-neutral-400">
                  Or enter details below
                </span>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* 1. Contact Information */}
              <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-brand-dark">1. Contact Information</h3>
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    Email address for order receipt & tracking
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800 focus:border-brand-dark focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm space-y-4">
                <h3 className="font-serif text-base font-bold text-brand-dark">2. Shipping Destination</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">First Name</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs text-neutral-800"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Shipping Method */}
              <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm space-y-3">
                <h3 className="font-serif text-base font-bold text-brand-dark">3. Shipping Speed</h3>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-300 bg-neutral-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-brand-dark"
                      />
                      <div>
                        <span className="font-bold text-xs text-brand-dark block">
                          Standard Tracked Courier (Guaranteed by Dec 18)
                        </span>
                        <span className="text-[11px] text-neutral-500">FedEx / DHL Express Ground</span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-brand-dark">{formattedShipping}</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-neutral-300 bg-neutral-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="accent-brand-dark"
                      />
                      <div>
                        <span className="font-bold text-xs text-brand-dark block">
                          Priority Rush Production & Air Freight
                        </span>
                        <span className="text-[11px] text-neutral-500">2-Day Guaranteed Air Delivery</span>
                      </div>
                    </div>
                    <span className="font-bold text-xs text-brand-dark">+$14.99</span>
                  </label>
                </div>
              </div>

              {/* 4. Payment Method (Stripe Simulation) */}
              <div className="rounded-2xl bg-white p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-brand-dark">4. Payment Details</h3>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <CreditCard className="h-4 w-4" />
                    <span>Powered by Stripe</span>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-300 p-4 bg-neutral-50 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-xs text-neutral-800 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-xs text-neutral-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        CVC Security
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full rounded-lg border border-neutral-300 bg-white p-2.5 text-xs text-neutral-800 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Complete Purchase Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-dark py-4 text-sm font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl transition-all"
              >
                {isSubmitting ? (
                  <span>Processing Payment...</span>
                ) : (
                  <span>COMPLETE PURCHASE — {formattedTotal.formatted}</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                <ShieldCheck className="h-4 w-4 text-green-600" />
                <span>100% Love-It Guarantee: Free replacement or full refund if not delighted</span>
              </div>
            </form>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: STICKY ORDER SUMMARY (40%)                  */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 rounded-3xl bg-white p-6 border border-neutral-200 shadow-xl space-y-4 sticky top-24">
            <h3 className="font-serif text-lg font-bold text-brand-dark border-b border-neutral-100 pb-3">
              Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>

            {/* Line items with thumbnails */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {items.map((item) => {
                const product = PRODUCTS.find((p) => p.id === item.productId);
                const style = GRAPHIC_STYLES.find((s) => s.id === item.styleId);
                const itemFormatted = formatCurrency(item.unitPrice * item.quantity, activeCurrency);

                return (
                  <div key={item.itemId} className="flex gap-3 items-center">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.customArtUrl || product?.images[0]}
                        alt="Art"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-bold text-brand-dark truncate">{product?.title}</h4>
                      <p className="text-[10px] text-neutral-500 truncate">
                        {style?.name} • {item.selectedSize} • Qty {item.quantity}
                      </p>
                      {item.frameName && (
                        <p className="text-[10px] text-brand-gold font-medium truncate">
                          Frame: {item.frameName}
                        </p>
                      )}
                      {item.inscription && (
                        <p className="text-[9px] text-neutral-400 italic truncate">
                          &quot;{item.inscription.text}&quot;
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-brand-dark">{itemFormatted.formatted}</span>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs border-t border-neutral-100 pt-4">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">{formattedSubtotal.formatted}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Coupon ({activeCoupon})</span>
                  <span>-{formattedDiscount.formatted}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-semibold text-neutral-900">{formattedShipping}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-brand-dark pt-2 border-t border-neutral-100">
                <span>Total Due</span>
                <span>{formattedTotal.formatted}</span>
              </div>
              {activeCurrency !== 'USD' && (
                <p className="text-[10px] text-neutral-400 italic text-right">
                  About {formattedTotal.formatted} – final amount charged in USD ($
                  {total.toFixed(2)})
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

