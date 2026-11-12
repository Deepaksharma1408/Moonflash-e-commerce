'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, Camera } from 'lucide-react';

interface BeforeAfterSliderProps {
  originalImage: string;
  artImage: string;
  artFilterStyle?: string;
  aspectRatio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  originalImage,
  artImage,
  artFilterStyle = '',
  aspectRatio = 'aspect-square',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(clampedPct);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-3xl border-4 border-white bg-neutral-900 shadow-2xl cursor-ew-resize group ${aspectRatio}`}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Bottom Layer: Generated Fine Art */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artImage}
        alt="Moonflash Art"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: artFilterStyle }}
      />
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full glass-panel px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-dark shadow-xl border border-white/80">
        <Sparkles className="h-3 w-3 text-brand-gold animate-spin-slow" />
        <span>Fine Art Print</span>
      </div>

      {/* Top Layer: Original Camera Photo clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={originalImage}
          alt="Original Raw Photo"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 rounded-full glass-panel px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-dark shadow-xl border border-white/80">
          <Camera className="h-3 w-3 text-neutral-600" />
          <span>Raw Photo</span>
        </div>
      </div>

      {/* Center Vertical Divider Line and Glowing Drag Handle */}
      <div
        className="absolute bottom-0 top-0 z-20 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9),0_0_25px_rgba(0,0,0,0.5)] transition-opacity"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Center Circular Luxury Handle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-brand-dark text-white shadow-2xl transition-transform hover:scale-115 active:scale-95 group-hover:shadow-[0_0_20px_rgba(180,123,54,0.6)]">
          {/* Subtle gold ring pulse */}
          <span className="absolute -inset-1 rounded-full border border-brand-gold/60 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          <svg
            className="h-4 w-4 text-brand-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-4 3 4 3m8-6l4 3-4 3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

