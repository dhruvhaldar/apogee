'use client';

import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculateOrbitalVelocity, calculateOrbitalPeriod } from '../utils/spaceflight';

const OrbitContent = () => {
  const [altitude, setAltitude] = useState<number>(400);
  const [velocity, setVelocity] = useState<number | null>(null);
  const [period, setPeriod] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      const v = calculateOrbitalVelocity(altitude);
      const p = calculateOrbitalPeriod(altitude);
      setVelocity(v);
      setPeriod(p);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An error occurred during calculation');
      }
      setVelocity(null);
      setPeriod(null);
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
          value={altitude}
          onChange={(e) => setAltitude(parseFloat(e.target.value))}
          className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-purple-500 transition"
        />
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

const OrbitCalculator = () => {
  return (
    <CalculatorCard title="Orbital Mechanics" description="Determine orbital velocity and period for a given altitude (e.g., LEO, GEO). Key for mission planning.">
      <OrbitContent />
    </CalculatorCard>
  );
};

export default OrbitCalculator;
