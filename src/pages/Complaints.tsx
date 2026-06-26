import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUserProfile } from '@/hooks/useUserProfile';
import {
  collection, addDoc, query, onSnapshot, doc, updateDoc,
  serverTimestamp, arrayUnion, arrayRemove, Timestamp, deleteDoc, increment
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ShieldAlert, Plus, Clock, CheckCircle2, Loader2,
  MessageSquare, User, Calendar, MapPin, Send, Trash2,
  ChevronUp, ChevronDown, Sparkles, AlertTriangle, AlertCircle, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { analyzeRisk, riskColors, riskBg, type RiskLevel } from '@/lib/riskDetection';
import { fileToBase64 } from '@/lib/storage';

interface Voter {
  userId: string;
  vote: 'up' | 'down';
}

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
  riskLevel: RiskLevel;
  status: 'pending' | 'in_progress' | 'resolved';
  description: string;
  location: string;
  createdAt: Timestamp;
  replies?: ComplaintReply[];
  upvotes: number;
  downvotes: number;
  voters: Voter[];
  mediaUrls?: string[];
}

const formatDate = (ts: Timestamp | Date | undefined | null): string => {
  if (!ts) return 'Pending';
  if (ts instanceof Timestamp) return ts.toDate().toLocaleDateString();
  if (ts instanceof Date) return ts.toLocaleDateString();
  return 'Pending';
};

const formatDateTime = (ts: Timestamp | Date | undefined | null): string => {
  if (!ts) return 'Pending';
  if (ts instanceof Timestamp) return ts.toDate().toLocaleString();
  if (ts instanceof Date) return ts.toLocaleString();
  return 'Pending';
};

const getTimestampSeconds = (ts: Timestamp | Date | undefined | null): number => {
  if (!ts) return 0;
  if (ts instanceof Timestamp) return ts.seconds;
  if (ts instanceof Date) return Math.floor(ts.getTime() / 1000);
  return 0;
};

