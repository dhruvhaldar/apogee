import React from 'react';
import dynamic from 'next/dynamic';
import CalculatorCard from './CalculatorCard';
import FormSkeleton from './FormSkeleton';

// ⚡ Performance: Dynamically importing RocketCalculatorForm splits the initial JS bundle.
// Even though this is the first calculator, code-splitting interactive forms (Client Components)
// prioritizes hydration of the main page and reduces the main bundle size.
// `ssr: true` ensures the HTML is still generated on the server for SEO and initial paint.
const RocketCalculatorForm = dynamic(() => import('./RocketCalculatorForm'), {
  loading: () => <FormSkeleton />,
  ssr: true
});

const RocketCalculator = () => {
  return (
    <CalculatorCard title="Rocket Equation" description="Calculate Delta-V (velocity change) based on mass ratio and engine efficiency. Essential for determining if a vehicle can reach orbit.">
      <RocketCalculatorForm />
    </CalculatorCard>
  );
};

export default RocketCalculator;
