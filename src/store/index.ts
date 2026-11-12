import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Vision, CurrencyCode, GiftOptions } from '@/types';
import { CURRENCIES } from '@/data/mockData';

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

// -------------------------------------------------------------
// CART STORE
// -------------------------------------------------------------
interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  activeCoupon: string | null;
  couponDiscountPct: number;
  giftOptions: GiftOptions;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'itemId' | 'createdAt'>) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  updateGiftOptions: (options: Partial<GiftOptions>) => void;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShippingCost: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      activeCoupon: null,
      couponDiscountPct: 0,
      giftOptions: {
        isGift: false,
        recipientName: '',
        senderName: '',
        giftMessage: '',
        waxSealColor: 'gold',
        giftBoxIncluded: true,
      },

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (itemData) => {
        const newItem: CartItem = {
          ...itemData,
          itemId: `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          items: [newItem, ...state.items],
          isCartOpen: true, // auto-opens cart drawer on add
        }));
      },

      updateQuantity: (itemId, delta) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.itemId === itemId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: updated };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.itemId !== itemId),
        }));
      },

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'MOON10') {
          set({ activeCoupon: 'MOON10', couponDiscountPct: 0.1 });
          return { success: true, message: 'Coupon MOON10 applied: 10% discount!' };
        }
        return { success: false, message: `Coupon "${code}" is invalid or expired.` };
      },

      removeCoupon: () => set({ activeCoupon: null, couponDiscountPct: 0 }),

      clearCart: () => set({ items: [], activeCoupon: null, couponDiscountPct: 0 }),

      updateGiftOptions: (options) => {
        set((state) => ({
          giftOptions: { ...state.giftOptions, ...options },
        }));
      },

      getSubtotal: () => {
        const itemsTotal = get().items.reduce(
          (acc, item) => acc + (item.unitPrice + (item.framePrice || 0)) * item.quantity,
          0
        );
        const giftWrapCost = get().giftOptions.isGift ? 12.0 : 0;
        return itemsTotal + giftWrapCost;
      },

      getDiscount: () => {
        const subtotal = get().getSubtotal();
        return subtotal * get().couponDiscountPct;
      },

      getShippingCost: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        return subtotal >= 75.0 ? 0.0 : 9.99;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().getDiscount();
        const shipping = get().getShippingCost();
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    {
      name: 'moonflash_cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        activeCoupon: state.activeCoupon,
        couponDiscountPct: state.couponDiscountPct,
        giftOptions: state.giftOptions,
      }),
    }
  )
);

// -------------------------------------------------------------
// VISION STORE (SAVED ARTWORKS)
// -------------------------------------------------------------
interface VisionState {
  savedVisions: Vision[];
  addVision: (vision: Omit<Vision, 'id' | 'createdAt'>) => string;
  removeVision: (id: string) => void;
  clearVisions: () => void;
}

export const useVisionStore = create<VisionState>()(
  persist(
    (set) => ({
      savedVisions: [],
      addVision: (visionData) => {
        const id = `vis-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        const newVision: Vision = {
          ...visionData,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          savedVisions: [newVision, ...state.savedVisions].slice(0, 20), // capped at 20
        }));
        return id;
      },
      removeVision: (id) =>
        set((state) => ({
          savedVisions: state.savedVisions.filter((v) => v.id !== id),
        })),
      clearVisions: () => set({ savedVisions: [] }),
    }),
    {
      name: 'moonflash_visions',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// -------------------------------------------------------------
// WISHLIST STORE
// -------------------------------------------------------------
interface WishlistState {
  wishlistIds: string[];
  isWishlistOpen: boolean;
  toggleWishlistDrawer: () => void;
  toggleWishlist: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      isWishlistOpen: false,
      toggleWishlistDrawer: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen })),
      toggleWishlist: (productId) => {
        const exists = get().wishlistIds.includes(productId);
        if (exists) {
          set((state) => ({
            wishlistIds: state.wishlistIds.filter((id) => id !== productId),
          }));
          return false;
        } else {
          set((state) => ({
            wishlistIds: [...state.wishlistIds, productId],
          }));
          return true;
        }
      },
      isInWishlist: (productId) => get().wishlistIds.includes(productId),
    }),
    {
      name: 'moonflash_wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ wishlistIds: state.wishlistIds }),
    }
  )
);

