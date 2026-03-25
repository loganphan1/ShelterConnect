import { supabase } from '@/lib/supabase';
import { Pet, PetMedia, Shelter } from '@/data/mockPets';
import { OwnerAnswers } from '@/store/userStore';
import { DBPetWithMedia } from '@/types/database';

// ─── Fetch pets (with optional preference-based ordering) ─────────────────────

export type PetFilters = {
  type?: 'dog' | 'cat';
  size?: 'small' | 'medium' | 'large';
  age?: 'young' | 'adult' | 'senior';
  energyLevel?: 'low' | 'medium' | 'high';
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  hypoallergenic?: boolean;
  needsYard?: boolean;
  shelterId?: string;
};

export async function fetchPets(filters?: PetFilters): Promise<Pet[]> {
  let query = supabase
    .from('pets')
    .select('*, pet_media(*), shelters(*)')
    .eq('available', true)
    .order('created_at', { ascending: false });

  if (filters?.type) query = query.eq('type', filters.type);
  if (filters?.size) query = query.eq('size', filters.size);
  if (filters?.age) query = query.eq('age', filters.age);
  if (filters?.energyLevel) query = query.eq('energy_level', filters.energyLevel);
  if (filters?.goodWithKids !== undefined) query = query.eq('good_with_kids', filters.goodWithKids);
  if (filters?.goodWithPets !== undefined) query = query.eq('good_with_pets', filters.goodWithPets);
  if (filters?.hypoallergenic !== undefined) query = query.eq('hypoallergenic', filters.hypoallergenic);
  if (filters?.needsYard !== undefined) query = query.eq('needs_yard', filters.needsYard);
  if (filters?.shelterId) query = query.eq('shelter_id', filters.shelterId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as DBPetWithMedia[]).map(dbRowToPet);
}

/** Fetch all available pets and attach a compatibility score based on owner answers. */
export async function fetchPetsForOwner(answers: Partial<OwnerAnswers>): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*, pet_media(*), shelters(*)')
    .eq('available', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  const { scorePet } = await import('@/lib/matching');
  return (data as DBPetWithMedia[])
    .map(dbRowToPet)
    .map((pet) => ({ ...pet, score: scorePet(pet, answers) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}

// ─── Shelter's own pets ───────────────────────────────────────────────────────

export async function fetchPetsByShelterId(shelterId: string): Promise<Pet[]> {
  const { data, error } = await supabase
    .from('pets')
    .select('*, pet_media(*), shelters(*)')
    .eq('shelter_id', shelterId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as DBPetWithMedia[]).map(dbRowToPet);
}

// ─── Create / update / delete a pet ──────────────────────────────────────────

export type NewPetInput = {
  shelterId: string;
  name: string;
  breed?: string;
  type: 'dog' | 'cat';
  size?: 'small' | 'medium' | 'large';
  age?: 'young' | 'adult' | 'senior';
  ageDisplay?: string;
  energyLevel?: 'low' | 'medium' | 'high';
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  hypoallergenic?: boolean;
  needsYard?: boolean;
  bio?: string;
  media?: PetMedia[];
};

export async function createPet(input: NewPetInput): Promise<Pet> {
  const { data: pet, error: petError } = await supabase
    .from('pets')
    .insert({
      shelter_id: input.shelterId,
      name: input.name,
      breed: input.breed ?? null,
      type: input.type,
      size: input.size ?? null,
      age: input.age ?? null,
      age_display: input.ageDisplay ?? null,
      energy_level: input.energyLevel ?? null,
      good_with_kids: input.goodWithKids ?? false,
      good_with_pets: input.goodWithPets ?? false,
      hypoallergenic: input.hypoallergenic ?? false,
      needs_yard: input.needsYard ?? false,
      bio: input.bio ?? null,
      available: true,
    } as Record<string, unknown>)
    .select('id')
    .single();

  if (petError) throw new Error(petError.message);

  const petId = (pet as { id: string }).id;

  if (input.media && input.media.length > 0) {
    const mediaRows = input.media.map((m, i) => ({
      pet_id: petId,
      type: m.type,
      url: m.uri,
      sort_order: i,
    })) as Record<string, unknown>[];
    const { error: mediaError } = await supabase.from('pet_media').insert(mediaRows);
    if (mediaError) throw new Error(mediaError.message);
  }

  const { data: full, error: fetchError } = await supabase
    .from('pets')
    .select('*, pet_media(*), shelters(*)')
    .eq('id', petId)
    .single();

  if (fetchError) throw new Error(fetchError.message);
  return dbRowToPet(full as DBPetWithMedia);
}

export async function markPetUnavailable(petId: string): Promise<void> {
  const { error } = await supabase
    .from('pets')
    .update({ available: false } as Record<string, unknown>)
    .eq('id', petId);
  if (error) throw new Error(error.message);
}

// ─── Shelters ─────────────────────────────────────────────────────────────────

export async function fetchAllShelters(): Promise<Shelter[]> {
  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .order('name');
  if (error) throw new Error(error.message);
  return (data as import('@/types/database').DBShelter[]).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone ?? '',
    address: row.address ?? '',
    about: row.about ?? '',
    hours: row.hours ?? '',
    animalTypes: row.animal_types,
    adoptionFee: row.adoption_fee ?? '',
    requiresHomeVisit: row.requires_home_visit ?? '',
    vaccinationPolicy: row.vaccination_policy ?? '',
    photoUri: row.photo_url ?? undefined,
  }));
}

export async function fetchShelterById(id: string): Promise<Shelter | null> {
  const { data, error } = await supabase
    .from('shelters')
    .select('*')
    .eq('id', id)
    .single();
  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message);
  }
  const row = data as import('@/types/database').DBShelter;
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? '',
    address: row.address ?? '',
    about: row.about ?? '',
    hours: row.hours ?? '',
    animalTypes: row.animal_types,
    adoptionFee: row.adoption_fee ?? '',
    requiresHomeVisit: row.requires_home_visit ?? '',
    vaccinationPolicy: row.vaccination_policy ?? '',
    photoUri: row.photo_url ?? undefined,
  };
}

// ─── Mapping helper ───────────────────────────────────────────────────────────

function dbRowToPet(row: DBPetWithMedia): Pet {
  return {
    id: row.id,
    name: row.name,
    breed: row.breed ?? '',
    type: row.type,
    size: row.size ?? 'medium',
    age: row.age ?? 'adult',
    ageDisplay: row.age_display ?? '',
    energyLevel: row.energy_level ?? 'medium',
    goodWithKids: row.good_with_kids,
    goodWithPets: row.good_with_pets,
    hypoallergenic: row.hypoallergenic,
    needsYard: row.needs_yard,
    bio: row.bio ?? '',
    shelterId: row.shelter_id,
    distanceMiles: 0, // populated client-side with device location if needed
    media: (row.pet_media ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((m) => ({ type: m.type, uri: m.url })),
  };
}
