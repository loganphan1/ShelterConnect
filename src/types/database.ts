export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ─── Row types ────────────────────────────────────────────────────────────────

export type DBProfile = {
  id: string;
  email: string;
  name: string | null;
  photo_url: string | null;
  role: 'owner' | 'shelter' | null;
  created_at: string;
};

export type DBOwnerPreferences = {
  id: string;
  user_id: string;
  pet_type: string | null;
  size: string | null;
  has_young_kids: string | null;
  other_pets: string | null;
  activity_level: string | null;
  living_situation: string | null;
  daily_time: string | null;
  experience: string | null;
  shedding: string | null;
  age_preference: string | null;
  updated_at: string;
};

export type DBShelter = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  address: string | null;
  about: string | null;
  hours: string | null;
  animal_types: string[];
  adoption_fee: string | null;
  requires_home_visit: string | null;
  vaccination_policy: string | null;
  photo_url: string | null;
  created_at: string;
};

export type DBPet = {
  id: string;
  shelter_id: string;
  name: string;
  breed: string | null;
  type: 'dog' | 'cat';
  size: 'small' | 'medium' | 'large' | null;
  age: 'young' | 'adult' | 'senior' | null;
  age_display: string | null;
  energy_level: 'low' | 'medium' | 'high' | null;
  good_with_kids: boolean;
  good_with_pets: boolean;
  hypoallergenic: boolean;
  needs_yard: boolean;
  bio: string | null;
  available: boolean;
  created_at: string;
};

export type DBPetMedia = {
  id: string;
  pet_id: string;
  type: 'image' | 'video';
  url: string;
  sort_order: number;
};

/** Pet row with joined media and shelter */
export type DBPetWithMedia = DBPet & { pet_media: DBPetMedia[]; shelters: DBShelter };

// ─── Database schema (for createClient<Database>) ─────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: DBProfile;
        Insert: { id: string; email: string; name?: string | null; photo_url?: string | null; role?: 'owner' | 'shelter' | null };
        Update: { email?: string; name?: string | null; photo_url?: string | null; role?: 'owner' | 'shelter' | null };
        Relationships: [];
      };
      owner_preferences: {
        Row: DBOwnerPreferences;
        Insert: {
          user_id: string;
          pet_type?: string | null;
          size?: string | null;
          has_young_kids?: string | null;
          other_pets?: string | null;
          activity_level?: string | null;
          living_situation?: string | null;
          daily_time?: string | null;
          experience?: string | null;
          shedding?: string | null;
          age_preference?: string | null;
          updated_at?: string;
        };
        Update: {
          pet_type?: string | null;
          size?: string | null;
          has_young_kids?: string | null;
          other_pets?: string | null;
          activity_level?: string | null;
          living_situation?: string | null;
          daily_time?: string | null;
          experience?: string | null;
          shedding?: string | null;
          age_preference?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      shelters: {
        Row: DBShelter;
        Insert: {
          user_id: string;
          name: string;
          phone?: string | null;
          address?: string | null;
          about?: string | null;
          hours?: string | null;
          animal_types?: string[];
          adoption_fee?: string | null;
          requires_home_visit?: string | null;
          vaccination_policy?: string | null;
          photo_url?: string | null;
        };
        Update: {
          name?: string;
          phone?: string | null;
          address?: string | null;
          about?: string | null;
          hours?: string | null;
          animal_types?: string[];
          adoption_fee?: string | null;
          requires_home_visit?: string | null;
          vaccination_policy?: string | null;
          photo_url?: string | null;
        };
        Relationships: [];
      };
      pets: {
        Row: DBPet;
        Insert: {
          shelter_id: string;
          name: string;
          breed?: string | null;
          type: 'dog' | 'cat';
          size?: 'small' | 'medium' | 'large' | null;
          age?: 'young' | 'adult' | 'senior' | null;
          age_display?: string | null;
          energy_level?: 'low' | 'medium' | 'high' | null;
          good_with_kids?: boolean;
          good_with_pets?: boolean;
          hypoallergenic?: boolean;
          needs_yard?: boolean;
          bio?: string | null;
          available?: boolean;
        };
        Update: {
          name?: string;
          breed?: string | null;
          type?: 'dog' | 'cat';
          size?: 'small' | 'medium' | 'large' | null;
          age?: 'young' | 'adult' | 'senior' | null;
          age_display?: string | null;
          energy_level?: 'low' | 'medium' | 'high' | null;
          good_with_kids?: boolean;
          good_with_pets?: boolean;
          hypoallergenic?: boolean;
          needs_yard?: boolean;
          bio?: string | null;
          available?: boolean;
        };
        Relationships: [];
      };
      pet_media: {
        Row: DBPetMedia;
        Insert: { pet_id: string; type: 'image' | 'video'; url: string; sort_order?: number };
        Update: { type?: 'image' | 'video'; url?: string; sort_order?: number };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
