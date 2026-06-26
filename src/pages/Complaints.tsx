import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp,
  arrayUnion,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  ShieldAlert, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  MessageSquare,
  ChevronRight,
  User,
  Calendar,
  MapPin,
  Send,
  Loader2,
  FileText,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

interface ComplaintReply {
  author: string;
  authorType: 'admin' | 'user';
  content: string;
  createdAt: Timestamp | Date;
}

interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  category: 'agriculture' | 'financial' | 'infrastructure' | 'technical' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'resolved';
  description: string;
  location: string;
  createdAt: Timestamp;
  replies?: ComplaintReply[];
}

const formatDate = (timestamp: Timestamp | Date | undefined | null): string => {
  if (!timestamp) return 'Pending';
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString();
  }
  return 'Pending';
};

const formatDateTime = (timestamp: Timestamp | Date | undefined | null): string => {
  if (!timestamp) return 'Pending';
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  if (timestamp instanceof Date) {
    return timestamp.toLocaleString();
  }
  return 'Pending';
};

const getTimestampSeconds = (timestamp: Timestamp | Date | undefined | null): number => {
  if (!timestamp) return 0;
  if (timestamp instanceof Timestamp) {
    return timestamp.seconds;
  }
  if (timestamp instanceof Date) {
    return Math.floor(timestamp.getTime() / 1000);
  }
  return 0;
};

