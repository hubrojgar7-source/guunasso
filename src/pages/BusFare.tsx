import React, { useState } from 'react';
import { Bus, MapPin, ArrowRightLeft, Clock, IndianRupee, AlertCircle, Search, Users, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import KathmanduValleyMap from '@/components/KathmanduValleyMap';

interface BusRoute {
  id: string;
  from: string;
  to: string;
  fare: number;
  duration: string;
  busType: string;
  operator: string;
  departure: string;
  seats: number;
}

const cities = [
  'Kathmandu', 'Pokhara', 'Bharatpur', 'Chitwan', 'Butwal',
  'Nepalgunj', 'Biratnagar', 'Janakpur', 'Dharan', 'Hetauda',
  'Baglung', 'Dhangadhi', 'Mahendranagar', 'Birgunj', 'Palpa'
];

const allRoutes: BusRoute[] = [
  { id: '1', from: 'Kathmandu', to: 'Pokhara', fare: 800, duration: '7 hrs', busType: 'Deluxe', operator: 'Sajha Yatayat', departure: '6:00 AM', seats: 12 },
  { id: '2', from: 'Kathmandu', to: 'Pokhara', fare: 1200, duration: '6 hrs', busType: 'AC VIP', operator: 'Greenline', departure: '7:00 AM', seats: 8 },
  { id: '3', from: 'Kathmandu', to: 'Bharatpur', fare: 500, duration: '4 hrs', busType: 'Standard', operator: 'Sajha Yatayat', departure: '8:00 AM', seats: 15 },
  { id: '4', from: 'Pokhara', to: 'Kathmandu', fare: 800, duration: '7 hrs', busType: 'Deluxe', operator: 'Swallow', departure: '6:30 AM', seats: 10 },
  { id: '5', from: 'Pokhara', to: 'Butwal', fare: 600, duration: '5 hrs', busType: 'Standard', operator: 'Nepal Yatayat', departure: '7:00 AM', seats: 18 },
  { id: '6', from: 'Kathmandu', to: 'Biratnagar', fare: 1500, duration: '10 hrs', busType: 'AC Luxury', operator: 'Pathao', departure: '8:00 PM', seats: 6 },
  { id: '7', from: 'Kathmandu', to: 'Nepalgunj', fare: 1400, duration: '12 hrs', busType: 'Deluxe', operator: 'Karnali Yatayat', departure: '7:00 PM', seats: 10 },
  { id: '8', from: 'Bharatpur', to: 'Pokhara', fare: 550, duration: '4 hrs', busType: 'Standard', operator: 'Chitwan Travels', departure: '6:00 AM', seats: 14 },
  { id: '9', from: 'Kathmandu', to: 'Janakpur', fare: 700, duration: '6 hrs', busType: 'Deluxe', operator: 'Janakpur Yatayat', departure: '6:00 AM', seats: 11 },
  { id: '10', from: 'Butwal', to: 'Kathmandu', fare: 900, duration: '8 hrs', busType: 'AC VIP', operator: 'Greenline', departure: '7:00 PM', seats: 7 },
  { id: '11', from: 'Biratnagar', to: 'Kathmandu', fare: 1500, duration: '10 hrs', busType: 'AC Luxury', operator: 'Pathao', departure: '8:00 PM', seats: 5 },
  { id: '12', from: 'Kathmandu', to: 'Chitwan', fare: 600, duration: '5 hrs', busType: 'Standard', operator: 'Sajha Yatayat', departure: '7:00 AM', seats: 16 },
  { id: '13', from: 'Pokhara', to: 'Baglung', fare: 400, duration: '4 hrs', busType: 'Standard', operator: 'Gandaki Yatayat', departure: '6:00 AM', seats: 20 },
  { id: '14', from: 'Nepalgunj', to: 'Dhangadhi', fare: 500, duration: '5 hrs', busType: 'Standard', operator: 'Sudur Yatayat', departure: '6:00 AM', seats: 18 },
  { id: '15', from: 'Kathmandu', to: 'Hetauda', fare: 400, duration: '3 hrs', busType: 'Standard', operator: 'Bagmati Travels', departure: '8:00 AM', seats: 20 },
];

const BusFare = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState<BusRoute[]>([]);
  const [searched, setSearched] = useState(false);

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    if (from === to) return;

    const filtered = allRoutes.filter(
      r => r.from.toLowerCase() === from.toLowerCase() && r.to.toLowerCase() === to.toLowerCase()
    );
    setResults(filtered);
    setSearched(true);
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

      {searched && (
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bus className="w-5 h-5 text-primary" />
            {results.length > 0
              ? `${results.length} bus${results.length > 1 ? 'es' : ''} found from ${from} to ${to}`
              : `No direct buses found from ${from} to ${to}`}
          </h2>

          {results.length === 0 ? (
            <div className="border rounded-xl p-10 text-center bg-card">
              <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No routes available</h3>
              <p className="text-muted-foreground text-sm">Try different cities or check back later for new routes.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((route) => (
                <div key={route.id} className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bus className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <span>{route.from}</span>
                          <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
                          <span>{route.to}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {route.duration}
                          </span>
                          <span>{route.departure}</span>
                          <span className="bg-muted px-2 py-0.5 rounded">{route.busType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 md:text-right">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Fare</p>
                        <p className="text-2xl font-bold text-primary">Rs. {route.fare}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Operator</p>
                        <p className="text-sm font-semibold text-foreground">{route.operator}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground font-medium">Seats</p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> {route.seats}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Select your departure and destination cities above to check available bus routes, fares, and schedules.
            Fares shown are approximate and may vary by season.
          </p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-primary/10 rounded-lg">
            <Navigation className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Kathmandu <span className="text-primary">Valley</span>
            </h2>
            <p className="text-sm text-muted-foreground">Click stations to set start and end, then see the fare</p>
          </div>
        </div>

        <KathmanduValleyMap />
      </div>
    </div>
  );
};

export default BusFare;
