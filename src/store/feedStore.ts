import { create } from 'zustand';
import { Pet } from '@/data/mockPets';

type FeedStore = {
  feedItems: Pet[];
  setFeedItems: (items: Pet[]) => void;
  addPost: (pet: Pet) => void;
  editPost: (pet: Pet) => void;
  deletePost: (petId: string) => void;
};

export const useFeedStore = create<FeedStore>((set) => ({
  feedItems: [],
  setFeedItems: (items) => set({ feedItems: items }),
  addPost: (pet) => set((state) => ({ feedItems: [pet, ...state.feedItems] })),
  editPost: (pet) =>
    set((state) => ({
      feedItems: state.feedItems.map((p) => (p.id === pet.id ? pet : p)),
    })),
  deletePost: (petId) =>
    set((state) => ({
      feedItems: state.feedItems.filter((p) => p.id !== petId),
    })),
}));