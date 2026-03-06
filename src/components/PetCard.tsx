import { router } from 'expo-router';
import { useState } from 'react';
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

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.78;

type Props = {
  pet: Pet;
  isVisible: boolean;
};

export default function PetCard({ pet, isVisible }: Props) {
  const [liked, setLiked] = useState(false);
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

        {/* Match badge */}
        {pet.score !== undefined && (
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>{pet.score}% match</Text>
          </View>
        )}

        {/* Heart button */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => setLiked((l) => !l)}
          activeOpacity={0.8}
        >
          <Text style={styles.heartEmoji}>{liked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Info overlay */}
        <View style={styles.infoOverlay}>
          <View style={styles.nameRow}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petAge}>{pet.ageDisplay}</Text>
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
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  matchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartEmoji: {
    fontSize: 32,
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
    alignItems: 'baseline',
    gap: 10,
    marginBottom: 4,
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
  adoptButton: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#7C3AED',
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
