'use client';

import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculateDeltaV } from '../utils/spaceflight';

const RocketCalculator = () => {
  const [isp, setIsp] = useState<number>(300);
  const [m0, setM0] = useState<number>(1000);
  const [mf, setMf] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      if (m0 <= mf) {
        setError('Initial mass must be greater than final mass');
        return;
      }
      const dv = calculateDeltaV(isp, m0, mf);
      setResult(dv);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An error occurred during calculation');
      }
      setResult(null);
    }
  };

  return (
    <CalculatorCard title="Rocket Equation" description="Calculate Delta-V (velocity change) based on mass ratio and engine efficiency. Essential for determining if a vehicle can reach orbit.">
      <div className="space-y-3">
        {error && (
          <div role="alert" className="p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="rocket-isp" className="block text-sm mb-1 text-gray-300">Specific Impulse (Isp, s)</label>
          <input
            id="rocket-isp"
            type="number"
            min="0"
            value={isp}
            onChange={(e) => setIsp(parseFloat(e.target.value))}
            className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition"
            aria-label="Specific Impulse in seconds"
            aria-describedby="rocket-isp-hint"
          />
          <p id="rocket-isp-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-cyan-400 transition-colors">Solid: ~250s, Liquid: ~450s, Nuclear: ~900s</p>
        </div>
        <div>
          <label htmlFor="rocket-m0" className="block text-sm mb-1 text-gray-300">Initial Mass (m0, kg)</label>
          <input
            id="rocket-m0"
            type="number"
            min="0"
            value={m0}
            onChange={(e) => setM0(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition"
            aria-label="Initial Mass in kilograms"
          />
        </div>
        <div>
          <label htmlFor="rocket-mf" className="block text-sm mb-1 text-gray-300">Final Mass (mf, kg)</label>
          <input
            id="rocket-mf"
            type="number"
            min="0"
            value={mf}
            onChange={(e) => setMf(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition"
            aria-label="Final Mass in kilograms"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95"
        >
          Calculate Delta-V
        </button>
        {result !== null && (
          <div className="mt-4 p-4 bg-cyan-900/30 rounded border border-cyan-500/30 backdrop-blur-sm">
            <p className="text-center font-mono text-xl">
              ΔV = <span className="text-cyan-300 font-bold">{result.toFixed(2)}</span> m/s
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
};

export default RocketCalculator;
