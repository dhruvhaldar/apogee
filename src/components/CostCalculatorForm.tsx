'use client';

import React, { useState, useMemo } from 'react';
import { calculateMissionCost } from '../utils/spaceflight';
import { logError, getErrorMessage, ValidationError } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

// ⚡ Performance: Cache Intl.NumberFormat instance outside the component.
// Calling .toLocaleString() recreates this formatter internally on every call,
// which is a known performance bottleneck (~35x slower).
const currencyFormatter = new Intl.NumberFormat('en-US');

const CostCalculatorForm = () => {
  const [payload, setPayload] = useState<string>("1000");
  const [costPerKg, setCostPerKg] = useState<string>("2700");
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚡ Performance: Memoize formatted strings to prevent redundant Intl.NumberFormat.format() calls.
  // This form re-renders on every keystroke in the input fields, which would otherwise trigger
  // redundant format() calls for the same result.
  const formattedTotalCost = useMemo(() => {
    if (totalCost === null) return null;
    return currencyFormatter.format(totalCost);
  }, [totalCost]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const payloadNum = parseFloat(payload);
      const costNum = parseFloat(costPerKg);

      if (isNaN(payloadNum) || payloadNum < 0) {
        throw new ValidationError("Please enter a valid payload mass");
      }
      if (isNaN(costNum) || costNum < 0) {
        throw new ValidationError("Please enter a valid cost per kg");
      }

      const result = calculateMissionCost(payloadNum, costNum);
      setTotalCost(result);
    } catch (e) {
      logError(e, 'CostCalculatorForm');
      setError(getErrorMessage(e));
      setTotalCost(null);
    }
  };

  const handlePayloadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setPayload(val);
    }
  };

  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setCostPerKg(val);
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
        <label htmlFor="cost-payload" className="block text-sm mb-1 text-gray-300">
          Payload Mass <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="cost-payload"
            type="number"
            min="0"
            step="any"
            required
            value={payload}
            onChange={handlePayloadChange}
            onFocus={(e) => e.target.select()}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="cost-payload-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-yellow-400 transition-colors">
            kg
          </div>
          <p id="cost-payload-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-yellow-400 transition-colors">CubeSat: ~1kg, Starlink: ~260kg, ISS Module: ~15,000kg</p>
        </div>
      </div>
      <div>
        <label htmlFor="cost-rate" className="block text-sm mb-1 text-gray-300">
          Cost per kg <span className="group relative inline-block cursor-help" aria-hidden="true"><span className="text-red-500">*</span><span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 border border-white/10">Required</span></span>
        </label>
        <div className="relative">
          <input
            id="cost-rate"
            type="number"
            min="0"
            step="any"
            required
            value={costPerKg}
            onChange={handleCostChange}
            onFocus={(e) => e.target.select()}
            className="peer w-full bg-black/50 border border-white/20 rounded py-2 pr-2 pl-7 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-describedby="cost-rate-hint"
          />
          <div className="absolute top-2.5 left-0 pl-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-yellow-400 transition-colors">
            $
          </div>
          <p id="cost-rate-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-yellow-400 transition-colors">e.g., Falcon 9: ~2700, SLS: ~50000+</p>
        </div>
      </div>
      <button
        type="submit"
        className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-yellow-500"
      >
        <span>Calculate Cost</span>
        <kbd aria-hidden="true" className="hidden sm:inline-block font-sans font-normal text-[11px] bg-black/20 border border-white/20 rounded px-1.5 py-0.5 opacity-70 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          ↵ Enter
        </kbd>
      </button>

      {/* 🎨 UX/A11y: Persistent aria-live region so screen readers catch dynamic updates */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[80px] flex flex-col">
        {formattedTotalCost !== null ? (
          <div className="mt-4 p-4 bg-yellow-900/30 rounded border border-yellow-500/30 backdrop-blur-sm relative group">
            <p className="text-center font-mono text-xl">
              <span className="text-yellow-300 font-bold">${formattedTotalCost}</span>
            </p>
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:focus-within:opacity-100">
              <CopyButton
                textToCopy={`$${formattedTotalCost}`}
                label="Copy mission cost"
                className="!text-yellow-400 hover:!text-yellow-200 focus-visible:!ring-yellow-400"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-grow rounded border border-dashed border-white/10 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-50">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Ready to calculate
          </div>
        )}
      </div>
    </form>
  );
};

export default CostCalculatorForm;
