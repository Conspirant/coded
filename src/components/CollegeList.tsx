import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface CollegeListProps {
  options: Option[];
  onOptionsChange: (options: Option[]) => void;
}

const CollegeList: React.FC<CollegeListProps> = ({ options, onOptionsChange }) => {
  const [newCollege, setNewCollege] = React.useState({
    collegeCode: "",
    branchCode: "",
    collegeName: "",
    branchName: "",
    location: "",
    courseFee: "",
  });

  const addCollege = () => {
    if (!newCollege.collegeCode || !newCollege.branchCode || !newCollege.collegeName || !newCollege.branchName) {
      return;
    }

    const newOption: Option = {
      id: Date.now().toString(),
      collegeCode: newCollege.collegeCode,
      branchCode: newCollege.branchCode,
      collegeName: newCollege.collegeName,
      branchName: newCollege.branchName,
      location: newCollege.location,
      collegeCourse: newCollege.collegeCode + newCollege.branchCode,
      priority: options.length + 1,
      courseFee: newCollege.courseFee,
      collegeAddress: newCollege.location,
    };

    onOptionsChange([...options, newOption]);
    
    // Reset form
    setNewCollege({
      collegeCode: "",
      branchCode: "",
      collegeName: "",
      branchName: "",
      location: "",
      courseFee: "",
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Add College Manually</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label htmlFor="collegeCode">College Code</Label>
          <Input
            id="collegeCode"
            placeholder="e.g., E001"
            value={newCollege.collegeCode}
            onChange={(e) => setNewCollege({ ...newCollege, collegeCode: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="branchCode">Branch Code</Label>
          <Input
            id="branchCode"
            placeholder="e.g., CS"
            value={newCollege.branchCode}
            onChange={(e) => setNewCollege({ ...newCollege, branchCode: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="collegeName">College Name</Label>
          <Input
            id="collegeName"
            placeholder="e.g., PES University"
            value={newCollege.collegeName}
            onChange={(e) => setNewCollege({ ...newCollege, collegeName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="branchName">Branch Name</Label>
          <Input
            id="branchName"
            placeholder="e.g., Computer Science Engineering"
            value={newCollege.branchName}
            onChange={(e) => setNewCollege({ ...newCollege, branchName: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g., Bangalore"
            value={newCollege.location}
            onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="courseFee">Course Fee (per annum)</Label>
          <Input
            id="courseFee"
            placeholder="e.g., 2,50,000"
            value={newCollege.courseFee}
            onChange={(e) => setNewCollege({ ...newCollege, courseFee: e.target.value })}
          />
        </div>
      </div>
      
      <Button onClick={addCollege} className="w-full md:w-auto">
        Add to Options List
      </Button>
      
      {options.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-semibold text-foreground mb-3">Current Options ({options.length})</h4>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="p-3 border rounded-lg bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">
                      Option #{option.priority}: {option.collegeCode}{option.branchCode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {option.branchName} @ {option.collegeName}
                    </div>
                    {option.location && (
                      <div className="text-xs text-muted-foreground">
                        Location: {option.location}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOptionsChange(options.filter(opt => opt.id !== option.id))}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CollegeList;
