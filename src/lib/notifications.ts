import { db, auth } from './firebase';
import {
  collection, addDoc, doc, updateDoc, query, where,
  orderBy, limit, getDocs, serverTimestamp, Timestamp, writeBatch
} from 'firebase/firestore';

export type NotificationType = 'poll' | 'feed' | 'complaint' | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Timestamp | null;
}

interface CreateNotificationInput {
  userId: string;
  actorId: string;
  actorName: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export const createNotification = async (input: CreateNotificationInput): Promise<string> => {
  const docRef = await addDoc(collection(db, 'notifications'), {
    userId: input.userId,
    actorId: input.actorId,
    actorName: input.actorName,
    type: input.type,
    title: input.title,
    message: input.message,
    link: input.link || null,
    read: false,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
};

export const broadcastNotification = async (input: Omit<CreateNotificationInput, 'userId'>): Promise<string> => {
  return createNotification({ ...input, userId: '__all__' });
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', notificationId), { read: true });
};

export const markAllAsRead = async (userId: string): Promise<void> => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', 'in', [userId, '__all__']),
    where('read', '==', false),
    limit(100)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return;
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    batch.update(doc(db, 'notifications', d.id), { read: true });
  });
  await batch.commit();
};

export interface NotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
  totalCount: number;
}

export const fetchNotifications = async (userId: string, maxResults = 50): Promise<NotificationsResult> => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', 'in', [userId, '__all__']),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );
  const snapshot = await getDocs(q);
  const notifications: AppNotification[] = [];
  let unreadCount = 0;
  snapshot.docs.forEach((d) => {
    const data = d.data();
    const notif = { id: d.id, ...data } as AppNotification;
    notifications.push(notif);
    if (!notif.read) unreadCount++;
  });
  return { notifications, unreadCount, totalCount: notifications.length };
};
