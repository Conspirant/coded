import React from 'react';
import { Card } from '@/components/ui/card';

const Instructions = () => {
  return (
    <Card className="p-6 glass-card">
      <h3 className="text-xl font-bold mb-4 gradient-text">How to Use the Planner</h3>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-amber-300">Step 1: Enter Your Details</h4>
          <p>Input your KCET rank and select your category (GM, SC, ST, OBC, etc.)</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber-300">Step 2: Upload PDF or Add Options</h4>
          <p>Upload your option entry PDF or manually add college preferences</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber-300">Step 3: Simulate Mock Allotment</h4>
          <p>Choose year and round, then simulate your likely allotment</p>
        </div>
        <div>
          <h4 className="font-semibold text-amber-300">Step 4: Analyze and Plan</h4>
          <p>Review analytics and use the worksheet to finalize your options</p>
        </div>
      </div>
    </Card>
  );
};

export default Instructions;
