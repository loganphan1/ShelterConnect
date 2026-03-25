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
  toggleSave: (petId: string) => void;
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
    const [profile, prefs, shelter] = await Promise.all([
      getProfile(userId),
      getOwnerPreferences(userId),
      getShelterByUserId(userId),
    ]);

    set({
      role: (profile?.role as UserRole) ?? null,
      ownerAnswers: prefs ?? {},
      shelterProfile: shelter ?? null,
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
    const newAnswers = { ...get().ownerAnswers, [questionId]: value };
    set({ ownerAnswers: newAnswers });
    const { userId } = get();
    if (userId) await upsertOwnerPreferences(userId, newAnswers);
  },

  setShelterProfile: async (profile) => {
    const merged = { ...get().shelterProfile, ...profile };
    set({ shelterProfile: merged });
    const { userId } = get();
    if (userId) await upsertShelterProfile(userId, merged);
  },

  toggleSave: (petId) =>
    set((state) => ({
      savedPetIds: state.savedPetIds.includes(petId)
        ? state.savedPetIds.filter((id) => id !== petId)
        : [...state.savedPetIds, petId],
    })),

  reset: () => set({ role: null, ownerAnswers: {}, shelterProfile: null, savedPetIds: [] }),
}));
