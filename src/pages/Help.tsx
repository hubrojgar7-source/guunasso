
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Book, 
  MessageCircle, 
  Search, 
  Video, 
  FileText, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Play,
  Users,
  LifeBuoy,
  Upload,
  Loader2,
  FileImage,
  File as FileIcon,
  Sparkles,
  Building,
  Landmark
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { summarizeContent } from '@/services/summarizerService';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const Help = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmitTicket = () => {
    toast({
      title: "Support ticket submitted",
      description: "We'll get back to you within 24 hours.",
    });
  };

  // --- Document Summarizer ---
  const [summarizerFile, setSummarizerFile] = useState<File | null>(null);
  const [summarizerLoading, setSummarizerLoading] = useState(false);
  const [summarizerResult, setSummarizerResult] = useState<string | null>(null);
  const [summarizerError, setSummarizerError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const demoGovernmentSummary = `**नेपाल सरकार – सार्वजनिक सेवा प्रवाह सुधार कार्ययोजना २०८१ (Key Points)**
- सार्वजनिक सेवा प्रवाहलाई छिटो, छरितो र प्रभावकारी बनाउन डिजिटल प्रणालीको विकास गरिने
- प्रमुख १० वटा सरकारी सेवाहरूलाई पूर्ण रूपमा अनलाइन सेवामा रूपान्तरण गरिने
- नागरिकले घरबाटै ८०% सेवाहरू प्राप्त गर्न सक्ने व्यवस्था मिलाइने
- सेवा प्रवाहमा ढिलाइ गर्ने कर्मचारीलाई कारबाहीको व्यवस्था गरिने
- गुनासो सुनुवाईको लागि ३० दिनभित्र जवाफ दिनैपर्ने अनिवार्य व्यवस्था
- महिला, दलित, अपाङ्गता भएका व्यक्तिहरूको लागि विशेष सेवा केन्द्र स्थापना गरिने
- प्रत्येक स्थानीय तहमा सूचना केन्द्र स्थापना गरी डिजिटल साक्षरता अभिवृद्धि गरिने
- सेवाग्राही सन्तुष्टि सर्वेक्षण हरेक तीन महिनामा गरिने
- सार्वजनिक सेवा प्रवाहलाई निगरानी गर्न 'मनिटरिङ ड्यासबोर्ड' निर्माण गरिने

**Nepal Government – Public Service Delivery Improvement Action Plan 2081 (Summary)**
- Developing digital systems to make public service delivery faster and more effective
- Transforming 10 major government services to fully online platforms
- Citizens will be able to access 80% of services from home
- Disciplinary action for employees who delay service delivery
- Mandatory response within 30 days for all complaints
- Special service centers for women, Dalits, and persons with disabilities
- Digital literacy centers at every local level
- Citizen satisfaction surveys every three months
- Monitoring dashboard to track public service delivery performance`;

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText.trim() || 'No extractable text found in PDF.';
  };

  const handleSummarize = async () => {
    if (!summarizerFile) return;
    setSummarizerLoading(true);
    setSummarizerResult(null);
    setSummarizerError(null);
    setIsDemoMode(false);

    try {
      const fileType = summarizerFile.type;
      let summary: string;

      if (fileType === 'application/pdf') {
        const pdfText = await extractPdfText(summarizerFile);
        if (pdfText === 'No extractable text found in PDF.') {
          throw new Error(pdfText);
        }
        const result = await summarizeContent(pdfText, null);
        summary = result.summary;
      } else if (fileType.startsWith('image/')) {
        const base64 = await readFileAsBase64(summarizerFile);
        const result = await summarizeContent('', base64);
        summary = result.summary;
      } else {
        throw new Error('Unsupported file type. Please upload an image or PDF.');
      }

      setSummarizerResult(summary);
    } catch (err: any) {
      console.error('Summarization failed:', err);
      setIsDemoMode(true);
      setSummarizerResult(demoGovernmentSummary);
    } finally {
      setSummarizerLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSummarizerFile(file);
    setSummarizerResult(null);
    setSummarizerError(null);
    setIsDemoMode(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      const valid = file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!valid) {
        toast({ title: 'Invalid file type', description: 'Please upload an image or PDF file.', variant: 'destructive' });
        return;
      }
      setSummarizerFile(file);
      setSummarizerResult(null);
      setSummarizerError(null);
      setIsDemoMode(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const faqItems = [
    {
      category: "गुनासो दर्ता / Filing a Complaint",
      items: [
        {
          question: "के गुनासो दर्ता गर्न म आफु रजिस्टर्ड हुनु पर्छ? / Do I need to be registered to file a complaint?",
          answer: "पर्दैन, तपाईले 'गुनासो दर्ता गर्नुहोस्' बटनमा क्लिक गरी आफ्नो गुनासो दर्ता फारम भर्न सक्नु हुन्छ। No, you can click 'File a Complaint' and fill out the form without registering."
        },
        {
          question: "के मैले गुनासोको बारेमा स्मरण तथा स्पष्टीकरण दिन सक्छु? / Can I provide updates or clarification on my complaint?",
          answer: "हो, तपाईं आफ्नो गुनासो दर्ता नम्बर प्रयोग गरेर थप जानकारी वा स्पष्टीकरण पठाउन सक्नुहुन्छ। Yes, you can submit additional information or clarification using your complaint registration number."
        },
        {
          question: "गुनासो दर्ता गर्दा मैले कुनै सम्बन्धित फाइल पठाउन सक्छु? / Can I attach files when filing a complaint?",
          answer: "तपाईले आफुले चाहेजति फाइल पठाउन सक्नु हुन्छ तर एउटा फाइल १० एम.बी भन्दा बढी हुनु हुँदैन। You can upload multiple files, but each file must be under 10 MB."
        },
        {
          question: "कस्ता प्रकारका फाइलहरु पठाउन सकिन्छ? / What types of files can I upload?",
          answer: "फोटो, भिडियो, पि.डी.एफ फाइल र डकुमेन्ट फाइल पठाउन सक्नुहुन्छ। You can upload photos, videos, PDF files, and document files."
        }
      ]
    },
    {
      category: "गोपनीयता र सुरक्षा / Privacy & Security",
      items: [
        {
          question: "गुनासो दर्ताको लागि पासवोर्डको आवश्कता किन पर्दछ? / Why is a password required for filing a complaint?",
          answer: "यदि तपाई आफ्नो गुनासोको स्थिति संवेदनशील तथा सुरक्षित राख्न चाहनुहुन्छ भने पासवोर्डको आवश्यकता पर्दछ। गुनासोको स्थिति थाहा पाउन दर्ता नम्बरको साथै पासवोर्डको पनि आवश्यकता पर्दछ। A password is needed if you want to keep your complaint status confidential and secure. You'll need both the registration number and password to check the status."
        },
        {
          question: "यदि मैले आफ्नो पासवोर्ड बिर्से/हराएको खण्डमा के गर्ने? / What if I forget or lose my password?",
          answer: "तपाईंले 'पासवोर्ड बिर्सेको' विकल्प प्रयोग गरी आफ्नो दर्ता गरिएको ईमेल वा फोन नम्बर मार्फत पासवोर्ड पुन: प्राप्त गर्न सक्नुहुन्छ। You can reset your password using the 'Forgot Password' option via your registered email or phone number."
        },
        {
          question: "मेरो व्यक्तिगत विवरण कसले हेर्न सक्छ? / Who can see my personal information?",
          answer: "तपाईंको व्यक्तिगत विवरण केवल सम्बन्धित सरकारी निकाय र अधिकारीहरूले मात्र हेर्न सक्छन्। Your personal information is only accessible to relevant government authorities and officials."
        },
        {
          question: "मैले मेरो व्यक्तिगत विवरण किन भर्नुपर्दछ? / Why do I need to provide my personal details?",
          answer: "गुनासोको समाधान र फलो-अपको लागि तपाईंको व्यक्तिगत विवरण आवश्यक हुन्छ। यो जानकारी गोपनीय राखिन्छ। Your personal details are needed for complaint resolution and follow-up. This information is kept confidential."
        }
      ]
    },
    {
      category: "गुनासो ट्र्याकिङ / Tracking Your Complaint",
      items: [
        {
          question: "मैले आफ्नो गुनासोको नतिजा कसरी थाहा पाउन सक्छु? / How can I find out the result of my complaint?",
          answer: "तपाईंले आफ्नो गुनासो दर्ता नम्बर र पासवोर्ड प्रयोग गरी 'गुनासोको स्थिति हेर्नुहोस्' खण्डमा गएर नतिजा हेर्न सक्नुहुन्छ। You can check the status by going to 'Check Complaint Status' using your registration number and password."
        },
        {
          question: "यदि मैले मेरो गुनासो/उजुरी को दर्ता नम्बर हराए वा बिर्सेको खण्डमा के गर्ने? / What if I lose or forget my complaint registration number?",
          answer: "कृपया हेल्पडेस्कमा सम्पर्क गर्नुहोस्। तपाईंको दर्ता गरिएको ईमेल वा फोन नम्बरको प्रयोग गरेर दर्ता नम्बर पुन: प्राप्त गर्न सकिन्छ। Please contact the helpdesk. Your registration number can be retrieved using your registered email or phone number."
        },
        {
          question: "के मलाई हरेक गुनासोको छुट्टाछुट्टै दर्ता नम्बर दिइन्छ? / Do I get a separate registration number for each complaint?",
          answer: "हो, प्रत्येक गुनासो/उजुरीको लागि छुट्टाछुट्टै दर्ता नम्बर प्रदान गरिन्छ। Yes, a unique registration number is provided for each complaint filed."
        },
        {
          question: "गुनासो समाधान हुन कति समय लाग्छ? / How long does it take to resolve a complaint?",
          answer: "गुनासोको प्रकृति अनुसार समाधान समय फरक हुन्छ। सामान्यतया १५-३० दिन भित्र समाधान गर्ने प्रयास गरिन्छ। Resolution time varies depending on the nature of the complaint. Generally, efforts are made to resolve within 15-30 days."
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: "Getting Started with गुनासो.com",
      duration: "5 min",
      type: "Video",
      description: "Complete walkthrough of setting up your account and first farm profile",
      level: "Beginner"
    },
    {
      title: "Mobile App Usage Guide",
      duration: "6 min",
      type: "Guide",
      description: "How to use गुनासो.com on your mobile device for field updates",
      level: "Beginner"
    },
    {
      title: "Seasonal Planning Worksheet",
      duration: "3 min",
      type: "Download",
      description: "PDF template for planning your crop seasons",
      level: "All Levels"
    }
  ];

  const filteredFAQs = faqItems.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-zinc-900">Help Center</h1>
          <p className="text-sm text-zinc-600">Find answers and get support</p>
        </div>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for help articles, FAQs, or tutorials..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="summarizer">Summarizer</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>
                  Find quick answers to common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No FAQs found matching your search.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredFAQs.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Badge variant="outline">{category.category}</Badge>
                        </h3>
                        <Accordion type="single" collapsible className="w-full">
                          {category.items.map((item, itemIndex) => (
                            <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                              <AccordionTrigger className="text-left">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {item.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Tutorials & Guides
                </CardTitle>
                <CardDescription>
                  Step-by-step guides to help you get the most out of गुनासो.com
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {tutorial.type === "Video" && <Play className="w-4 h-4 text-blue-600" />}
                            {tutorial.type === "Guide" && <FileText className="w-4 h-4 text-green-600" />}
                            {tutorial.type === "Download" && <Download className="w-4 h-4 text-purple-600" />}
                            <Badge variant="outline" className="text-xs">
                              {tutorial.type}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </span>
                        </div>
                        <h4 className="font-medium mb-2">{tutorial.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant={
                            tutorial.level === "Beginner" ? "default" :
                            tutorial.level === "Intermediate" ? "secondary" :
                            tutorial.level === "Advanced" ? "destructive" : "outline"
                          }>
                            {tutorial.level}
                          </Badge>
                          <Button size="sm" variant="outline">
                            {tutorial.type === "Download" ? "Download" : "Watch"}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Get in Touch
                  </CardTitle>
                  <CardDescription>
                    Multiple ways to reach our support team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">info@गुनासो.com</p>
                      <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">+9779868597841</p>
                      <p className="text-xs text-muted-foreground">Mon-Fri 9AM-6PM NPT</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                      <Button size="sm" className="mt-2">Start Chat</Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    <Users className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="font-medium">Community Forum</p>
                      <p className="text-sm text-muted-foreground">Get help from other farmers</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Visit Forum
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Ticket Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LifeBuoy className="w-5 h-5" />
                    Submit Support Ticket
                  </CardTitle>
                  <CardDescription>
                    Describe your issue and we'll help you resolve it
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticketSubject">Subject</Label>
                    <Input id="ticketSubject" placeholder="Brief description of your issue" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticketCategory">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="account">Account Issues</SelectItem>

                        <SelectItem value="payments">Payments & Billing</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticketPriority">Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticketDescription">Description</Label>
                    <Textarea
                      id="ticketDescription"
                      placeholder="Please provide detailed information about your issue..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button onClick={handleSubmitTicket} className="w-full">
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Summarizer Tab */}
          <TabsContent value="summarizer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Document Summarizer
                </CardTitle>
                <CardDescription>
                  Upload an image or PDF document to extract key points and summary
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {summarizerFile ? (
                      <div className="flex flex-col items-center gap-2">
                        {summarizerFile.type.startsWith('image/') ? (
                          <FileImage className="w-10 h-10 text-emerald-600" />
                        ) : (
                          <FileIcon className="w-10 h-10 text-emerald-600" />
                        )}
                        <p className="font-medium text-sm">{summarizerFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(summarizerFile.size / 1024).toFixed(1)} KB
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Change file
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-muted-foreground" />
                        <p className="font-medium">
                          Drop your file here or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supports images (PNG, JPG) and PDF documents
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleSummarize}
                    disabled={!summarizerFile || summarizerLoading}
                    className="w-full"
                  >
                    {summarizerLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Summarize Document
                      </>
                    )}
                  </Button>

                  {/* Result */}
                  {summarizerResult && (
                    <Card className={`border ${isDemoMode ? 'border-amber-300 bg-amber-50/30' : 'border-emerald-300 bg-emerald-50/30'}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          {isDemoMode ? (
                            <>
                              <Landmark className="w-5 h-5 text-amber-600" />
                              <span className="text-amber-800">Demo: Government Document Summary</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5 text-emerald-600" />
                              <span className="text-emerald-800">Key Points Extracted</span>
                            </>
                          )}
                        </CardTitle>
                        {isDemoMode && (
                          <CardDescription className="text-amber-700">
                            API summarization was not available. Showing a sample government document summary instead.
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {summarizerResult}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {summarizerError && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {summarizerError}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete guides and API documentation
                  </p>
                  <Button variant="outline" className="w-full">
                    View Docs
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Mobile App
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download our mobile app for iOS and Android
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      App Store
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Google Play
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Check the current status of our services
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">All systems operational</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Status Page
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with other farmers and share experiences
                  </p>
                  <Button variant="outline" className="w-full">
                    Join Community
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Blog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Latest updates, tips, and farming insights
                  </p>
                  <Button variant="outline" className="w-full">
                    Read Blog
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Webinars
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Live and recorded training sessions
                  </p>
                  <Button variant="outline" className="w-full">
                    View Webinars
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Help;
