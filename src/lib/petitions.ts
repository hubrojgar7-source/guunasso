import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
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

export type PetitionCategory =
  | 'infrastructure'
  | 'health'
  | 'education'
  | 'environment'
  | 'governance'
  | 'social'
  | 'other';

export type PetitionStatus = 'active' | 'closed' | 'responded';

export interface Petition {
  id: string;
  title: string;
  description: string;
  category: PetitionCategory;
  targetSignatures: number;
  totalSignatures: number;
  createdBy: string;
  createdByName: string;
  status: PetitionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Signature {
  id: string;
  petitionId: string;
  userId: string;
  signedAt: Date;
}

export interface CreatePetitionData {
  title: string;
  description: string;
  category: PetitionCategory;
  targetSignatures: number;
}

const toDate = (val: unknown): Date => {
  if (!val) return new Date();
  if (val instanceof Date) return val;
  if (val instanceof Timestamp) return val.toDate();
  if (typeof val === 'object' && 'seconds' in (val as object)) {
    return new Timestamp((val as { seconds: number }).seconds, 0).toDate();
  }
  return new Date(val as string);
};

export const createPetition = async (data: CreatePetitionData): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const petitionRef = doc(collection(db, 'petitions'));
  await setDoc(petitionRef, {
    title: data.title,
    description: data.description,
    category: data.category,
    targetSignatures: data.targetSignatures,
    totalSignatures: 0,
    createdBy: user.uid,
    createdByName: user.displayName || 'Anonymous',
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return petitionRef.id;
};

export const getPetitions = async (filters?: {
  status?: PetitionStatus;
  category?: PetitionCategory;
}): Promise<Petition[]> => {
  try {
    let q = query(collection(db, 'petitions'));

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    const snapshot = await getDocs(q);
    const petitions: Petition[] = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      petitions.push({
        id: docSnap.id,
        title: data.title,
        description: data.description,
        category: data.category,
        targetSignatures: data.targetSignatures || 100,
        totalSignatures: data.totalSignatures || 0,
        createdBy: data.createdBy,
        createdByName: data.createdByName,
        status: data.status || 'active',
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt),
      });
    }

    petitions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return petitions;
  } catch (error) {
    console.error('Error fetching petitions:', error);
    throw error;
  }
};

export const getPetitionById = async (petitionId: string): Promise<Petition | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'petitions', petitionId));
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      category: data.category,
      targetSignatures: data.targetSignatures || 100,
      totalSignatures: data.totalSignatures || 0,
      createdBy: data.createdBy,
      createdByName: data.createdByName,
      status: data.status || 'active',
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  } catch (error) {
    console.error('Error fetching petition:', error);
    throw error;
  }
};

export const signPetition = async (petitionId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const existingSig = await getUserSignature(petitionId);
  if (existingSig) throw new Error('You have already signed this petition');

  const petition = await getPetitionById(petitionId);
  if (!petition) throw new Error('Petition not found');
  if (petition.status !== 'active') throw new Error('This petition is not currently active');

  const batch = writeBatch(db);

  const sigRef = doc(collection(db, 'signatures'));
  batch.set(sigRef, {
    petitionId,
    userId: user.uid,
    signedAt: serverTimestamp(),
  });

  const petitionRef = doc(db, 'petitions', petitionId);
  batch.update(petitionRef, {
    totalSignatures: increment(1),
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
};

export const getUserSignature = async (petitionId: string): Promise<Signature | null> => {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const q = query(
      collection(db, 'signatures'),
      where('petitionId', '==', petitionId),
      where('userId', '==', user.uid),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const d = snap.docs[0].data();
    return {
      id: snap.docs[0].id,
      petitionId: d.petitionId,
      userId: d.userId,
      signedAt: toDate(d.signedAt),
    };
  } catch (error) {
    console.error('Error getting user signature:', error);
    return null;
  }
};

export const updatePetitionStatus = async (petitionId: string, status: PetitionStatus): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  await updateDoc(doc(db, 'petitions', petitionId), {
    status,
    updatedAt: serverTimestamp(),
  });
};

export const deletePetition = async (petitionId: string): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const sigSnap = await getDocs(query(collection(db, 'signatures'), where('petitionId', '==', petitionId)));
  const batch = writeBatch(db);
  sigSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, 'petitions', petitionId));
  await batch.commit();
};

export const getMyPetitions = async (): Promise<Petition[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');

  const q = query(collection(db, 'petitions'), where('createdBy', '==', user.uid));
  const snap = await getDocs(q);
  const petitions: Petition[] = [];

  for (const docSnap of snap.docs) {
    const data = docSnap.data();
    petitions.push({
      id: docSnap.id,
      title: data.title,
      description: data.description,
      category: data.category,
      targetSignatures: data.targetSignatures || 100,
      totalSignatures: data.totalSignatures || 0,
      createdBy: data.createdBy,
      createdByName: data.createdByName,
      status: data.status || 'active',
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    });
  }

  petitions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return petitions;
};
