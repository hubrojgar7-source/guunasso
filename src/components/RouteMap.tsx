import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  from: string | null;
  to: string | null;
  fromCoords: [number, number] | null;
  toCoords: [number, number] | null;
  showRoute: boolean;
}

const nepalCenter: [number, number] = [28.3949, 84.1240];

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

const fromIcon = new L.DivIcon({
  className: 'from-marker',
  html: `<div style="width:40px;height:40px;background:#22C55E;border:4px solid #86EFAC;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(34,197,94,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><circle cx="12" cy="12" r="3"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

const toIcon = new L.DivIcon({
  className: 'to-marker',
  html: `<div style="width:40px;height:40px;background:#EF4444;border:4px solid #FCA5A5;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(239,68,68,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill="white"/></svg></div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function FitBounds({ points, showRoute }: { points: [number, number][]; showRoute: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const t = setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(points, { padding: [50, 50] });
    }, showRoute ? 750 : 100);
    return () => clearTimeout(t);
  }, [map, points, showRoute]);
  return null;
}

const RouteMap = ({ from, to, fromCoords, toCoords, showRoute }: RouteMapProps) => {
  const hasRoute = from && to && fromCoords && toCoords;
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [roadDistance, setRoadDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRouteCoords([]);
    setRoadDistance(null);
    if (!fromCoords || !toCoords) return;

    const lng1 = fromCoords[1], lat1 = fromCoords[0];
    const lng2 = toCoords[1], lat2 = toCoords[0];
    const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?geometries=geojson&overview=full`;

    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const coords = data.routes?.[0]?.geometry?.coordinates;
        if (coords) {
          setRouteCoords(coords.map((c: number[]) => [c[1], c[0]]));
          setRoadDistance(Math.round(data.routes[0].distance / 1000));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [fromCoords, toCoords]);

  const straightDist = hasRoute ? haversineKm(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]) : 0;
  const displayDist = roadDistance || Math.round(straightDist * 1.4);
  const showPolyline = showRoute && routeCoords.length >= 2;

  return (
    <div className="rounded-xl overflow-hidden border bg-card">
      <MapContainer
        center={nepalCenter}
        zoom={7}
        className="h-[450px] w-full"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hasRoute && (
          <>
            <FitBounds points={showPolyline ? routeCoords : [fromCoords!, toCoords!]} showRoute={showRoute} />
            <Marker position={fromCoords!} icon={fromIcon}>
              <Popup><strong style={{ fontSize: 15 }}>{from}</strong><br /><span style={{ fontSize: 13, color: '#16A34A' }}>Departure</span></Popup>
            </Marker>
            <Marker position={toCoords!} icon={toIcon}>
              <Popup><strong style={{ fontSize: 15 }}>{to}</strong><br /><span style={{ fontSize: 13, color: '#DC2626' }}>Arrival</span></Popup>
            </Marker>
            {showPolyline && (
              <>
                <Polyline positions={routeCoords} color="#3B82F6" weight={8} opacity={0.2} />
                <Polyline positions={routeCoords} color="#3B82F6" weight={4} opacity={0.95} />
                <Polyline positions={routeCoords} color="#60A5FA" weight={2} opacity={0.6} />
              </>
            )}
          </>
        )}
      </MapContainer>
      <div className="px-5 py-3 bg-card border-t flex items-center justify-between text-sm">
        {hasRoute ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="font-semibold text-foreground">{from}</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="font-semibold text-foreground">{to}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {loading && !showPolyline && <span className="text-xs text-muted-foreground">Loading road route...</span>}
              <span className="text-xs font-medium text-foreground">~{displayDist} km{showPolyline ? ' via road' : ''}</span>
            </div>
          </>
        ) : (
          <div className="text-muted-foreground text-xs">Select departure and destination cities to see route</div>
        )}
      </div>
    </div>
  );
};

export default RouteMap;