const Complaints = () => {
  const { t } = useTranslation();
  const { profile, loading: profileLoading } = useUserProfile();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newRiskLevel, setNewRiskLevel] = useState<RiskLevel>('medium');
  const [newLocation, setNewLocation] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newVideos, setNewVideos] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const [adminResponse, setAdminResponse] = useState('');
  const [adminStatus, setAdminStatus] = useState<'pending' | 'in_progress' | 'resolved'>('in_progress');
  const [replying, setReplying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [votingId, setVotingId] = useState<string | null>(null);

  const isAdmin = profile?.userType === 'admin';

  useEffect(() => {
    if (profileLoading || !profile) return;
    setLoading(true);
    const complaintsQuery = query(collection(db, 'complaints'));
    const unsubscribe = onSnapshot(complaintsQuery, (snapshot) => {
      const docs = snapshot.docs.map(d => ({
        id: d.id,
        upvotes: 0,
        downvotes: 0,
        voters: [],
        ...d.data(),
      })) as Complaint[];
      const sorted = docs.sort((a, b) => getTimestampSeconds(b.createdAt) - getTimestampSeconds(a.createdAt));
      setComplaints(sorted);
      setLoading(false);
    }, () => {
      toast.error("Failed to load complaints");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [profile, profileLoading]);

  useEffect(() => {
    if (selectedComplaint) {
      const updated = complaints.find(c => c.id === selectedComplaint.id);
      if (updated) setSelectedComplaint(updated);
    }
  }, [complaints, selectedComplaint]);

  // --- AI Analysis (runs when description changes) ---
  const aiAnalysis = useMemo(() => {
    if (!newDescription.trim()) return null;
    return analyzeRisk(newDescription);
  }, [newDescription]);

  const riskLevelIcon: Record<RiskLevel, React.ReactNode> = {
    high: <AlertTriangle className="w-3.5 h-3.5" />,
    medium: <AlertCircle className="w-3.5 h-3.5" />,
    low: <Info className="w-3.5 h-3.5" />,
  };

  const riskLabel: Record<RiskLevel, string> = {
    high: 'High Risk',
    medium: 'Medium Risk',
    low: 'Low Risk',
  };

  // --- Create Complaint ---
  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!newTitle.trim()) { toast.error("Please enter a title"); return; }
    if (!newDescription.trim()) { toast.error("Please enter a description"); return; }

    setSubmitting(true);
    try {
      const mediaUrls: string[] = [];
      for (const file of newImages) {
        mediaUrls.push(await fileToBase64(file));
      }
      for (const file of newVideos) {
        mediaUrls.push(await fileToBase64(file));
      }

      const complaintData: Record<string, any> = {
        userId: profile.id,
        userName: profile.displayName || 'Anonymous User',
        userEmail: auth.currentUser?.email || '',
        title: newTitle.trim(),
        riskLevel: newRiskLevel,
        status: 'pending',
        location: newLocation.trim(),
        description: newDescription.trim(),
        createdAt: serverTimestamp(),
        replies: [],
        upvotes: 0,
        downvotes: 0,
        voters: [],
      };
      if (mediaUrls.length > 0) complaintData.mediaUrls = mediaUrls;

      await addDoc(collection(db, 'complaints'), complaintData);
      toast.success('Complaint registered successfully!');
      setNewTitle('');
      setNewRiskLevel('medium');
      setNewLocation('');
      setNewDescription('');
      setNewImages([]);
      setNewVideos([]);
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error("Failed to register complaint: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getPromotedLevel = (current: RiskLevel, netScore: number): RiskLevel | null => {
    if (current === 'low' && netScore >= 3) return 'medium';
    if (current === 'medium' && netScore >= 5) return 'high';
    if (current === 'medium' && netScore <= -2) return 'low';
    if (current === 'high' && netScore <= -3) return 'medium';
    return null;
  };

  // --- Vote ---
  const handleVote = async (complaintId: string, voteType: 'up' | 'down') => {
    const user = auth.currentUser;
    if (!user) { toast.error("Please sign in to vote"); return; }
    setVotingId(complaintId);
    try {
      const complaint = complaints.find(c => c.id === complaintId);
      if (!complaint) return;
      const existing = complaint.voters?.find(v => v.userId === user.uid);
      const complaintRef = doc(db, 'complaints', complaintId);

      let upChange = 0;
      let downChange = 0;

      if (existing) {
        if (existing.vote === voteType) {
          upChange = voteType === 'up' ? -1 : 0;
          downChange = voteType === 'down' ? -1 : 0;
          await updateDoc(complaintRef, {
            voters: arrayRemove({ userId: user.uid, vote: voteType }),
            [`${voteType}votes`]: increment(-1),
          });
        } else {
          upChange = voteType === 'up' ? 1 : -1;
          downChange = voteType === 'down' ? 1 : -1;
          const oldType = existing.vote;
          const updates: any = {
            voters: arrayRemove({ userId: user.uid, vote: oldType }),
            [`${oldType}votes`]: increment(-1),
          };
          await updateDoc(complaintRef, updates);
          await updateDoc(complaintRef, {
            voters: arrayUnion({ userId: user.uid, vote: voteType }),
            [`${voteType}votes`]: increment(1),
          });
        }
      } else {
        upChange = voteType === 'up' ? 1 : 0;
        downChange = voteType === 'down' ? 1 : 0;
        await updateDoc(complaintRef, {
          voters: arrayUnion({ userId: user.uid, vote: voteType }),
          [`${voteType}votes`]: increment(1),
        });
      }

      // Auto-promote/demote based on net score
      const newUp = (complaint.upvotes || 0) + upChange;
      const newDown = (complaint.downvotes || 0) + downChange;
      const netScore = newUp - newDown;
      const promoted = getPromotedLevel(complaint.riskLevel, netScore);
      if (promoted) {
        setPromotingId(complaintId);
        await updateDoc(complaintRef, { riskLevel: promoted });
        const label = promoted === 'high' ? 'High Risk' : promoted === 'medium' ? 'Medium Risk' : 'Low Risk';
        toast.success(`Complaint promoted to ${label} based on votes`);
      }
    } catch (err) {
      toast.error("Failed to vote");
    } finally {
      setVotingId(null);
      setPromotingId(null);
    }
  };

  // --- Delete ---
  const handleDeleteComplaint = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'complaints', id));
      toast.success('Complaint deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  // --- Reply ---
  const handleAddResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !selectedComplaint) return;
    if (!adminResponse.trim()) { toast.error("Please write a response"); return; }
    setReplying(true);
    try {
      const complaintRef = doc(db, 'complaints', selectedComplaint.id);
      const newReply: ComplaintReply = {
        author: isAdmin ? 'Government Official' : (profile.displayName || 'User'),
        authorType: isAdmin ? 'admin' : 'user',
        content: adminResponse.trim(),
        createdAt: new Date(),
      };
      const updateData: any = { replies: arrayUnion(newReply) };
      if (isAdmin) updateData.status = adminStatus;
      await updateDoc(complaintRef, updateData);

      if (isAdmin && selectedComplaint.userId && selectedComplaint.userId !== auth.currentUser?.uid) {
        try {
          const { createNotification: createNotif } = await import('@/lib/notifications');
          await createNotif({
            userId: selectedComplaint.userId,
            actorId: auth.currentUser?.uid || '',
            actorName: 'Government Official',
            type: 'complaint',
            title: 'Complaint Status Updated',
            message: `Your complaint "${selectedComplaint.title}" is now ${adminStatus.replace(/_/g, ' ')}`,
            link: '/dashboard/complaints',
          });
        } catch {}
      }
      toast.success("Response updated");
      setAdminResponse('');
    } catch (err: any) {
      toast.error("Failed to add response: " + err.message);
    } finally {
      setReplying(false);
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
    highRisk: complaints.filter(c => c.riskLevel === 'high').length,
    mediumRisk: complaints.filter(c => c.riskLevel === 'medium').length,
    lowRisk: complaints.filter(c => c.riskLevel === 'low').length,
  };

  const currentUserId = auth.currentUser?.uid;

  return (
    <div className="p-6">
      {/* Admin Alert */}
      {isAdmin && (
        <div className="bg-primary text-primary-foreground rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5" />
              <span className="text-xs font-semibold tracking-wider uppercase bg-background/10 px-2 py-0.5 rounded-md">Government Portal View</span>
            </div>
            <h2 className="text-2xl font-bold">Civic Complaints Control Desk</h2>
            <p className="text-sm mt-1 opacity-80">Review civil concerns, assign progress status, and issue official responses.</p>
          </div>
          <div className="bg-background/10 border border-background/20 rounded-xl py-3 px-6 flex items-center gap-6">
            <div className="text-center">
              <span className="text-xs block font-medium opacity-80">Unresolved</span>
              <span className="text-3xl font-bold">{stats.pending + stats.inProgress}</span>
            </div>
            <div className="h-8 w-px bg-background/20" />
            <div className="text-center">
              <span className="text-xs block font-medium opacity-80">Resolved</span>
              <span className="text-3xl font-bold">{stats.resolved}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          {(['high', 'medium', 'low'] as RiskLevel[]).map(level => (
            <div key={level} className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${
              level === 'high' ? 'border-red-200 bg-red-50 text-red-700' :
              level === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700' :
              'border-green-200 bg-green-50 text-green-700'
            }`}>
              {riskLevelIcon[level]}
              {riskLabel[level]}: {stats[`${level}Risk`]}
            </div>
          ))}
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="h-11 px-6 flex-shrink-0">
          <Plus className="w-5 h-5 mr-1" />
          File a Complaint
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-16 border rounded-xl bg-card">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground font-medium text-sm">Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <ShieldAlert className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-1">No complaints yet</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-sm">File a complaint to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6" style={{ alignItems: 'start' }}>
          {(['high', 'medium', 'low'] as RiskLevel[]).map(level => {
            const levelComplaints = complaints.filter(c => c.riskLevel === level);
            return (
              <div key={level}>
                <div className={`flex items-center gap-2 mb-4 px-4 py-2.5 rounded-xl border font-bold text-sm ${
                  level === 'high' ? 'border-red-200 bg-red-50 text-red-700' :
                  level === 'medium' ? 'border-amber-200 bg-amber-50 text-amber-700' :
                  'border-green-200 bg-green-50 text-green-700'
                }`}>
                  {riskLevelIcon[level]}
                  {riskLabel[level]}
                  <span className="ml-auto text-xs opacity-60">{levelComplaints.length}</span>
                </div>
                <div className="space-y-4">
                  {levelComplaints.length === 0 ? (
                    <div className="text-center py-8 border border-dashed rounded-xl bg-card/50">
                      <p className="text-muted-foreground text-xs">No {level} risk complaints</p>
                    </div>
                  ) : levelComplaints.map(complaint => {
            const myVote = complaint.voters?.find(v => v.userId === currentUserId);
            return (
              <Card
                key={complaint.id}
                className="rounded-xl border overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col bg-card"
                onClick={() => { setSelectedComplaint(complaint); setAdminStatus(complaint.status); }}
              >
                <div className={`h-1.5 w-full ${riskBg[complaint.riskLevel]}`} />

                <CardHeader className="p-5 flex-1 pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] text-muted-foreground font-bold bg-muted px-2 py-0.5 rounded uppercase tracking-widest">
                      #{complaint.id.substring(0, 6)}
                    </span>
                    <div className="flex items-center gap-1">
                      {(isAdmin || complaint.userId === profile?.id) && (
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteComplaint(complaint.id); }}
                          disabled={deletingId === complaint.id}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                        >
                          {deletingId === complaint.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-base font-bold text-foreground line-clamp-1">{complaint.title}</CardTitle>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold mt-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{complaint.location || 'N/A'}</span>
                  </div>

                  <p className="text-muted-foreground text-sm mt-3 line-clamp-3 leading-relaxed">
                    {complaint.description || 'No description provided.'}
                  </p>
                  {complaint.mediaUrls && complaint.mediaUrls.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto">
                      {complaint.mediaUrls.slice(0, 3).map((url, i) => (
                        url.startsWith('data:video') ? (
                          <video key={i} src={url} className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-muted" />
                        ) : (
                          <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-muted" />
                        )
                      ))}
                      {complaint.mediaUrls.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground font-semibold flex-shrink-0">
                          +{complaint.mediaUrls.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>

                <div className="px-5 pb-5 pt-1 flex flex-col gap-3 border-t mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); handleVote(complaint.id, 'up'); }}
                        disabled={votingId === complaint.id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-xs font-medium ${
                          myVote?.vote === 'up' ? 'text-orange-600 bg-orange-50' : 'text-muted-foreground hover:text-orange-600 hover:bg-orange-50'
                        }`}
                      >
                        <ChevronUp className="w-4 h-4" />
                        Upvote
                      </button>
                      <span className={`text-sm font-bold min-w-[24px] text-center ${
                        (complaint.upvotes || 0) - (complaint.downvotes || 0) > 0 ? 'text-orange-500' :
                        (complaint.upvotes || 0) - (complaint.downvotes || 0) < 0 ? 'text-blue-500' :
                        'text-muted-foreground'
                      }`}>
                        {(complaint.upvotes || 0) - (complaint.downvotes || 0)}
                      </span>
                      <button
                        onClick={e => { e.stopPropagation(); handleVote(complaint.id, 'down'); }}
                        disabled={votingId === complaint.id}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors text-xs font-medium ${
                          myVote?.vote === 'down' ? 'text-blue-600 bg-blue-50' : 'text-muted-foreground hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                        Downvote
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {isAdmin ? (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">{complaint.userName}</span>
                      </div>
                    ) : <div />}
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(complaint.createdAt)}
                      </span>
                      {complaint.replies && complaint.replies.length > 0 && (
                        <span className="flex items-center gap-1 text-primary bg-primary/10 px-2.5 py-1 rounded-lg font-semibold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {complaint.replies.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  })}
</div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              File a Complaint
            </DialogTitle>
            <DialogDescription>
              Select a risk level and describe your issue. AI will analyze and suggest the appropriate risk category.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateComplaint} className="space-y-5 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Complaint Title *</Label>
              <Input
                id="title"
                placeholder="Briefly state your concern..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Risk Level * (you choose first)</Label>
              <div className="grid grid-cols-3 gap-3">
                {(['high', 'medium', 'low'] as RiskLevel[]).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setNewRiskLevel(level)}
                    className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                      newRiskLevel === level
                        ? level === 'high' ? 'border-red-500 bg-red-50 text-red-700'
                          : level === 'medium' ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-green-500 bg-green-50 text-green-700'
                        : 'border-muted bg-card text-muted-foreground hover:border-muted-foreground/30'
                    }`}
                  >
                    {riskLevelIcon[level]}
                    {riskLabel[level]}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Analysis */}
            {aiAnalysis && (
              <div className={`p-4 rounded-xl border ${
                aiAnalysis.level === 'high' ? 'bg-red-50 border-red-200' :
                aiAnalysis.level === 'medium' ? 'bg-amber-50 border-amber-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AI Risk Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Detected:</span>
                  <Badge className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${riskColors[aiAnalysis.level]}`}>
                    {riskLevelIcon[aiAnalysis.level]}
                    <span className="ml-1">{riskLabel[aiAnalysis.level]}</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">({aiAnalysis.confidence}% confidence)</span>
                  {aiAnalysis.level !== newRiskLevel && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs ml-auto"
                      onClick={() => setNewRiskLevel(aiAnalysis.level)}
                    >
                      Use AI suggestion
                    </Button>
                  )}
                </div>
                {aiAnalysis.matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {aiAnalysis.matchedKeywords.map((kw, i) => (
                      <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        kw.level === 'high' ? 'bg-red-100 text-red-700' :
                        kw.level === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {kw.word}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="location"
                  placeholder="e.g. Ward 4, Lalitpur"
                  value={newLocation}
                  onChange={e => setNewLocation(e.target.value)}
                  className="pl-12 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your issue in detail..."
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Attach Images & Videos</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-muted-foreground">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => {
                        const files = e.target.files;
                        if (files) setNewImages(Array.from(files));
                      }}
                    />
                    {newImages.length > 0 ? `${newImages.length} image(s) selected` : 'Choose Images'}
                  </label>
                </div>
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-muted-foreground">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={e => {
                        const files = e.target.files;
                        if (files) setNewVideos(Array.from(files));
                      }}
                    />
                    {newVideos.length > 0 ? `${newVideos.length} video(s) selected` : 'Choose Videos'}
                  </label>
                </div>
              </div>
              {(newImages.length > 0 || newVideos.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {newImages.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg text-xs text-muted-foreground">
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button type="button" onClick={() => setNewImages(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80 ml-1">&times;</button>
                    </div>
                  ))}
                  {newVideos.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg text-xs text-muted-foreground">
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button type="button" onClick={() => setNewVideos(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80 ml-1">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="h-12 px-6">Cancel</Button>
              <Button type="submit" disabled={submitting} className="h-12 px-6">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin mr-1" /> Submitting...</> : <><Send className="w-5 h-5 mr-1" /> Submit</>}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      {selectedComplaint && (
        <Dialog open={!!selectedComplaint} onOpenChange={open => !open && setSelectedComplaint(null)}>
          <DialogContent className="max-w-3xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="text-xs text-muted-foreground font-bold bg-muted px-3 py-1 rounded uppercase tracking-wider">
                  ID: {selectedComplaint.id}
                </span>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${riskColors[selectedComplaint.riskLevel]}`}>
                    {riskLevelIcon[selectedComplaint.riskLevel]}
                    <span className="ml-1">{riskLabel[selectedComplaint.riskLevel]}</span>
                  </Badge>
                </div>
              </div>
              <DialogTitle className="text-xl font-bold leading-tight">{selectedComplaint.title}</DialogTitle>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold mt-2">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Submitted by: <strong className="text-foreground">{selectedComplaint.userName}</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-foreground">{selectedComplaint.location || 'No Location'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>On: <strong className="text-foreground">{formatDate(selectedComplaint.createdAt)}</strong></span>
                </div>
              </div>

              {/* Vote stats in detail */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                <div className="flex items-center gap-1.5 text-sm">
                  <ChevronUp className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-foreground">{selectedComplaint.upvotes || 0}</span>
                  <span className="text-muted-foreground text-xs">Upvote</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <ChevronDown className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-foreground">{selectedComplaint.downvotes || 0}</span>
                  <span className="text-muted-foreground text-xs">Downvote</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-semibold text-foreground">{selectedComplaint.replies?.length || 0}</span>
                  <span className="text-xs">replies</span>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="bg-muted rounded-lg p-5 border">
                <h4 className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2">Description</h4>
                <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.description || 'No description provided.'}
                </p>
                {selectedComplaint.mediaUrls && selectedComplaint.mediaUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedComplaint.mediaUrls.map((url, i) => (
                      url.startsWith('data:video') ? (
                        <video key={i} src={url} controls className="w-full rounded-xl border bg-black" style={{ maxHeight: 300 }} />
                      ) : (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <img src={url} alt="" className="w-full rounded-xl border object-cover bg-muted" style={{ maxHeight: 300 }} />
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Replies ({selectedComplaint.replies?.length || 0})
                </h4>
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
                  {!selectedComplaint.replies || selectedComplaint.replies.length === 0 ? (
                    <div className="text-center py-6 bg-muted border rounded-lg">
                      <p className="text-muted-foreground text-xs italic">No replies yet.</p>
                    </div>
                  ) : (
                    selectedComplaint.replies.map((reply, index) => (
                      <div key={index} className={`p-4 rounded-lg text-sm leading-relaxed ${
                        reply.authorType === 'admin' ? 'bg-primary/10 border border-primary/20 ml-6' : 'bg-muted border mr-6'
                      }`}>
                        <div className="flex items-center justify-between gap-3 mb-1.5">
                          <span className={`font-semibold text-xs ${reply.authorType === 'admin' ? 'text-primary' : 'text-foreground'}`}>
                            {reply.authorType === 'admin' ? 'Official Response' : reply.author}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">{formatDateTime(reply.createdAt)}</span>
                        </div>
                        <p className="text-foreground text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <form onSubmit={handleAddResponse} className="pt-4 border-t space-y-4">
                {isAdmin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="statusSelect" className="text-xs font-bold">Update Status</Label>
                      <Select value={adminStatus} onValueChange={(v: any) => setAdminStatus(v)}>
                        <SelectTrigger className="h-10 rounded-lg text-xs">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg">
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="replyText" className="text-xs font-bold">
                    {isAdmin ? 'Add Official Response' : 'Add Follow-up Message'}
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="replyText"
                      placeholder={isAdmin ? "Type your official response here..." : "Type your follow-up message..."}
                      value={adminResponse}
                      onChange={e => setAdminResponse(e.target.value)}
                      className="min-h-[80px] pr-12 text-sm leading-normal"
                      required
                    />
                    <Button type="submit" disabled={replying}
                      className="absolute right-3 bottom-3 w-8 h-8 p-0 rounded-lg flex items-center justify-center">
                      {replying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Complaints;
