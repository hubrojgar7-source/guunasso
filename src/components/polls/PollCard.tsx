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
  'bg-primary',
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-teal-500',
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
      className="bg-card rounded-xl border p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md hover:border-foreground/20 transition-all duration-200 group relative"
      onClick={() => onClick(poll.id)}
    >
      {showConfirm && (
        <div
          className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl z-10 flex flex-col items-center justify-center gap-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-bold text-foreground text-base">Delete this poll?</p>
            <p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p>
          </div>
          <div className="flex gap-3 w-full">
            <button
              onClick={(e) => { e.stopPropagation(); setShowConfirm(false); }}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold border text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting…' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full capitalize">
            <Building2 className="w-3.5 h-3.5" />
            {poll.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold bg-muted text-muted-foreground px-3 py-1 rounded-full capitalize">
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

      <h3 className="text-[15px] font-bold text-foreground leading-snug line-clamp-2 group-hover:text-foreground transition-colors">
        {poll.title}
      </h3>

      <div className="flex flex-col gap-3 flex-1">
        {topOptions.map((option, idx) => {
          const pct = total > 0 ? Math.round((option.voteCount / total) * 100) : 0;
          const barColor = BAR_COLORS[idx % BAR_COLORS.length];

          return (
            <div key={option.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-foreground font-medium truncate max-w-[70%]">{option.text}</span>
                <span className="text-muted-foreground text-xs">{option.voteCount} votes</span>
              </div>
              <div className="w-full bg-muted rounded-full h-6 overflow-hidden">
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

      <div className="flex items-center justify-between pt-3 border-t mt-auto gap-2 flex-wrap">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-foreground">{total.toLocaleString()}</span> votes
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs">
              {isEnded
                ? `Ended ${formatDistanceToNow(poll.endDate, { addSuffix: true })}`
                : `Ends ${formatDistanceToNow(poll.endDate, { addSuffix: true })}`}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEnded && (
            <span className="text-xs text-muted-foreground font-semibold">Poll ended</span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onClick(poll.id); }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              isEnded
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {isEnded ? 'View Results' : 'Vote Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
