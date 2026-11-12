export type MediumType = 'medium' | 'audience' | 'seasonal';

export interface Collection {
  id: string;
  name: string;
  type: MediumType;
  slug: string;
  heroImage: string;
  description: string;
  featuredProductIds: string[];
  startingPrice: number;
  compareAtPrice?: number;
}

export interface ProductSize {
  name: string;
  dimensions: string;
  priceDelta: number;
}

export interface ProductSpecs {
  dimensions: string;
  materials: string;
  mounting: string;
  guarantee: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  collectionId: string;
  categoryTag: string;
  basePrice: number;
  compareAtPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: ProductSize[];
  specs: ProductSpecs;
  defaultStyleId: string;
  badge?: string;
  description: string;
  multiPhotoCount?: number;
}

export interface GraphicStyle {
  id: string;
  name: string;
  category: string;
  thumbnailUrl: string;
  description: string;
  filterRecipe: string;
  promptTemplate: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  recommend: boolean;
  photoUrl?: string;
  helpfulCount: number;
}

export interface CartItem {
  itemId: string;
  productId: string;
  styleId: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  customArtUrl: string;
  originalPhotoUrl: string;
  cropCoords?: { x: number; y: number; zoom: number };
  createdAt: string;
}

export interface Vision {
  id: string;
  productId: string;
  styleId: string;
  customArtUrl: string;
  originalPhotoUrl: string;
  productTitle: string;
  styleName: string;
  price: number;
  createdAt: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  format: string;
}

export interface FrameOption {
  id: string;
  name: string;
  material: string;
  priceDelta: number;
  colorCode: string;
  borderCss: string;
  description: string;
  badge?: string;
}

export interface RoomScene {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  wallColorDefault: string;
  accentShadow: string;
  description: string;
}

export interface CustomInscription {
  text: string;
  subtitle?: string;
  fontStyle: 'serif' | 'sans' | 'script';
  alignment: 'center' | 'left';
  mattingColor: 'none' | 'white' | 'cream' | 'charcoal';
}

export interface AudioKeepsake {
  enabled: boolean;
  title: string;
  duration: string;
  soundwaveWaveform?: number[];
}

export interface GalleryWallLayout {
  id: string;
  name: string;
  tileCount: number;
  badge: string;
  description: string;
  discountPct: number;
  recommendedRoom: string;
  dimensions: string;
}

export interface UgcPost {
  id: string;
  customerName: string;
  location: string;
  roomType: string;
  wallImageUrl: string;
  originalPhotoUrl?: string;
  styleId: string;
  styleName: string;
  productTitle: string;
  rating: number;
  verifiedBuyer: boolean;
  likes: number;
  comment: string;
}

export interface GiftOptions {
  isGift: boolean;
  recipientName: string;
  senderName: string;
  giftMessage: string;
  waxSealColor: 'gold' | 'burgundy' | 'emerald';
  giftBoxIncluded: boolean;
}

export interface CartItem {
  itemId: string;
  productId: string;
  productTitle?: string;
  styleId: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
  customArtUrl: string;
  originalPhotoUrl: string;
  cropCoords?: { x: number; y: number; zoom: number };
  createdAt: string;
  frameId?: string;
  frameName?: string;
  framePrice?: number;
  inscription?: CustomInscription;
  audioKeepsake?: AudioKeepsake;
  isGalleryWall?: boolean;
  galleryWallType?: string;
}


