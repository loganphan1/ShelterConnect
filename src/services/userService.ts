import { supabase } from '@/lib/supabase';
import { DBOwnerPreferences, DBProfile, DBShelter } from '@/types/database';
import { OwnerAnswers } from '@/store/userStore';
import { Shelter } from '@/data/mockPets';

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<DBProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .limit(1);
  if (error) { console.error('getProfile:', error.message); return null; }
  return (data?.[0] as DBProfile) ?? null;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<DBProfile, 'name' | 'photo_url' | 'role'>>
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates as Record<string, unknown>)
    .eq('id', userId);
  if (error) throw new Error(error.message);
}

// ─── Owner preferences ───────────────────────────────────────────────────────

export async function getOwnerPreferences(userId: string): Promise<Partial<OwnerAnswers> | null> {
  const { data, error } = await supabase
    .from('owner_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null; // row not found
    console.error('getOwnerPreferences:', error.message);
    return null;
  }
  return dbRowToOwnerAnswers(data as DBOwnerPreferences);
}

export async function upsertOwnerPreferences(
  userId: string,
  answers: Partial<OwnerAnswers>
): Promise<void> {
  const { error } = await supabase
    .from('owner_preferences')
    .upsert({
      user_id: userId,
      pet_type: answers.petType ?? null,
      size: answers.size ?? null,
      has_young_kids: answers.hasYoungKids ?? null,
      other_pets: answers.otherPets ?? null,
      activity_level: answers.activityLevel ?? null,
      living_situation: answers.livingSituation ?? null,
      daily_time: answers.dailyTime ?? null,
      experience: answers.experience ?? null,
      shedding: answers.shedding ?? null,
      age_preference: answers.agePreference ?? null,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>, { onConflict: 'user_id' });
  if (error) throw new Error(error.message);
}

function dbRowToOwnerAnswers(row: DBOwnerPreferences): Partial<OwnerAnswers> {
  return {
    petType: row.pet_type ?? undefined,
    size: row.size ?? undefined,
    hasYoungKids: row.has_young_kids ?? undefined,
    otherPets: row.other_pets ?? undefined,
    activityLevel: row.activity_level ?? undefined,
    livingSituation: row.living_situation ?? undefined,
    dailyTime: row.daily_time ?? undefined,
    experience: row.experience ?? undefined,
    shedding: row.shedding ?? undefined,
    agePreference: row.age_preference ?? undefined,
  };
}

// ─── Shelter profile ─────────────────────────────────────────────────────────

export async function getShelterByUserId(userId: string): Promise<Partial<Shelter> | null> {
  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getShelterByUserId:', error.message);
    return null;
  }
  return dbRowToShelter(data as DBShelter);
}

export async function upsertShelterProfile(
  userId: string,
  profile: Partial<Shelter>
): Promise<string | null> {
  const { data, error } = await supabase
    .from('shelters')
    .upsert({
      user_id: userId,
      name: profile.name ?? 'My Shelter',
      phone: profile.phone ?? null,
      address: profile.address ?? null,
      about: profile.about ?? null,
      hours: profile.hours ?? null,
      animal_types: normalizeAnimalTypes(profile.animalTypes),
      adoption_fee: profile.adoptionFee ?? null,
      requires_home_visit: profile.requiresHomeVisit ?? null,
      vaccination_policy: profile.vaccinationPolicy ?? null,
      photo_url: profile.photoUri ?? null,
    } as Record<string, unknown>, { onConflict: 'user_id' })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return (data as { id: string } | null)?.id ?? null;
}

function normalizeAnimalTypes(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value === 'both') return ['dogs', 'cats'];
  return [value];
}

function dbRowToShelter(row: DBShelter): Partial<Shelter> {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    about: row.about ?? undefined,
    hours: row.hours ?? undefined,
    animalTypes: row.animal_types,
    adoptionFee: row.adoption_fee ?? undefined,
    requiresHomeVisit: row.requires_home_visit ?? undefined,
    vaccinationPolicy: row.vaccination_policy ?? undefined,
    photoUri: row.photo_url ?? undefined,
  };
}
