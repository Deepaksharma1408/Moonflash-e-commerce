'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UploadCloud,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  ZoomOut,
  Sliders,
  Image as ImageIcon,
  Eye,
  Type,
  Volume2,
  Box,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUIStore, useCartStore, useVisionStore, useDevStore, formatCurrency } from '@/store';
import { GRAPHIC_STYLES, PRODUCTS, FRAME_OPTIONS } from '@/data/mockData';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';

export const AppLayerModal: React.FC = () => {
  const activeProduct = useUIStore((s) => s.activeAppModalProduct);
  const closeAppModal = useUIStore((s) => s.closeAppModal);
  const openRoomVisualizer = useUIStore((s) => s.openRoomVisualizer);
  const addToast = useUIStore((s) => s.addToast);
  const activeCurrency = useDevStore((s) => s.activeCurrency);

  const addItemToCart = useCartStore((s) => s.addItem);
  const addVision = useVisionStore((s) => s.addVision);
  const simulateGenerationFailure = useDevStore((s) => s.simulateGenerationFailure);

  // Wizard Steps: 1 = Upload, 2 = Style, 3 = Preview & Adjust
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Upload state
  const [rawPhotoUrl, setRawPhotoUrl] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPhotoTipsOpen, setIsPhotoTipsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Graphic Style selection
  const [selectedStyleId, setSelectedStyleId] = useState<string>(
    activeProduct?.initialStyleId || 'stained-glass'
  );

  // Step 3: Generation & Customizer Tabs
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationPhaseText, setGenerationPhaseText] = useState<string>('');
  const [generationFailed, setGenerationFailed] = useState<boolean>(false);
  const [regenerationsRemaining, setRegenerationsRemaining] = useState<number>(3);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0); // 1.0x to 2.5x
  const [selectedSize, setSelectedSize] = useState<string>('Standard');

  // Customizer Tabs & Options
  const [activeTab, setActiveTab] = useState<'adjust' | 'frame' | 'inscription' | 'audio'>('adjust');
  const [selectedFrameId, setSelectedFrameId] = useState<string>('frameless-magnetic');
  const [inscriptionText, setInscriptionText] = useState<string>('');
  const [inscriptionSubtitle, setInscriptionSubtitle] = useState<string>('');
  const [inscriptionFont, setInscriptionFont] = useState<'serif' | 'sans' | 'script'>('serif');
  const [mattingColor, setMattingColor] = useState<'none' | 'white' | 'cream' | 'charcoal'>('none');
  const [hasAudioKeepsake, setHasAudioKeepsake] = useState<boolean>(false);

  // Reset state on open
  useEffect(() => {
    if (activeProduct) {
      setCurrentStep(1);
      setRawPhotoUrl(null);
      setUploadWarning(null);
      setUploadError(null);
      setGenerationFailed(false);
      setRegenerationsRemaining(3);
      setZoomLevel(1.0);
      if (activeProduct.initialStyleId) {
        setSelectedStyleId(activeProduct.initialStyleId);
      }
      const prod = PRODUCTS.find((p) => p.id === activeProduct.productId);
      if (prod && prod.sizes.length > 0) {
        setSelectedSize(prod.sizes[0].name);
      }
    }
  }, [activeProduct]);

  if (!activeProduct) return null;

  const currentProduct = PRODUCTS.find((p) => p.id === activeProduct.productId);
  const selectedStyle = GRAPHIC_STYLES.find((s) => s.id === selectedStyleId) || GRAPHIC_STYLES[0];

  // -------------------------------------------------------------
  // STEP 1: FILE INGESTION & VALIDATION
  // -------------------------------------------------------------
  const handleFileChange = (file: File) => {
    setUploadError(null);
    setUploadWarning(null);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      setUploadError('Unsupported format. Please upload a JPG, PNG, WEBP, or HEIC photo.');
      return;
    }

    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('File exceeds 25MB limit. Please upload a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.width < 1200 || img.height < 1200) {
          setUploadWarning(
            `Soft Image Notice: Photo resolution is ${img.width}x${img.height}px (under 1200px). It may appear soft when printed on large physical canvas.`
          );
        }
        setRawPhotoUrl(dataUrl);
        setCurrentStep(2);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUseSamplePhoto = () => {
    const sample = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&q=80';
    setRawPhotoUrl(sample);
    setUploadWarning(null);
    setCurrentStep(2);
  };

  // -------------------------------------------------------------
  // STEP 3: GENERATION SIMULATION ENGINE (3.2 SECONDS)
  // -------------------------------------------------------------
  const startGenerationSimulation = () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationFailed(false);
    setCurrentStep(3);

    const intervalTime = 80;
    const totalDuration = 3200;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalTime;
      const pct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setGenerationProgress(pct);

      if (elapsed < 800) {
        setGenerationPhaseText('Analyzing photo composition, depth, and lighting geometry...');
      } else if (elapsed < 1800) {
        setGenerationPhaseText(
          `Synthesizing ${selectedStyle.name} brushwork and physical paint texture...`
        );
      } else if (elapsed < 2800) {
        setGenerationPhaseText('Balancing museum-grade color harmony and archival pigments...');
      } else {
        setGenerationPhaseText('Finalizing high-resolution physical print preview...');
      }

      if (simulateGenerationFailure && elapsed >= 2000) {
        clearInterval(timer);
        setIsGenerating(false);
        setGenerationFailed(true);
        return;
      }

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        setIsGenerating(false);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#B47B36', '#111827', '#E2E8F0'],
          });
        } catch {}
      }
    }, intervalTime);
  };

  const handleRegenerate = () => {
    if (regenerationsRemaining <= 0) return;
    setRegenerationsRemaining((prev) => prev - 1);
    startGenerationSimulation();
  };

  // -------------------------------------------------------------
  // STEP 4: ADD TO CART & VISION PERSISTENCE
  // -------------------------------------------------------------
  const handleAddToCart = () => {
    if (!rawPhotoUrl) return;

    const currentFrame = FRAME_OPTIONS.find((f) => f.id === selectedFrameId) || FRAME_OPTIONS[0];

    addVision({
      productId: activeProduct.productId,
      styleId: selectedStyleId,
      customArtUrl: rawPhotoUrl,
      originalPhotoUrl: rawPhotoUrl,
      productTitle: currentProduct?.title || activeProduct.productTitle,
      styleName: selectedStyle.name,
      price: (currentProduct?.basePrice || activeProduct.basePrice) + currentFrame.priceDelta,
    });

    addItemToCart({
      productId: activeProduct.productId,
      styleId: selectedStyleId,
      selectedSize,
      quantity: 1,
      unitPrice: currentProduct?.basePrice || activeProduct.basePrice,
      customArtUrl: rawPhotoUrl,
      originalPhotoUrl: rawPhotoUrl,
      cropCoords: { x: 0, y: 0, zoom: zoomLevel },
      frameId: currentFrame.id,
      frameName: currentFrame.name,
      framePrice: currentFrame.priceDelta,
      inscription: inscriptionText.trim()
        ? {
            text: inscriptionText.trim(),
            subtitle: inscriptionSubtitle.trim() || undefined,
            fontStyle: inscriptionFont,
            alignment: 'center',
            mattingColor,
          }
        : undefined,
      audioKeepsake: hasAudioKeepsake
        ? {
            enabled: true,
            title: 'Audio Keepsake',
            duration: '0:42',
          }
        : undefined,
    });

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#B47B36', '#111827', '#15803D'],
      });
    } catch {}

    addToast('Artwork added to cart! Saved to your Visions.', 'success');
    closeAppModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      {/* Backdrop with blur */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity" onClick={closeAppModal} />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-neutral-200 animate-in zoom-in-95 duration-200">
        {/* Top Header with Stepper Pill */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 sm:px-6 py-3.5 sm:py-4 bg-brand-linen flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-brand-dark text-xs font-bold text-white flex-shrink-0">
              {currentStep}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Creation Pipeline Step {currentStep} of 3
              </span>
              <h3 className="font-serif text-sm sm:text-lg font-bold text-brand-dark line-clamp-1">
                {currentStep === 1 && 'Upload Your Favorite Photograph'}
                {currentStep === 2 && 'Select Signature Graphic Style'}
                {currentStep === 3 && 'Preview & Fine-Tune Composition'}
              </h3>
            </div>
          </div>

          <button
            onClick={closeAppModal}
            className="rounded-full p-1.5 sm:p-2 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          {/* ========================================================= */}
          {/* STEP 1: UPLOAD                                            */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-300 bg-brand-linen/50 p-8 md:p-14 text-center hover:border-brand-dark hover:bg-brand-sand/50 transition-all cursor-pointer"
              >
                <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform border border-brand-border">
                  <UploadCloud className="h-8 w-8 text-brand-gold" />
                </div>
                <h4 className="font-serif text-lg md:text-xl font-bold text-brand-dark">
                  Drag and drop your photograph here
                </h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
                  JPEG, PNG, WEBP, or HEIC format. Original camera roll photos produce stunning museum clarity.
                </p>

                <div className="mt-5 flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    className="rounded-full bg-brand-dark px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 shadow-md"
                  >
                    Browse Device Photo
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseSamplePhoto();
                    }}
                    className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 shadow-sm"
                  >
                    Try with Demo Photo
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs text-red-700 border border-red-200">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Tips Accordion */}
              <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsPhotoTipsOpen(!isPhotoTipsOpen)}
                  className="flex w-full items-center justify-between p-4 text-xs font-bold text-neutral-800 hover:bg-neutral-50"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-gold" />
                    Photo Tips for Museum-Grade Art
                  </span>
                  {isPhotoTipsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isPhotoTipsOpen && (
                  <div className="border-t border-neutral-200 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-neutral-600 bg-brand-linen/40">
                    <div>
                      <strong className="block text-brand-dark font-semibold">1. Natural Lighting:</strong>
                      Bright, natural light gives the AI engine rich color depth for brushwork synthesis.
                    </div>
                    <div>
                      <strong className="block text-brand-dark font-semibold">2. Crisp Subject:</strong>
                      Faces and pet fur in sharp focus produce the most intricate detail.
                    </div>
                    <div>
                      <strong className="block text-brand-dark font-semibold">3. High Resolution:</strong>
                      Use original photos rather than screenshots to prevent pixelation.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: CHOOSE GRAPHIC STYLE                              */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6">
              {uploadWarning && (
                <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600" />
                  <span>{uploadWarning}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-bold text-brand-dark">Curated Graphic Styles</h4>
                  <p className="text-xs text-neutral-500">
                    Select an artistic style to synthesize your photograph into a fine art piece.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-neutral-500 hover:text-brand-dark underline font-medium"
                >
                  Change Photo
                </button>
              </div>

              {/* 10 Styles Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {GRAPHIC_STYLES.map((style) => {
                  const isSelected = style.id === selectedStyleId;
                  return (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyleId(style.id)}
                      className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 p-2.5 transition-all group ${
                        isSelected
                          ? 'border-brand-gold bg-brand-linen shadow-lg scale-[1.03]'
                          : 'border-neutral-200 bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100 mb-2 relative shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={style.thumbnailUrl}
                          alt={style.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          style={{ filter: style.filterRecipe }}
                        />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-white shadow-md">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-brand-dark line-clamp-1">{style.name}</h5>
                      <p className="text-[10px] text-neutral-500 line-clamp-1 mt-0.5">{style.category}</p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Style Detail & CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
                <div className="text-xs">
                  <span className="text-neutral-500">Selected Style:</span>{' '}
                  <span className="font-bold text-brand-dark">{selectedStyle.name}</span> —{' '}
                  <span className="text-neutral-600">{selectedStyle.description}</span>
                </div>
                <button
                  onClick={startGenerationSimulation}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-brand-dark px-8 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-xl hover:scale-105 active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                  <span>Generate Artwork →</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: PREVIEW, SLIDER, CROP & GENERATE ENGINE           */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Animated Laser Scanline Loading State */}
              {isGenerating ? (
                <div className="relative flex flex-col items-center justify-center py-12 text-center space-y-5 rounded-3xl bg-brand-linen border border-brand-border overflow-hidden">
                  {/* Subtle Glowing Scanline Moving Down */}
                  <div className="relative h-48 w-48 rounded-2xl overflow-hidden border-2 border-brand-gold shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rawPhotoUrl || ''}
                      alt="Processing art"
                      className="h-full w-full object-cover filter blur-[1px] opacity-80"
                    />
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent shadow-[0_0_15px_#B47B36] animate-scanline" />
                  </div>

                  <div>
                    <h4 className="font-serif text-xl font-bold text-brand-dark">
                      Synthesizing Your Physical Artwork
                    </h4>
                    <p className="text-xs text-neutral-600 max-w-sm mt-1.5">{generationPhaseText}</p>
                  </div>

                  {/* Progress Bar with Gold Glow */}
                  <div className="w-full max-w-md px-6">
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full bg-gradient-to-r from-brand-gold to-brand-terracotta transition-all duration-150 rounded-full"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-500 mt-2 block">
                      {generationProgress}% Synthesized
                    </span>
                  </div>
                </div>
              ) : generationFailed ? (
                /* Failure State (Simulated) */
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 bg-red-50 p-6 rounded-3xl border border-red-200">
                  <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 shadow-sm">
                    <AlertTriangle className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-red-900">
                      Artwork Synthesis Failed
                    </h4>
                    <p className="text-xs text-red-700 max-w-md mt-1 leading-relaxed">
                      Our engine could not balance the lighting layers on this upload. You can retry with the same image or upload another angle.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={startGenerationSimulation}
                      className="rounded-full bg-red-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-red-800 shadow"
                    >
                      Retry Generation
                    </button>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="rounded-full border border-red-300 bg-white px-5 py-2.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                    >
                      Upload Different Photo
                    </button>
                  </div>
                </div>
              ) : (
                /* Interactive Generated Preview with Custom Frame, Inscription & AR Visualizer */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left: Split Slider Canvas wrapped in Selected Frame */}
                  <div className="lg:col-span-7 flex flex-col items-center">
                    {(() => {
                      const currentFrame =
                        FRAME_OPTIONS.find((f) => f.id === selectedFrameId) || FRAME_OPTIONS[0];

                      const mattingClass =
                        mattingColor === 'white'
                          ? 'bg-white p-4 border border-neutral-200'
                          : mattingColor === 'cream'
                          ? 'bg-[#F9F6F0] p-4 border border-[#E8E2D5]'
                          : mattingColor === 'charcoal'
                          ? 'bg-[#2A2E33] p-4 border border-black/40 text-white'
                          : '';

                      return (
                        <div className="w-full flex flex-col items-center">
                          <div
                            className={`w-full max-w-md transition-all duration-300 ${currentFrame.borderCss}`}
                            style={{
                              borderRadius:
                                currentFrame.id === 'frameless-magnetic' ? '16px' : '6px',
                            }}
                          >
                            <div className={mattingClass}>
                              <div
                                className="w-full transition-transform"
                                style={{
                                  transform: `scale(${zoomLevel})`,
                                  transformOrigin: 'center',
                                }}
                              >
                                <BeforeAfterSlider
                                  originalImage={rawPhotoUrl || ''}
                                  artImage={rawPhotoUrl || ''}
                                  artFilterStyle={selectedStyle.filterRecipe}
                                  aspectRatio="aspect-square"
                                />
                              </div>

                              {/* Custom Inscription Plaque on Canvas/Matting */}
                              {inscriptionText.trim() && (
                                <div
                                  className={`text-center pt-3 pb-1 border-t ${
                                    mattingColor === 'charcoal'
                                      ? 'border-white/20 text-white'
                                      : 'border-neutral-200 text-brand-dark'
                                  }`}
                                >
                                  <div
                                    className={`text-xs font-bold tracking-wide ${
                                      inscriptionFont === 'serif'
                                        ? 'font-serif'
                                        : inscriptionFont === 'script'
                                        ? 'italic font-serif'
                                        : 'font-sans'
                                    }`}
                                  >
                                    {inscriptionText}
                                  </div>
                                  {inscriptionSubtitle.trim() && (
                                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                                      {inscriptionSubtitle}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Soundwave badge indicator if enabled */}
                          {hasAudioKeepsake && (
                            <div className="mt-2.5 flex items-center gap-2 rounded-full bg-brand-linen px-3 py-1 border border-brand-border text-[11px] font-bold text-brand-dark">
                              <Volume2 className="h-3.5 w-3.5 text-brand-gold animate-pulse" />
                              <span>Audio Keepsake QR included on reverse plate</span>
                            </div>
                          )}

                          {/* Action Button: View on Your Wall */}
                          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                openRoomVisualizer({
                                  imageUrl: rawPhotoUrl || '',
                                  title: currentProduct?.title || activeProduct.productTitle,
                                  frameId: currentFrame.id,
                                  frameName: currentFrame.name,
                                  filterRecipe: selectedStyle.filterRecipe,
                                });
                              }}
                              className="inline-flex items-center gap-2 rounded-full bg-brand-linen border border-brand-border px-5 py-2 text-xs font-bold text-brand-dark hover:bg-brand-dark hover:text-white transition-all shadow-md active:scale-95"
                            >
                              <Eye className="h-4 w-4 text-brand-gold" />
                              <span>View on Your Wall (AR Simulator)</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}

                    <span className="text-[11px] text-neutral-400 mt-2 font-medium">
                      ◄ Drag slider handle horizontally to wipe photo & artwork ►
                    </span>
                  </div>

                  {/* Right: Bespoke Customizer Tabs & Controls */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Navigation Tab Bar */}
                    <div className="flex border-b border-neutral-200 gap-1 pb-1 text-xs">
                      <button
                        onClick={() => setActiveTab('adjust')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                          activeTab === 'adjust'
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <Sliders className="h-3.5 w-3.5" />
                        <span>Canvas</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('frame')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                          activeTab === 'frame'
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <Box className="h-3.5 w-3.5" />
                        <span>Frames</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('inscription')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                          activeTab === 'inscription'
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <Type className="h-3.5 w-3.5" />
                        <span>Text & Mat</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('audio')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                          activeTab === 'audio'
                            ? 'bg-brand-dark text-white shadow-sm'
                            : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>Soundwave</span>
                      </button>
                    </div>

                    {/* Tab 1: Adjust & Zoom */}
                    {activeTab === 'adjust' && (
                      <div className="rounded-2xl border border-neutral-200 bg-brand-linen/60 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-dark">Active Style:</span>
                          <span className="text-xs font-bold text-brand-gold bg-white px-3 py-1 rounded-full border border-brand-border shadow-sm">
                            {selectedStyle.name}
                          </span>
                        </div>

                        {/* Zoom Slider */}
                        <div>
                          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1.5">
                            <span className="flex items-center gap-1 font-semibold">
                              <Sliders className="h-3.5 w-3.5" /> Canvas Zoom
                            </span>
                            <span className="font-bold text-brand-dark">{zoomLevel.toFixed(1)}x</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ZoomOut className="h-3.5 w-3.5 text-neutral-400" />
                            <input
                              type="range"
                              min="1.0"
                              max="2.0"
                              step="0.1"
                              value={zoomLevel}
                              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                              className="w-full accent-brand-dark cursor-pointer"
                            />
                            <ZoomIn className="h-3.5 w-3.5 text-neutral-400" />
                          </div>
                        </div>

                        {/* Size Selector */}
                        {currentProduct && currentProduct.sizes.length > 0 && (
                          <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-1">
                              Physical Dimensions:
                            </label>
                            <select
                              value={selectedSize}
                              onChange={(e) => setSelectedSize(e.target.value)}
                              className="w-full rounded-xl border border-neutral-300 bg-white p-2.5 text-xs font-semibold text-neutral-800"
                            >
                              {currentProduct.sizes.map((s) => (
                                <option key={s.name} value={s.name}>
                                  {s.name} {s.priceDelta > 0 ? `(+$${s.priceDelta})` : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Regeneration Limit Rule (Max 3) */}
                        <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                          <div className="text-[11px] text-neutral-500">
                            Regenerations remaining:{' '}
                            <span className="font-bold text-brand-dark">
                              {regenerationsRemaining} of 3
                            </span>
                          </div>
                          <button
                            onClick={handleRegenerate}
                            disabled={regenerationsRemaining <= 0}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                              regenerationsRemaining > 0
                                ? 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100 shadow-sm'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            }`}
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Regenerate</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Artisan Frame Switcher */}
                    {activeTab === 'frame' && (
                      <div className="rounded-2xl border border-neutral-200 bg-brand-linen/60 p-4 space-y-2.5 max-h-[300px] overflow-y-auto">
                        <span className="text-xs font-bold text-brand-dark block mb-1">
                          Select Frame Material & Profile
                        </span>
                        {FRAME_OPTIONS.map((frame) => {
                          const isSelected = frame.id === selectedFrameId;
                          return (
                            <div
                              key={frame.id}
                              onClick={() => setSelectedFrameId(frame.id)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-white border-brand-gold shadow-md ring-1 ring-brand-gold'
                                  : 'bg-white/70 border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className="h-5 w-5 rounded-full border border-black/20 flex-shrink-0"
                                  style={{ backgroundColor: frame.colorCode }}
                                />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="text-xs font-bold text-brand-dark">{frame.name}</h5>
                                    {frame.badge && (
                                      <span className="text-[9px] font-bold bg-brand-linen px-2 py-0.5 rounded-full text-brand-gold border border-brand-border">
                                        {frame.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-neutral-500 line-clamp-1">{frame.material}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-brand-dark">
                                  {frame.priceDelta === 0 ? 'Included' : `+$${frame.priceDelta}`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Tab 3: Custom Inscription & Matting */}
                    {activeTab === 'inscription' && (
                      <div className="rounded-2xl border border-neutral-200 bg-brand-linen/60 p-4 space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1">
                            Inscription Title (Family Name / Quote)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. The Cooper Family • Est. 2021"
                            value={inscriptionText}
                            onChange={(e) => setInscriptionText(e.target.value)}
                            maxLength={45}
                            className="w-full rounded-xl border border-neutral-300 p-2.5 text-xs bg-white focus:outline-none focus:border-brand-dark"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-neutral-600 mb-1">
                            Secondary Line (Date or Location)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Amalfi Coast, Italy"
                            value={inscriptionSubtitle}
                            onChange={(e) => setInscriptionSubtitle(e.target.value)}
                            maxLength={35}
                            className="w-full rounded-xl border border-neutral-300 p-2 text-xs bg-white focus:outline-none focus:border-brand-dark"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                              Font Style
                            </label>
                            <select
                              value={inscriptionFont}
                              onChange={(e) => setInscriptionFont(e.target.value as any)}
                              className="w-full rounded-lg border border-neutral-300 p-1.5 text-xs bg-white"
                            >
                              <option value="serif">Museum Classic Serif</option>
                              <option value="sans">Minimalist Sans</option>
                              <option value="script">Artisan Script / Italic</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                              Passe-Partout Matting
                            </label>
                            <select
                              value={mattingColor}
                              onChange={(e) => setMattingColor(e.target.value as any)}
                              className="w-full rounded-lg border border-neutral-300 p-1.5 text-xs bg-white"
                            >
                              <option value="none">No Matting (Full Bleed)</option>
                              <option value="white">Gallery Archival White</option>
                              <option value="cream">Museum Warm Cream</option>
                              <option value="charcoal">Modern Charcoal Gray</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Soundwave Audio Keepsake */}
                    {activeTab === 'audio' && (
                      <div className="rounded-2xl border border-neutral-200 bg-brand-linen/60 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-brand-gold" />
                            <div>
                              <h5 className="font-serif text-xs font-bold text-brand-dark">
                                Audio Keepsake & Voice Note QR
                              </h5>
                              <p className="text-[10px] text-neutral-500">
                                Attach wedding vows, baby laughter, or birthday audio.
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={hasAudioKeepsake}
                            onChange={(e) => setHasAudioKeepsake(e.target.checked)}
                            className="h-4 w-4 accent-brand-dark cursor-pointer"
                          />
                        </div>

                        {hasAudioKeepsake && (
                          <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                            <span className="text-[10px] uppercase font-bold text-brand-gold tracking-wider block">
                              Simulated Waveform Preview
                            </span>
                            <div className="flex items-center gap-1 h-8">
                              {[8, 14, 22, 28, 16, 24, 32, 18, 26, 12, 19, 27, 30, 20, 15, 23, 29, 17, 10].map(
                                (h, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 bg-brand-dark rounded-full animate-pulse"
                                    style={{
                                      height: `${h}px`,
                                      animationDelay: `${i * 0.05}s`,
                                    }}
                                  />
                                )
                              )}
                            </div>
                            <p className="text-[10px] text-neutral-500 italic">
                              Laser-etched metal QR plate affixed to the back of the artwork. Anyone can scan to play.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Price Summary & Primary CTA */}
                    {(() => {
                      const currentFrame =
                        FRAME_OPTIONS.find((f) => f.id === selectedFrameId) || FRAME_OPTIONS[0];
                      const totalUnit =
                        (currentProduct?.basePrice || activeProduct.basePrice) +
                        currentFrame.priceDelta;
                      const formattedTotal = formatCurrency(totalUnit, activeCurrency);

                      return (
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center justify-between text-xs font-bold text-brand-dark px-1">
                            <span>Total Configured Price:</span>
                            <span className="text-base text-brand-gold">
                              {formattedTotal.formatted}
                            </span>
                          </div>

                          <button
                            onClick={handleAddToCart}
                            className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-dark py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-all shadow-xl hover:scale-102 active:scale-98"
                          >
                            <Sparkles className="h-4 w-4 text-brand-gold animate-pulse" />
                            <span>Add Artwork to Cart & Save Vision</span>
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setCurrentStep(2)}
                              className="flex-1 rounded-full border border-neutral-300 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm"
                            >
                              Try Another Style
                            </button>
                            <button
                              onClick={() => setCurrentStep(1)}
                              className="flex-1 rounded-full border border-neutral-300 bg-white py-2.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm"
                            >
                              Change Photo
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
