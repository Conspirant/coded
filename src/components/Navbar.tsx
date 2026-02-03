import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-900 to-purple-700 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-xl font-bold">KCET Coded</div>
        <div className="text-sm opacity-90">Mock Option Entry Planner</div>
      </div>
    </nav>
  );
};

export default Navbar;
