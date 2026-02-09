'use client';

import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculateDeltaV } from '../utils/spaceflight';

const RocketCalculator = () => {
  const [isp, setIsp] = useState<number>(300);
  const [m0, setM0] = useState<number>(1000);
  const [mf, setMf] = useState<number>(100);
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    try {
      if (m0 <= mf) {
        alert('Initial mass must be greater than final mass');
        return;
      }
      const dv = calculateDeltaV(isp, m0, mf);
      setResult(dv);
    } catch (e) {
      console.error(e);
      setResult(null);
    }
  };

  return (
    <CalculatorCard title="Rocket Equation" description="Calculate Delta-V (velocity change) based on mass ratio and engine efficiency. Essential for determining if a vehicle can reach orbit.">
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1 text-gray-300">Specific Impulse (Isp, s)</label>
          <input
            type="number"
            value={isp}
            onChange={(e) => setIsp(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">Initial Mass (m0, kg)</label>
          <input
            type="number"
            value={m0}
            onChange={(e) => setM0(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-300">Final Mass (mf, kg)</label>
          <input
            type="number"
            value={mf}
            onChange={(e) => setMf(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-cyan-500 transition"
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
