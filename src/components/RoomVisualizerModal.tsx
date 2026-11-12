'use client';

import React, { useState } from 'react';
import { X, Sun, Moon, Maximize2, Check, Sparkles, ShoppingBag, Palette } from 'lucide-react';
import { useUIStore, useCartStore, formatCurrency, useDevStore } from '@/store';
import { ROOM_SCENES, FRAME_OPTIONS } from '@/data/mockData';

const WALL_TINTS = [
  { name: 'Original Room', color: 'transparent' },
  { name: 'Warm Linen', color: 'rgba(245, 240, 230, 0.45)' },
  { name: 'Nordic Sage', color: 'rgba(215, 226, 218, 0.45)' },
  { name: 'Moody Charcoal', color: 'rgba(50, 55, 60, 0.45)' },
  { name: 'Terracotta Clay', color: 'rgba(224, 185, 165, 0.45)' },
];

export const RoomVisualizerModal: React.FC = () => {
  const isRoomVisualizerOpen = useUIStore((s) => s.isRoomVisualizerOpen);
  const closeRoomVisualizer = useUIStore((s) => s.closeRoomVisualizer);
  const visualizerData = useUIStore((s) => s.visualizerData);
  const addItemToCart = useCartStore((s) => s.addItem);
  const addToast = useUIStore((s) => s.addToast);
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  const [selectedSceneId, setSelectedSceneId] = useState<string>('nordic-living');
  const [selectedFrameId, setSelectedFrameId] = useState<string>(
    visualizerData?.frameId || 'frameless-magnetic'
  );
  const [selectedTint, setSelectedTint] = useState<string>('transparent');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [artScale, setArtScale] = useState<number>(1.0); // 0.8x to 1.3x

  if (!isRoomVisualizerOpen || !visualizerData) return null;

  const currentScene =
    ROOM_SCENES.find((s) => s.id === selectedSceneId) || ROOM_SCENES[0];
  const currentFrame =
    FRAME_OPTIONS.find((f) => f.id === selectedFrameId) || FRAME_OPTIONS[0];

  const basePrice = 49.0;
  const totalPrice = basePrice + currentFrame.priceDelta;
  const formattedPrice = formatCurrency(totalPrice, activeCurrency);

  const handleAddToCart = () => {
    addItemToCart({
      productId: 'single-tile-6x8',
      productTitle: visualizerData.title || 'Personalized Wall Art',
      styleId: 'watercolor-botanica',
      selectedSize: 'Standard',
      quantity: 1,
      unitPrice: basePrice,
      customArtUrl: visualizerData.imageUrl,
      originalPhotoUrl: visualizerData.imageUrl,
      frameId: currentFrame.id,
      frameName: currentFrame.name,
      framePrice: currentFrame.priceDelta,
    });
    addToast(`Added "${visualizerData.title}" with ${currentFrame.name} to cart!`, 'success');
    closeRoomVisualizer();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      {/* Dark backdrop scrim */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={closeRoomVisualizer}
      />

      {/* Main Dialog Container */}
      <div className="relative z-10 w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-neutral-900 text-white shadow-2xl overflow-hidden border border-neutral-700 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 bg-neutral-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-gold/20 flex items-center justify-center border border-brand-gold/40">
              <Sparkles className="h-4 w-4 text-brand-gold" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Interactive Wall Visualizer
              </span>
              <h3 className="font-serif text-lg font-bold text-white">
                View on Your Wall — {currentScene.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Day / Night Ambient Toggle */}
            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
              title="Toggle Day/Night ambient lighting"
            >
              {isNightMode ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-amber-400" />
                  <span>Warm Night</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Natural Daylight</span>
                </>
              )}
            </button>

            <button
              onClick={closeRoomVisualizer}
              className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Visualizer Canvas Area */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[460px] overflow-hidden bg-neutral-950 flex items-center justify-center">
          {/* Room Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentScene.imageUrl}
            alt={currentScene.name}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
              isNightMode ? 'brightness-75 contrast-110 saturate-90' : 'brightness-100'
            }`}
          />

          {/* Wall Paint Tint Filter Layer */}
          <div
            className="absolute inset-0 transition-colors duration-500 pointer-events-none mix-blend-multiply"
            style={{ backgroundColor: selectedTint }}
          />

          {/* Night Ambience Glow */}
          {isNightMode && (
            <div className="absolute inset-0 bg-amber-950/20 mix-blend-color-burn pointer-events-none" />
          )}

          {/* Framed Artwork Displayed on Wall */}
          <div
            className="relative z-20 transition-all duration-300 group select-none shadow-2xl"
            style={{
              transform: `scale(${artScale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Real 3D Frame Rendering */}
            <div
              className={`relative overflow-hidden transition-all duration-300 ${currentFrame.borderCss}`}
              style={{
                borderRadius: currentFrame.id === 'frameless-magnetic' ? '12px' : '6px',
              }}
            >
              {/* Artwork Media */}
              <div className="relative h-44 w-44 sm:h-64 sm:w-64 md:h-72 md:w-72 overflow-hidden bg-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={visualizerData.imageUrl}
                  alt={visualizerData.title}
                  className="h-full w-full object-cover"
                  style={{ filter: visualizerData.filterRecipe || '' }}
                />
                {/* Subtle Archival Texture Canvas Overlay */}
                <div className="absolute inset-0 bg-neutral-900/5 mix-blend-overlay pointer-events-none" />
              </div>
            </div>

            {/* Simulated Wall Shadow beneath frame */}
            <div
              className="absolute -inset-4 -z-10 rounded-2xl blur-xl transition-opacity duration-300"
              style={{
                backgroundColor: currentScene.accentShadow,
                opacity: isNightMode ? 0.7 : 0.45,
              }}
            />
          </div>

          {/* Floating Dimension Tag on Canvas */}
          <div className="absolute bottom-4 left-4 z-30 rounded-full glass-dark px-3 py-1 text-[11px] font-semibold text-neutral-200 border border-white/10 shadow-lg">
            <span>Dimensions: {Math.round(24 * artScale)}&quot; × {Math.round(24 * artScale)}&quot;</span>
          </div>

          {/* Size Scale Slider in Bottom Right */}
          <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 rounded-full glass-dark px-3.5 py-1.5 text-xs text-neutral-200 border border-white/10 shadow-lg">
            <span className="text-[10px] uppercase font-bold text-neutral-400">Scale:</span>
            <input
              type="range"
              min="0.75"
              max="1.35"
              step="0.05"
              value={artScale}
              onChange={(e) => setArtScale(parseFloat(e.target.value))}
              className="w-20 accent-brand-gold cursor-pointer"
            />
            <span className="font-bold text-[11px]">{Math.round(artScale * 100)}%</span>
          </div>
        </div>

        {/* Bottom Control Bar: Scenes, Wall Colors, Frame Selector & Add to Cart */}
        <div className="border-t border-neutral-800 bg-neutral-950 p-4 sm:p-5 flex flex-col gap-4 flex-shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* 1. Scene Switcher */}
            <div className="md:col-span-4 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                1. Select Designer Room Scene
              </span>
              <div className="grid grid-cols-4 gap-2">
                {ROOM_SCENES.map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedSceneId(scene.id)}
                    className={`relative overflow-hidden rounded-xl border-2 aspect-[4/3] transition-all group ${
                      selectedSceneId === scene.id
                        ? 'border-brand-gold ring-2 ring-brand-gold/30 scale-105'
                        : 'border-neutral-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={scene.imageUrl}
                      alt={scene.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[9px] font-bold leading-tight">
                      <span className="truncate">{scene.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Wall Paint Tint Swatches */}
            <div className="md:col-span-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                2. Test Wall Paint Tint
              </span>
              <div className="flex items-center gap-2">
                {WALL_TINTS.map((tint) => (
                  <button
                    key={tint.name}
                    onClick={() => setSelectedTint(tint.color)}
                    title={tint.name}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      selectedTint === tint.color
                        ? 'border-brand-gold scale-125 ring-2 ring-brand-gold/40'
                        : 'border-neutral-600 hover:scale-110'
                    }`}
                    style={{
                      backgroundColor:
                        tint.color === 'transparent' ? '#555' : tint.color.replace('0.45', '1'),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 3. Physical Frame Choice & Price */}
            <div className="md:col-span-5 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                3. Choose Physical Frame Material
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FRAME_OPTIONS.map((frame) => {
                  const isSelected = frame.id === selectedFrameId;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => setSelectedFrameId(frame.id)}
                      className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-gold text-brand-dark font-bold shadow-md'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: frame.colorCode }}
                      />
                      <span>{frame.name}</span>
                      {frame.priceDelta > 0 && (
                        <span className="text-[10px] opacity-80">(+${frame.priceDelta})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-neutral-800 gap-3">
            <div className="text-xs">
              <span className="text-neutral-400">Configured:</span>{' '}
              <span className="font-bold text-white">{visualizerData.title}</span> +{' '}
              <span className="text-brand-gold font-bold">{currentFrame.name}</span>
              <span className="mx-2 text-neutral-600">•</span>
              <span className="text-base font-bold text-white">{formattedPrice.formatted}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={closeRoomVisualizer}
                className="flex-1 sm:flex-initial rounded-full border border-neutral-700 px-5 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800"
              >
                Close Visualizer
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-brand-gold hover:bg-amber-500 px-6 py-2.5 text-xs font-bold text-brand-dark transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Order with this Frame</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

