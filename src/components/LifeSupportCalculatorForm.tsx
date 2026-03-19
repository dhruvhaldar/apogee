'use client';

import React, { useState, useMemo } from 'react';
import { calculateConsumables } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

// ⚡ Performance: Cache Intl.NumberFormat instances outside the component.
// Calling .toFixed() repeatedly can be optimized by reusing a formatter.
const consumablesFormatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

// Client Component to handle form state and calculations
// Isolated to prevent re-renders of the parent CalculatorCard
const LifeSupportCalculatorForm = () => {
  const [crew, setCrew] = useState<string>('3');
  const [days, setDays] = useState<string>('10');
  const [consumables, setConsumables] = useState<{ oxygen: number; water: number; food: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ⚡ Performance: Memoize formatted strings to prevent redundant Intl.NumberFormat.format() calls.
  // Although the formatter is cached globally, calling .format() is still moderately expensive.
  // This form re-renders on every keystroke in the input fields, which would otherwise trigger
  // 8 redundant format() calls for the same result.
  const formattedConsumables = useMemo(() => {
    if (!consumables) return null;
    return {
      oxygen: consumablesFormatter.format(consumables.oxygen),
      water: consumablesFormatter.format(consumables.water),
      food: consumablesFormatter.format(consumables.food),
      total: consumablesFormatter.format(consumables.total)
    };
  }, [consumables]);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const crewNum = parseInt(crew, 10);
      const daysNum = parseInt(days, 10);

      if (isNaN(crewNum) || isNaN(daysNum)) {
        throw new Error('Please enter valid numeric values');
      }

      const result = calculateConsumables(crewNum, daysNum);
      setConsumables(result);
    } catch (e) {
      logError(e, 'LifeSupportCalculator');
      setError(getErrorMessage(e));
      setConsumables(null);
    }
  };

  // ⚡ Performance: Refactored curried handleInputChange into specific handlers.
  // This prevents creating a new function closure on every single render cycle,
  // reducing garbage collection overhead and potential unnecessary re-renders of child components.
  const handleCrewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setCrew(val);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setDays(val);
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
        <label htmlFor="ls-crew" className="block text-sm mb-1 text-gray-300">
          Crew Size <span className="text-red-500" aria-hidden="true" title="Required">*</span>
        </label>
        <div className="relative">
          <input
            id="ls-crew"
            type="number"
            min="1"
            step="any"
            required
            value={crew}
            onChange={handleCrewChange}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-16 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Crew Size in people"
            aria-describedby="ls-crew-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-green-400 transition-colors">
            people
          </div>
          <p id="ls-crew-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-green-400 transition-colors">ISS Typical: 7</p>
        </div>
      </div>
      <div>
        <label htmlFor="ls-days" className="block text-sm mb-1 text-gray-300">
          Duration <span className="text-red-500" aria-hidden="true" title="Required">*</span>
        </label>
        <div className="relative">
          <input
            id="ls-days"
            type="number"
            min="1"
            step="any"
            required
            value={days}
            onChange={handleDaysChange}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-12 text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/40 focus:invalid:border-red-500 focus:invalid:ring-red-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Duration in days"
            aria-describedby="ls-days-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-green-400 transition-colors">
            days
          </div>
          <p id="ls-days-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-green-400 transition-colors">Short: ~7d, ISS: ~180d, Mars: ~500d</p>
        </div>
      </div>
      <button
        type="submit"
        className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-green-500"
      >
        <span>Calculate Needs</span>
        <kbd aria-hidden="true" className="hidden sm:inline-block font-sans font-normal text-[11px] bg-black/20 border border-white/20 rounded px-1.5 py-0.5 opacity-70 group-hover:opacity-100 transition-opacity">
          ↵ Enter
        </kbd>
      </button>

      {/* 🎨 UX/A11y: Persistent aria-live region so screen readers catch dynamic updates */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[140px] flex flex-col">
        {formattedConsumables ? (
          <div className="mt-4 p-4 bg-green-900/30 rounded border border-green-500/30 backdrop-blur-sm text-sm space-y-1 relative group">
            <p>Oxygen: <span className="text-green-300 font-bold">{formattedConsumables.oxygen}</span> kg</p>
            <p>Water: <span className="text-green-300 font-bold">{formattedConsumables.water}</span> kg</p>
            <p>Food: <span className="text-green-300 font-bold">{formattedConsumables.food}</span> kg</p>
            <div className="border-t border-green-500/30 pt-1 mt-1">
              <p className="font-bold">Total: <span className="text-green-300">{formattedConsumables.total}</span> kg</p>
            </div>
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:focus-within:opacity-100">
              <CopyButton
                textToCopy={`Oxygen: ${formattedConsumables.oxygen} kg\nWater: ${formattedConsumables.water} kg\nFood: ${formattedConsumables.food} kg\nTotal: ${formattedConsumables.total} kg`}
                label="Copy life support consumables"
                className="text-green-400 hover:text-green-200 focus:ring-green-400"
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

export default LifeSupportCalculatorForm;
