'use client';

import React, { useState } from 'react';
import { calculateOrbitalStats } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';
import CopyButton from './CopyButton';

const OrbitCalculatorForm = () => {
  // Use string state to allow proper decimal input handling and strict validation
  const [altitude, setAltitude] = useState<string>("400");
  const [velocity, setVelocity] = useState<number | null>(null);
  const [period, setPeriod] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const altNum = parseFloat(altitude);
      if (isNaN(altNum)) {
        throw new Error("Please enter a valid altitude");
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Validate length and pattern (prevent DoS and invalid chars)
    if (validateNumericInput(val)) {
      setAltitude(val);
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
        <label htmlFor="orbit-altitude" className="block text-sm mb-1 text-gray-300">Altitude</label>
        <div className="relative">
          <input
            id="orbit-altitude"
            type="number"
            min="0"
            step="any"
            value={altitude}
            onChange={handleInputChange}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 pr-10 text-white focus:outline-none focus:border-purple-500 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="Altitude in kilometers"
            aria-describedby="orbit-altitude-hint"
          />
          <div className="absolute top-2.5 right-0 pr-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-purple-400 transition-colors">
            km
          </div>
          <p id="orbit-altitude-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-purple-400 transition-colors">LEO: ~400km, GPS: ~20200km, GEO: 35786km</p>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-purple-500"
      >
        Calculate Orbit
      </button>
      {velocity !== null && period !== null && (
        <div aria-live="polite" aria-atomic="true" className="mt-4 p-4 bg-purple-900/30 rounded border border-purple-500/30 backdrop-blur-sm space-y-2 relative group">
          <p className="font-mono text-lg">
            Velocity: <span className="text-purple-300 font-bold">{velocity.toFixed(3)}</span> km/s
          </p>
          <p className="font-mono text-lg">
            Period: <span className="text-purple-300 font-bold">{period.toFixed(1)}</span> min
          </p>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
            <CopyButton
              textToCopy={`Velocity: ${velocity.toFixed(3)} km/s, Period: ${period.toFixed(1)} min`}
              label="Copy orbital parameters"
              className="text-purple-400 hover:text-purple-200 focus:ring-purple-400"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default OrbitCalculatorForm;
