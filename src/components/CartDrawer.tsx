'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Edit3, ShieldCheck, Truck, ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore, useDevStore, formatCurrency, useUIStore } from '@/store';
import { PRODUCTS, GRAPHIC_STYLES } from '@/data/mockData';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const closeCart = useCartStore((s) => s.closeCart);
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
  const giftOptions = useCartStore((s) => s.giftOptions);
  const updateGiftOptions = useCartStore((s) => s.updateGiftOptions);

  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const openAppModal = useUIStore((s) => s.openAppModal);
  const addToast = useUIStore((s) => s.addToast);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCouponAccordionOpen, setIsCouponAccordionOpen] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingCost();
  const total = getTotal();

  // Free shipping progress calculation ($75 threshold)
  const freeShippingThreshold = 75.0;
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Trigger celebration when user unlocks free shipping
  useEffect(() => {
    if (progressPct >= 100 && isCartOpen) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { x: 0.8, y: 0.2 },
          colors: ['#15803D', '#B47B36', '#E2E8F0'],
        });
      } catch {}
    }
  }, [progressPct, isCartOpen]);

  if (!isCartOpen) return null;

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
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { x: 0.8, y: 0.6 },
          colors: ['#15803D', '#B47B36'],
        });
      } catch {}
      addToast('Coupon MOON10 applied: 10% discount!', 'success');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleEditItem = (productId: string, styleId: string) => {
    const prod = PRODUCTS.find((p) => p.id === productId);
    if (prod) {
      closeCart();
      openAppModal({
        productId: prod.id,
        productTitle: prod.title,
        basePrice: prod.basePrice,
        initialStyleId: styleId,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop scrim */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* 1. Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 bg-white">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-brand-dark">Your Cart</h3>
            <span className="rounded-full bg-brand-linen px-2.5 py-0.5 text-xs font-bold text-brand-dark border border-brand-border">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 2. Free Shipping Progress Bar */}
        <div className="bg-brand-linen px-6 py-3.5 border-b border-brand-border">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-800 mb-2">
            <span className="flex items-center gap-1.5">
              <Truck className={`h-4 w-4 ${progressPct >= 100 ? 'text-green-600' : 'text-brand-gold'}`} />
              {progressPct >= 100 ? (
                <span className="text-green-700 font-bold flex items-center gap-1">
                  <span>Free Standard Shipping Unlocked!</span>
                  <Sparkles className="h-3 w-3" />
                </span>
              ) : (
                <span>
                  Add{' '}
                  <span className="text-brand-gold font-bold">
                    {formatCurrency(remainingForFreeShipping, activeCurrency).formatted}
                  </span>{' '}
                  more for Free Shipping
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-neutral-500">{Math.round(progressPct)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 shadow-inner">
            <div
              className={`h-full transition-all duration-700 ease-out rounded-full ${
                progressPct >= 100
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-brand-gold to-brand-terracotta'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* 3. Items List (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="h-20 w-20 rounded-3xl bg-brand-linen flex items-center justify-center mb-4 border border-brand-border shadow-sm">
                <Truck className="h-8 w-8 text-neutral-400" />
              </div>
              <h4 className="font-serif text-lg font-bold text-brand-dark">Your canvas is empty</h4>
              <p className="text-xs text-neutral-500 max-w-xs mt-1 mb-6">
                Explore our handcrafted physical mediums and create your first personalized art piece.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/collections');
                }}
                className="rounded-full bg-brand-dark px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors shadow-md"
              >
                Discover Collections →
              </button>
            </div>
          ) : (
            items.map((item) => {
              const product = PRODUCTS.find((p) => p.id === item.productId);
              const style = GRAPHIC_STYLES.find((s) => s.id === item.styleId);
              const itemFormattedPrice = formatCurrency(item.unitPrice * item.quantity, activeCurrency);

              return (
                <div
                  key={item.itemId}
                  className="flex gap-4 p-3.5 rounded-2xl border border-neutral-200/90 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200 shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.customArtUrl || product?.images[0]}
                      alt={product?.title || 'Art'}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-brand-dark line-clamp-1">
                          {product?.title || 'Customized Artwork'}
                        </h4>
                        <button
                          onClick={() => removeItem(item.itemId)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Style: <span className="font-semibold text-neutral-700">{style?.name || 'Custom'}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Size: <span className="font-semibold text-neutral-700">{item.selectedSize}</span>
                      </p>
                      {item.frameName && (
                        <p className="text-[10px] text-brand-dark font-medium mt-0.5">
                          • Frame: <span className="font-semibold">{item.frameName}</span> (+${item.framePrice})
                        </p>
                      )}
                      {item.inscription && (
                        <p className="text-[10px] text-neutral-500 italic mt-0.5 truncate">
                          • Plaque: &quot;{item.inscription.text}&quot;
                        </p>
                      )}
                      {item.audioKeepsake && (
                        <p className="text-[10px] text-brand-gold font-bold mt-0.5 flex items-center gap-1">
                          <Sparkles className="h-2.5 w-2.5" />
                          <span>Soundwave Audio QR Plate Included</span>
                        </p>
                      )}
                    </div>

                    {/* Stepper & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                      <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.itemId, -1)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-200 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.itemId, 1)}
                          className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-200 rounded-r"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-brand-dark">
                          {itemFormattedPrice.formatted}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEditItem(item.productId, item.styleId)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-gold hover:underline mt-1.5"
                    >
                      <Edit3 className="h-2.5 w-2.5" /> Edit Customization
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 4. Footer & Checkout Section */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 bg-neutral-50/80 px-6 py-4 pb-safe space-y-3">
            {/* Luxury Gift Option Accordion */}
            <div className="border-b border-neutral-200 pb-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={giftOptions.isGift}
                    onChange={(e) => updateGiftOptions({ isGift: e.target.checked })}
                    className="h-4 w-4 accent-brand-dark cursor-pointer rounded"
                  />
                  <span>🎁 Send as Luxury Gift (+ $12.00)</span>
                </label>
                {giftOptions.isGift && (
                  <span className="text-[10px] font-bold text-brand-gold uppercase">Custom Card Included</span>
                )}
              </div>

              {giftOptions.isGift && (
                <div className="mt-2.5 p-3 rounded-xl bg-brand-linen border border-brand-border space-y-2 text-xs animate-in fade-in">
                  <input
                    type="text"
                    placeholder="Recipient's Name (e.g. Sarah)"
                    value={giftOptions.recipientName}
                    onChange={(e) => updateGiftOptions({ recipientName: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 p-1.5 text-xs bg-white"
                  />
                  <textarea
                    rows={2}
                    placeholder="Personalized Handwritten Gift Note..."
                    value={giftOptions.giftMessage}
                    onChange={(e) => updateGiftOptions({ giftMessage: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 p-1.5 text-xs bg-white resize-none"
                  />
                  <div className="flex items-center justify-between text-[11px] text-neutral-600">
                    <span>Wax Seal Color:</span>
                    <div className="flex items-center gap-2">
                      {(['gold', 'burgundy', 'emerald'] as const).map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => updateGiftOptions({ waxSealColor: color })}
                          className={`h-5 w-5 rounded-full border-2 transition-transform ${
                            giftOptions.waxSealColor === color ? 'scale-125 border-brand-dark' : 'border-transparent'
                          }`}
                          style={{
                            backgroundColor:
                              color === 'gold' ? '#B47B36' : color === 'burgundy' ? '#800020' : '#15803D',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Coupon Accordion */}
            <div className="border-b border-neutral-200 pb-3">
              <button
                onClick={() => setIsCouponAccordionOpen(!isCouponAccordionOpen)}
                className="flex w-full items-center justify-between text-xs font-semibold text-neutral-700 hover:text-brand-dark"
              >
                <span>Apply a coupon code</span>
                {isCouponAccordionOpen ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {isCouponAccordionOpen && (
                <div className="mt-2 animate-in fade-in">
                  {activeCoupon ? (
                    <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2 text-xs font-medium text-green-800 border border-green-200">
                      <span>Coupon &quot;{activeCoupon}&quot; applied (-10%)</span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try 'MOON10'"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 rounded-xl border border-neutral-300 px-3 py-1.5 text-xs uppercase focus:border-brand-dark focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-brand-dark px-3.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="mt-1 text-[11px] text-red-600">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs">
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

              <div className="flex justify-between text-sm font-bold text-brand-dark pt-2 border-t border-neutral-200">
                <span>Estimated Total</span>
                <span>{formattedTotal.formatted}</span>
              </div>

              {activeCurrency !== 'USD' && (
                <p className="text-[10px] text-neutral-500 italic text-right">
                  About {formattedTotal.formatted} – final amount set at payment in USD ($
                  {total.toFixed(2)})
                </p>
              )}
            </div>

            {/* Express Pay Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-900 shadow-sm transition-transform active:scale-95"
              >
                <span>G Pay</span>
              </button>
              <button
                onClick={() => {
                  closeCart();
                  router.push('/checkout');
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-black py-2.5 text-xs font-bold text-white hover:bg-neutral-900 shadow-sm transition-transform active:scale-95"
              >
                <span>Apple Pay</span>
              </button>
            </div>

            {/* Primary Checkout CTA */}
            <button
              onClick={() => {
                closeCart();
                router.push('/checkout');
              }}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-dark py-4 text-xs font-bold tracking-wider uppercase text-white hover:bg-neutral-800 shadow-xl transition-all hover:scale-102 active:scale-98"
            >
              <span>CHECKOUT</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Utility links */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-500 pt-1">
              <Link
                href="/cart"
                onClick={closeCart}
                className="underline hover:text-brand-dark"
              >
                View full cart
              </Link>
              <span>•</span>
              <button onClick={closeCart} className="hover:text-brand-dark">
                Continue shopping
              </button>
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-400 pt-1">
              <ShieldCheck className="h-3 w-3 text-green-600" />
              <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
