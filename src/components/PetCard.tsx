import { router } from 'expo-router';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { MOCK_SHELTERS } from '@/data/mockPets';
import type { Pet } from '@/data/mockPets';
import { useUserStore } from '@/store/userStore';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height;

type Props = {
  pet: Pet;
  isVisible: boolean;
};

export default function PetCard({ pet, isVisible }: Props) {
  const savedPetIds = useUserStore((s) => s.savedPetIds);
  const toggleSave = useUserStore((s) => s.toggleSave);
  const liked = savedPetIds.includes(pet.id);
  const shelter = MOCK_SHELTERS.find((s) => s.id === pet.shelterId);
  const firstMedia = pet.media[0];

  function openShelterProfile() {
    router.push({ pathname: '/shelter/profile', params: { shelterId: pet.shelterId } });
  }

  return (
    <View style={styles.card}>
      {/* Media */}
      <View style={styles.mediaContainer}>
        <Image
          source={{ uri: firstMedia.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Gradient overlay */}
        <View style={styles.gradient} />

        {/* Info overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.nameRow}>
            <View style={styles.nameRowLeft}>
              <TouchableOpacity onPress={() => toggleSave(pet.id)} activeOpacity={0.8}>
                <Text style={styles.heartEmoji}>{liked ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
              {pet.score !== undefined && (
                <View style={styles.matchBadge}>
                  <Text style={styles.matchText}>{pet.score}% match</Text>
                </View>
              )}
            </View>
            <View style={styles.nameRowRight}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petAge}>{pet.ageDisplay}</Text>
            </View>
          </View>
          <Text style={styles.petBreed}>{pet.breed}</Text>

          {/* Traits */}
          <View style={styles.traitsRow}>
            {pet.goodWithKids && (
              <View style={styles.trait}>
                <Text style={styles.traitText}>👶 Kid-friendly</Text>
              </View>
            )}
            {pet.goodWithPets && (
              <View style={styles.trait}>
                <Text style={styles.traitText}>🐾 Pet-friendly</Text>
              </View>
            )}
            {pet.hypoallergenic && (
              <View style={styles.trait}>
                <Text style={styles.traitText}>🌿 Hypoallergenic</Text>
              </View>
            )}
          </View>

          <Text style={styles.bio} numberOfLines={2}>
            {pet.bio}
          </Text>

          {/* Bottom actions */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={openShelterProfile} style={styles.shelterButton}>
              <Text style={styles.shelterName}>🏠 {shelter?.name}</Text>
              <Text style={styles.distanceText}>📍 {pet.distanceMiles} mi away</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.adoptButton} activeOpacity={0.85}>
              <Text style={styles.adoptText}>Adopt Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width,
    height: CARD_HEIGHT,
    backgroundColor: '#1A1A2E',
  },
  mediaContainer: {
    flex: 1,
    backgroundColor: '#111',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: 'transparent',
    // Simulated gradient via opacity layers
    borderBottomLeftRadius: 0,
  },
  matchBadge: {
    backgroundColor: '#F97316',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  matchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  heartEmoji: {
    fontSize: 28,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nameRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameRowRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  petName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
  },
  petAge: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  petBreed: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  trait: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  traitText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bio: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shelterButton: {
    flex: 1,
    paddingRight: 12,
  },
  shelterName: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
  },
  distanceText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginTop: 2,
  },
  adoptButton: {
    backgroundColor: '#F97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  adoptText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
