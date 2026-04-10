'use client';

import React, { useState, useMemo } from 'react';
import { calculateSolarPanelArea } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

// ⚡ Performance: Cache Intl.NumberFormat instances outside the component.
// Calling .toFixed() repeatedly can be optimized by reusing a formatter.
const areaFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SolarPanelCalculatorForm = () => {
  const [power, setPower] = useState<string>("10000");
  const [efficiency, setEfficiency] = useState<string>("0.25");
  const [area, setArea] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚡ Performance: Memoize formatted strings to prevent redundant Intl.NumberFormat.format() calls.
  // This form re-renders on every keystroke in the input fields, which would otherwise trigger
  // redundant format() calls for the same result.
  const formattedArea = useMemo(() => {
    if (area === null) return null;
    return areaFormatter.format(area);
  }, [area]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const powerNum = parseFloat(power);
      const efficiencyNum = parseFloat(efficiency);

      if (isNaN(powerNum) || isNaN(efficiencyNum)) {
        throw new Error('Please enter valid numeric values');
      }

      const result = calculateSolarPanelArea(powerNum, efficiencyNum);
      setArea(result);
    } catch (e) {
      logError(e, 'SolarPanelCalculator');
      setError(getErrorMessage(e));
      setArea(null);
    }
  };

  // ⚡ Performance: Refactored curried handleInputChange into specific handlers.
  // This prevents creating a new function closure on every single render cycle,
  // reducing garbage collection overhead and potential unnecessary re-renders of child components.
  const handlePowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setPower(val);
    }
  };

  const handleEfficiencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setEfficiency(val);
    }
  };

  return (
    <form onSubmit={handleCalculate} className="space-y-3">
      {error && (
        <div role="alert" className="p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm flex items-start gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="flex-shrink-0 mt-0.5 text-red-400">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="solar-power" className="block text-sm mb-1 text-gray-300">
          Required Power <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="solar-power"
            type="number"
            min="0"
            step="any"
            required
            value={power}
            onChange={handlePowerChange}
            onFocus={(e) => e.target.select()}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="solar-power-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-red-400 transition-colors">
            W
          </div>
          <p id="solar-power-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-red-400 transition-colors">CubeSat: ~1-10W, GPS: ~1000W, ISS: ~100,000W</p>
        </div>
      </div>
      <div>
        <label htmlFor="solar-efficiency" className="block text-sm mb-1 text-gray-300">
          Efficiency (0.0 - 1.0) <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <input
          id="solar-efficiency"
          type="number"
          min="0"
          max="1"
          step="any"
          required
          value={efficiency}
          onChange={handleEfficiencyChange}
          onFocus={(e) => e.target.select()}
          className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          aria-describedby="solar-efficiency-hint"
        />
        <p id="solar-efficiency-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-red-400 transition-colors">Typical: 0.2 - 0.3</p>
      </div>
      <button
        type="submit"
        className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-red-500"
      >
        <span>Calculate Area</span>
        <kbd aria-hidden="true" className="hidden sm:inline-block font-sans font-normal text-[11px] bg-black/20 border border-white/20 rounded px-1.5 py-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
          ↵ Enter
        </kbd>
      </button>

      {/* 🎨 UX/A11y: Persistent aria-live region so screen readers catch dynamic updates */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[80px] flex flex-col">
        {formattedArea !== null ? (
          <div className="mt-4 p-4 bg-red-900/30 rounded border border-red-500/30 backdrop-blur-sm relative group">
            <p className="text-center font-mono text-xl">
              <span className="text-red-300 font-bold">{formattedArea}</span> m²
            </p>
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:focus-within:opacity-100">
              <CopyButton
                textToCopy={`${formattedArea} m²`}
                label="Copy solar panel area"
                className="!text-red-400 hover:!text-red-200 focus-visible:!ring-red-400"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-grow rounded border border-dashed border-white/10 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-50">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
            Ready to calculate
          </div>
        )}
      </div>
    </form>
  );
};

export default SolarPanelCalculatorForm;
