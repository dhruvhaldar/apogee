'use client';

import React from 'react';
import CalculatorCard from './CalculatorCard';
import OrbitCalculatorForm from './OrbitCalculatorForm';

const OrbitCalculator = () => {
  // State is now isolated in OrbitCalculatorForm to prevent CalculatorCard re-renders
  return (
    <CalculatorCard title="Orbital Mechanics" description="Determine orbital velocity and period for a given altitude (e.g., LEO, GEO). Key for mission planning.">
      <OrbitCalculatorForm />
    </CalculatorCard>
  );
};

export default OrbitCalculator;
