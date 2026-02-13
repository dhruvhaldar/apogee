'use client';

import React from 'react';
import CalculatorCard from './CalculatorCard';
import RocketCalculatorForm from './RocketCalculatorForm';

const RocketCalculator = () => {
  return (
    <CalculatorCard title="Rocket Equation" description="Calculate Delta-V (velocity change) based on mass ratio and engine efficiency. Essential for determining if a vehicle can reach orbit.">
      <RocketCalculatorForm />
    </CalculatorCard>
  );
};

export default RocketCalculator;
