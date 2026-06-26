import React from 'react';
import { Filter, MapPin, Layers } from 'lucide-react';
import type { PollCategory, LocationScope } from '@/lib/polls';

interface PollFiltersProps {
  statusFilter: 'active' | 'ended' | 'all';
  setStatusFilter: (v: 'active' | 'ended' | 'all') => void;
  categoryFilter: PollCategory | 'all';
  setCategoryFilter: (v: PollCategory | 'all') => void;
  locationFilter: LocationScope | 'all';
  setLocationFilter: (v: LocationScope | 'all') => void;
}

const STATUS_TABS = [
  { label: 'All Polls', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Ended', value: 'ended' },
] as const;

const CATEGORIES: Array<{ label: string; value: PollCategory | 'all' }> = [
  { label: 'All Categories', value: 'all' },
  { label: 'Governance', value: 'governance' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Health', value: 'health' },
  { label: 'Education', value: 'education' },
  { label: 'Environment', value: 'environment' },
  { label: 'Other', value: 'other' },
];

const LOCATIONS: Array<{ label: string; value: LocationScope | 'all' }> = [
  { label: 'All Locations', value: 'all' },
  { label: 'Nationwide', value: 'nationwide' },
  { label: 'Province', value: 'province' },
  { label: 'District', value: 'district' },
  { label: 'Municipality', value: 'municipality' },
];

export const PollFilters: React.FC<PollFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex gap-1 bg-muted p-1 rounded-lg">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
              statusFilter === value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 min-w-[160px] max-w-[200px]">
        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as PollCategory | 'all')}
          className="w-full pl-9 pr-3 h-10 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
        >
          {CATEGORIES.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="relative flex-1 min-w-[160px] max-w-[200px]">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value as LocationScope | 'all')}
          className="w-full pl-9 pr-3 h-10 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
        >
          {LOCATIONS.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {(statusFilter !== 'all' || categoryFilter !== 'all' || locationFilter !== 'all') && (
        <button
          onClick={() => {
            setStatusFilter('all');
            setCategoryFilter('all');
            setLocationFilter('all');
          }}
          className="flex items-center gap-2 h-10 px-4 text-sm font-semibold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        >
          <Filter className="w-4 h-4" />
          Reset
        </button>
      )}
    </div>
  );
};
