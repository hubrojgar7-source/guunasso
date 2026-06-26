import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation } from 'lucide-react';

interface Station {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const stations: Station[] = [
  { id: '1', name: 'Gongabu Bus Park', lat: 27.7413, lng: 85.3228 },
  { id: '2', name: 'Ratna Park', lat: 27.7031, lng: 85.3158 },
  { id: '3', name: 'Lagankhel Bus Station', lat: 27.6730, lng: 85.3253 },
  { id: '4', name: 'Balkhu', lat: 27.6910, lng: 85.2980 },
  { id: '5', name: 'Kalanki', lat: 27.6950, lng: 85.2890 },
  { id: '6', name: 'Suryabinayak', lat: 27.6710, lng: 85.3660 },
  { id: '7', name: 'Bhaktapur Bus Station', lat: 27.6720, lng: 85.4100 },
  { id: '8', name: 'Chabahil', lat: 27.7160, lng: 85.3500 },
  { id: '9', name: 'Koteshwor', lat: 27.6770, lng: 85.3540 },
  { id: '10', name: 'Samakhushi', lat: 27.7280, lng: 85.3300 },
  { id: '11', name: 'New Baneshwor', lat: 27.6950, lng: 85.3450 },
  { id: '12', name: 'Kirtipur', lat: 27.6780, lng: 85.2770 },
  { id: '13', name: 'Boudha', lat: 27.7210, lng: 85.3620 },
  { id: '14', name: 'Kalimati', lat: 27.6960, lng: 85.3060 },
  { id: '15', name: 'Jawalakhel', lat: 27.6710, lng: 85.3120 },
  { id: '16', name: 'Thankot', lat: 27.6850, lng: 85.2450 },
  { id: '17', name: 'Kapan', lat: 27.7370, lng: 85.3480 },
  { id: '18', name: 'Maitighar', lat: 27.6940, lng: 85.3280 },
  { id: '19', name: 'Patan Dhoka', lat: 27.6780, lng: 85.3260 },
  { id: '20', name: 'Bagbazar', lat: 27.7070, lng: 85.3160 },
];

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calcFare(distanceKm: number) {
  if (distanceKm <= 2) return 15;
  if (distanceKm <= 5) return 20;
  if (distanceKm <= 8) return 25;
  if (distanceKm <= 12) return 30;
  if (distanceKm <= 16) return 35;
  if (distanceKm <= 20) return 40;
  return 50;
}

const greenIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="width:32px;height:32px;background:#10B981;border:3px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const selectedIcon = new L.DivIcon({
  className: 'custom-marker-selected',
  html: `<div style="width:40px;height:40px;background:#059669;border:4px solid #34D399;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(16,185,129,0.5);cursor:pointer;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapClickHandler({ onSelect }: { onSelect: (station: Station) => void }) {
  useMapEvents({
    click(e) {
      const clicked = stations.reduce((best, s) => {
        const d = haversineKm(e.latlng.lat, e.latlng.lng, s.lat, s.lng);
        return d < best.dist ? { station: s, dist: d } : best;
      }, { station: stations[0], dist: Infinity });

      if (clicked.dist < 0.5) {
        onSelect(clicked.station);
      }
    },
  });
  return null;
}

const KathmanduValleyMap = () => {
  const [start, setStart] = useState<Station | null>(null);
  const [end, setEnd] = useState<Station | null>(null);
  const [mode, setMode] = useState<'start' | 'end'>('start');

  const distance = start && end ? haversineKm(start.lat, start.lng, end.lat, end.lng) : null;
  const fare = distance ? calcFare(distance) : null;

  const handleSelect = (station: Station) => {
    if (mode === 'start') {
      setStart(station);
      setMode('end');
    } else {
      setEnd(station);
      setMode('start');
    }
  };

  const resetSelection = () => {
    setStart(null);
    setEnd(null);
    setMode('start');
  };

  const isSelected = (s: Station) =>
    start?.id === s.id || end?.id === s.id;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 h-[500px] lg:h-[600px] relative z-0">
          <MapContainer
            center={[27.705, 85.325]}
            zoom={12}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onSelect={handleSelect} />
            {stations.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={isSelected(s) ? selectedIcon : greenIcon}
              >
                <Tooltip permanent={false} direction="top">
                  <span className="text-sm font-semibold">{s.name}</span>
                </Tooltip>
              </Marker>
            ))}
            {start && end && (
              <Polyline
                positions={[[start.lat, start.lng], [end.lat, end.lng]]}
                color="#10B981"
                weight={3}
                dashArray="8 6"
              />
            )}
          </MapContainer>
        </div>

        <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col gap-5">
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Select Stations</h3>
            <p className="text-xs text-gray-400 mb-4">
              Click a marker on the map, or pick from the list below. Click <strong>Start</strong> stations first, then <strong>End</strong>.
            </p>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('start')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  mode === 'start'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 inline mr-1" />
                Start
              </button>
              <button
                onClick={() => setMode('end')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-colors ${
                  mode === 'end'
                    ? 'bg-[#10B981] text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 inline mr-1" />
                End
              </button>
            </div>
          </div>

          {start && (
            <div className="bg-[#10B981]/5 rounded-lg p-3 border border-[#10B981]/10">
              <p className="text-xs text-gray-400 font-medium mb-0.5">Start</p>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                {start.name}
              </p>
            </div>
          )}

          {end && (
            <div className="bg-[#10B981]/5 rounded-lg p-3 border border-[#10B981]/10">
              <p className="text-xs text-gray-400 font-medium mb-0.5">End</p>
              <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-[#10B981]" />
                {end.name}
              </p>
            </div>
          )}

          {start && end && distance && fare && (
            <div className="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl p-5 text-white text-center">
              <p className="text-xs text-white/70 font-medium uppercase tracking-wider">Estimated Fare</p>
              <p className="text-3xl font-bold mt-1">Rs. {fare}</p>
              <p className="text-xs text-white/70 mt-1">{distance.toFixed(1)} km via road</p>
            </div>
          )}

          {!start && !end && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Click any station marker on the map to begin</p>
            </div>
          )}

          {(start || end) && (
            <button
              onClick={resetSelection}
              className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear selection
            </button>
          )}

          <div className="flex-1 min-h-0 overflow-auto">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">All Stations</p>
            <div className="space-y-1">
              {stations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                    start?.id === s.id
                      ? 'bg-[#10B981]/10 text-[#10B981] font-bold'
                      : end?.id === s.id
                        ? 'bg-[#059669]/10 text-[#059669] font-bold'
                        : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <span className="mr-1.5">
                    {start?.id === s.id ? '🟢' : end?.id === s.id ? '🔴' : '📍'}
                  </span>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KathmanduValleyMap;
