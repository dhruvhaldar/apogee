'use client';

import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculateMissionCost } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';

const CostCalculator = () => {
  const [payload, setPayload] = useState<number>(1000);
  const [costPerKg, setCostPerKg] = useState<number>(2700);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = () => {
    setError(null);
    try {
      const result = calculateMissionCost(payload, costPerKg);
      setTotalCost(result);
    } catch (e) {
      logError(e, 'CostCalculator');
      setError(getErrorMessage(e));
      setTotalCost(null);
    }
  };

  return (
    <CalculatorCard title="Mission Cost" description="Estimate launch cost based on payload mass and vehicle rates. Covers economic and political perspectives.">
      <div className="space-y-3">
        {error && (
          <div role="alert" className="p-3 bg-red-900/50 border border-red-500/50 rounded text-red-200 text-sm">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="cost-payload" className="block text-sm mb-1 text-gray-300">Payload Mass (kg)</label>
          <input
            id="cost-payload"
            type="number"
            value={payload}
            onChange={(e) => setPayload(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-yellow-500 transition"
          />
        </div>
        <div>
          <label htmlFor="cost-rate" className="block text-sm mb-1 text-gray-300">Cost per kg ($)</label>
          <input
            id="cost-rate"
            type="number"
            value={costPerKg}
            onChange={(e) => setCostPerKg(parseFloat(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-yellow-500 transition"
          />
          <p className="text-xs text-gray-400 mt-1">e.g., Falcon 9: ~2700, SLS: ~50000+</p>
        </div>
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95"
        >
          Calculate Cost
        </button>
        {totalCost !== null && (
          <div className="mt-4 p-4 bg-yellow-900/30 rounded border border-yellow-500/30 backdrop-blur-sm">
            <p className="text-center font-mono text-xl">
              <span className="text-yellow-300 font-bold">${totalCost.toLocaleString()}</span>
            </p>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
};

export default CostCalculator;
