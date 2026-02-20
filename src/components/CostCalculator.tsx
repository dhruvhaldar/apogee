import React from 'react';
import CalculatorCard from './CalculatorCard';
import CostCalculatorForm from './CostCalculatorForm';

const CostCalculator = () => {
  return (
    <CalculatorCard title="Mission Cost" description="Estimate launch cost based on payload mass and vehicle rates. Covers economic and political perspectives.">
      <CostCalculatorForm />
    </CalculatorCard>
  );
};

export default CostCalculator;
