import React from 'react';
import dynamic from 'next/dynamic';
import CalculatorCard from './CalculatorCard';
import FormSkeleton from './FormSkeleton';

const OrbitCalculatorForm = dynamic(() => import('./OrbitCalculatorForm'), {
  loading: () => <FormSkeleton />,
  ssr: true
});

const OrbitCalculator = () => {
  // State is isolated in OrbitCalculatorForm to prevent CalculatorCard re-renders
  // Dynamic import reduces initial bundle size for this secondary component
  return (
    <CalculatorCard title="Orbital Mechanics" description="Determine orbital velocity and period for a given altitude (e.g., LEO, GEO). Key for mission planning." titleColor="text-purple-400">
      <OrbitCalculatorForm />
    </CalculatorCard>
  );
};

export default OrbitCalculator;
