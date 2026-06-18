'use client';

import React, { useState, useMemo } from 'react';
import { calculateDeltaV } from '../utils/spaceflight';
import { logError, getErrorMessage, ValidationError } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

// ⚡ Performance: Cache Intl.NumberFormat instances outside the component.
// Calling .toFixed() repeatedly can be optimized by reusing a formatter.
const deltaVFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const RocketCalculatorForm = () => {
  const [isp, setIsp] = useState<string>('300');
  const [m0, setM0] = useState<string>('1000');
  const [mf, setMf] = useState<string>('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚡ Performance: Memoize formatted strings to prevent redundant Intl.NumberFormat.format() calls.
  // This form re-renders on every keystroke in the input fields, which would otherwise trigger
  // redundant format() calls for the same result.
  const formattedResult = useMemo(() => {
    if (result === null) return null;
    return deltaVFormatter.format(result);
  }, [result]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const ispNum = parseFloat(isp);
      const m0Num = parseFloat(m0);
      const mfNum = parseFloat(mf);

      if (isNaN(ispNum) || isNaN(m0Num) || isNaN(mfNum)) {
        throw new ValidationError('Please enter valid numeric values');
      }

      if (m0Num <= mfNum) {
        throw new ValidationError('Initial mass must be greater than final mass');
      }
      const dv = calculateDeltaV(ispNum, m0Num, mfNum);
      setResult(dv);
    } catch (e) {
      logError(e, 'RocketCalculatorForm');
      setError(getErrorMessage(e));
      setResult(null);
    }
  };

  // ⚡ Performance: Refactored curried handleInputChange into specific handlers.
  // This prevents creating a new function closure on every single render cycle,
  // reducing garbage collection overhead and potential unnecessary re-renders of child components.
  const handleIspChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setIsp(val);
      setResult(null);
      setError(null);
    }
  };

  const handleM0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setM0(val);
      setResult(null);
      setError(null);
    }
  };

  const handleMfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setMf(val);
      setResult(null);
      setError(null);
    }
  };

  return (
    <form onSubmit={handleCalculate} autoComplete="off" className="space-y-3 group/form">
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
      <div className="group/field">
        <label htmlFor="rocket-isp" className="block text-sm mb-1 text-gray-300 group-focus-within/field:text-cyan-400 transition-colors">
          Specific Impulse (Isp) <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="rocket-isp"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            required
            value={isp}
            onChange={handleIspChange}
            onFocus={(e) => e.target.select()}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-8 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="rocket-isp-hint"
          />
          <div aria-hidden="true" className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-cyan-400 transition-colors">
            s
          </div>
          <p id="rocket-isp-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">Solid: ~250s, Liquid: ~450s, Nuclear: ~900s</p>
        </div>
      </div>
      <div className="group/field">
        <label htmlFor="rocket-m0" className="block text-sm mb-1 text-gray-300 group-focus-within/field:text-cyan-400 transition-colors">
          Initial Mass (m0) <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="rocket-m0"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            required
            value={m0}
            onChange={handleM0Change}
            onFocus={(e) => e.target.select()}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="rocket-m0-hint"
          />
          <div aria-hidden="true" className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-cyan-400 transition-colors">
            kg
          </div>
          <p id="rocket-m0-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">e.g., Falcon 9: ~549,000kg, Saturn V: ~2,970,000kg</p>
        </div>
      </div>
      <div className="group/field">
        <label htmlFor="rocket-mf" className="block text-sm mb-1 text-gray-300 group-focus-within/field:text-cyan-400 transition-colors">
          Final Mass (mf) <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="rocket-mf"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            required
            value={mf}
            onChange={handleMfChange}
            onFocus={(e) => e.target.select()}
            onWheel={(e) => (e.target as HTMLInputElement).blur()}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="rocket-mf-hint"
          />
          <div aria-hidden="true" className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-cyan-400 transition-colors">
            kg
          </div>
          <p id="rocket-mf-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">Dry mass + payload (e.g., ~25,000kg)</p>
        </div>
      </div>
      <button
        type="submit"
        className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-cyan-500"
      >
        <span>Calculate Delta-V</span>
        <kbd aria-hidden="true" className="hidden sm:inline-block font-sans font-normal text-[11px] bg-black/20 border border-white/20 rounded px-1.5 py-0.5 opacity-70 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          ↵ Enter
        </kbd>
      </button>

      {/* 🎨 UX/A11y: Persistent aria-live region so screen readers catch dynamic updates */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[80px] flex flex-col">
        {formattedResult !== null ? (
          <div className="mt-4 p-4 bg-cyan-900/30 rounded border border-cyan-500/30 backdrop-blur-sm relative group">
            <p className="text-center font-mono text-xl">
              ΔV = <span className="text-cyan-300 font-bold select-all">{formattedResult}</span> m/s
            </p>
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:focus-within:opacity-100">
              <CopyButton
                textToCopy={`${formattedResult} m/s`}
                label="Copy Delta-V result"
                className="!text-cyan-400 hover:!text-cyan-200 focus-visible:!ring-cyan-400"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-grow rounded border border-dashed border-white/10 group-focus-within/form:border-cyan-500/30 flex items-center justify-center gap-2 text-gray-400 group-focus-within/form:text-cyan-400 transition-colors duration-300 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-50 group-focus-within/form:opacity-80 transition-opacity duration-300">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
            </svg>
            Ready to calculate
          </div>
        )}
      </div>
    </form>
  );
};

export default RocketCalculatorForm;
