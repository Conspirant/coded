import React from 'react';
import { Card } from '@/components/ui/card';

const CutoffExplorer = () => {
  return (
    <Card className="p-6 glass-card">
      <h3 className="text-xl font-bold mb-4 gradient-text">Cutoff Explorer</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Explore historical cutoff data to make informed decisions about your college preferences.
      </p>
      <div className="text-center text-muted-foreground">
        <p>Cutoff exploration features coming soon...</p>
      </div>
    </Card>
  );
};

export default CutoffExplorer;
