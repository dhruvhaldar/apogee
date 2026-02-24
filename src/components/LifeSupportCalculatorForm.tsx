'use client';

import React, { useState } from 'react';
import { calculateConsumables } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

// Client Component to handle form state and calculations
// Isolated to prevent re-renders of the parent CalculatorCard
const LifeSupportCalculatorForm = () => {
  const [crew, setCrew] = useState<string>('3');
  const [days, setDays] = useState<string>('10');
  const [consumables, setConsumables] = useState<{ oxygen: number; water: number; food: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const crewNum = parseInt(crew);
      const daysNum = parseInt(days);

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
        <label htmlFor="ls-crew" className="block text-sm mb-1 text-gray-300">Crew Size</label>
        <input
          id="ls-crew"
          type="number"
          min="1"
          value={crew}
          onChange={handleInputChange(setCrew)}
          className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-green-500 transition"
          aria-describedby="ls-crew-hint"
        />
        <p id="ls-crew-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-green-400 transition-colors">ISS Typical: 7</p>
      </div>
      <div>
        <label htmlFor="ls-days" className="block text-sm mb-1 text-gray-300">Duration (days)</label>
        <input
          id="ls-days"
          type="number"
          min="1"
          value={days}
          onChange={handleInputChange(setDays)}
          className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-green-500 transition"
          aria-describedby="ls-days-hint"
        />
        <p id="ls-days-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-green-400 transition-colors">Short: ~7d, ISS: ~180d, Mars: ~500d</p>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95"
      >
        Calculate Needs
      </button>
      {consumables && (
        <div aria-live="polite" aria-atomic="true" className="mt-4 p-4 bg-green-900/30 rounded border border-green-500/30 backdrop-blur-sm text-sm space-y-1 relative group">
          <p>Oxygen: <span className="text-green-300 font-bold">{consumables.oxygen.toFixed(1)}</span> kg</p>
          <p>Water: <span className="text-green-300 font-bold">{consumables.water.toFixed(1)}</span> kg</p>
          <p>Food: <span className="text-green-300 font-bold">{consumables.food.toFixed(1)}</span> kg</p>
          <div className="border-t border-green-500/30 pt-1 mt-1">
            <p className="font-bold">Total: <span className="text-green-300">{consumables.total.toFixed(1)}</span> kg</p>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <CopyButton
              textToCopy={`Oxygen: ${consumables.oxygen.toFixed(1)} kg\nWater: ${consumables.water.toFixed(1)} kg\nFood: ${consumables.food.toFixed(1)} kg\nTotal: ${consumables.total.toFixed(1)} kg`}
              label="Copy life support consumables"
              className="text-green-400 hover:text-green-200 focus:ring-green-400"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default LifeSupportCalculatorForm;
