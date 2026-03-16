'use client';

import React, { useState, useMemo } from 'react';
import { calculateDeltaV } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
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
        throw new Error('Please enter valid numeric values');
      }

      if (m0Num <= mfNum) {
        setError('Initial mass must be greater than final mass');
        return;
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
    }
  };

  const handleM0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setM0(val);
    }
  };

  const handleMfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setMf(val);
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
        <label htmlFor="rocket-isp" className="block text-sm mb-1 text-gray-300">
          Specific Impulse (Isp) <span className="text-red-500" aria-hidden="true" title="Required">*</span>
        </label>
        <div className="relative">
          <input
            id="rocket-isp"
            type="number"
            min="0"
            step="any"
            required
            value={isp}
            onChange={handleIspChange}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-8 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Specific Impulse in seconds"
            aria-describedby="rocket-isp-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-cyan-400 transition-colors">
            s
          </div>
          <p id="rocket-isp-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">Solid: ~250s, Liquid: ~450s, Nuclear: ~900s</p>
        </div>
      </div>
      <div>
        <label htmlFor="rocket-m0" className="block text-sm mb-1 text-gray-300">
          Initial Mass (m0) <span className="text-red-500" aria-hidden="true" title="Required">*</span>
        </label>
        <div className="relative">
          <input
            id="rocket-m0"
            type="number"
            min="0"
            step="any"
            required
            value={m0}
            onChange={handleM0Change}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Initial Mass in kilograms"
            aria-describedby="rocket-m0-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-cyan-400 transition-colors">
            kg
          </div>
          <p id="rocket-m0-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">e.g., Falcon 9: ~549,000kg, Saturn V: ~2,970,000kg</p>
        </div>
      </div>
      <div>
        <label htmlFor="rocket-mf" className="block text-sm mb-1 text-gray-300">
          Final Mass (mf) <span className="text-red-500" aria-hidden="true" title="Required">*</span>
        </label>
        <div className="relative">
          <input
            id="rocket-mf"
            type="number"
            min="0"
            step="any"
            required
            value={mf}
            onChange={handleMfChange}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/40 hover:border-white/40 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Final Mass in kilograms"
            aria-describedby="rocket-mf-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-cyan-400 transition-colors">
            kg
          </div>
          <p id="rocket-mf-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">Dry mass + payload (e.g., ~25,000kg)</p>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-cyan-500"
      >
        Calculate Delta-V
      </button>

      {/* 🎨 UX/A11y: Persistent aria-live region so screen readers catch dynamic updates */}
      <div aria-live="polite" aria-atomic="true" className="min-h-[80px] flex flex-col">
        {formattedResult !== null ? (
          <div className="mt-4 p-4 bg-cyan-900/30 rounded border border-cyan-500/30 backdrop-blur-sm relative group">
            <p className="text-center font-mono text-xl">
              ΔV = <span className="text-cyan-300 font-bold">{formattedResult}</span> m/s
            </p>
            <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity focus-within:opacity-100 sm:focus-within:opacity-100">
              <CopyButton
                textToCopy={`${formattedResult} m/s`}
                label="Copy Delta-V result"
                className="text-cyan-400 hover:text-cyan-200 focus:ring-cyan-400"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 flex-grow rounded border border-dashed border-white/10 flex items-center justify-center text-gray-500 text-sm">
            Ready to calculate
          </div>
        )}
      </div>
    </form>
  );
};

export default RocketCalculatorForm;
