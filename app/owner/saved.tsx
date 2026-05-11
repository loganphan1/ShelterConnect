import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeedStore } from '@/store/feedStore';
import { useUserStore } from '@/store/userStore';
import { MOCK_SHELTERS } from '@/data/mockPets';
import type { Pet } from '@/data/mockPets';

// Decorative floating hearts for the background
function BackgroundHearts() {
  const hearts = [
    { top: 60,  left: 14,  size: 28, opacity: 0.10, rotate: '-12deg' },
    { top: 120, left: 280, size: 20, opacity: 0.08, rotate:  '18deg' },
    { top: 230, left: 40,  size: 16, opacity: 0.07, rotate:  '-6deg' },
    { top: 340, left: 310, size: 24, opacity: 0.09, rotate:  '22deg' },
    { top: 460, left: 20,  size: 22, opacity: 0.08, rotate:  '-18deg' },
    { top: 560, left: 290, size: 18, opacity: 0.07, rotate:   '8deg' },
    { top: 680, left: 60,  size: 30, opacity: 0.09, rotate:  '14deg' },
    { top: 780, left: 260, size: 16, opacity: 0.06, rotate: '-10deg' },
  ];
  return (
    <>
      {hearts.map((h, i) => (
        <Text
          key={i}
          style={{
            position: 'absolute',
            top: h.top,
            left: h.left,
            fontSize: h.size,
            opacity: h.opacity,
            transform: [{ rotate: h.rotate }],
            pointerEvents: 'none',
          } as never}
        >
          ❤️
        </Text>
      ))}
    </>
  );
}

const SIZE_LABEL: Record<Pet['size'], string> = { small: 'Small', medium: 'Medium', large: 'Large' };
const AGE_COLOR: Record<Pet['age'], string> = { young: '#34D399', adult: '#60A5FA', senior: '#A78BFA' };

