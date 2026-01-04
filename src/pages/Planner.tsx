import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download,
  Trash2,
  Play,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PDFParser, type ParsedOption } from "@/lib/pdf-parser";
import { useNavigate } from "react-router-dom";

const Planner = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedOptions, setExtractedOptions] = useState<ParsedOption[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [parseError, setParseError] = useState<string>("");

  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, []);

  // Handle file input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  // Process uploaded PDF file
  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setProgress(10);
    setParseError("");
    setFileName(file.name);

    try {
      setProgress(30);

      // Parse the PDF with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('PDF parsing timed out. Please try again or check the file.')), 30000);
      });

      const parsePromise = PDFParser.parseWithFallback(file);
      const options = await Promise.race([parsePromise, timeoutPromise]);

      setProgress(80);

      if (options.length === 0) {
        setParseError("No options found in the PDF. Please check the file format.");
        toast({
          title: "No Options Found",
          description: "Could not extract options from the PDF",
          variant: "destructive"
        });
      } else {
        setExtractedOptions(options);
        toast({
          title: "PDF Parsed Successfully! 🎉",
          description: `Extracted ${options.length} options from your Option Entry PDF`
        });
      }

      setProgress(100);
    } catch (error) {
      console.error('PDF parsing error:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse PDF');
      toast({
        title: "Parsing Error",
        description: "Failed to parse the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  // Clear uploaded data
  const clearData = () => {
    setExtractedOptions([]);
    setFileName("");
    setParseError("");
    setProgress(0);
  };

  // Navigate to Mock Simulator with preferences
  const analyzeWithSimulator = () => {
    // Store preferences in sessionStorage for Mock Simulator
    sessionStorage.setItem('mockSimulatorPreferences', JSON.stringify(
      extractedOptions.map(opt => ({
        id: opt.id,
        collegeCode: opt.collegeCode,
        branchCode: opt.branchCode,
        collegeName: opt.collegeName,
        branchName: opt.branchName,
        priority: opt.priority
      }))
    ));

    navigate('/mock-simulator');

    toast({
      title: "Preferences Loaded",
      description: "Your options have been loaded into the Mock Simulator"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Option Entry Analyzer
        </h1>
        <p className="text-muted-foreground">
          Upload your KEA Option Entry PDF to view, analyze, and simulate your preferences
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Upload your downloaded Option Entry PDF from the KEA website. We'll extract your
          preferences and display them exactly as they appear in the original document.
        </AlertDescription>
      </Alert>

      {/* Upload Section */}
      {extractedOptions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
                }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload className={`h-16 w-16 mx-auto mb-4 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="text-xl font-semibold mb-2">
                {isDragging ? 'Drop your PDF here' : 'Upload Option Entry PDF'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your KEA Option Entry PDF, or click to browse
              </p>
              <label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>
                    <FileText className="h-4 w-4 mr-2" />
                    Select PDF File
                  </span>
                </Button>
              </label>
            </div>

            {parseError && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{parseError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
              <div>
                <p className="font-medium">Parsing {fileName}...</p>
                <p className="text-sm text-muted-foreground">Extracting your option entries</p>
              </div>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Extracted Options Table - KEA Format */}
      {extractedOptions.length > 0 && !isLoading && (
        <>
          {/* Actions Bar */}
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {extractedOptions.length} options extracted
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearData}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={analyzeWithSimulator}>
                    <Play className="h-4 w-4 mr-2" />
                    Analyze in Mock Simulator
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KEA Format Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Option Entry List</CardTitle>
              <CardDescription>
                Displaying options exactly as they appear in your KEA PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-20 font-bold text-center">Optn. No</TableHead>
                      <TableHead className="w-28 font-bold">College Course</TableHead>
                      <TableHead className="font-bold">Course Name</TableHead>
                      <TableHead className="w-64 font-bold">Course Fee per Annum(Rs)</TableHead>
                      <TableHead className="font-bold">College Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedOptions.map((option, index) => (
                      <TableRow key={option.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                        <TableCell className="text-center font-medium">
                          {option.priority}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {option.collegeCourse}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {option.branchName}
                        </TableCell>
                        <TableCell className="text-sm">
                          {option.courseFee || 'Not specified'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{option.collegeName}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Total Options:</span>
                    <span className="ml-2 font-semibold">{extractedOptions.length}</span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Unique Colleges:</span>
                    <span className="ml-2 font-semibold">
                      {new Set(extractedOptions.map(o => o.collegeCode)).size}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Unique Branches:</span>
                    <span className="ml-2 font-semibold">
                      {new Set(extractedOptions.map(o => o.branchCode)).size}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">First Choice:</span>
                    <span className="ml-2 font-semibold">
                      {extractedOptions[0]?.collegeCourse || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Planner;
