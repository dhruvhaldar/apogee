'use client';

import React, { useState, useMemo } from 'react';
import { calculateMissionCost } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
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
        throw new Error("Please enter a valid payload mass");
      }
      if (isNaN(costNum) || costNum < 0) {
        throw new Error("Please enter a valid cost per kg");
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
        <div role="alert" className="p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="cost-payload" className="block text-sm mb-1 text-gray-300">
          Payload Mass <span className="text-red-500" aria-hidden="true" title="Required">*</span>
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
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Payload Mass in kilograms"
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
          Cost per kg <span className="text-red-500" aria-hidden="true" title="Required">*</span>
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
            className="peer w-full bg-black/50 border border-white/20 rounded py-2 pr-2 pl-7 text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Cost per kg in USD"
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
        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-yellow-500"
      >
        Calculate Cost
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
                className="text-yellow-400 hover:text-yellow-200 focus:ring-yellow-400"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-grow rounded border border-dashed border-white/10 flex items-center justify-center text-gray-400 text-sm">
            Ready to calculate
          </div>
        )}
      </div>
    </form>
  );
};

export default CostCalculatorForm;