export default function SavedPets() {
  const savedPetIds = useUserStore((s) => s.savedPetIds);
  const toggleSave  = useUserStore((s) => s.toggleSave);
  const feedItems   = useFeedStore((s) => s.feedItems);
  const savedPets   = feedItems.filter((p) => savedPetIds.includes(p.id));

  return (
    <LinearGradient
      colors={['#FFE4EC', '#FFF0F5', '#FFF8F0', '#FFFBF7']}
      locations={[0, 0.25, 0.6, 1]}
      style={{ flex: 1 }}
    >
      <BackgroundHearts />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>❤️ Saved Animals</Text>
            {savedPets.length > 0 && (
              <Text style={styles.headerSub}>
                {savedPets.length} {savedPets.length === 1 ? 'pet' : 'pets'} waiting for you
              </Text>
            )}
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* ── Empty state ── */}
        {savedPets.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyHeart}>🤍</Text>
            <Text style={styles.emptyTitle}>No saved animals yet</Text>
            <Text style={styles.emptySub}>
              Tap the heart on any animal in your feed to save them here.
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.back()} activeOpacity={0.85}>
              <LinearGradient colors={['#F97316', '#EC4899']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.emptyBtnGrad}>
                <Text style={styles.emptyBtnText}>Browse Animals</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {savedPets.map((pet) => {
              const shelter = MOCK_SHELTERS.find((s) => s.id === pet.shelterId);

              return (
                <View key={pet.id} style={styles.card}>

                  {/* Photo */}
                  <View style={styles.imageWrap}>
                    <Image
                      source={{ uri: pet.media[0].uri }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.45)']}
                      style={StyleSheet.absoluteFill}
                      pointerEvents="none"
                    />

                    {/* Name + age overlaid on photo */}
                    <View style={styles.imageOverlay}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <View style={[styles.agePill, { backgroundColor: AGE_COLOR[pet.age] }]}>
                        <Text style={styles.agePillText}>{pet.ageDisplay}</Text>
                      </View>
                    </View>

                    {/* Match badge */}
                    {pet.score !== undefined && (
                      <View style={styles.matchBadge}>
                        <Text style={styles.matchText}>⭐ {pet.score}% match</Text>
                      </View>
                    )}

                    {/* Unsave button */}
                    <TouchableOpacity
                      style={styles.heartBtn}
                      onPress={() => toggleSave(pet.id)}
                      activeOpacity={0.8}
                      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                    >
                      <Text style={styles.heartEmoji}>❤️</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Info panel */}
                  <View style={styles.info}>

                    {/* Breed + size */}
                    <Text style={styles.breed}>
                      {pet.breed}
                      <Text style={styles.breedMid}> · </Text>
                      {SIZE_LABEL[pet.size]}
                    </Text>

                    {/* Trait chips */}
                    <View style={styles.chipsRow}>
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
                      {pet.needsYard && (
                        <View style={[styles.chip, styles.chipYellow]}>
                          <Text style={styles.chipText}>🏡 Needs yard</Text>
                        </View>
                      )}
                    </View>

                    {/* Bio */}
                    <Text style={styles.bio} numberOfLines={3}>{pet.bio}</Text>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Shelter details */}
                    {shelter && (
                      <TouchableOpacity
                        onPress={() => router.push({ pathname: '/shelter/profile', params: { shelterId: pet.shelterId } })}
                        activeOpacity={0.75}
                        style={styles.shelterRow}
                      >
                        <View style={styles.shelterLeft}>
                          <Text style={styles.shelterName}>🏠 {shelter.name}</Text>
                          <Text style={styles.shelterDetail}>📍 {pet.distanceMiles} mi away  ·  💰 {shelter.adoptionFee}</Text>
                          <Text style={styles.shelterDetail}>🕐 {shelter.hours}</Text>
                        </View>
                        <Text style={styles.shelterArrow}>›</Text>
                      </TouchableOpacity>
                    )}

                    {/* CTA row */}
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={styles.unsaveRow}
                        onPress={() => toggleSave(pet.id)}
                        activeOpacity={0.75}
                      >
                        <Text style={styles.unsaveText}>🤍 Remove</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        style={{ flex: 1 }}
                        onPress={() => router.push({ pathname: '/shelter/profile', params: { shelterId: pet.shelterId } })}
                      >
                        <LinearGradient
                          colors={['#F97316', '#EC4899']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.adoptBtn}
                        >
                          <Text style={styles.adoptText}>Adopt Me 🐾</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>
              );
            })}

            <View style={{ height: 32 }} />
          </ScrollView>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(249,115,22,0.15)',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249,115,22,0.12)',
    borderRadius: 20,
  },
  backIcon: {
    fontSize: 20,
    color: '#F97316',
    fontWeight: '700',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EC4899',
    marginTop: 2,
  },

  // Empty
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
  },
  emptyHeart: {
    fontSize: 72,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 23,
  },
  emptyBtn: {
    marginTop: 8,
    width: '100%',
  },
  emptyBtnGrad: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 20,
  },

  // Card
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 8,
  },

  // Image section
  imageWrap: {
    width: '100%',
    height: 220,
    backgroundColor: '#eee',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  petName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  agePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  agePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F97316',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heartEmoji: {
    fontSize: 20,
  },

  // Info section
  info: {
    padding: 18,
    gap: 10,
  },
  breed: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888',
  },
  breedMid: {
    color: '#ccc',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chipBlue:   { backgroundColor: '#EFF6FF' },
  chipTeal:   { backgroundColor: '#F0FDFA' },
  chipGreen:  { backgroundColor: '#F0FDF4' },
  chipYellow: { backgroundColor: '#FEFCE8' },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  bio: {
    fontSize: 14,
    color: '#555',
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3E8FF',
    marginVertical: 2,
  },
  shelterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8F0',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFE4CC',
  },
  shelterLeft: {
    flex: 1,
    gap: 3,
  },
  shelterName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  shelterDetail: {
    fontSize: 12,
    color: '#888',
  },
  shelterArrow: {
    fontSize: 22,
    color: '#F97316',
    fontWeight: '700',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  unsaveRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EC4899',
    backgroundColor: '#FFF0F5',
  },
  unsaveText: {
    color: '#EC4899',
    fontSize: 14,
    fontWeight: '700',
  },
  adoptBtn: {
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
  },
  adoptText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
