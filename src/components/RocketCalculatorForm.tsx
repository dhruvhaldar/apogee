'use client';

import React, { useState } from 'react';
import { calculateDeltaV } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

const RocketCalculatorForm = () => {
  const [isp, setIsp] = useState<string>('300');
  const [m0, setM0] = useState<string>('1000');
  const [mf, setMf] = useState<string>('100');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (validateNumericInput(val)) {
      setter(val);
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
        <label htmlFor="rocket-isp" className="block text-sm mb-1 text-gray-300">Specific Impulse (Isp)</label>
        <div className="relative">
          <input
            id="rocket-isp"
            type="number"
            min="0"
            step="any"
            value={isp}
            onChange={handleInputChange(setIsp)}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-8 text-white focus:outline-none focus:border-cyan-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        <label htmlFor="rocket-m0" className="block text-sm mb-1 text-gray-300">Initial Mass (m0)</label>
        <div className="relative">
          <input
            id="rocket-m0"
            type="number"
            min="0"
            step="any"
            value={m0}
            onChange={handleInputChange(setM0)}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-cyan-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        <label htmlFor="rocket-mf" className="block text-sm mb-1 text-gray-300">Final Mass (mf)</label>
        <div className="relative">
          <input
            id="rocket-mf"
            type="number"
            min="0"
            step="any"
            value={mf}
            onChange={handleInputChange(setMf)}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-cyan-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
      {result !== null && (
        <div aria-live="polite" aria-atomic="true" className="mt-4 p-4 bg-cyan-900/30 rounded border border-cyan-500/30 backdrop-blur-sm relative group">
          <p className="text-center font-mono text-xl">
            ΔV = <span className="text-cyan-300 font-bold">{result.toFixed(2)}</span> m/s
          </p>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <CopyButton
              textToCopy={`${result.toFixed(2)} m/s`}
              label="Copy Delta-V result"
              className="text-cyan-400 hover:text-cyan-200 focus:ring-cyan-400"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default RocketCalculatorForm;
