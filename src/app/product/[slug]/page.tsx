'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ThumbsUp,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { PRODUCTS, REVIEWS, GRAPHIC_STYLES } from '@/data/mockData';
import {
  useCartStore,
  useDevStore,
  useUIStore,
  useWishlistStore,
  formatCurrency,
} from '@/store';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSpecTab, setOpenSpecTab] = useState<'dimensions' | 'materials' | 'mounting' | 'guarantee' | null>('dimensions');
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Stores
  const addItemToCart = useCartStore((s) => s.addItem);
  const openAppModal = useUIStore((s) => s.openAppModal);
  const openRoomVisualizer = useUIStore((s) => s.openRoomVisualizer);
  const addToast = useUIStore((s) => s.addToast);
  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const isInWishlist = useWishlistStore((s) => (product ? s.isInWishlist(product.id) : false));
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return notFound();
  }

  const selectedSize = product.sizes[selectedSizeIndex] || { name: 'Standard', dimensions: '', priceDelta: 0 };
  const unitPrice = product.basePrice + selectedSize.priceDelta;
  const compareAtPrice = product.compareAtPrice + selectedSize.priceDelta;
  const discountPct = Math.round(((compareAtPrice - unitPrice) / compareAtPrice) * 100);

  const formattedPrice = formatCurrency(unitPrice, activeCurrency);
  const formattedCompare = formatCurrency(compareAtPrice, activeCurrency);

  const recommendations = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
  const productReviews = REVIEWS.filter((r) => r.productId === product.id);
  const fallbackReviews = productReviews.length > 0 ? productReviews : REVIEWS.slice(0, 3);

  const handleAddToCart = () => {
    addItemToCart({
      productId: product.id,
      styleId: product.defaultStyleId,
      selectedSize: selectedSize.name,
      quantity,
      unitPrice,
      customArtUrl: product.images[0],
      originalPhotoUrl: product.images[0],
    });
    addToast(`Added "${product.title}" to cart!`, 'success');
  };

  const handleDirectCheckout = () => {
    addItemToCart({
      productId: product.id,
      styleId: product.defaultStyleId,
      selectedSize: selectedSize.name,
      quantity,
      unitPrice,
      customArtUrl: product.images[0],
      originalPhotoUrl: product.images[0],
    });
    router.push('/checkout');
  };

  const handleOpenCustomizer = () => {
    openAppModal({
      productId: product.id,
      productTitle: product.title,
      basePrice: unitPrice,
      initialStyleId: product.defaultStyleId,
    });
  };

  return (
    <div className="bg-white min-h-screen relative pb-16">
      {/* ============================================================= */}
      {/* SECTION 1: BUY BOX & GALLERY (Tedoo Architecture)             */}
      {/* ============================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6">
          <Link href="/" className="hover:text-brand-dark">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-brand-dark">
            Collections
          </Link>
          <span>/</span>
          <span className="text-brand-dark font-medium truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Gallery: Thumbnails & Main Image (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4 sticky top-24">
            {/* Thumbnail Rail */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-brand-dark ring-2 ring-brand-gold/40 shadow-md scale-102'
                      : 'border-neutral-200 opacity-70 hover:opacity-100 hover:border-neutral-400'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="Thumb" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Interactive Hero Image */}
            <div className="relative flex-1 aspect-square overflow-hidden rounded-3xl bg-neutral-100 border border-neutral-200/80 shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[activeImageIndex]}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  const added = toggleWishlist(product.id);
                  addToast(added ? 'Saved to favorites' : 'Removed from favorites', 'info');
                }}
                className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-xl backdrop-blur-md hover:bg-white hover:text-red-600 hover:scale-110 active:scale-95 transition-all"
                aria-label="Save to wishlist"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlist ? 'fill-red-600 text-red-600' : 'stroke-neutral-700'
                  }`}
                />
              </button>

              {/* Upload Art Badge Overlay */}
              <div className="absolute bottom-5 left-5 right-5 space-y-2">
                <button
                  onClick={handleOpenCustomizer}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl glass-panel p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl border border-white/80 hover:bg-white transition-all group/btn hover:scale-102 active:scale-98"
                >
                  <Sparkles className="h-4 w-4 text-brand-gold animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="text-xs font-bold text-brand-dark group-hover/btn:text-brand-gold transition-colors">
                    Click to Upload Photo & Preview Your Art
                  </span>
                </button>

                <button
                  onClick={() =>
                    openRoomVisualizer({
                      imageUrl: product.images[activeImageIndex],
                      title: product.title,
                      frameId: 'natural-oak',
                    })
                  }
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl glass-dark py-2.5 px-4 text-xs font-bold text-white shadow-xl hover:bg-black transition-all active:scale-98"
                >
                  <Eye className="h-3.5 w-3.5 text-brand-gold" />
                  <span>View on Your Wall (AR Simulator)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Buy Box Specifications & Payment (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                {product.categoryTag}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
                {product.title}
              </h1>

              {/* Rating & Social Proof */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-brand-gold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-brand-gold" />
                  ))}
                </div>
                <span className="text-xs font-bold text-neutral-800">{product.rating}</span>
                <span className="text-xs text-neutral-400">({product.reviewCount} reviews)</span>
                <span className="text-xs font-semibold text-green-700 ml-2">13.1k sold</span>
              </div>
            </div>

            {/* Price Stack & Local Currency Approximation */}
            <div className="p-5 rounded-3xl bg-brand-linen border border-brand-border space-y-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-brand-dark tracking-tight">
                  {formattedPrice.formatted}
                </span>
                <span className="text-sm text-neutral-400 line-through">
                  {formattedCompare.formatted}
                </span>
                <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                  {discountPct}% off
                </span>
              </div>

              {activeCurrency !== 'USD' && (
                <p className="text-xs text-neutral-500 italic">
                  About {formattedPrice.formatted} – final amount set at payment in USD ($
                  {unitPrice.toFixed(2)})
                </p>
              )}
            </div>

            {/* Selectors: Quantity & Size */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Select Size & Medium
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {product.sizes.map((s, idx) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`flex items-center justify-between rounded-2xl border p-3.5 text-xs font-semibold transition-all ${
                        selectedSizeIndex === idx
                          ? 'border-brand-dark bg-white shadow-sm ring-2 ring-brand-dark/20'
                          : 'border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-700'
                      }`}
                    >
                      <span>{s.name}</span>
                      <span className="text-neutral-500">
                        {s.priceDelta === 0 ? 'Standard' : `+$${s.priceDelta}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Quantity
                </label>
                <div className="flex items-center w-36 rounded-2xl border border-neutral-300 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100 rounded-l-2xl"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center text-xs font-bold text-neutral-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2 text-sm font-bold text-neutral-600 hover:bg-neutral-100 rounded-r-2xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Payment & CTA Stack (Tedoo Order) */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleDirectCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-xs font-bold text-white hover:bg-neutral-900 shadow-md transition-transform active:scale-[0.99]"
              >
                <span>G Pay</span>
              </button>

              <button
                onClick={handleDirectCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black py-3.5 text-xs font-bold text-white hover:bg-neutral-900 shadow-md transition-transform active:scale-[0.99]"
              >
                <span>Buy with Apple Pay</span>
              </button>

              <button
                onClick={handleDirectCheckout}
                className="w-full rounded-2xl bg-brand-dark py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-xl transition-all hover:scale-102 active:scale-98"
              >
                Checkout Now
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full rounded-2xl border-2 border-brand-dark bg-white py-3.5 text-xs font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-linen transition-colors"
              >
                + Add to Cart
              </button>
            </div>

            {/* Shipping & Delivery Guarantee Widget */}
            <div className="flex items-center gap-3 rounded-2xl bg-brand-linen/60 p-4 border border-brand-border text-xs text-neutral-700">
              <Truck className="h-5 w-5 text-brand-gold flex-shrink-0" />
              <div>
                <span className="font-bold text-brand-dark block">
                  Get it by Fri, Dec 18
                </span>
                <span className="text-[11px] text-neutral-500">
                  Guaranteed holiday dispatch with trackable FedEx delivery
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 2: SPECS CONTENT (Tedoo Accordion Architecture)       */}
      {/* ============================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-neutral-200">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
            Craftsmanship & Specs
          </span>
          <h2 className="font-serif text-2xl font-bold text-brand-dark mt-1 mb-6">
            Engineered for Archival Longevity
          </h2>

          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            <div className="py-4">
              <button
                onClick={() => setOpenSpecTab(openSpecTab === 'dimensions' ? null : 'dimensions')}
                className="flex w-full items-center justify-between text-left text-sm font-bold text-brand-dark"
              >
                <span>Dimensions & Physical Specifications</span>
                {openSpecTab === 'dimensions' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSpecTab === 'dimensions' && (
                <div className="mt-2 text-xs text-neutral-600 leading-relaxed animate-in fade-in">
                  <p>{product.specs.dimensions}</p>
                </div>
              )}
            </div>

            <div className="py-4">
              <button
                onClick={() => setOpenSpecTab(openSpecTab === 'materials' ? null : 'materials')}
                className="flex w-full items-center justify-between text-left text-sm font-bold text-brand-dark"
              >
                <span>Museum Materials & Archival UV Inks</span>
                {openSpecTab === 'materials' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSpecTab === 'materials' && (
                <div className="mt-2 text-xs text-neutral-600 leading-relaxed animate-in fade-in">
                  <p>{product.specs.materials}</p>
                  <p className="mt-1">
                    Printed using 12-color pigment giclée technology. Inks are UV-cured and certified fade-resistant for 100+ years in indoor lighting conditions.
                  </p>
                </div>
              )}
            </div>

            <div className="py-4">
              <button
                onClick={() => setOpenSpecTab(openSpecTab === 'mounting' ? null : 'mounting')}
                className="flex w-full items-center justify-between text-left text-sm font-bold text-brand-dark"
              >
                <span>Damage-Free Mounting & Hardware Kit Included</span>
                {openSpecTab === 'mounting' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSpecTab === 'mounting' && (
                <div className="mt-2 text-xs text-neutral-600 leading-relaxed animate-in fade-in">
                  <p>{product.specs.mounting}</p>
                </div>
              )}
            </div>

            <div className="py-4">
              <button
                onClick={() => setOpenSpecTab(openSpecTab === 'guarantee' ? null : 'guarantee')}
                className="flex w-full items-center justify-between text-left text-sm font-bold text-brand-dark"
              >
                <span>100% Love-It Guarantee Policy</span>
                {openSpecTab === 'guarantee' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {openSpecTab === 'guarantee' && (
                <div className="mt-2 text-xs text-neutral-600 leading-relaxed animate-in fade-in">
                  <p>{product.specs.guarantee}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 3: YOU MAY ALSO LIKE (Society6 Editorial Carousel)    */}
      {/* ============================================================= */}
      <section className="bg-brand-linen py-16 border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                Curated Suggestions
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/collections"
              className="text-xs font-bold text-brand-dark hover:text-brand-gold underline flex items-center gap-1.5"
            >
              <span>Explore All Mediums</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================= */}
      {/* SECTION 4: CUSTOMER REVIEWS (Society6 Visual Architecture)    */}
      {/* ============================================================= */}
      <section className="py-16 bg-white border-t border-neutral-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Aggregate Summary Box */}
            <div className="rounded-3xl bg-brand-linen p-8 border border-brand-border grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left shadow-sm">
              <div>
                <span className="font-serif text-5xl font-bold text-brand-dark">4.8</span>
                <div className="flex items-center justify-center md:justify-start text-brand-gold my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <p className="text-xs text-neutral-500">Based on 2,914 customer ratings</p>
              </div>

              {/* Star Histogram */}
              <div className="space-y-1.5 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <span>5★</span>
                  <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-brand-gold w-[82%]" />
                  </div>
                  <span>82%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4★</span>
                  <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-brand-gold w-[12%]" />
                  </div>
                  <span>12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3★</span>
                  <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-brand-gold w-[4%]" />
                  </div>
                  <span>4%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2★</span>
                  <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-brand-gold w-[1%]" />
                  </div>
                  <span>1%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>1★</span>
                  <div className="h-2 flex-1 rounded-full bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-brand-gold w-[1%]" />
                  </div>
                  <span>1%</span>
                </div>
              </div>

              {/* Recommendation % */}
              <div className="border-t md:border-t-0 md:border-l border-brand-border pt-4 md:pt-0 md:pl-8">
                <span className="font-serif text-3xl font-bold text-green-700">88%</span>
                <p className="text-xs font-semibold text-neutral-700 mt-1">
                  would recommend these products to family and friends
                </p>
              </div>
            </div>

            {/* Customer Photo Strip */}
            <div>
              <h3 className="font-serif text-lg font-bold text-brand-dark mb-4">
                Customer Photo Gallery
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80',
                  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',
                  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=300&q=80',
                  'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?w=300&q=80',
                  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&q=80',
                  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80',
                ].map((photo, i) => (
                  <div
                    key={i}
                    className="aspect-square overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm hover:scale-105 transition-transform duration-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Customer review art" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-6 pt-6 border-t border-neutral-200">
              {fallbackReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 rounded-3xl border border-neutral-200 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-brand-dark">{rev.author}</span>
                        {rev.verifiedBuyer && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center text-brand-gold">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= rev.rating ? 'fill-brand-gold text-brand-gold' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-brand-dark">{rev.title}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px] text-neutral-400">
                    <span>I recommend this product</span>
                    <button className="flex items-center gap-1 hover:text-brand-dark transition-colors">
                      <ThumbsUp className="h-3 w-3" />
                      <span>Helpful ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floating Sticky Conversion Bar on Scroll */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 z-40 glass-panel border-t border-neutral-200/80 p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.images[0]} alt="Art" className="h-full w-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h4 className="text-xs font-bold text-brand-dark truncate max-w-xs">{product.title}</h4>
                <span className="text-[11px] font-bold text-brand-gold">{formattedPrice.formatted}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenCustomizer}
                className="flex items-center gap-1.5 rounded-full bg-brand-dark px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md transition-transform active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                <span>Upload & Preview</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="rounded-full border-2 border-brand-dark bg-white px-4 py-2.5 text-xs font-bold text-brand-dark hover:bg-brand-linen transition-colors hidden sm:block"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
