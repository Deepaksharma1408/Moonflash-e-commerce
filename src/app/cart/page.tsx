'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCartStore, useDevStore, formatCurrency, useUIStore } from '@/store';
import { PRODUCTS, GRAPHIC_STYLES } from '@/data/mockData';

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const activeCoupon = useCartStore((s) => s.activeCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getShippingCost = useCartStore((s) => s.getShippingCost);
  const getTotal = useCartStore((s) => s.getTotal);

  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const addToast = useUIStore((s) => s.addToast);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingCost();
  const total = getTotal();

  const formattedSubtotal = formatCurrency(subtotal, activeCurrency);
  const formattedDiscount = formatCurrency(discount, activeCurrency);
  const formattedShipping = shipping === 0 ? 'FREE' : formatCurrency(shipping, activeCurrency).formatted;
  const formattedTotal = formatCurrency(total, activeCurrency);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      addToast('Coupon MOON10 applied: 10% discount!', 'success');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-brand-linen min-h-screen py-20">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-brand-border shadow-sm">
            <Truck className="h-8 w-8 text-neutral-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-brand-dark">Your Cart is Empty</h1>
          <p className="text-sm text-neutral-600 mt-2 mb-8">
            Start from your favorite photo and watch it turn into museum-grade art in 3 seconds.
          </p>
          <Link
            href="/collections"
            className="rounded-full bg-brand-dark px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-lg"
          >
            Explore Collections →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-linen min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-8">
          Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table (7 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              const style = GRAPHIC_STYLES.find((s) => s.id === item.styleId);
              const itemFormatted = formatCurrency(item.unitPrice * item.quantity, activeCurrency);

              return (
                <div
                  key={item.itemId}
                  className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-neutral-200 bg-white shadow-sm items-center sm:items-start"
                >
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.customArtUrl || product?.images[0]}
                      alt="Art"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <h3 className="font-serif text-base font-bold text-brand-dark">
                      {product?.title || 'Customized Artwork'}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Style: <span className="font-semibold text-neutral-700">{style?.name || 'Custom'}</span>
                    </p>
                    <p className="text-xs text-neutral-500">
                      Size: <span className="font-semibold text-neutral-700">{item.selectedSize}</span>
                    </p>
                    {item.frameName && (
                      <p className="text-xs text-brand-dark font-medium">
                        Frame: <span className="font-bold text-brand-gold">{item.frameName}</span> (+${item.framePrice})
                      </p>
                    )}
                    {item.inscription && (
                      <p className="text-xs text-neutral-500 italic">
                        Inscription: &quot;{item.inscription.text}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center rounded-lg border border-neutral-300 bg-neutral-50">
                      <button
                        onClick={() => updateQuantity(item.itemId, -1)}
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-200"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-bold text-neutral-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.itemId, 1)}
                        className="px-2.5 py-1 text-xs text-neutral-600 hover:bg-neutral-200"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold text-sm text-brand-dark min-w-[70px] text-right">
                      {itemFormatted.formatted}
                    </span>

                    <button
                      onClick={() => removeItem(item.itemId)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Summary Column (4 Cols) */}
          <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-neutral-200 shadow-xl space-y-4">
            <h3 className="font-serif text-lg font-bold text-brand-dark border-b border-neutral-100 pb-3">
              Order Summary
            </h3>

            {/* Coupon Box */}
            <div>
              {activeCoupon ? (
                <div className="flex items-center justify-between rounded-xl bg-green-50 p-3 text-xs font-medium text-green-800 border border-green-200">
                  <span>Coupon &quot;{activeCoupon}&quot; active (-10%)</span>
                  <button onClick={removeCoupon} className="font-bold text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code (Try 'MOON10')"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-xs uppercase"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-brand-dark px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 text-xs border-y border-neutral-100 py-3">
              <div className="flex justify-between text-neutral-600">
                <span>Merchandise Subtotal</span>
                <span className="font-medium text-neutral-900">{formattedSubtotal.formatted}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Discount</span>
                  <span>-{formattedDiscount.formatted}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Standard Tracked Shipping</span>
                <span className="font-medium text-neutral-900">{formattedShipping}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-brand-dark pt-2 border-t border-neutral-100">
                <span>Estimated Total</span>
                <span>{formattedTotal.formatted}</span>
              </div>
              {activeCurrency !== 'USD' && (
                <p className="text-[10px] text-neutral-400 italic text-right">
                  About {formattedTotal.formatted} – final amount set at payment in USD ($
                  {total.toFixed(2)})
                </p>
              )}
            </div>

            <button
              onClick={() => router.push('/checkout')}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-dark py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>Free returns & 100% Love-It Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

