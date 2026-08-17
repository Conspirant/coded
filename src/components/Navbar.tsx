import React from 'react';
import { Logo } from './ui/Logo';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 shadow-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo mode="default" iconSize={28} textSize="text-lg" />
        <div className="text-sm opacity-80 font-medium">Option Entry Preference List Tool</div>
      </div>
    </nav>
  );
};

export default Navbar;
