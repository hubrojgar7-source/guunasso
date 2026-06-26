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
import { summarizeContent, type SummarizationResult } from '@/services/summarizerService';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    const numPages = Math.min(pdf.numPages, 20);
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText;
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
      toast('Processing document...', { duration: 3000 });
      let extractedText = '';
      let base64Image = null;

      if (fileType === 'image') {
        base64Image = filePreview;
      } else if (fileType === 'text') {
        extractedText = await selectedFile.text();
      } else if (fileType === 'pdf') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        extractedText = await extractTextFromPDF(arrayBuffer);
      } else if (fileType === 'docx') {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      }

      if (fileType !== 'image' && (!extractedText || extractedText.trim().length === 0)) {
        throw new Error("Could not extract any readable text from this document.");
      }

      toast('Generating summary...', { duration: 3000 });
      const result = await summarizeContent(extractedText, base64Image);
      setSummary(result.summary);
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
    <div className="min-h-screen bg-white">
      <div className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-[#10B981]/10 rounded-2xl">
                <FileText className="w-10 h-10 text-[#10B981]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Dr. Summarizer</h1>
                <p className="text-gray-500">AI-Powered Multi-Format Document Insights</p>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Extract Key Insights <span className="text-[#10B981]">Instantly</span>
            </h2>
            <p className="text-gray-500 text-base lg:text-lg max-w-3xl mx-auto leading-relaxed">
              Upload PDFs, Word Docs, Text files, or Images in any language. Our AI will automatically translate and extract the most important bullet points for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="pb-6 border-b border-gray-100 bg-gray-50/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-[#10B981]/10 rounded-lg">
                    <Upload className="w-5 h-5 text-[#10B981]" />
                  </div>
                  Upload Document or Image
                </CardTitle>
                <CardDescription className="text-base">
                  Supported formats: PDF, DOCX, TXT, JPG, PNG (Max 20MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 transition-all duration-300">
                  {selectedFile ? (
                    <div className="space-y-6">
                      {fileType === 'image' && filePreview ? (
                        <img 
                          src={filePreview} 
                          alt="Uploaded preview" 
                          className="max-w-full h-48 object-contain mx-auto rounded-xl shadow-sm border border-gray-100"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-48">
                          {fileType === 'pdf' && <FileText className="w-20 h-20 text-red-500 mb-4" />}
                          {fileType === 'docx' && <File className="w-20 h-20 text-[#10B981] mb-4" />}
                          {fileType === 'text' && <FileText className="w-20 h-20 text-gray-600 mb-4" />}
                          <p className="text-lg font-medium text-gray-800 break-all px-4">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button 
                          onClick={processFileAndSummarize}
                          disabled={isAnalyzing}
                          className="bg-[#10B981] hover:bg-[#059669] text-white rounded-lg px-8 py-6 text-lg font-semibold shadow-none flex-1 sm:flex-none"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                              Extracting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-3" />
                              Summarize Now
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={resetState}
                          disabled={isAnalyzing}
                          className="rounded-lg px-6 py-6 text-lg border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex-1 sm:flex-none"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 py-8">
                      <div className="flex justify-center gap-4 text-gray-400">
                        <FileText className="w-10 h-10" />
                        <FileImage className="w-10 h-10" />
                        <File className="w-10 h-10" />
                      </div>
                      <div>
                        <p className="text-xl font-medium text-gray-900">Drag & drop or click to upload</p>
                        <p className="text-gray-500 mt-2 text-sm">We'll automatically detect the language and extract the text.</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.txt,.md,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="doc-upload"
                      />
                      <label htmlFor="doc-upload">
                        <Button className="cursor-pointer bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-50 rounded-lg px-8 py-6 text-base font-medium shadow-none" asChild>
                          <span>Browse Files</span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {error && (
                  <Alert className="bg-red-50 border-red-200 rounded-xl">
                    <Info className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-800 ml-2">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-6 border-b border-gray-100 bg-gray-50/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-[#10B981]/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-[#10B981]" />
                  </div>
                  Key Insights & Summary
                </CardTitle>
                <CardDescription className="text-base">
                  AI-generated bullet points
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-8 overflow-y-auto max-h-[600px]">
                {!summary ? (
                  <div className="text-center py-16 text-gray-500 h-full flex flex-col justify-center">
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-lg font-medium text-gray-800">Ready to summarize</p>
                    <p className="text-sm mt-2 text-gray-500 max-w-xs mx-auto">Upload a document and click Summarize to see the extracted bullet points here.</p>
                  </div>
                ) : (
                  <div className="prose prose-blue max-w-none">
                    <div className="text-gray-800 leading-relaxed text-lg whitespace-pre-wrap">
                      {summary}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrSummarizer;
