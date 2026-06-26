import React, { useState } from 'react';
import { Users, MapPin, Building2, CalendarDays, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import type { Poll } from '@/lib/polls';
import { deletePoll } from '@/lib/polls';
import { auth } from '@/lib/firebase';

interface PollCardProps {
  poll: Poll;
  onClick: (id: string) => void;
  onDeleted?: (id: string) => void;
}

const BAR_COLORS = [
  'bg-gradient-to-r from-[#10B981] to-[#34d399]',
  'bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8]',
  'bg-gradient-to-r from-[#6366f1] to-[#818cf8]',
  'bg-gradient-to-r from-[#f59e0b] to-[#fbbf24]',
  'bg-gradient-to-r from-[#14b8a6] to-[#5eead4]',
];

export const PollCard: React.FC<PollCardProps> = ({ poll, onClick, onDeleted }) => {
  const isEnded = poll.status === 'ended' || new Date() > poll.endDate;
  const total = poll.totalVotes || 0;
  const topOptions = poll.options.slice(0, 4);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentUid = auth.currentUser?.uid;
  const isOwner = currentUid && poll.createdBy === currentUid;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await deletePoll(poll.id);
      toast.success('Poll deleted successfully.');
      onDeleted?.(poll.id);
    } catch (err: any) {
      toast.error('Failed to delete poll: ' + (err.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-200 group relative"
      onClick={() => onClick(poll.id)}
    >
      {showConfirm && (
        <div
          className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center gap-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-base">Delete this poll?</p>
            <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-bold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full capitalize">
            <Building2 className="w-3.5 h-3.5" />
            {poll.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-full capitalize">
            <MapPin className="w-3.5 h-3.5" />
            {poll.locationScope}
          </span>
        </div>
        {isOwner && (
          <button
            onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete poll"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <h3 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#10B981] transition-colors">
        {poll.title}
      </h3>

      <div className="flex flex-col gap-3 flex-1">
        {topOptions.map((option, idx) => {
          const pct = total > 0 ? Math.round((option.voteCount / total) * 100) : 0;
          const barColor = BAR_COLORS[idx % BAR_COLORS.length];

          return (
            <div key={option.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 font-medium truncate max-w-[70%]">{option.text}</span>
                <span className="text-gray-400 text-xs">{option.voteCount} votes</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-6 overflow-hidden">
                {pct > 0 ? (
                  <div
                    className={`${barColor} h-6 rounded-full flex items-center pl-2.5 transition-all duration-500`}
                    style={{ width: `${Math.max(pct, 10)}%` }}
                  >
                    <span className="text-white text-xs font-bold leading-none drop-shadow-sm">{pct}%</span>
                  </div>
                ) : (
                  <div className="h-6 w-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto gap-2 flex-wrap">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#10B981]" />
            <span className="font-semibold text-gray-600">{total.toLocaleString()}</span> votes
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs">
              {isEnded
                ? `Ended ${formatDistanceToNow(poll.endDate, { addSuffix: true })}`
                : `Ends ${formatDistanceToNow(poll.endDate, { addSuffix: true })}`}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEnded && (
            <span className="text-xs text-red-500 font-semibold">Poll ended</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onClick(poll.id); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-none ${
              isEnded
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#10B981] hover:bg-[#059669] text-white'
            }`}
          >
            {isEnded ? 'View Results' : 'Vote Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