const Complaints = () => {
  const { t } = useTranslation();
  const { profile, loading: profileLoading } = useUserProfile();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'agriculture' | 'financial' | 'infrastructure' | 'technical' | 'other'>('agriculture');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [adminResponse, setAdminResponse] = useState('');
  const [adminStatus, setAdminStatus] = useState<'pending' | 'in_progress' | 'resolved'>('in_progress');
  const [replying, setReplying] = useState(false);

  const isAdmin = profile?.userType === 'admin';

  useEffect(() => {
    if (profileLoading || !profile) return;

    setLoading(true);
    let complaintsQuery;

    if (isAdmin) {
      complaintsQuery = query(collection(db, 'complaints'));
    } else {
      complaintsQuery = query(
        collection(db, 'complaints'), 
        where('userId', '==', profile.id)
      );
    }

    const unsubscribe = onSnapshot(complaintsQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Complaint[];
      
      const sorted = docs.sort((a, b) => {
        const timeA = getTimestampSeconds(a.createdAt);
        const timeB = getTimestampSeconds(b.createdAt);
        return timeB - timeA;
      });

      setComplaints(sorted);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching complaints: ", error);
      toast.error("Failed to load complaints");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile, profileLoading, isAdmin]);

  useEffect(() => {
    if (selectedComplaint) {
      const updated = complaints.find(c => c.id === selectedComplaint.id);
      if (updated) {
        setSelectedComplaint(updated);
      }
    }
  }, [complaints, selectedComplaint]);

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    if (!newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!newDescription.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setSubmitting(true);
    try {
      const complaintData = {
        userId: profile.id,
        userName: profile.displayName || 'Anonymous User',
        userEmail: auth.currentUser?.email || '',
        title: newTitle.trim(),
        category: newCategory,
        priority: newPriority,
        status: 'pending',
        location: newLocation.trim(),
        description: newDescription.trim(),
        createdAt: serverTimestamp(),
        replies: []
      };

      await addDoc(collection(db, 'complaints'), complaintData);
      
      toast.success(t('complaints.submitSuccess', 'Complaint registered successfully!'));
      
      setNewTitle('');
      setNewCategory('agriculture');
      setNewPriority('medium');
      setNewLocation('');
      setNewDescription('');
      setIsCreateOpen(false);
    } catch (error: any) {
      console.error("Error creating complaint:", error);
      toast.error("Failed to register complaint: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedComplaint) return;

    if (!adminResponse.trim()) {
      toast.error("Please write a response");
      return;
    }

    setReplying(true);
    try {
      const complaintRef = doc(db, 'complaints', selectedComplaint.id);
      
      const newReply: ComplaintReply = {
        author: isAdmin ? 'Government Official' : (profile.displayName || 'User'),
        authorType: isAdmin ? 'admin' : 'user',
        content: adminResponse.trim(),
        createdAt: new Date()
      };

      const updateData: any = {
        replies: arrayUnion(newReply)
      };

      if (isAdmin) {
        updateData.status = adminStatus;
      }

      await updateDoc(complaintRef, updateData);
      
      toast.success("Response updated successfully");
      setAdminResponse('');
    } catch (error: any) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add response: " + error.message);
    } finally {
      setReplying(false);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      (complaint.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.id || '').substring(0, 8).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || complaint.category === selectedCategory;

    const matchesStatus = activeStatusTab === 'all' || complaint.status === activeStatusTab;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="py-20 px-6 lg:px-8 bg-white min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header Alert Banner */}
        {isAdmin && (
          <div className="bg-[#10B981] text-white rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="w-5 h-5 text-white/80" />
                <span className="text-xs font-semibold tracking-wider uppercase text-white/90 bg-white/10 px-2 py-0.5 rounded-md">{t('complaints.adminView', 'Government Portal View')}</span>
              </div>
              <h2 className="text-2xl font-bold">{t('complaints.adminTitle', 'Civic Complaints Control Desk')}</h2>
              <p className="text-sm text-white/80 mt-1">Review civil concerns, assign progress status, and issue official responses.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-xl py-3 px-6 flex items-center gap-6">
              <div className="text-center">
                <span className="text-xs text-white/80 block font-medium">Unresolved</span>
                <span className="text-3xl font-bold">{stats.pending + stats.inProgress}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div className="text-center">
                <span className="text-xs text-white/80 block font-medium">Resolved</span>
                <span className="text-3xl font-bold">{stats.resolved}</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Title Block */}
        {!isAdmin && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <ShieldAlert className="w-7 h-7 text-[#10B981]" />
                {t('complaints.title', 'Complaints')}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{t('complaints.subtitle', 'Raise your concerns to the authorities')}</p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold h-12 px-6 rounded-lg border-0 shadow-none flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('complaints.fileNew', 'File a Complaint')}
            </Button>
          </div>
        )}

        {/* Stats Cards Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="rounded-xl border border-gray-100 overflow-hidden shadow-sm relative group bg-white hover:shadow-md transition-shadow">
            <div className="absolute right-3 top-3 w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#10B981]" />
            </div>
            <CardHeader className="pb-2 pt-6 px-6">
              <CardDescription className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('complaints.total', 'Total')}</CardDescription>
              <CardTitle className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-1 text-xs text-gray-400">
              All submitted cases
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-100 overflow-hidden shadow-sm relative group bg-white hover:shadow-md transition-shadow">
            <div className="absolute right-3 top-3 w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <CardHeader className="pb-2 pt-6 px-6">
              <CardDescription className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('complaints.pending', 'Pending')}</CardDescription>
              <CardTitle className="text-3xl font-bold text-amber-600 mt-1">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-1 text-xs text-amber-600/80 font-medium">
              Awaiting assessment
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-100 overflow-hidden shadow-sm relative group bg-white hover:shadow-md transition-shadow">
            <div className="absolute right-3 top-3 w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-[#10B981] animate-spin" />
            </div>
            <CardHeader className="pb-2 pt-6 px-6">
              <CardDescription className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('complaints.inProgress', 'In Progress')}</CardDescription>
              <CardTitle className="text-3xl font-bold text-[#10B981] mt-1">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-1 text-xs text-[#10B981]/80 font-medium">
              Active investigations
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-100 overflow-hidden shadow-sm relative group bg-white hover:shadow-md transition-shadow">
            <div className="absolute right-3 top-3 w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            </div>
            <CardHeader className="pb-2 pt-6 px-6">
              <CardDescription className="text-xs font-medium text-gray-400 uppercase tracking-wider">{t('complaints.resolved', 'Resolved')}</CardDescription>
              <CardTitle className="text-3xl font-bold text-[#10B981] mt-1">{stats.resolved}</CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-1 text-xs text-[#10B981]/80 font-medium">
              Resolved grievances
            </CardContent>
          </Card>
        </div>

        {/* Filter and Control Area */}
        <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden bg-white p-5">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t('complaints.searchPlaceholder', 'Search complaints...')}
                className="pl-12 h-12 bg-gray-50 border-gray-200 focus-visible:ring-[#10B981] rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500">
                <Filter className="w-4 h-4 text-gray-400" />
                <span>Filters</span>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 w-[180px] bg-gray-50 border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-gray-100">
                  <SelectItem value="all">{t('complaints.allCategories', 'All Categories')}</SelectItem>
                  <SelectItem value="agriculture">{t('complaints.category.agriculture', 'Agriculture')}</SelectItem>
                  <SelectItem value="financial">{t('complaints.category.financial', 'Financial')}</SelectItem>
                  <SelectItem value="infrastructure">{t('complaints.category.infrastructure', 'Infrastructure')}</SelectItem>
                  <SelectItem value="technical">{t('complaints.category.technical', 'Technical')}</SelectItem>
                  <SelectItem value="other">{t('complaints.category.other', 'Other')}</SelectItem>
                </SelectContent>
              </Select>

              {isAdmin && (
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-semibold h-12 px-5 rounded-lg flex items-center gap-1.5 border-0 shadow-none"
                >
                  <Plus className="w-5 h-5" />
                  <span>{t('complaints.fileNew', 'New')}</span>
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-6 w-full" value={activeStatusTab} onValueChange={setActiveStatusTab}>
            <TabsList className="bg-gray-50 p-1 rounded-lg w-full max-w-lg grid grid-cols-4 h-11">
              <TabsTrigger value="all" className="rounded-md text-sm font-medium py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#10B981]">{t('complaints.allStatuses', 'All')}</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-md text-sm font-medium py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#10B981]">{t('complaints.pending', 'Pending')}</TabsTrigger>
              <TabsTrigger value="in_progress" className="rounded-md text-sm font-medium py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#10B981]">{t('complaints.inProgress', 'In Progress')}</TabsTrigger>
              <TabsTrigger value="resolved" className="rounded-md text-sm font-medium py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#10B981]">{t('complaints.resolved', 'Resolved')}</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Grid List of Complaints */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm space-y-4">
            <Loader2 className="w-10 h-10 text-[#10B981] animate-spin" />
            <p className="text-gray-400 font-medium text-sm">Fetching grievances details...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <ShieldAlert className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">No complaints found</h3>
            <p className="text-gray-400 max-w-sm mx-auto text-sm">Create a new complaint or change filters to view items.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <Card
                key={complaint.id}
                className={`rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 cursor-pointer flex flex-col bg-white ${
                  complaint.priority === 'high' ? 'ring-1 ring-red-100' : ''
                }`}
                onClick={() => {
                  setSelectedComplaint(complaint);
                  setAdminStatus(complaint.status);
                }}
              >
                <div className={`h-1.5 w-full ${
                  complaint.priority === 'high' ? 'bg-red-500' :
                  complaint.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'
                }`} />

                <CardHeader className="p-6 flex-1 pb-4">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded uppercase tracking-widest">
                      #{complaint.id.substring(0, 6)}
                    </span>
                    <Badge className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      complaint.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                      complaint.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {complaint.priority === 'high' ? 'High' : complaint.priority === 'medium' ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-gray-900 line-clamp-1">
                    {complaint.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold mt-1">
                    <span>{complaint.category}</span>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{complaint.location || 'N/A'}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3 line-clamp-3 leading-relaxed">
                    {complaint.description || 'No description provided.'}
                  </p>
                </CardHeader>

                <div className="px-6 pb-6 pt-2 flex flex-col justify-end gap-3 border-t border-gray-50 mt-auto">
                  <div className="flex items-center justify-between text-xs">
                    <Badge className={`text-xs font-medium px-2.5 py-1 rounded-lg gap-1.5 flex items-center w-fit border ${
                      complaint.status === 'resolved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                      complaint.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {complaint.status === 'resolved' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       complaint.status === 'in_progress' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                       <Clock className="w-3.5 h-3.5" />}
                      {complaint.status === 'resolved' ? 'Resolved' :
                       complaint.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-xs text-gray-400 font-medium">
                    {isAdmin ? (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-700">{complaint.userName}</span>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {complaint.replies && complaint.replies.length > 0 ? (
                      <div className="flex items-center gap-1 text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-lg font-semibold text-xs">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{complaint.replies.length} replies</span>
                      </div>
                    ) : (
                      <div className="text-gray-300 italic text-[11px]">No responses yet</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog for filing a new complaint */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl rounded-xl p-6 border border-gray-100 shadow-lg bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-gray-100">
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#10B981]" />
                {t('complaints.fileNew', 'File a Complaint')}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-sm">
                Provide necessary details below. Civil authorities will process this complaint within standard service durations.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateComplaint} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold text-gray-700">{t('complaints.complaintTitle', 'Complaint Title')} *</Label>
                <Input
                  id="title"
                  placeholder="Briefly state your concern..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-12 border-gray-200 focus-visible:ring-[#10B981] rounded-lg text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-bold text-gray-700">{t('complaints.category', 'Category')} *</Label>
                  <Select value={newCategory} onValueChange={(value: any) => setNewCategory(value)}>
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-[#10B981] rounded-lg text-sm">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-100">
                      <SelectItem value="agriculture">{t('complaints.category.agriculture', 'Agriculture')}</SelectItem>
                      <SelectItem value="financial">{t('complaints.category.financial', 'Financial')}</SelectItem>
                      <SelectItem value="infrastructure">{t('complaints.category.infrastructure', 'Infrastructure')}</SelectItem>
                      <SelectItem value="technical">{t('complaints.category.technical', 'Technical Support')}</SelectItem>
                      <SelectItem value="other">{t('complaints.category.other', 'Other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-bold text-gray-700">{t('complaints.priority', 'Priority')} *</Label>
                  <Select value={newPriority} onValueChange={(value: any) => setNewPriority(value)}>
                    <SelectTrigger className="h-12 border-gray-200 focus:ring-[#10B981] rounded-lg text-sm">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-gray-100">
                      <SelectItem value="low">{t('complaints.low', 'Low')}</SelectItem>
                      <SelectItem value="medium">{t('complaints.medium', 'Medium')}</SelectItem>
                      <SelectItem value="high">{t('complaints.high', 'High')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-bold text-gray-700">{t('complaints.location', 'Location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="location"
                    placeholder="e.g. Ward 4, Lalitpur"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="pl-12 h-12 border-gray-200 focus-visible:ring-[#10B981] rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-bold text-gray-700">{t('complaints.description', 'Description')} *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="min-h-[120px] border-gray-200 focus-visible:ring-[#10B981] rounded-lg text-sm"
                  required
                />
              </div>

              <DialogFooter className="pt-4 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateOpen(false)}
                  className="h-12 border-gray-200 hover:bg-gray-50 font-semibold rounded-lg px-6"
                >
                  {t('complaints.cancel', 'Cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-lg px-6 border-0 shadow-none flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{t('complaints.submit', 'Submit')}</span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog for Complaint Details & Replies */}
        {selectedComplaint && (
          <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
            <DialogContent className="max-w-3xl rounded-xl p-6 border border-gray-100 shadow-lg bg-white max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4 border-b border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="text-xs text-gray-400 font-bold bg-gray-50 border border-gray-100 px-3 py-1 rounded uppercase tracking-wider">
                    ID: {selectedComplaint.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      selectedComplaint.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                      selectedComplaint.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {selectedComplaint.priority === 'high' ? 'High' : selectedComplaint.priority === 'medium' ? 'Medium' : 'Low'}
                    </Badge>
                    <Badge className={`text-xs font-medium px-2.5 py-1 rounded-lg gap-1.5 flex items-center w-fit border ${
                      selectedComplaint.status === 'resolved' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' :
                      selectedComplaint.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {selectedComplaint.status === 'resolved' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                       selectedComplaint.status === 'in_progress' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                       <Clock className="w-3.5 h-3.5" />}
                      {selectedComplaint.status === 'resolved' ? 'Resolved' :
                       selectedComplaint.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                </div>
                <DialogTitle className="text-xl font-bold text-gray-900 leading-tight">
                  {selectedComplaint.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-semibold mt-2">
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>Submitted by: <strong className="text-gray-600">{selectedComplaint.userName}</strong></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600">{selectedComplaint.location || 'No Location'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>On: <strong className="text-gray-600">{formatDate(selectedComplaint.createdAt)}</strong></span>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
                  <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedComplaint.description || 'No description provided.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#10B981]" />
                    {t('complaints.replies', 'Replies')} ({selectedComplaint.replies?.length || 0})
                  </h4>

                  <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                    {!selectedComplaint.replies || selectedComplaint.replies.length === 0 ? (
                      <div className="text-center py-6 bg-gray-50 border border-gray-100 rounded-lg">
                        <p className="text-gray-400 text-xs italic">{t('complaints.noReplies', 'No replies yet.')}</p>
                      </div>
                    ) : (
                      selectedComplaint.replies.map((reply, index) => (
                        <div 
                          key={index} 
                          className={`p-4 rounded-lg text-sm leading-relaxed ${
                            reply.authorType === 'admin'
                              ? 'bg-[#10B981]/10 border border-[#10B981]/20 ml-6'
                              : 'bg-gray-50 border border-gray-100 mr-6'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-1.5">
                            <span className={`font-semibold text-xs ${reply.authorType === 'admin' ? 'text-[#10B981]' : 'text-gray-700'}`}>
                              {reply.authorType === 'admin' ? 'Official Response' : reply.author}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {formatDateTime(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <form onSubmit={handleAddResponse} className="pt-4 border-t border-gray-50 space-y-4">
                  {isAdmin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="statusSelect" className="text-xs font-bold text-gray-700">{t('complaints.updateStatus', 'Update Status')}</Label>
                        <Select 
                          value={adminStatus} 
                          onValueChange={(value: any) => setAdminStatus(value)}
                        >
                          <SelectTrigger className="h-10 border-gray-200 rounded-lg text-xs">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="pending">{t('complaints.pending', 'Pending')}</SelectItem>
                            <SelectItem value="in_progress">{t('complaints.inProgress', 'In Progress')}</SelectItem>
                            <SelectItem value="resolved">{t('complaints.resolved', 'Resolved')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="replyText" className="text-xs font-bold text-gray-700">
                      {isAdmin ? t('complaints.addResponse', 'Add Official Response') : 'Add Follow-up Message'}
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="replyText"
                        placeholder={isAdmin ? "Type your official response here..." : "Type your follow-up message..."}
                        value={adminResponse}
                        onChange={(e) => setAdminResponse(e.target.value)}
                        className="min-h-[80px] border-gray-200 focus-visible:ring-[#10B981] rounded-lg pr-12 text-sm leading-normal"
                        required
                      />
                      <Button 
                        type="submit" 
                        disabled={replying}
                        className="absolute right-3 bottom-3 w-8 h-8 p-0 bg-[#10B981] hover:bg-[#059669] rounded-lg flex items-center justify-center text-white border-0"
                        title="Send"
                      >
                        {replying ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Complaints;
