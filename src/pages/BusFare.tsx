import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ArrowRightLeft, AlertCircle, Search, Navigation, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeRisk } from '@/lib/riskDetection';
import type { RiskLevel } from '@/lib/riskDetection';
import { fileToBase64 } from '@/lib/storage';
import RouteMap from '@/components/RouteMap';

function toRad(deg: number) { return deg * (Math.PI / 180); }

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const busTypes = [
  { label: 'Ordinary public bus', key: 'ordinary' as const },
  { label: 'Deluxe public bus', key: 'deluxe' as const },
  { label: 'Tourist bus', key: 'tourist' as const },
  { label: 'VIP/Sofa tourist bus', key: 'vip' as const },
];

function estimateFares(distanceKm: number) {
  const roadKm = distanceKm * 1.4;
  return {
    ordinary: [Math.round(roadKm * 4), Math.round(roadKm * 5.5)],
    deluxe: [Math.round(roadKm * 5.5), Math.round(roadKm * 7.5)],
    tourist: [Math.round(roadKm * 7.5), Math.round(roadKm * 10)],
    vip: [Math.round(roadKm * 10), Math.round(roadKm * 13)],
  };
}

const cities = [
  'Kathmandu', 'Pokhara', 'Bharatpur', 'Chitwan', 'Butwal',
  'Nepalgunj', 'Biratnagar', 'Janakpur', 'Dharan', 'Hetauda',
  'Baglung', 'Dhangadhi', 'Mahendranagar', 'Birgunj', 'Palpa'
];

const cityCoordinates: Record<string, [number, number]> = {
  Kathmandu: [27.7172, 85.3240],
  Pokhara: [28.2096, 83.9856],
  Bharatpur: [27.6833, 84.4333],
  Chitwan: [27.5290, 84.3540],
  Butwal: [27.7000, 83.4500],
  Nepalgunj: [28.0500, 81.6167],
  Biratnagar: [26.4547, 87.2797],
  Janakpur: [26.7288, 85.9250],
  Dharan: [26.8129, 87.2836],
  Hetauda: [27.4283, 85.0322],
  Baglung: [28.2667, 83.5833],
  Dhangadhi: [28.6833, 80.6000],
  Mahendranagar: [28.9667, 80.1667],
  Birgunj: [27.0143, 84.8720],
  Palpa: [27.8667, 83.5500],
};

