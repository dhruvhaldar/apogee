import React from 'react';
import CalculatorCard from './CalculatorCard';
import SolarPanelCalculatorForm from './SolarPanelCalculatorForm';

const SolarPanelCalculator = () => {
  return (
    <CalculatorCard title="Power Systems" description="Determine solar panel area based on power requirements and efficiency. Crucial for space stations.">
      <SolarPanelCalculatorForm />
    </CalculatorCard>
  );
};

export default SolarPanelCalculator;
