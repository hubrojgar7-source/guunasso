import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, ClipboardList, AlertTriangle, CheckCheck, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<string, React.ReactNode> = {
  poll: <ClipboardList size={16} className="text-blue-500" />,
  feed: <Megaphone size={16} className="text-green-500" />,
  complaint: <AlertTriangle size={16} className="text-orange-500" />,
  system: <Bell size={16} className="text-purple-500" />,
};

const NotificationPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = (notif: { id: string; link?: string; read: boolean }) => {
    if (!notif.read) markRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
      onClose();
    }
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-[480px] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground" onClick={markAllRead}>
              <CheckCheck size={14} />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Bell size={32} className="mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                !notif.read ? 'bg-blue-50/40' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {typeIcons[notif.type] || typeIcons.system}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${!notif.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {notif.createdAt?.toDate ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : ''}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-100 text-center">
          <span className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </span>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
