import React from "react";
import { Card } from "@/components/ui/card";

interface Option {
  id: string;
  collegeCode: string;
  branchCode: string;
  collegeName: string;
  branchName: string;
  location: string;
  collegeCourse: string;
  priority: number;
  courseFee?: string;
  collegeAddress?: string;
}

interface AnalyticsProps {
  userRank: number | null;
  userCategory: string;
  selectedOptions: Option[];
}

const Analytics: React.FC<AnalyticsProps> = ({ userRank, userCategory, selectedOptions }) => {
  const getMockCutoff = (collegeCode: string, branchCode: string) => {
    // Mock cutoff calculation - in real app, this would use actual cutoff data
    const baseCutoff = 50000;
    const collegeMultiplier = collegeCode.charCodeAt(0) % 3 + 0.8; // Varies by college
    const branchMultiplier = branchCode === 'CS' ? 1.5 : branchCode === 'EC' ? 1.2 : 1.0;
    return Math.round(baseCutoff * collegeMultiplier * branchMultiplier);
  };

  const calculateChances = () => {
    if (!userRank || selectedOptions.length === 0) return [];

    return selectedOptions.map(option => {
      const cutoff = getMockCutoff(option.collegeCode, option.branchCode);
      const rankDifference = cutoff - userRank;
      
      let status = "Unknown";
      let probability = 0;
      
      if (rankDifference > 0) {
        if (rankDifference > 10000) {
          status = "Very High Chance";
          probability = 95;
        } else if (rankDifference > 5000) {
          status = "High Chance";
          probability = 85;
        } else if (rankDifference > 1000) {
          status = "Good Chance";
          probability = 70;
        } else {
          status = "Moderate Chance";
          probability = 50;
        }
      } else {
        if (Math.abs(rankDifference) < 1000) {
          status = "Borderline";
          probability = 30;
        } else if (Math.abs(rankDifference) < 5000) {
          status = "Low Chance";
          probability = 15;
        } else {
          status = "Very Low Chance";
          probability = 5;
        }
      }

      return {
        option,
        cutoff,
        status,
        probability,
        rankDifference
      };
    });
  };

  const chances = calculateChances();
  const totalFee = selectedOptions.reduce((sum, opt) => {
    const fee = parseInt(opt.courseFee?.replace(/,/g, '') || '0');
    return sum + fee;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{selectedOptions.length}</div>
          <div className="text-sm text-muted-foreground">Total Options</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {userRank ? userRank.toLocaleString() : 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">Your Rank</div>
        </Card>
        
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-foreground">
            {totalFee > 0 ? `₹${(totalFee / 100000).toFixed(1)}L` : 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">Total Annual Fee</div>
        </Card>
      </div>

      {/* Chances Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Admission Chances Analysis</h3>
        
        {chances.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Add some options to see your admission chances analysis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chances.map((chance, index) => (
              <div key={chance.option.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">
                      Option #{chance.option.priority}: {chance.option.collegeCode}{chance.option.branchCode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {chance.option.branchName} @ {chance.option.collegeName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium px-2 py-1 rounded ${
                      chance.status.includes('High') ? 'bg-green-100 text-green-800' :
                      chance.status.includes('Good') ? 'bg-blue-100 text-blue-800' :
                      chance.status.includes('Moderate') ? 'bg-yellow-100 text-yellow-800' :
                      chance.status.includes('Low') ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {chance.status}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Cutoff Rank:</span>
                    <div className="font-medium">{chance.cutoff.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Your Rank:</span>
                    <div className="font-medium">{userRank?.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Difference:</span>
                    <div className={`font-medium ${chance.rankDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {chance.rankDifference > 0 ? '+' : ''}{chance.rankDifference.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Probability:</span>
                    <div className="font-medium">{chance.probability}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">💡 Planning Insights</h3>
        
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="font-medium mb-1">Rank Analysis</div>
            <div className="text-muted-foreground">
              {userRank ? 
                `With rank ${userRank.toLocaleString()}, you have ${chances.filter(c => c.probability >= 70).length} high-probability options.` :
                'Enter your rank to see personalized insights.'
              }
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="font-medium mb-1">Fee Considerations</div>
            <div className="text-muted-foreground">
              {totalFee > 0 ? 
                `Total annual fees: ₹${(totalFee / 100000).toFixed(1)} lakhs. Consider your budget constraints.` :
                'Add course fees to see total cost analysis.'
              }
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="font-medium mb-1">Strategy Tips</div>
            <div className="text-muted-foreground">
              • Place high-probability options in the middle of your list<br/>
              • Include some safe options at the end<br/>
              • Consider location preferences and placement records
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
