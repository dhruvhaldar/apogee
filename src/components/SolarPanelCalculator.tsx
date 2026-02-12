'use client';

import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculateSolarPanelArea } from '../utils/spaceflight';

const SolarPanelCalculator = () => {
  const [power, setPower] = useState<number>(10000);
  const [efficiency, setEfficiency] = useState<number>(0.25);
  const [area, setArea] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      const result = calculateSolarPanelArea(power, efficiency);
      setArea(result);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An error occurred during calculation');
      }
      setArea(null);
    }
  };

  return (
    <CalculatorCard title="Power Systems" description="Determine solar panel area based on power requirements and efficiency. Crucial for space stations.">
      <div className="space-y-3">
        {error && (
          <div role="alert" className="p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="solar-power" className="block text-sm mb-1 text-gray-300">Required Power (Watts)</label>
          <input
            id="solar-power"
            type="number"
            value={power}
            onChange={(e) => setPower(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-red-500 transition"
          />
        </div>
        <div>
          <label htmlFor="solar-efficiency" className="block text-sm mb-1 text-gray-300">Efficiency (0.0 - 1.0)</label>
          <input
            id="solar-efficiency"
            type="number"
            step="0.01"
            value={efficiency}
            onChange={(e) => setEfficiency(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-red-500 transition"
          />
          <p className="text-xs text-gray-400 mt-1">Typical: 0.2 - 0.3</p>
        </div>
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95"
        >
          Calculate Area
        </button>
        {area !== null && (
          <div className="mt-4 p-4 bg-red-900/30 rounded border border-red-500/30 backdrop-blur-sm">
            <p className="text-center font-mono text-xl">
              <span className="text-red-300 font-bold">{area.toFixed(2)}</span> m²
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
};

export default SolarPanelCalculator;
