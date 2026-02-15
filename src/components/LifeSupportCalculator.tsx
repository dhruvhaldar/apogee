import React from 'react';
import CalculatorCard from './CalculatorCard';
import LifeSupportCalculatorForm from './LifeSupportCalculatorForm';

const LifeSupportCalculator = () => {
  return (
    <CalculatorCard title="Life Support" description="Estimate consumables (Oxygen, Water, Food) required for a mission. Critical for medical and logistical planning.">
      <LifeSupportCalculatorForm />
    </CalculatorCard>
  );
};

export default LifeSupportCalculator;
