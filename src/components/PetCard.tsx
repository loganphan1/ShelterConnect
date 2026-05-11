import { LinearGradient } from 'expo-linear-gradient';
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
const IMAGE_HEIGHT = height * 0.56;

type Props = {
  pet: Pet;
  isVisible: boolean;
};

const ENERGY_LABEL: Record<Pet['energyLevel'], string> = {
  low: '🛋️ Laid-back',
  medium: '🏃 Active',
  high: '⚡ High energy',
};

const SIZE_LABEL: Record<Pet['size'], string> = {
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export default function PetCard({ pet }: Props) {
  const savedPetIds = useUserStore((s) => s.savedPetIds);
  const toggleSave = useUserStore((s) => s.toggleSave);
  const liked = savedPetIds.includes(pet.id);
  const shelter = MOCK_SHELTERS.find((s) => s.id === pet.shelterId);
  const firstMedia = pet.media[0];

  function openShelterProfile() {
    router.push({ pathname: '/shelter/profile', params: { shelterId: pet.shelterId } });
  }

  return (
    <View style={styles.slide}>
      <View style={styles.card}>

        {/* ── Photo ── */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: firstMedia.uri }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.35)']}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          />

          {/* Heart button */}
          <TouchableOpacity
            style={[styles.heartBtn, liked && styles.heartBtnActive]}
            onPress={() => toggleSave(pet.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.heartEmoji}>{liked ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          {/* Match badge */}
          {pet.score !== undefined && (
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>⭐ {pet.score}% match</Text>
            </View>
          )}

          {/* Name / age floated on image */}
          <View style={styles.imageNameRow}>
            <Text style={styles.imageNameText}>{pet.name}</Text>
            <View style={styles.agePill}>
              <Text style={styles.agePillText}>{pet.ageDisplay}</Text>
            </View>
          </View>
        </View>

        {/* ── Info Panel ── */}
        <View style={styles.info}>
          <Text style={styles.breed}>{pet.breed} · {SIZE_LABEL[pet.size]}</Text>

          {/* Trait chips */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipOrange]}>
              <Text style={styles.chipText}>{ENERGY_LABEL[pet.energyLevel]}</Text>
            </View>
            {pet.goodWithKids && (
              <View style={[styles.chip, styles.chipBlue]}>
                <Text style={styles.chipText}>👶 Kid-friendly</Text>
              </View>
            )}
            {pet.goodWithPets && (
              <View style={[styles.chip, styles.chipTeal]}>
                <Text style={styles.chipText}>🐾 Pet-friendly</Text>
              </View>
            )}
            {pet.hypoallergenic && (
              <View style={[styles.chip, styles.chipGreen]}>
                <Text style={styles.chipText}>🌿 Hypoallergenic</Text>
              </View>
            )}
          </View>

          <Text style={styles.bio} numberOfLines={2}>{pet.bio}</Text>

          {/* Bottom row */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.shelterBtn} onPress={openShelterProfile} activeOpacity={0.75}>
              <Text style={styles.shelterName}>🏠 {shelter?.name}</Text>
              <Text style={styles.distance}>📍 {pet.distanceMiles} mi away</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.85} onPress={openShelterProfile}>
              <LinearGradient
                colors={['#F97316', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.adoptBtn}
              >
                <Text style={styles.adoptText}>Adopt Me</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },

  // Image
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  heartBtnActive: {
    backgroundColor: '#FFF0F0',
  },
  heartEmoji: {
    fontSize: 22,
  },
  matchBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  matchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  imageNameRow: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageNameText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  agePill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  agePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A2E',
  },

  // Info
  info: {
    padding: 18,
    paddingBottom: 20,
    backgroundColor: '#fff',
    gap: 10,
  },
  breed: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
  },
  chipOrange: { backgroundColor: '#FFF3E8' },
  chipBlue:   { backgroundColor: '#EFF6FF' },
  chipTeal:   { backgroundColor: '#F0FDFA' },
  chipGreen:  { backgroundColor: '#F0FDF4' },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  shelterBtn: {
    flex: 1,
    paddingRight: 12,
  },
  shelterName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  distance: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 2,
  },
  adoptBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
  },
  adoptText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