const FarePanel = ({ from, to, fromCoords, toCoords }: { from: string; to: string; fromCoords: [number, number] | null; toCoords: [number, number] | null }) => {
  if (!fromCoords || !toCoords) return null;
  const distance = haversineKm(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
  const fares = estimateFares(distance);

  return (
    <div className="bg-gradient-to-br from-primary/5 via-card to-primary/5 rounded-xl border-2 border-primary/10 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-primary/10 rounded-xl">
          <Navigation className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Estimated Fares</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {from} → {to}
          </p>
        </div>
      </div>

      <div className="space-y-1 mb-5">
        {busTypes.map((bt) => {
          const [lo, hi] = fares[bt.key];
          return (
            <div key={bt.key} className="flex items-center justify-between py-3 px-4 rounded-xl bg-card border border-border/60 hover:border-primary/20 hover:bg-primary/[0.02] transition-colors">
              <span className="text-sm font-medium text-foreground">{bt.label}</span>
              <span className="text-base font-bold text-primary whitespace-nowrap">
                Rs. {lo} – {hi}
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-xl p-4 border border-border/60">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Trip Details</h4>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Straight-line distance</span>
            <span className="text-sm font-semibold text-foreground">{distance.toFixed(0)} km</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estimated road distance</span>
            <span className="text-sm font-semibold text-foreground">{(distance * 1.4).toFixed(0)} km</span>
          </div>
          <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
            <span className="text-sm text-muted-foreground">Estimated travel time</span>
            <span className="text-sm font-semibold text-foreground">
              {distance > 0 ? `${Math.round(distance / 45 * 1.4 * 10) / 10} hrs` : '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const BusFare = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [searched, setSearched] = useState(false);
  const [complainOpen, setComplainOpen] = useState(false);
  const [compTitle, setCompTitle] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compBusNumber, setCompBusNumber] = useState('');
  const [compSubmitting, setCompSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [compImages, setCompImages] = useState<File[]>([]);
  const [compVideos, setCompVideos] = useState<File[]>([]);

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    if (from === to) return;
    setSearched(true);
  };

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle.trim() || !compDesc.trim()) return;
    setCompSubmitting(true);
    setAnalyzing(true);
    try {
      // AI analysis with minimum 2 second animation
      const [risk] = await Promise.all([
        analyzeRisk(compTitle.trim(), compDesc.trim()),
        new Promise<void>(resolve => setTimeout(resolve, 2000)),
      ]);
      const priority = risk.level as RiskLevel;
      let category = 'other';
      if (risk.keywords.length > 0) {
        const k = risk.keywords[0].toLowerCase();
        if (['financial', 'money', 'payment', 'fare', 'price', 'cost', 'expensive', 'overcharge'].some(w => k.includes(w))) category = 'financial';
        else if (['infrastructure', 'road', 'bridge', 'station', 'stop', 'terminal'].some(w => k.includes(w))) category = 'infrastructure';
        else if (['service', 'driver', 'behavior', 'conduct', 'rude', 'delay', 'late'].some(w => k.includes(w))) category = 'service';
      }
      const mediaUrls: string[] = [];
      for (const file of compImages) mediaUrls.push(await fileToBase64(file));
      for (const file of compVideos) mediaUrls.push(await fileToBase64(file));
      const complaintData: Record<string, any> = {
        userId: auth.currentUser?.uid || 'anonymous',
        userName: auth.currentUser?.displayName || 'Anonymous',
        userEmail: auth.currentUser?.email || '',
        title: compTitle.trim(),
        category,
        priority,
        status: 'pending',
        location: `${from} → ${to}`,
        busNumber: compBusNumber.trim() || '',
        description: compDesc.trim(),
        riskLabel: risk.label,
        riskLevel: risk.level,
        riskColor: risk.color,
        riskKeywords: risk.keywords,
        createdAt: serverTimestamp(),
        replies: [],
      };
      if (mediaUrls.length > 0) complaintData.mediaUrls = mediaUrls;
      await addDoc(collection(db, 'complaints'), complaintData);
      setComplainOpen(false);
      setCompTitle('');
      setCompDesc('');
      setCompBusNumber('');
      setCompImages([]);
      setCompVideos([]);
      navigate('/dashboard/complaints');
    } catch (err) {
      console.error('Complaint failed:', err);
    } finally {
      setCompSubmitting(false);
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-4 mb-6">
        <div className="flex-1 w-full">
          <label className="text-sm font-semibold text-foreground mb-1.5 block">From</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-muted border-0 rounded-lg text-sm appearance-none cursor-pointer"
            >
              <option value="">Select departure city</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={swapLocations}
          className="p-3 rounded-lg border hover:bg-muted transition-colors flex-shrink-0 mb-0.5"
        >
          <ArrowRightLeft className="w-5 h-5 text-primary" />
        </button>

        <div className="flex-1 w-full">
          <label className="text-sm font-semibold text-foreground mb-1.5 block">To</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full pl-12 pr-4 h-12 bg-muted border-0 rounded-lg text-sm appearance-none cursor-pointer"
            >
              <option value="">Select destination city</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!from || !to || from === to}
          className="h-12 px-8 w-full md:w-auto"
        >
          <Search className="w-5 h-5" />
          Search
        </Button>
      </form>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-4">
          <Navigation className="w-5 h-5 text-primary" />
          {from && to && from !== to ? `Route: ${from} → ${to}` : 'Nepal Map'}
        </h2>
        <div className="flex gap-6">
          <div className={`transition-all duration-700 min-w-0 ${searched && from && to && from !== to ? 'w-[calc(100%-20rem)]' : 'w-full'}`}>
            <RouteMap
              from={from && to && from !== to ? from : null}
              to={from && to && from !== to ? to : null}
              fromCoords={from && to && from !== to && cityCoordinates[from] ? cityCoordinates[from] : null}
              toCoords={from && to && from !== to && cityCoordinates[to] ? cityCoordinates[to] : null}
              showRoute={searched}
            />
          </div>
          <div className={`overflow-hidden transition-all duration-700 ${searched && from && to && from !== to && cityCoordinates[from] && cityCoordinates[to] ? 'w-80 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="w-80">
              <FarePanel
                from={from || ''}
                to={to || ''}
                fromCoords={from && cityCoordinates[from] ? cityCoordinates[from] : null}
                toCoords={to && cityCoordinates[to] ? cityCoordinates[to] : null}
              />
            </div>
          </div>
        </div>
      </div>

      {from && to && from !== to && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl">
              <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Did someone ask for more money than this?</p>
              <p className="text-sm text-muted-foreground mt-1">Report overcharging on the <span className="font-semibold text-foreground">{from} → {to}</span> route</p>
            </div>
          </div>
          <Button variant="destructive" size="lg" onClick={() => setComplainOpen(true)} className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto shadow-sm">
            <AlertTriangle className="w-5 h-5" />
            File a Complaint
          </Button>
        </div>
      )}

      <Dialog open={complainOpen} onOpenChange={setComplainOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>File a Complaint</DialogTitle>
          </DialogHeader>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="relative">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <Sparkles className="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div>
                <p className="text-lg font-semibold">Our AI is analyzing your post</p>
                <p className="text-sm text-muted-foreground mt-1">Determining risk level and category...</p>
              </div>
            </div>
          ) : (
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Route</label>
              <Input value={`${from} → ${to}`} disabled className="bg-muted" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
              <Input value={compTitle} onChange={e => setCompTitle(e.target.value)} placeholder="e.g. Overcharged by bus driver" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Bus Number (optional)</label>
              <Input value={compBusNumber} onChange={e => setCompBusNumber(e.target.value)} placeholder="e.g. Ba 2 Kha 1234" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
              <Textarea value={compDesc} onChange={e => setCompDesc(e.target.value)} placeholder="Describe what happened..." rows={3} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground mb-1 block">Attach Images & Videos</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-muted-foreground">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={e => { const files = e.target.files; if (files) setCompImages(Array.from(files)); }}
                    />
                    {compImages.length > 0 ? `${compImages.length} image(s) selected` : 'Choose Images'}
                  </label>
                </div>
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors text-sm text-muted-foreground">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={e => { const files = e.target.files; if (files) setCompVideos(Array.from(files)); }}
                    />
                    {compVideos.length > 0 ? `${compVideos.length} video(s) selected` : 'Choose Videos'}
                  </label>
                </div>
              </div>
              {(compImages.length > 0 || compVideos.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {compImages.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg text-xs text-muted-foreground">
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button type="button" onClick={() => setCompImages(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80 ml-1">&times;</button>
                    </div>
                  ))}
                  {compVideos.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-lg text-xs text-muted-foreground">
                      <span className="truncate max-w-[100px]">{f.name}</span>
                      <button type="button" onClick={() => setCompVideos(prev => prev.filter((_, j) => j !== i))} className="text-destructive hover:text-destructive/80 ml-1">&times;</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setComplainOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={compSubmitting || !compTitle.trim() || !compDesc.trim()}>
                {compSubmitting ? 'Analyzing...' : 'Submit Complaint'}
              </Button>
            </DialogFooter>
          </form>
          )}
        </DialogContent>
      </Dialog>



      {!searched && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Select your departure and destination cities above to check available bus routes, fares, and schedules.
            Fares shown are approximate and may vary by season.
          </p>
        </div>
      )}

    </div>
  );
};

export default BusFare;
