import React, { useId } from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  titleColor?: string;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ title, description, children, titleColor = 'text-cyan-400' }) => {
  const titleId = useId();
  const descId = useId();

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={descId}
      // ⚡ Performance: Replaced `transition-all` with `transition` to prevent the browser
      // from needlessly checking and animating all CSS properties, which is especially expensive
      // for components with `backdrop-blur` and shadow effects.
      className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 hover:bg-white/[0.12] hover:shadow-2xl focus-within:border-white/40 focus-within:bg-white/[0.12] focus-within:shadow-2xl transition duration-300 rounded-xl p-6 shadow-xl text-white h-full flex flex-col"
    >
      <h2 id={titleId} className={`text-2xl font-bold mb-2 ${titleColor}`}>{title}</h2>
      <p id={descId} className="text-gray-300 mb-4 text-sm flex-grow">{description}</p>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default CalculatorCard;
