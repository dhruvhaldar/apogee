import React, { useId } from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  titleColor?: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, description, children, titleColor = 'text-cyan-400' }) => {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl text-white h-full flex flex-col">
      <h2 id={titleId} className={`text-2xl font-bold mb-2 ${titleColor}`}>{title}</h2>
      <p className="text-gray-300 mb-4 text-sm flex-grow">{description}</p>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default CalculatorCard;
