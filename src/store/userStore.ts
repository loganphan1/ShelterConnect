import { create } from 'zustand';
import { Shelter } from '@/data/mockPets';

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
  role: UserRole;
  ownerAnswers: Partial<OwnerAnswers>;
  shelterProfile: Partial<Shelter> | null;
  setRole: (role: UserRole) => void;
  setOwnerAnswer: (questionId: string, value: string) => void;
  setShelterProfile: (profile: Partial<Shelter>) => void;
  reset: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  role: null,
  ownerAnswers: {},
  shelterProfile: null,

  setRole: (role) => set({ role }),

  setOwnerAnswer: (questionId, value) =>
    set((state) => ({
      ownerAnswers: { ...state.ownerAnswers, [questionId]: value },
    })),

  setShelterProfile: (profile) =>
    set((state) => ({
      shelterProfile: { ...state.shelterProfile, ...profile },
    })),

  reset: () => set({ role: null, ownerAnswers: {}, shelterProfile: null }),
}));
