import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { validateRank, validateCategory } from "@/lib/security";

interface RankInputProps {
  onRankSubmit: (rank: number, category: string) => void;
}

const RankInput: React.FC<RankInputProps> = ({ onRankSubmit }) => {
  const [rank, setRank] = useState<string>("");
  const [category, setCategory] = useState<string>("GM");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = parseInt(rank);
    
    // Validate rank
    const rankValidation = validateRank(rankNum);
    if (!rankValidation.isValid) {
      alert(rankValidation.error);
      return;
    }

    // Validate category
    const categoryValidation = validateCategory(category);
    if (!categoryValidation.isValid) {
      alert(categoryValidation.error);
      return;
    }

    onRankSubmit(rankNum, categoryValidation.sanitized);
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Enter Your KCET Details</h2>
        <p className="text-muted-foreground">Start planning your college preferences</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rank">KCET Rank</Label>
          <Input
            id="rank"
            type="number"
            placeholder="Enter your KCET rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            required
            min="1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GM">General Merit (GM)</SelectItem>
              <SelectItem value="SC">Scheduled Caste (SC)</SelectItem>
              <SelectItem value="ST">Scheduled Tribe (ST)</SelectItem>
              <SelectItem value="OBC">Other Backward Classes (OBC)</SelectItem>
              <SelectItem value="CAT1">Category 1</SelectItem>
              <SelectItem value="CAT2A">Category 2A</SelectItem>
              <SelectItem value="CAT2B">Category 2B</SelectItem>
              <SelectItem value="CAT3A">Category 3A</SelectItem>
              <SelectItem value="CAT3B">Category 3B</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button type="submit" className="w-full" disabled={!rank || !category}>
          Continue to Planner
        </Button>
      </form>
    </Card>
  );
};

export default RankInput;
