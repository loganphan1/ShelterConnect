import { Pet } from '@/data/mockPets';
import { OwnerAnswers } from '@/store/userStore';

export function scorePet(pet: Pet, answers: Partial<OwnerAnswers>): number {
  let score = 0;

  // Type match — 25pts
  if (answers.petType === 'either' || answers.petType === pet.type) {
    score += 25;
  }

  // Size match — 15pts
  if (answers.size === 'any' || answers.size === pet.size) {
    score += 15;
  }

  // Activity / energy match — 20pts
  if (answers.activityLevel && pet.energyLevel) {
    const map: Record<string, string> = {
      low: 'low',
      medium: 'medium',
      high: 'high',
    };
    if (map[answers.activityLevel] === pet.energyLevel) {
      score += 20;
    } else {
      // Partial match for adjacent levels
      const levels = ['low', 'medium', 'high'];
      const ownerIdx = levels.indexOf(answers.activityLevel);
      const petIdx = levels.indexOf(pet.energyLevel);
      if (Math.abs(ownerIdx - petIdx) === 1) {
        score += 10;
      }
    }
  }

  // Kids compatibility — 15pts
  if (answers.hasYoungKids === 'none') {
    score += 15; // No kids, any pet works
  } else if (pet.goodWithKids) {
    score += 15;
  }

  // Other pets compatibility — 10pts
  if (answers.otherPets === 'none') {
    score += 10; // No other pets, any pet works
  } else if (pet.goodWithPets) {
    score += 10;
  }

  // Age preference — 10pts
  if (answers.agePreference === 'any' || answers.agePreference === pet.age) {
    score += 10;
  }

  // Shedding / hypoallergenic — 5pts
  if (answers.shedding === 'ok') {
    score += 5;
  } else if (answers.shedding === 'hypoallergenic' && pet.hypoallergenic) {
    score += 5;
  } else if (answers.shedding === 'minimal' && !pet.hypoallergenic) {
    score += 3;
  }

  // Living situation bonus — apartment-friendly pets
  if (answers.livingSituation === 'apartment' && !pet.needsYard) {
    score += 5;
  } else if (answers.livingSituation !== 'apartment') {
    score += 5; // House/large: all pets work
  }

  return Math.min(score, 100);
}

export function matchPets(pets: Pet[], answers: Partial<OwnerAnswers>): Pet[] {
  return pets
    .map((pet) => ({ ...pet, score: scorePet(pet, answers) }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
}
