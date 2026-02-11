'use client';

import React, { useState } from 'react';
import CalculatorCard from './CalculatorCard';
import { calculateConsumables } from '../utils/spaceflight';

const LifeSupportCalculator = () => {
  const [crew, setCrew] = useState<number>(3);
  const [days, setDays] = useState<number>(10);
  const [consumables, setConsumables] = useState<{ oxygen: number; water: number; food: number; total: number } | null>(null);

  const handleCalculate = () => {
    try {
      const result = calculateConsumables(crew, days);
      setConsumables(result);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CalculatorCard title="Life Support" description="Estimate consumables (Oxygen, Water, Food) required for a mission. Critical for medical and logistical planning.">
      <div className="space-y-3">
        <div>
          <label htmlFor="ls-crew" className="block text-sm mb-1 text-gray-300">Crew Size</label>
          <input
            id="ls-crew"
            type="number"
            value={crew}
            onChange={(e) => setCrew(parseInt(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-green-500 transition"
          />
        </div>
        <div>
          <label htmlFor="ls-days" className="block text-sm mb-1 text-gray-300">Duration (days)</label>
          <input
            id="ls-days"
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value))}
            className="w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-green-500 transition"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-2 px-4 rounded transition shadow-lg transform active:scale-95"
        >
          Calculate Needs
        </button>
        {consumables && (
          <div className="mt-4 p-4 bg-green-900/30 rounded border border-green-500/30 backdrop-blur-sm text-sm space-y-1">
            <p>Oxygen: <span className="text-green-300 font-bold">{consumables.oxygen.toFixed(1)}</span> kg</p>
            <p>Water: <span className="text-green-300 font-bold">{consumables.water.toFixed(1)}</span> kg</p>
            <p>Food: <span className="text-green-300 font-bold">{consumables.food.toFixed(1)}</span> kg</p>
            <div className="border-t border-green-500/30 pt-1 mt-1">
              <p className="font-bold">Total: <span className="text-green-300">{consumables.total.toFixed(1)}</span> kg</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
};

export default LifeSupportCalculator;
