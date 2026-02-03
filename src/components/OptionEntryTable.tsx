import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUp, ArrowDown, X, Edit, Save, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

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

interface OptionEntryTableProps {
  userRank: number | null;
  userCategory: string;
  options: Option[];
  onOptionsChange: (options: Option[]) => void;
}

const OptionEntryTable: React.FC<OptionEntryTableProps> = ({
  userRank,
  userCategory,
  options,
  onOptionsChange,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Option>>({});

  const removeOption = (id: string) => {
    const newOptions = options.filter(opt => opt.id !== id);
    // Reorder priorities after removal
    const reorderedOptions = newOptions.map((opt, index) => ({
      ...opt,
      priority: index + 1
    }));
    onOptionsChange(reorderedOptions);
  };

  const moveOption = (id: string, direction: 'up' | 'down') => {
    const index = options.findIndex(opt => opt.id === id);
    if (index === -1) return;

    const newOptions = [...options];
    if (direction === 'up' && index > 0) {
      [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]];
    } else if (direction === 'down' && index < newOptions.length - 1) {
      [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
    }
    
    // Reorder priorities after moving
    const reorderedOptions = newOptions.map((opt, index) => ({
      ...opt,
      priority: index + 1
    }));
    onOptionsChange(reorderedOptions);
  };

  const startEditing = (option: Option) => {
    setEditingId(option.id);
    setEditForm({
      collegeCode: option.collegeCode,
      branchCode: option.branchCode,
      collegeName: option.collegeName,
      branchName: option.branchName,
      location: option.location,
      courseFee: option.courseFee
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    const newOptions = options.map(opt => 
      opt.id === editingId 
        ? { 
            ...opt, 
            ...editForm,
            collegeCourse: `${editForm.collegeCode || opt.collegeCode}${editForm.branchCode || opt.branchCode}`
          }
        : opt
    );
    
    onOptionsChange(newOptions);
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const updatePriority = (id: string, newPriority: number) => {
    if (newPriority < 1 || newPriority > options.length) return;
    
    const newOptions = [...options];
    const currentIndex = newOptions.findIndex(opt => opt.id === id);
    const targetIndex = newPriority - 1;
    
    if (currentIndex === -1) return;
    
    // Remove the option from current position
    const [movedOption] = newOptions.splice(currentIndex, 1);
    
    // Insert at new position
    newOptions.splice(targetIndex, 0, movedOption);
    
    // Reorder all priorities
    const reorderedOptions = newOptions.map((opt, index) => ({
      ...opt,
      priority: index + 1
    }));
    
    onOptionsChange(reorderedOptions);
  };

  if (options.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">No options added yet</p>
          <p className="text-sm">Upload a PDF or manually add college preferences to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Your Option List</h3>
        <div className="text-sm text-muted-foreground">
          Total Options: {options.length}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Priority</TableHead>
              <TableHead>College Code</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>College Name</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Course Fee</TableHead>
              <TableHead className="w-40">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.map((option, index) => (
              <TableRow key={option.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  {editingId === option.id ? (
                    <Input
                      type="number"
                      min={1}
                      max={options.length}
                      value={editForm.priority || option.priority}
                      onChange={(e) => {
                        const newPriority = parseInt(e.target.value);
                        if (!isNaN(newPriority)) {
                          updatePriority(option.id, newPriority);
                        }
                      }}
                      className="w-16 h-8 text-center"
                    />
                  ) : (
                    option.priority
                  )}
                </TableCell>
                <TableCell>
                  {editingId === option.id ? (
                    <Input
                      value={editForm.collegeCode || option.collegeCode}
                      onChange={(e) => setEditForm({...editForm, collegeCode: e.target.value})}
                      className="w-20 h-8"
                    />
                  ) : (
                    option.collegeCode
                  )}
                </TableCell>
                <TableCell>
                  {editingId === option.id ? (
                    <Input
                      value={editForm.branchCode || option.branchCode}
                      onChange={(e) => setEditForm({...editForm, branchCode: e.target.value})}
                      className="w-20 h-8"
                    />
                  ) : (
                    option.branchCode
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  {editingId === option.id ? (
                    <Input
                      value={editForm.collegeName || option.collegeName}
                      onChange={(e) => setEditForm({...editForm, collegeName: e.target.value})}
                      className="w-32 h-8"
                    />
                  ) : (
                    <span title={option.collegeName} className="truncate block">
                      {option.collegeName}
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  {editingId === option.id ? (
                    <Input
                      value={editForm.branchName || option.branchName}
                      onChange={(e) => setEditForm({...editForm, branchName: e.target.value})}
                      className="w-32 h-8"
                    />
                  ) : (
                    <span title={option.branchName} className="truncate block">
                      {option.branchName}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === option.id ? (
                    <Input
                      value={editForm.location || option.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      className="w-24 h-8"
                    />
                  ) : (
                    option.location
                  )}
                </TableCell>
                <TableCell>
                  {editingId === option.id ? (
                    <Input
                      value={editForm.courseFee || option.courseFee || ''}
                      onChange={(e) => setEditForm({...editForm, courseFee: e.target.value})}
                      className="w-24 h-8"
                      placeholder="N/A"
                    />
                  ) : (
                    option.courseFee || 'N/A'
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {editingId === option.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={saveEdit}
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          title="Save changes"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={cancelEdit}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700"
                          title="Cancel editing"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(option)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                          title="Edit option"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveOption(option.id, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                          title="Move up"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => moveOption(option.id, 'down')}
                          disabled={index === options.length - 1}
                          className="h-8 w-8 p-0"
                          title="Move down"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(option.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Remove option"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Summary Information */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Total Options:</span>
            <span className="ml-2 font-semibold">{options.length}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Top Priority:</span>
            <span className="ml-2 font-semibold">{options[0]?.collegeName || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Last Priority:</span>
            <span className="ml-2 font-semibold">{options[options.length - 1]?.collegeName || 'N/A'}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Your Rank:</span>
            <span className="ml-2 font-semibold">{userRank?.toLocaleString() || 'Not set'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OptionEntryTable;
