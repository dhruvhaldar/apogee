import React from 'react';
import dynamic from 'next/dynamic';
import CalculatorCard from './CalculatorCard';
import FormSkeleton from './FormSkeleton';

const LifeSupportCalculatorForm = dynamic(() => import('./LifeSupportCalculatorForm'), {
  loading: () => <FormSkeleton />,
  ssr: true
});

const LifeSupportCalculator = () => {
  // Optimization: State is isolated in LifeSupportCalculatorForm (Client Component)
  // to prevent CalculatorCard (Server Component / shared UI) from re-rendering
  // on every keystroke, which avoids expensive CSS repaints (backdrop-blur).
  return (
    <CalculatorCard title="Life Support" description="Estimate consumables (Oxygen, Water, Food) required for a mission. Critical for medical and logistical planning.">
      <LifeSupportCalculatorForm />
    </CalculatorCard>
  );
};

export default LifeSupportCalculator;
