'use client';

import React, { useState } from 'react';
import { calculateSolarPanelArea } from '../utils/spaceflight';
import { logError, getErrorMessage } from '../utils/logger';
import { validateNumericInput } from '../utils/validation';

const SolarPanelCalculatorForm = () => {
  const [power, setPower] = useState<string>("10000");
  const [efficiency, setEfficiency] = useState<string>("0.25");
  const [area, setArea] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    try {
      const powerNum = parseFloat(power);
      const efficiencyNum = parseFloat(efficiency);

      if (isNaN(powerNum) || isNaN(efficiencyNum)) {
        throw new Error('Please enter valid numeric values');
      }

      const result = calculateSolarPanelArea(powerNum, efficiencyNum);
      setArea(result);
    } catch (e) {
      logError(e, 'SolarPanelCalculator');
      setError(getErrorMessage(e));
      setArea(null);
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
        <label htmlFor="solar-power" className="block text-sm mb-1 text-gray-300">Required Power (Watts)</label>
        <input
          id="solar-power"
          type="number"
          min="0"
          step="any"
          value={power}
          onChange={handleInputChange(setPower)}
          className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-red-500 transition"
          aria-describedby="solar-power-hint"
        />
        <p id="solar-power-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-red-400 transition-colors">CubeSat: ~1-10W, GPS: ~1000W, ISS: ~100,000W</p>
      </div>
      <div>
        <label htmlFor="solar-efficiency" className="block text-sm mb-1 text-gray-300">Efficiency (0.0 - 1.0)</label>
        <input
          id="solar-efficiency"
          type="number"
          min="0"
          max="1"
          step="any"
          value={efficiency}
          onChange={handleInputChange(setEfficiency)}
          className="peer w-full bg-black/50 border border-white/20 rounded p-2 text-white focus:outline-none focus:border-red-500 transition"
          aria-describedby="solar-efficiency-hint"
        />
        <p id="solar-efficiency-hint" className="text-xs text-gray-400 mt-1 peer-focus:text-red-400 transition-colors">Typical: 0.2 - 0.3</p>
      </div>
      <button
        type="submit"
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
    </form>
  );
};

export default SolarPanelCalculatorForm;
