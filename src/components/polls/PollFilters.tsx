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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg flex-shrink-0">
        {STATUS_TABS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value as any)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              statusFilter === value
                ? 'bg-[#10B981] text-white shadow-sm'
                : 'text-gray-500 hover:text-[#10B981]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#10B981]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as PollCategory | 'all')}
            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 appearance-none cursor-pointer font-medium"
          >
            {CATEGORIES.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#10B981]" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value as LocationScope | 'all')}
            className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 appearance-none cursor-pointer font-medium"
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
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-[#10B981] bg-[#10B981]/10 rounded-lg hover:bg-[#10B981]/20 transition-colors flex-shrink-0"
          >
            <Filter className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};
