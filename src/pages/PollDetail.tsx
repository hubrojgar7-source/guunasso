import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Loader2, Share2, MapPin, CalendarDays } from 'lucide-react';
import { getPollById, castVote, getUserVote, getPollResults, type Poll, type PollResults as PollResultsType } from '@/lib/polls';
import { useAuthContext } from '@/lib/AuthProvider';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';

const BAR_COLOR = 'bg-[#10B981]/30';
const WINNER_COLOR = 'bg-[#10B981]';

const PollDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { profile } = useUserProfile();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [results, setResults] = useState<PollResultsType | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVotedIds, setUserVotedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canCreatePoll = profile?.userType === 'farmer' || profile?.userType === 'admin' || profile?.userType === 'organization';

  useEffect(() => {
    if (id) loadData(id);
  }, [id, user]);

  const loadData = async (pollId: string) => {
    setIsLoading(true);
    try {
      const p = await getPollById(pollId);
      if (!p) { setIsLoading(false); return; }
      setPoll(p);

      if (user) {
        const userVote = await getUserVote(pollId);
        if (userVote) {
          setHasVoted(true);
          setUserVotedIds(userVote.optionIds);
        }
      }

      const isEnded = p.status === 'ended' || new Date() > p.endDate;
      if (isEnded) {
        const res = await getPollResults(pollId);
        setResults(res);
      }
    } catch (error) {
      console.error('Error loading poll:', error);
      toast.error('Failed to load poll data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteSubmit = async () => {
    if (!id || selectedOptionIds.length === 0) return;
    setIsSubmitting(true);
    try {
      await castVote(id, selectedOptionIds);
      toast.success('Your vote has been recorded!');
      setHasVoted(true);
      const res = await getPollResults(id);
      setResults(res);
      setUserVotedIds(selectedOptionIds);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = (optionId: string) => {
    if (!poll) return;
    if (poll.pollType === 'single' || poll.pollType === 'yesno') {
      setSelectedOptionIds([optionId]);
    } else {
      setSelectedOptionIds((prev) =>
        prev.includes(optionId) ? prev.filter((x) => x !== optionId) : [...prev, optionId]
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#10B981]" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Poll Not Found</h2>
        <button onClick={() => navigate('/dashboard/polls')} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          Back to Polls
        </button>
      </div>
    );
  }

  const isEnded = poll.status === 'ended' || new Date() > poll.endDate;
  const showResults = isEnded || hasVoted;

  const total = results?.totalVotes ?? poll.totalVotes ?? 0;
  const maxVotes = results
    ? Math.max(...results.options.map((o) => o.voteCount), 0)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="py-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <button
            onClick={() => navigate('/dashboard/polls')}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Polls
          </button>

          <div className="flex items-center justify-between">
            <span className="inline-block text-xs font-semibold bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full capitalize">
              {poll.category}
            </span>
            {canCreatePoll && (
              <button onClick={() => navigate('/dashboard/polls/create')} className="text-sm text-gray-500 hover:text-[#10B981] flex items-center gap-1 transition-colors">
                <Plus className="w-4 h-4" /> Create Poll
              </button>
            )}
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-2">{poll.title}</h1>
            {poll.description && (
              <p className="text-gray-500">{poll.description}</p>
            )}
            <div className="flex gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> <span className="capitalize">{poll.locationScope}</span>
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5" />
                {isEnded ? `Ended ${poll.endDate.toLocaleDateString()}` : `Ends ${poll.endDate.toLocaleDateString()}`}
              </span>
            </div>
          </div>

          {showResults && results ? (
            <div className="flex flex-col gap-4">
              {results.options.map((option, idx) => {
                const pct = total > 0 ? Math.round((option.voteCount / total) * 100) : 0;
                const isWinner = option.voteCount === maxVotes && maxVotes > 0;
                const barColor = isWinner ? WINNER_COLOR : BAR_COLOR;
                const isUserChoice = userVotedIds.includes(option.id);

                return (
                  <div key={option.id} className={`bg-white rounded-lg border border-gray-100 px-8 py-5 shadow-sm transition-all ${isUserChoice ? 'ring-2 ring-[#10B981]/40' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`font-semibold text-base ${isUserChoice ? 'text-[#10B981]' : 'text-gray-700'}`}>
                        {option.text}
                        {isUserChoice && <span className="ml-2 text-xs font-normal bg-[#10B981]/10 text-[#10B981] px-2 py-0.5 rounded-full">Your vote</span>}
                      </span>
                      <span className="text-sm text-gray-400">{option.voteCount} votes</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-lg h-[26px] overflow-hidden">
                      {pct > 0 ? (
                        <div
                          className={`${barColor} h-full rounded-lg flex items-center justify-center transition-all duration-500`}
                          style={{ width: `${Math.max(pct, 6)}%` }}
                        >
                          <span className="text-white text-xs font-bold">{pct}%</span>
                        </div>
                      ) : (
                        <div className="h-full flex items-center pl-2">
                          <span className="text-gray-300 text-xs">0%</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <p className="text-center text-sm text-gray-400 font-medium pt-2">
                {isEnded ? 'This poll has ended.' : 'You have already voted.'} &nbsp;·&nbsp; {total.toLocaleString()} total votes
              </p>
            </div>
          ) : !user ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
              <p className="text-gray-500 mb-4">Please sign in to participate in this poll.</p>
              <button onClick={() => navigate('/login')} className="bg-[#10B981] hover:bg-[#059669] text-white px-8 py-2.5 rounded-lg font-semibold transition-colors">
                Sign In to Vote
              </button>
            </div>
          ) : isEnded ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
              <p className="text-gray-500">This poll has ended.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {poll.pollType === 'multiple' ? 'Select all that apply' : 'Select one option'}
              </p>
              {poll.options.map((option) => {
                const isSelected = selectedOptionIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`bg-white rounded-lg border-2 px-8 py-5 shadow-sm cursor-pointer transition-all ${
                      isSelected ? 'border-[#10B981] bg-[#10B981]/5' : 'border-gray-100 hover:border-[#10B981]/40'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-semibold text-gray-700 text-base">{option.text}</span>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={handleVoteSubmit}
                disabled={isSubmitting || selectedOptionIds.length === 0}
                className="w-full bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-3.5 rounded-lg transition-colors shadow-none mt-2 text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                  </span>
                ) : 'Submit Vote'}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-sm text-gray-400">
            <span>Created by {poll.createdByName}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
              className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors"
            >
              <Share2 className="w-4 h-4" /> Share Poll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollDetail;
