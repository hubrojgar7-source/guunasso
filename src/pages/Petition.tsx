import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollText, Plus, Users, Clock, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react';
import { getPetitions, createPetition, signPetition, getUserSignature, Petition as PetitionType, PetitionCategory } from '@/lib/petitions';
import { useAuth } from '@/hooks/useAuth';

const Petition = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [petitions, setPetitions] = useState<PetitionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [signingId, setSigningId] = useState<string | null>(null);
  const [signedIds, setSignedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState({ title: '', description: '', category: '' as PetitionCategory, targetSignatures: 100 });

  const fetchPetitions = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      const data = await getPetitions(filters);
      setPetitions(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load petitions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetitions();
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    if (!user || petitions.length === 0) return;
    const checkSignatures = async () => {
      const signed = new Set<string>();
      for (const p of petitions) {
        const sig = await getUserSignature(p.id);
        if (sig) signed.add(p.id);
      }
      setSignedIds(signed);
    };
    checkSignatures();
  }, [user, petitions]);

  const handleSign = async (id: string) => {
    setSigningId(id);
    try {
      await signPetition(id);
      setSignedIds(prev => new Set(prev).add(id));
      setPetitions(prev => prev.map(p =>
        p.id === id ? { ...p, totalSignatures: p.totalSignatures + 1 } : p
      ));
      toast({ title: 'हस्ताक्षर गरियो / Signed!', description: 'तपाईंले यो मागपत्रमा हस्ताक्षर गर्नुभयो।' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to sign', variant: 'destructive' });
    } finally {
      setSigningId(null);
    }
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.description || !formData.category) return;
    try {
      const id = await createPetition(formData);
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', category: '' as PetitionCategory, targetSignatures: 100 });
      toast({ title: 'मागपत्र सिर्जना गरियो / Petition Created!', description: 'तपाईंको मागपत्र सफलतापूर्वक सिर्जना गरियो।' });
      fetchPetitions();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create', variant: 'destructive' });
    }
  };

  const categories: { value: PetitionCategory; label: string }[] = [
    { value: 'infrastructure', label: 'पूर्वाधार / Infrastructure' },
    { value: 'health', label: 'स्वास्थ्य / Health' },
    { value: 'education', label: 'शिक्षा / Education' },
    { value: 'environment', label: 'वातावरण / Environment' },
    { value: 'governance', label: 'सुशासन / Governance' },
    { value: 'social', label: 'सामाजिक / Social' },
    { value: 'other', label: 'अन्य / Other' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-primary/10 text-primary hover:bg-primary/10"><Clock className="w-3.5 h-3.5 mr-1" />सक्रिय / Active</Badge>;
      case 'responded': return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100"><CheckCircle className="w-3.5 h-3.5 mr-1" />जवाफ प्राप्त / Responded</Badge>;
      case 'closed': return <Badge variant="secondary"><AlertCircle className="w-3.5 h-3.5 mr-1" />बन्द / Closed</Badge>;
      default: return null;
    }
  };

  const filteredPetitions = petitions;

  return (
    <div className="p-6 space-y-6">
      {/* Header with Create button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-[180px] bg-muted border-0"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै / All</SelectItem>
              <SelectItem value="active">सक्रिय / Active</SelectItem>
              <SelectItem value="responded">जवाफ प्राप्त / Responded</SelectItem>
              <SelectItem value="closed">बन्द / Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 w-[220px] bg-muted border-0"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">सबै / All</SelectItem>
              {categories.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6">
              <Plus className="w-5 h-5 mr-2" />नयाँ मागपत्र / New Petition
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>नयाँ मागपत्र सिर्जना गर्नुहोस्</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>शीर्षक / Title</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="मागपत्रको शीर्षक" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>श्रेणी / Category</Label>
                <Select value={formData.category} onValueChange={(v: PetitionCategory) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="श्रेणी चयन गर्नुहोस्" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>लक्षित हस्ताक्षर / Target Signatures</Label>
                <Input type="number" value={formData.targetSignatures} onChange={e => setFormData({ ...formData, targetSignatures: parseInt(e.target.value) || 100 })} className="h-12" />
              </div>
              <div className="space-y-2">
                <Label>विवरण / Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="min-h-[120px]" placeholder="मागपत्रको विस्तृत विवरण" />
              </div>
              <Button onClick={handleCreate} className="w-full h-12">सिर्जना गर्नुहोस् / Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Petition List */}
      {loading ? (
        <div className="flex justify-center py-20 border rounded-xl bg-card"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : filteredPetitions.length === 0 ? (
        <Card className="bg-card">
          <CardContent className="py-16 text-center">
            <ScrollText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">कुनै मागपत्र फेला परेन। नयाँ मागपत्र सिर्जना गर्नुहोस्।</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPetitions.map(petition => {
            const progress = Math.round((petition.totalSignatures / petition.targetSignatures) * 100);
            const alreadySigned = signedIds.has(petition.id);
            return (
              <Card key={petition.id} className="bg-card hover:shadow-md transition-shadow">
                <CardHeader className="pb-4 pt-6 px-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ScrollText className="w-6 h-6 text-primary flex-shrink-0" />
                        <CardTitle className="text-lg font-semibold">{petition.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {getStatusBadge(petition.status)}
                        <Badge variant="outline">{categories.find(c => c.value === petition.category)?.label || petition.category}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{petition.description}</p>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="w-4 h-4" />{petition.totalSignatures} / {petition.targetSignatures}</span>
                      <span className="font-semibold">{Math.min(progress, 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t">
                    <span className="font-medium">{petition.createdByName} · {petition.createdAt.toLocaleDateString('ne-NP')}</span>
                    {petition.status === 'active' && !alreadySigned && (
                      <Button size="default" className="h-10 px-5" onClick={() => handleSign(petition.id)} disabled={signingId === petition.id}>
                        {signingId === petition.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Users className="w-4 h-4 mr-1.5" /> हस्ताक्षर / Sign</>}
                      </Button>
                    )}
                    {petition.status === 'active' && alreadySigned && (
                      <Badge variant="outline" className="text-primary border-primary/30">हस्ताक्षर गरियो / Signed</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Petition;