// -------------------------------------------------------------
// UI & TOAST STORE
// -------------------------------------------------------------
interface VisualizerPayload {
  imageUrl: string;
  title: string;
  frameId?: string;
  frameName?: string;
  filterRecipe?: string;
}

interface UIState {
  toasts: ToastItem[];
  isSearchOpen: boolean;
  activeAppModalProduct: {
    productId: string;
    productTitle: string;
    basePrice: number;
    initialStyleId?: string;
  } | null;
  isRoomVisualizerOpen: boolean;
  visualizerData: VisualizerPayload | null;
  isGalleryBuilderOpen: boolean;
  addToast: (message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  openSearch: () => void;
  closeSearch: () => void;
  openAppModal: (product: UIState['activeAppModalProduct']) => void;
  closeAppModal: () => void;
  openRoomVisualizer: (data: VisualizerPayload) => void;
  closeRoomVisualizer: () => void;
  openGalleryBuilder: () => void;
  closeGalleryBuilder: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  isSearchOpen: false,
  activeAppModalProduct: null,
  isRoomVisualizerOpen: false,
  visualizerData: null,
  isGalleryBuilderOpen: false,

  addToast: (message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  openAppModal: (product) => set({ activeAppModalProduct: product }),
  closeAppModal: () => set({ activeAppModalProduct: null }),

  openRoomVisualizer: (data) => set({ isRoomVisualizerOpen: true, visualizerData: data }),
  closeRoomVisualizer: () => set({ isRoomVisualizerOpen: false, visualizerData: null }),

  openGalleryBuilder: () => set({ isGalleryBuilderOpen: true }),
  closeGalleryBuilder: () => set({ isGalleryBuilderOpen: false }),
}));

// -------------------------------------------------------------
// DEV SETTINGS STORE
// -------------------------------------------------------------
interface DevSettingsState {
  isDevPanelOpen: boolean;
  forceMyVisions: boolean | null; // null = auto
  souvenirsLayout: '3-up' | '2-up';
  simulateGenerationFailure: boolean;
  activeCurrency: CurrencyCode;
  toggleDevPanel: () => void;
  setForceMyVisions: (val: boolean | null) => void;
  setSouvenirsLayout: (val: '3-up' | '2-up') => void;
  setSimulateGenerationFailure: (val: boolean) => void;
  setActiveCurrency: (code: CurrencyCode) => void;
  resetAllData: () => void;
}

export const useDevStore = create<DevSettingsState>()(
  persist(
    (set) => ({
      isDevPanelOpen: false,
      forceMyVisions: null,
      souvenirsLayout: '3-up',
      simulateGenerationFailure: false,
      activeCurrency: 'USD',

      toggleDevPanel: () => set((state) => ({ isDevPanelOpen: !state.isDevPanelOpen })),
      setForceMyVisions: (val) => set({ forceMyVisions: val }),
      setSouvenirsLayout: (val) => set({ souvenirsLayout: val }),
      setSimulateGenerationFailure: (val) => set({ simulateGenerationFailure: val }),
      setActiveCurrency: (code) => set({ activeCurrency: code }),

      resetAllData: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('moonflash_cart');
          localStorage.removeItem('moonflash_visions');
          localStorage.removeItem('moonflash_wishlist');
          localStorage.removeItem('moonflash_currency');
          window.location.reload();
        }
      },
    }),
    {
      name: 'moonflash_dev_settings',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Currency formatting helper hook
export function formatCurrency(amountUSD: number, currencyCode: CurrencyCode = 'USD') {
  const config = CURRENCIES[currencyCode] || CURRENCIES.USD;
  const converted = amountUSD * config.rate;
  return {
    formatted: `${config.symbol}${converted.toFixed(2)}`,
    convertedAmount: converted,
    config,
  };
}

