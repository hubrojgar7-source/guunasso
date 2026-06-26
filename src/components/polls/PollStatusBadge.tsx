import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, FileEdit, XCircle } from 'lucide-react';
import type { PollStatus } from '@/lib/polls';

interface Props {
  status: PollStatus;
  className?: string;
}

const config: Record<PollStatus, { label: string; icon: React.ElementType; className: string }> = {
  active: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
  },
  draft: {
    label: 'Draft',
    icon: FileEdit,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  ended: {
    label: 'Ended',
    icon: XCircle,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

export const PollStatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const { label, icon: Icon, className: badgeClass } = config[status] ?? config.draft;
  return (
    <Badge
      variant="outline"
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold ${badgeClass} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};
