import React from 'react';
import Image from 'next/image';
import RocketCalculator from '@/components/RocketCalculator';
import OrbitCalculator from '@/components/OrbitCalculator';
import LifeSupportCalculator from '@/components/LifeSupportCalculator';
import CostCalculator from '@/components/CostCalculator';
import SolarPanelCalculator from '@/components/SolarPanelCalculator';

export default function Home() {
  return (
    <main className="min-h-screen p-8 relative overflow-hidden text-white bg-black">
      {/* Background with stars */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0B1A] to-black"></div>
      {/*
        Performance Optimization: Hosting static assets locally improves load time and reliability.
        Using next/image for automatic optimization (format, size, priority).
      */}
      <Image
        src="/patterns/stardust.png"
        alt="Stardust background pattern"
        fill
        priority
        className="z-0 opacity-30 object-cover pointer-events-none"
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 mb-4 drop-shadow-2xl">
            APOGEE
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Human Spaceflight Mission Planning & Analysis Tool
            <br />
            <span className="text-sm opacity-70">Based on KTH SD2905 Syllabus</span>
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <RocketCalculator />
          <OrbitCalculator />
          <LifeSupportCalculator />
          <CostCalculator />
          <SolarPanelCalculator />
          
          {/* Information Card */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center text-center">
             <h3 className="text-xl font-bold text-gray-300 mb-2">Project Overview</h3>
             <p className="text-gray-400 text-sm">
               This tool helps analyze key aspects of manned space transportation, including vehicle performance, orbital dynamics, life support systems, and mission economics.
             </p>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Apogee © 2026 | MIT License</p>
          <p className="mt-1">Developed for Human Spaceflight Course SD2905</p>
        </footer>
      </div>
    </main>
  );
}
