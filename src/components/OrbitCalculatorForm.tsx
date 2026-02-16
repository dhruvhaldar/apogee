'use client';

import React, { useState } from 'react';
import { calculateOrbitalVelocity, calculateOrbitalPeriod } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';

const OrbitCalculatorForm = () => {
  // Use string state to allow proper decimal input handling and strict validation
  const [altitude, setAltitude] = useState<string>("400");
  const [velocity, setVelocity] = useState<number | null>(null);
  const [period, setPeriod] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      const altNum = parseFloat(altitude);
      if (isNaN(altNum)) {
        throw new Error("Please enter a valid altitude");
      }
      const v = calculateOrbitalVelocity(altNum);
      const p = calculateOrbitalPeriod(altNum);
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
    <div className="space-y-3">
      {error && (
        <div role="alert" className="p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="orbit-altitude" className="block text-sm mb-1 text-gray-300">Altitude (km)</label>
        <input
          id="orbit-altitude"
          type="number"
          min="0"
          value={altitude}
          onChange={handleInputChange}
          className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-purple-500 transition"
          aria-describedby="orbit-altitude-hint"
        />
        <p id="orbit-altitude-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-purple-400 transition-colors">LEO: ~400km, GPS: ~20200km, GEO: 35786km</p>
      </div>
      <button
        onClick={handleCalculate}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95"
      >
        Calculate Orbit
      </button>
      {velocity !== null && period !== null && (
        <div className="mt-4 p-4 bg-purple-900/30 rounded border border-purple-500/30 backdrop-blur-sm space-y-2">
          <p className="font-mono text-lg">
            Velocity: <span className="text-purple-300 font-bold">{velocity.toFixed(3)}</span> km/s
          </p>
          <p className="font-mono text-lg">
            Period: <span className="text-purple-300 font-bold">{period.toFixed(1)}</span> min
          </p>
        </div>
      )}
    </div>
  );
};

export default OrbitCalculatorForm;
