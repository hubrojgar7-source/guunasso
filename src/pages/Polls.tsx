import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, BarChart2 } from 'lucide-react';
import { getPolls, type Poll, type PollCategory, type LocationScope } from '@/lib/polls';
import { PollCard } from '@/components/polls/PollCard';
import { PollFilters } from '@/components/polls/PollFilters';
import { useUserProfile } from '@/hooks/useUserProfile';

const Polls = () => {
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState<'active' | 'ended' | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<PollCategory | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<LocationScope | 'all'>('all');

  const canCreatePoll = profile?.userType === 'farmer' || profile?.userType === 'admin' || profile?.userType === 'organization';

  useEffect(() => {
    fetchPolls();
  }, [statusFilter, categoryFilter, locationFilter]);

  const fetchPolls = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (categoryFilter !== 'all') filters.category = categoryFilter;
      if (locationFilter !== 'all') filters.locationScope = locationFilter;

      const data = await getPolls(filters);
      setPolls(data);
    } catch (error) {
      console.error('Failed to load polls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePollDeleted = (id: string) => {
    setPolls((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Poll &amp; <span className="text-[#10B981]">Voting System</span>
              </h1>
              <p className="text-gray-500 mt-2">Participate in community decisions and voice your opinion.</p>
            </div>
            {canCreatePoll && (
              <button
                onClick={() => navigate('/dashboard/polls/create')}
                className="flex items-center gap-2 bg-[#10B981] text-white text-sm font-semibold px-5 py-3 rounded-lg shadow-none hover:bg-[#059669] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Poll
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-6 py-4 shadow-sm">
            <div className="bg-[#10B981]/10 p-3 rounded-lg">
              <BarChart2 className="w-8 h-8 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Civic Polls {!isLoading && <span className="text-[#10B981]">({polls.length})</span>}
              </h2>
              <p className="text-sm text-gray-500">Browse and vote on active community polls.</p>
            </div>
          </div>

          <PollFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
          />

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#10B981]" />
              <p className="text-sm font-medium">Loading polls...</p>
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-[#10B981]/40" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-1">No polls found</h3>
              <p className="text-sm text-gray-400 max-w-xs mx-auto">
                There are no polls matching your filters. Try switching to "All" to see everything.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {polls.map((poll) => (
                <PollCard 
                  key={poll.id} 
                  poll={poll} 
                  onClick={(id) => navigate(`/dashboard/polls/${id}`)}
                  onDeleted={handlePollDeleted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Polls;
