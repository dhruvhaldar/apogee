import React from 'react';
import dynamic from 'next/dynamic';
import CalculatorCard from './CalculatorCard';
import FormSkeleton from './FormSkeleton';

const CostCalculatorForm = dynamic(() => import('./CostCalculatorForm'), {
  loading: () => <FormSkeleton />,
  ssr: true
});

const CostCalculator = () => {
  return (
    <CalculatorCard title="Mission Cost" description="Estimate launch cost based on payload mass and vehicle rates. Covers economic and political perspectives.">
      <CostCalculatorForm />
    </CalculatorCard>
  );
};

export default CostCalculator;
