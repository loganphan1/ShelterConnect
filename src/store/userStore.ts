import { create } from 'zustand';
import { Shelter } from '@/data/mockPets';
import {
  getOwnerPreferences,
  getProfile,
  getShelterByUserId,
  updateProfile,
  upsertOwnerPreferences,
  upsertShelterProfile,
} from '@/services/userService';
import {
  getSavedPetIds,
  savePet,
  unsavePet,
} from '@/services/savedPetService';

export type UserRole = 'owner' | 'shelter' | null;

export type OwnerAnswers = {
  petType: string;
  size: string;
  hasYoungKids: string;
  otherPets: string;
  activityLevel: string;
  livingSituation: string;
  dailyTime: string;
  experience: string;
  shedding: string;
  agePreference: string;
};

type UserStore = {
  isAuthenticated: boolean;
  userId: string | null;
  user: { email: string; name: string; photoUrl?: string } | null;
  role: UserRole;
  ownerAnswers: Partial<OwnerAnswers>;
  shelterProfile: Partial<Shelter> | null;
  savedPetIds: string[];

  signIn: (userId: string, email: string, name?: string, photoUrl?: string) => Promise<void>;
  signOut: () => void;
  setRole: (role: UserRole) => Promise<void>;
  setOwnerAnswer: (questionId: string, value: string) => Promise<void>;
  setShelterProfile: (profile: Partial<Shelter>) => Promise<void>;
  toggleSave: (petId: string) => Promise<void>;
  reset: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  isAuthenticated: false,
  userId: null,
  user: null,
  role: null,
  ownerAnswers: {},
  shelterProfile: null,
  savedPetIds: [],

  signIn: async (userId, email, name, photoUrl) => {
    set({
      isAuthenticated: true,
      userId,
      user: { email, name: name ?? email.split('@')[0], photoUrl },
    });

    // Restore persisted data from Supabase
    const [profile, prefs, shelter, savedIds] = await Promise.all([
      getProfile(userId),
      getOwnerPreferences(userId),
      getShelterByUserId(userId),
      getSavedPetIds(userId),
    ]);
    set({
      role: (profile?.role as UserRole) ?? null,
      ownerAnswers: prefs ?? {},
      shelterProfile: shelter ?? null,
      savedPetIds: savedIds,
    });
  },

  signOut: () =>
    set({ isAuthenticated: false, userId: null, user: null, role: null, ownerAnswers: {}, shelterProfile: null, savedPetIds: [] }),

  setRole: async (role) => {
    set({ role });
    const { userId } = get();
    if (userId) await updateProfile(userId, { role: role ?? undefined });
  },

  setOwnerAnswer: async (questionId, value) => {
  const { userId, ownerAnswers } = get();

  if (!userId) {
    throw new Error('Please verify your email and log in first.');
  }

  const newAnswers = { ...ownerAnswers, [questionId]: value };
  set({ ownerAnswers: newAnswers });

  try {
    await upsertOwnerPreferences(userId, newAnswers);
  } catch (error) {
    set({ ownerAnswers });
    throw error;
  }
},

  setShelterProfile: async (profile) => {
  const { userId, shelterProfile } = get();

  if (!userId) {
    throw new Error('Please verify your email and log in first.');
  }

  const merged = { ...shelterProfile, ...profile };
  set({ shelterProfile: merged });

  try {
    await upsertShelterProfile(userId, merged);
  } catch (error) {
    set({ shelterProfile });
    throw error;
  }
},

  toggleSave: async (petId) => {
  const { userId, savedPetIds } = get();

  if (!userId) {
    throw new Error('You must be logged in to save pets.');
  }

  const isSaved = savedPetIds.includes(petId);

  if (isSaved) {
    set({ savedPetIds: savedPetIds.filter((id) => id !== petId) });

    try {
      await unsavePet(userId, petId);
    } catch (error) {
      set({ savedPetIds });
      throw error;
    }
  } else {
    set({ savedPetIds: [...savedPetIds, petId] });

    try {
      await savePet(userId, petId);
    } catch (error) {
      set({ savedPetIds });
      throw error;
    }
  }
},

  reset: () => set({ role: null, ownerAnswers: {}, shelterProfile: null, savedPetIds: [] }),
}));
