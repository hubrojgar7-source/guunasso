import React from 'react';
import type { PollOption } from '@/lib/polls';

interface ResultBarsProps {
  options: Array<PollOption & { percentage: number }>;
  userVotedOptionIds?: string[];
  totalVotes: number;
}

const COLORS = [
  'from-[#10B981] to-[#34d399]',
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-amber-500 to-amber-600',
  'from-rose-500 to-rose-600',
  'from-cyan-500 to-cyan-600',
];

export const ResultBars: React.FC<ResultBarsProps> = ({
  options,
  userVotedOptionIds = [],
  totalVotes,
}) => {
  const sorted = [...options].sort((a, b) => b.voteCount - a.voteCount);
  const maxVotes = sorted[0]?.voteCount ?? 1;

  return (
    <div className="space-y-3">
      {options.map((opt, idx) => {
        const isVoted = userVotedOptionIds.includes(opt.id);
        const isWinner = opt.voteCount === maxVotes && totalVotes > 0;
        const color = COLORS[idx % COLORS.length];

        return (
          <div key={opt.id} className="group">
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-sm font-medium flex items-center gap-1.5 ${
                  isVoted ? 'text-[#10B981]' : 'text-gray-700'
                }`}
              >
                {isVoted && (
                  <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] flex-shrink-0" />
                )}
                {isWinner && totalVotes > 0 && (
                  <span className="text-xs bg-[#10B981]/10 text-[#10B981] px-1.5 py-0.5 rounded-full font-semibold">
                    Leading
                  </span>
                )}
                {opt.text}
              </span>
              <span className="text-sm font-bold text-gray-800">
                {opt.percentage}%
                <span className="text-xs text-gray-400 ml-1 font-normal">({opt.voteCount})</span>
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`}
                style={{ width: `${opt.percentage}%` }}
              />
            </div>
          </div>
        );
      })}
      {totalVotes === 0 && (
        <p className="text-center text-sm text-gray-400 py-2">No votes yet — be the first!</p>
      )}
    </div>
  );
};
