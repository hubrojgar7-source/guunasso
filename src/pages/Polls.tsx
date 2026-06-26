import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader2, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPolls, type Poll, type PollCategory, type LocationScope } from '@/lib/polls';
import { PollCard } from '@/components/polls/PollCard';
import { PollFilters } from '@/components/polls/PollFilters';

const Polls = () => {
  const navigate = useNavigate();

  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<'active' | 'ended' | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<PollCategory | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<LocationScope | 'all'>('all');

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <PollFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          locationFilter={locationFilter}
          setLocationFilter={setLocationFilter}
        />
        <Button
          onClick={() => navigate('/dashboard/polls/create')}
          className="flex items-center gap-2 h-11 px-6 flex-shrink-0 ml-4"
        >
          <Plus className="w-5 h-5" />
          Create Poll
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p className="text-sm font-medium">Loading polls...</p>
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-20 rounded-xl border bg-card">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-8 h-8 text-primary/40" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No polls found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            There are no polls matching your filters. Try switching to "All" to see everything.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default Polls;
