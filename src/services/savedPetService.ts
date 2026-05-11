import { supabase } from '@/lib/supabase';

export async function getSavedPetIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('saved_pets')
    .select('pet_id')
    .eq('user_id', userId);

  if (error) {
    console.error('getSavedPetIds:', error.message);
    return [];
  }

  return data.map((row) => row.pet_id);
}

export async function savePet(userId: string, petId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_pets')
    .upsert(
      { user_id: userId, pet_id: petId },
      { onConflict: 'user_id,pet_id' }
    );

  if (error) throw new Error(error.message);
}

export async function unsavePet(userId: string, petId: string): Promise<void> {
  const { error } = await supabase
    .from('saved_pets')
    .delete()
    .eq('user_id', userId)
    .eq('pet_id', petId);

  if (error) throw new Error(error.message);
}