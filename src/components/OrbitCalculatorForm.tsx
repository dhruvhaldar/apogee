'use client';

import React, { useState, useMemo } from 'react';
import { calculateOrbitalStats } from '../utils/spaceflight';
import { logError, getErrorMessage, ValidationError } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

// ⚡ Performance: Cache Intl.NumberFormat instances outside the component.
// Calling .toFixed() repeatedly can be optimized by reusing a formatter.
const velocityFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const periodFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const OrbitCalculatorForm = () => {
  // Use string state to allow proper decimal input handling and strict validation
  const [altitude, setAltitude] = useState<string>("400");
  const [velocity, setVelocity] = useState<number | null>(null);
  const [period, setPeriod] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚡ Performance: Memoize formatted strings to prevent redundant Intl.NumberFormat.format() calls.
  // This form re-renders on every keystroke in the input fields, which would otherwise trigger
  // redundant format() calls for the same result.
  const formattedStats = useMemo(() => {
    if (velocity === null || period === null) return null;
    return {
      velocity: velocityFormatter.format(velocity),
      period: periodFormatter.format(period)
    };
  }, [velocity, period]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const altNum = parseFloat(altitude);
      if (isNaN(altNum)) {
        throw new ValidationError("Please enter a valid altitude");
      }
      // Optimization: Calculate both values in one pass to avoid redundant sqrt() and radius calculations
      const { velocity: v, period: p } = calculateOrbitalStats(altNum);
      setVelocity(v);
      setPeriod(p);
    } catch (e) {
      logError(e, 'OrbitCalculatorForm');
      setError(getErrorMessage(e));
      setVelocity(null);
      setPeriod(null);
    }
  };

  // ⚡ Performance: Refactored generic input handler to a specific handler.
  // This helps maintain consistency across the codebase and prevents potential dynamic closures.
  const handleAltitudeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Validate length and pattern (prevent DoS and invalid chars)
    if (validateNumericInput(val)) {
      setAltitude(val);
      setVelocity(null);
      setPeriod(null);
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
        <label htmlFor="orbit-altitude" className="block text-sm mb-1 text-gray-300">
          Altitude <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="orbit-altitude"
            type="number"
            min="0"
            step="any"
            required
            value={altitude}
            onChange={handleAltitudeChange}
            onFocus={(e) => e.target.select()}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="orbit-altitude-hint"
          />
          <div aria-hidden="true" className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-purple-400 transition-colors">
            km
          </div>
          <p id="orbit-altitude-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-purple-400 transition-colors">LEO: ~400km, GPS: ~20200km, GEO: 35786km</p>
        </div>
      </div>
      <button
        type="submit"
        className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-purple-500"
      >
        <span>Calculate Orbit</span>
        <kbd aria-hidden="true" className="hidden sm:inline-block font-sans font-normal text-[11px] bg-black/20 border border-white/20 rounded px-1.5 py-0.5 opacity-70 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          ↵ Enter
        </kbd>
      </button>

      {/* 🎨 UX/A11y: Persistent aria-live region so screen readers catch dynamic updates */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[100px] flex flex-col">
        {formattedStats !== null ? (
          <div className="mt-4 p-4 bg-purple-900/30 rounded border border-purple-500/30 backdrop-blur-sm space-y-2 relative group">
            <p className="font-mono text-lg">
              Velocity: <span className="text-purple-300 font-bold">{formattedStats.velocity}</span> km/s
            </p>
            <p className="font-mono text-lg">
              Period: <span className="text-purple-300 font-bold">{formattedStats.period}</span> min
            </p>
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:focus-within:opacity-100">
              <CopyButton
                textToCopy={`Velocity: ${formattedStats.velocity} km/s, Period: ${formattedStats.period} min`}
                label="Copy orbital parameters"
                className="!text-purple-400 hover:!text-purple-200 focus-visible:!ring-purple-400"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-grow rounded border border-dashed border-white/10 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-50">
              <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
              <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"></path>
              <path d="M22 12A10 10 0 0 0 12 2v2a8 8 0 0 1 8 8h2z"></path>
            </svg>
            Ready to calculate
          </div>
        )}
      </div>
    </form>
  );
};

export default OrbitCalculatorForm;
