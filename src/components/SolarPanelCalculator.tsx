import React from 'react';
import dynamic from 'next/dynamic';
import CalculatorCard from './CalculatorCard';
import FormSkeleton from './FormSkeleton';

const SolarPanelCalculatorForm = dynamic(() => import('./SolarPanelCalculatorForm'), {
  loading: () => <FormSkeleton />,
  ssr: true
});

const SolarPanelCalculator = () => {
  // Optimization: State is isolated in SolarPanelCalculatorForm (Client Component)
  // to prevent CalculatorCard (Server Component / shared UI) from re-rendering
  // on every keystroke, which avoids expensive CSS repaints (backdrop-blur).
  return (
    <CalculatorCard title="Power Systems" description="Determine solar panel area based on power requirements and efficiency. Crucial for space stations.">
      <SolarPanelCalculatorForm />
    </CalculatorCard>
  );
};

export default SolarPanelCalculator;
