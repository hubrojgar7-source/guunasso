import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  Timestamp,
  writeBatch,
  limit,
} from 'firebase/firestore';
import { auth, db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PollType = 'single' | 'multiple' | 'yesno';
export type PollStatus = 'draft' | 'active' | 'ended';
export type LocationScope = 'nationwide' | 'province' | 'district' | 'municipality';
export type PollCategory =
  | 'governance'
  | 'infrastructure'
  | 'health'
  | 'education'
  | 'environment'
  | 'other';

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
  order: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  category: PollCategory;
  pollType: PollType;
  createdBy: string;
  createdByName: string;
  organizationName: string;
  startDate: Date;
  endDate: Date;
  locationScope: LocationScope;
  locationName: string;
  status: PollStatus;
  totalVotes: number;
  options: PollOption[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  id: string;
  pollId: string;
  optionIds: string[];
  userId: string;
  votedAt: Date;
}

export interface PollResults {
  totalVotes: number;
  options: Array<PollOption & { percentage: number }>;
  winner: PollOption | null;
}

export interface CreatePollData {
  title: string;
  description: string;
  category: PollCategory;
  pollType: PollType;
  organizationName: string;
  startDate: Date;
  endDate: Date;
  locationScope: LocationScope;
  locationName: string;
  status: PollStatus;
  options: string[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const toDate = (val: unknown): Date => {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'object' && 'seconds' in (val as object)) {
    return new Timestamp((val as { seconds: number }).seconds, 0).toDate();
  }
  return new Date(val as string);
};

// ─── Create Poll ──────────────────────────────────────────────────────────────

export const createPoll = async (data: CreatePollData): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const batch = writeBatch(db);

  // Create the poll document
  const pollRef = doc(collection(db, 'polls'));
  batch.set(pollRef, {
    title: data.title,
    description: data.description,
    category: data.category,
    pollType: data.pollType,
    createdBy: user.uid,
    createdByName: user.displayName || 'Anonymous',
    organizationName: data.organizationName,
    startDate: Timestamp.fromDate(data.startDate),
    endDate: Timestamp.fromDate(data.endDate),
    locationScope: data.locationScope,
    locationName: data.locationName,
    status: data.status,
    totalVotes: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Create each option as a sub-document
  data.options.forEach((optionText, idx) => {
    const optRef = doc(collection(db, 'polls', pollRef.id, 'options'));
    batch.set(optRef, {
      text: optionText,
      voteCount: 0,
      order: idx,
    });
  });

  await batch.commit();
  return pollRef.id;
};

// ─── Get All Polls ────────────────────────────────────────────────────────────

export const getPolls = async (filters?: {
  status?: PollStatus;
  category?: PollCategory;
  locationScope?: LocationScope;
}): Promise<Poll[]> => {
  try {
    let q = query(collection(db, 'polls'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters?.locationScope) {
      q = query(q, where('locationScope', '==', filters.locationScope));
    }

    const snapshot = await getDocs(q);
    const polls: Poll[] = [];

    for (const pollDoc of snapshot.docs) {
      const data = pollDoc.data();
      const optionsSnap = await getDocs(
        query(collection(db, 'polls', pollDoc.id, 'options'), orderBy('order'))
      );
      const options: PollOption[] = optionsSnap.docs.map((o) => ({
        id: o.id,
        text: o.data().text,
        voteCount: o.data().voteCount || 0,
        order: o.data().order || 0,
      }));

      polls.push({
        id: pollDoc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        pollType: data.pollType,
        createdBy: data.createdBy,
        createdByName: data.createdByName,
        organizationName: data.organizationName,
        startDate: toDate(data.startDate),
        endDate: toDate(data.endDate),
        locationScope: data.locationScope,
        locationName: data.locationName,
        status: data.status,
        totalVotes: data.totalVotes || 0,
        options,
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      });
    }

    // Sort descending by createdAt to simulate orderBy('createdAt', 'desc')
    polls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return polls;
  } catch (error) {
    console.error('Error fetching polls:', error);
    throw error;
  }
};

// ─── Get Poll By ID ───────────────────────────────────────────────────────────

export const getPollById = async (pollId: string): Promise<Poll | null> => {
  try {
    const pollDoc = await getDoc(doc(db, 'polls', pollId));
    if (!pollDoc.exists()) return null;

    const data = pollDoc.data();
    const optionsSnap = await getDocs(
      query(collection(db, 'polls', pollId, 'options'), orderBy('order'))
    );
    const options: PollOption[] = optionsSnap.docs.map((o) => ({
      id: o.id,
      text: o.data().text,
      voteCount: o.data().voteCount || 0,
      order: o.data().order || 0,
    }));

    return {
      id: pollDoc.id,
      title: data.title,
      description: data.description,
      category: data.category,
      pollType: data.pollType,
      createdBy: data.createdBy,
      createdByName: data.createdByName,
      organizationName: data.organizationName,
      startDate: toDate(data.startDate),
      endDate: toDate(data.endDate),
      locationScope: data.locationScope,
      locationName: data.locationName,
      status: data.status,
      totalVotes: data.totalVotes || 0,
      options,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  } catch (error) {
    console.error('Error fetching poll:', error);
    throw error;
  }
};

// ─── Cast Vote ────────────────────────────────────────────────────────────────

export const castVote = async (pollId: string, optionIds: string[]): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  // Check for duplicate vote
  const existingVote = await getUserVote(pollId);
  if (existingVote) throw new Error('You have already voted on this poll');

  const poll = await getPollById(pollId);
  if (!poll) throw new Error('Poll not found');
  if (poll.status !== 'active') throw new Error('This poll is not currently active');

  const now = new Date();
  if (now < poll.startDate) throw new Error('This poll has not started yet');
  if (now > poll.endDate) throw new Error('This poll has ended');

  const batch = writeBatch(db);

  // Create vote record
  const voteRef = doc(collection(db, 'votes'));
  batch.set(voteRef, {
    pollId,
    optionIds,
    userId: user.uid,
    votedAt: serverTimestamp(),
  });

  // Increment vote count on each selected option
  for (const optionId of optionIds) {
    const optRef = doc(db, 'polls', pollId, 'options', optionId);
    batch.update(optRef, { voteCount: increment(1) });
  }

  // Increment poll total votes
  const pollRef = doc(db, 'polls', pollId);
  batch.update(pollRef, { totalVotes: increment(1) });

  await batch.commit();
};

// ─── Get User Vote ────────────────────────────────────────────────────────────

export const getUserVote = async (pollId: string): Promise<Vote | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const q = query(
      collection(db, 'votes'),
      where('pollId', '==', pollId),
      where('userId', '==', user.uid),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const d = snap.docs[0].data();
    return {
      id: snap.docs[0].id,
      pollId: d.pollId,
      optionIds: d.optionIds,
      userId: d.userId,
      votedAt: toDate(d.votedAt),
    };
  } catch (error) {
    console.error('Error getting user vote:', error);
    return null;
  }
};

// ─── Get Poll Results ─────────────────────────────────────────────────────────

export const getPollResults = async (pollId: string): Promise<PollResults> => {
  const poll = await getPollById(pollId);
  if (!poll) throw new Error('Poll not found');

  const total = poll.totalVotes || 0;
  const optionsWithPercentage = poll.options.map((opt) => ({
    ...opt,
    percentage: total > 0 ? Math.round((opt.voteCount / total) * 100) : 0,
  }));

  const winner =
    total > 0
      ? optionsWithPercentage.reduce((prev, curr) =>
          curr.voteCount > prev.voteCount ? curr : prev
        )
      : null;

  return { totalVotes: total, options: optionsWithPercentage, winner };
};

// ─── Update Poll ──────────────────────────────────────────────────────────────

export const updatePoll = async (
  pollId: string,
  data: Partial<Omit<CreatePollData, 'options'>>
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const updateData: Record<string, unknown> = { updatedAt: serverTimestamp() };
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.organizationName !== undefined) updateData.organizationName = data.organizationName;
  if (data.startDate !== undefined) updateData.startDate = Timestamp.fromDate(data.startDate);
  if (data.endDate !== undefined) updateData.endDate = Timestamp.fromDate(data.endDate);
  if (data.locationScope !== undefined) updateData.locationScope = data.locationScope;
  if (data.locationName !== undefined) updateData.locationName = data.locationName;
  if (data.status !== undefined) updateData.status = data.status;

  await updateDoc(doc(db, 'polls', pollId), updateData);
};

// ─── Delete Poll ──────────────────────────────────────────────────────────────

export const deletePoll = async (pollId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  // Delete options sub-collection
  const optSnap = await getDocs(collection(db, 'polls', pollId, 'options'));
  const batch = writeBatch(db);
  optSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, 'polls', pollId));
  await batch.commit();
};

// ─── Get My Polls (for org/admin) ─────────────────────────────────────────────

export const getMyPolls = async (): Promise<Poll[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const q = query(
    collection(db, 'polls'),
    where('createdBy', '==', user.uid)
  );
  const snap = await getDocs(q);
  const polls: Poll[] = [];

  for (const pollDoc of snap.docs) {
    const data = pollDoc.data();
    const optSnap = await getDocs(
      query(collection(db, 'polls', pollDoc.id, 'options'), orderBy('order'))
    );
    const options: PollOption[] = optSnap.docs.map((o) => ({
      id: o.id,
      text: o.data().text,
      voteCount: o.data().voteCount || 0,
      order: o.data().order || 0,
    }));

    polls.push({
      id: pollDoc.id,
      title: data.title,
      description: data.description,
      category: data.category,
      pollType: data.pollType,
      createdBy: data.createdBy,
      createdByName: data.createdByName,
      organizationName: data.organizationName,
      startDate: toDate(data.startDate),
      endDate: toDate(data.endDate),
      locationScope: data.locationScope,
      locationName: data.locationName,
      status: data.status,
      totalVotes: data.totalVotes || 0,
      options,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    });
  }

  polls.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return polls;
};
