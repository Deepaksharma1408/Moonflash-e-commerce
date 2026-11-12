'use client';

import React, { useEffect } from 'react';
import { X, RefreshCw, Terminal, Sliders, DollarSign, Eye, EyeOff } from 'lucide-react';
import { useDevStore, useUIStore } from '@/store';
import { CURRENCIES } from '@/data/mockData';
import { CurrencyCode } from '@/types';

export const DevPanel: React.FC = () => {
  const isDevPanelOpen = useDevStore((s) => s.isDevPanelOpen);
  const toggleDevPanel = useDevStore((s) => s.toggleDevPanel);
  const forceMyVisions = useDevStore((s) => s.forceMyVisions);
  const setForceMyVisions = useDevStore((s) => s.setForceMyVisions);
  const souvenirsLayout = useDevStore((s) => s.souvenirsLayout);
  const setSouvenirsLayout = useDevStore((s) => s.setSouvenirsLayout);
  const simulateGenerationFailure = useDevStore((s) => s.simulateGenerationFailure);
  const setSimulateGenerationFailure = useDevStore((s) => s.setSimulateGenerationFailure);
  const activeCurrency = useDevStore((s) => s.activeCurrency);
  const setActiveCurrency = useDevStore((s) => s.setActiveCurrency);
  const resetAllData = useDevStore((s) => s.resetAllData);
  const addToast = useUIStore((s) => s.addToast);

  // Global hotkey listener: Ctrl + Shift + D (or Cmd + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleDevPanel();
        addToast('Developer Control Panel toggled via shortcut', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDevPanel, addToast]);

  if (!isDevPanelOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] w-88 max-w-sm rounded-2xl bg-neutral-900 text-white p-5 shadow-2xl border border-neutral-700 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-brand-gold" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-200">
            Developer Controls
          </h4>
        </div>
        <button
          onClick={toggleDevPanel}
          className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* Toggle 1: Force My Visions Visibility */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-neutral-400" />
            Homepage Section 2 (Visions):
          </span>
          <div className="flex rounded-lg border border-neutral-700 overflow-hidden text-[10px]">
            <button
              onClick={() => setForceMyVisions(null)}
              className={`px-2 py-1 ${forceMyVisions === null ? 'bg-brand-gold text-white font-bold' : 'bg-neutral-800 text-neutral-400'}`}
            >
              Auto
            </button>
            <button
              onClick={() => setForceMyVisions(true)}
              className={`px-2 py-1 ${forceMyVisions === true ? 'bg-brand-gold text-white font-bold' : 'bg-neutral-800 text-neutral-400'}`}
            >
              Show
            </button>
            <button
              onClick={() => setForceMyVisions(false)}
              className={`px-2 py-1 ${forceMyVisions === false ? 'bg-brand-gold text-white font-bold' : 'bg-neutral-800 text-neutral-400'}`}
            >
              Hide
            </button>
          </div>
        </div>

        {/* Toggle 2: Souvenirs Layout (3-up vs 2-up) */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
            <Sliders className="h-3.5 w-3.5 text-neutral-400" />
            Section 6 (Souvenirs):
          </span>
          <div className="flex rounded-lg border border-neutral-700 overflow-hidden text-[10px]">
            <button
              onClick={() => setSouvenirsLayout('3-up')}
              className={`px-3 py-1 font-bold ${souvenirsLayout === '3-up' ? 'bg-brand-gold text-white' : 'bg-neutral-800 text-neutral-400'}`}
            >
              3-up
            </button>
            <button
              onClick={() => setSouvenirsLayout('2-up')}
              className={`px-3 py-1 font-bold ${souvenirsLayout === '2-up' ? 'bg-brand-gold text-white' : 'bg-neutral-800 text-neutral-400'}`}
            >
              2-up
            </button>
          </div>
        </div>

        {/* Toggle 3: Simulate Generation Failure */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-300 font-medium">Simulate Gen Failure:</span>
          <button
            onClick={() => setSimulateGenerationFailure(!simulateGenerationFailure)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${
              simulateGenerationFailure
                ? 'bg-red-600 text-white'
                : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
            }`}
          >
            {simulateGenerationFailure ? 'ENABLED (Fails)' : 'DISABLED (Succeeds)'}
          </button>
        </div>

        {/* Toggle 4: Currency Override */}
        <div className="flex items-center justify-between">
          <span className="text-neutral-300 font-medium flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
            Active Currency:
          </span>
          <select
            value={activeCurrency}
            onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
            className="rounded-lg border border-neutral-700 bg-neutral-800 p-1 text-[11px] font-semibold text-white"
          >
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
              <option key={c} value={c}>
                {c} ({CURRENCIES[c].symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Action: Reset All LocalStorage */}
        <div className="pt-2 border-t border-neutral-800">
          <button
            onClick={resetAllData}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-950/60 border border-red-800/80 py-2 text-xs font-bold text-red-200 hover:bg-red-900 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Prototype Data & Reload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

