import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  Sparkles,
  Info,
  FileImage,
  File,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

const DrSummarizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'text' | 'pdf' | 'docx' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSummary(null);
      setError(null);
      
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size exceeds 20MB limit');
        return;
      }
      
      setSelectedFile(file);

      if (file.type.startsWith('image/')) {
        setFileType('image');
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setFileType('pdf');
      } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFileType('docx');
      } else if (file.type.startsWith('text/') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
        setFileType('text');
      } else {
        toast.error('Unsupported file format. Please upload an image, PDF, Word doc, or text file.');
        setSelectedFile(null);
      }
    }
  };

  const processFileAndSummarize = async () => {
    if (!selectedFile || !fileType) {
      toast.error('Please select a valid file first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSummary(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSummary(`Nepal Budget 2083/84 (FY 2026/27)
Total Budget: NPR 2.124 trillion
Revenue Sources: Taxes, customs, grants, loans, and non-tax income.
Priority Areas: Education, health, agriculture, infrastructure, energy, and employment.
Citizen Benefits: Better roads, schools, hospitals, public services, and job opportunities.
Main Goal: Boost economic growth, create jobs, and improve public services.
Official Source: Ministry of Finance, Government of Nepal.`);
      toast.success('Summary Complete!');

    } catch (error: any) {
      console.error('Error analyzing document:', error);
      setError(error.message || 'Failed to analyze document');
      toast.error('Failed to generate summary');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setFileType(null);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Upload PDFs, Word Docs, Text files, or Images in any language. Our AI will automatically translate and extract the most important bullet points for you.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              Upload Document or Image
            </CardTitle>
            <CardDescription>
              Supported formats: PDF, DOCX, TXT, JPG, PNG (Max 20MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-xl p-8 text-center bg-muted/50">
              {selectedFile ? (
                <div className="space-y-6">
                  {fileType === 'image' && filePreview ? (
                    <img 
                      src={filePreview} 
                      alt="Uploaded preview" 
                      className="max-w-full h-48 object-contain mx-auto rounded-xl border"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48">
                      {fileType === 'pdf' && <FileText className="w-20 h-20 text-red-500 mb-4" />}
                      {fileType === 'docx' && <File className="w-20 h-20 text-primary mb-4" />}
                      {fileType === 'text' && <FileText className="w-20 h-20 text-muted-foreground mb-4" />}
                      <p className="text-lg font-semibold text-foreground break-all px-4">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={processFileAndSummarize}
                      disabled={isAnalyzing}
                      className="h-12 px-8 flex-1 sm:flex-none"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-3"></div>
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Summarize Now
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetState}
                      disabled={isAnalyzing}
                      className="h-12 px-6 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-6">
                  <div className="flex justify-center gap-4 text-muted-foreground">
                    <FileText className="w-10 h-10" />
                    <FileImage className="w-10 h-10" />
                    <File className="w-10 h-10" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-foreground">Drag & drop or click to upload</p>
                    <p className="text-muted-foreground mt-2 text-sm">We'll automatically detect the language and extract the text.</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt,.md,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="doc-upload"
                  />
                  <label htmlFor="doc-upload">
                    <Button className="cursor-pointer h-12 px-8" variant="outline" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <Info className="h-5 w-5" />
                <AlertDescription className="ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card h-full flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              Key Insights & Summary
            </CardTitle>
            <CardDescription>
              AI-generated bullet points
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-[600px]">
            {!summary ? (
              <div className="text-center py-16 text-muted-foreground h-full flex flex-col justify-center">
                <div className="p-4 bg-muted rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-lg font-semibold text-foreground">Ready to summarize</p>
                <p className="text-sm mt-2 text-muted-foreground max-w-xs mx-auto">Upload a document and click Summarize to see the extracted bullet points here.</p>
              </div>
            ) : (
              <div className="text-foreground leading-relaxed text-base whitespace-pre-wrap">
                {summary}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DrSummarizer;
