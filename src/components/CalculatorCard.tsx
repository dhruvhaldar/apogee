import React from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl text-white h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-2 text-cyan-400">{title}</h2>
      <p className="text-gray-300 mb-4 text-sm flex-grow">{description}</p>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default CalculatorCard;
