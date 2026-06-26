import { useState, useEffect, useCallback } from 'react';
import { db, auth } from '@/lib/firebase';
import {
  collection, query, where, orderBy, limit, onSnapshot, Timestamp
} from 'firebase/firestore';
import { markNotificationAsRead, markAllAsRead, AppNotification } from '@/lib/notifications';

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  type: 'poll' | 'feed' | 'complaint' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [user.uid, '__all__']),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items: NotificationItem[] = [];
      let unread = 0;
      snapshot.docs.forEach((d) => {
        const data = d.data() as Omit<NotificationItem, 'id'>;
        const item: NotificationItem = { id: d.id, ...data };
        items.push(item);
        if (!item.read) unread++;
      });
      setNotifications(items);
      setUnreadCount(unread);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const markRead = useCallback(async (id: string) => {
    await markNotificationAsRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;
    await markAllAsRead(user.uid);
  }, []);

  return { notifications, unreadCount, loading, markRead, markAllRead };
}
