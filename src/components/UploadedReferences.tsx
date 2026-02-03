import React from 'react';
import { Card } from '@/components/ui/card';

const UploadedReferences = () => {
  return (
    <Card className="p-6 glass-card">
      <h3 className="text-xl font-bold mb-4 gradient-text">Resources & References</h3>
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-amber-300">Official KEA Resources</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>KCET Official Website</li>
            <li>Option Entry Guidelines</li>
            <li>Previous Year Cutoffs</li>
            <li>College Information</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-amber-300">Helpful Tools</h4>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>College Comparison Tool</li>
            <li>Fee Calculator</li>
            <li>Rank Predictor</li>
            <li>Document Manager</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default UploadedReferences;
