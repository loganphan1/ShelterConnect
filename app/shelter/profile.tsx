import { router, useLocalSearchParams } from 'expo-router';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_SHELTERS, MOCK_PETS } from '@/data/mockPets';
import { useUserStore } from '@/store/userStore';

const { width } = Dimensions.get('window');
const GRID_ITEM = (width - 4) / 3;

export default function ShelterProfile() {
  const params = useLocalSearchParams<{ shelterId?: string; fromOnboarding?: string }>();
  const shelterProfile = useUserStore((s) => s.shelterProfile);

  // If viewing own shelter profile (from onboarding), use store data
  // If viewing another shelter from the feed, use mock data
  const shelter =
    params.shelterId
      ? MOCK_SHELTERS.find((s) => s.id === params.shelterId)
      : null;

  const isOwnProfile = !params.shelterId || params.fromOnboarding === '1';

  const displayName = shelter?.name ?? shelterProfile?.name ?? 'My Shelter';
  const displayPhone = shelter?.phone ?? shelterProfile?.phone ?? '—';
  const displayAddress = shelter?.address ?? shelterProfile?.address ?? '—';
  const displayAbout =
    shelter?.about ??
    'Welcome to our shelter. We are dedicated to finding loving homes for every animal in our care.';
  const displayHours = shelter?.hours ?? 'Mon–Fri 9am–5pm';
  const displayFee = shelter?.adoptionFee ?? (shelterProfile as any)?.adoptionFee ?? '—';
  const displayVisit = shelter?.requiresHomeVisit ?? (shelterProfile as any)?.requiresHomeVisit ?? '—';
  const displayVax = shelter?.vaccinationPolicy ?? (shelterProfile as any)?.vaccinationPolicy ?? '—';

  const shelterId = params.shelterId ?? 's1';
  const pets = MOCK_PETS.filter((p) => p.shelterId === shelterId);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header nav */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shelter Profile</Text>
        {isOwnProfile && (
          <TouchableOpacity
            onPress={() => router.push('/shelter/post')}
            style={styles.postBtn}
          >
            <Text style={styles.postBtnText}>+ Post</Text>
          </TouchableOpacity>
        )}
        {!isOwnProfile && <View style={{ width: 60 }} />}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🏛️</Text>
          </View>
          <Text style={styles.shelterName}>{displayName}</Text>
          <Text style={styles.address}>📍 {displayAddress}</Text>
        </View>

        {/* Quick stats */}
        <View style={styles.statsRow}>
          <StatItem emoji="🐾" label="Animals" value={String(pets.length)} />
          <StatItem emoji="💰" label="Fee" value={displayFee} />
          <StatItem emoji="🏠" label="Home visit" value={displayVisit} />
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <InfoRow emoji="📞" label="Phone" value={displayPhone} />
          <InfoRow emoji="📍" label="Address" value={displayAddress} />
          <InfoRow emoji="🕐" label="Hours" value={displayHours} />
        </View>

        {/* Adoption info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Info</Text>
          <InfoRow emoji="💰" label="Adoption fee" value={displayFee} />
          <InfoRow emoji="🏠" label="Home visit required" value={displayVisit} />
          <InfoRow emoji="💉" label="Vaccination records" value={displayVax} />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.aboutText}>{displayAbout}</Text>
        </View>

        {/* Post button for own profile */}
        {isOwnProfile && (
          <TouchableOpacity
            style={styles.postAnimalBtn}
            onPress={() => router.push('/shelter/post')}
            activeOpacity={0.85}
          >
            <Text style={styles.postAnimalText}>📸 Post a New Animal</Text>
          </TouchableOpacity>
        )}

        {/* Animal grid */}
        {pets.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Animals</Text>
            <View style={styles.grid}>
              {pets.map((pet) => (
                <View key={pet.id} style={styles.gridItem}>
                  <Image
                    source={{ uri: pet.media[0].uri }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridPetName}>{pet.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatItem({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statEmoji}>{emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoEmoji}>{emoji}</Text>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#444',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  postBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#7C3AED',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  shelterName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 6,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statEmoji: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  infoEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#1A1A2E',
    fontWeight: '500',
  },
  aboutText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  postAnimalBtn: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  postAnimalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
    marginHorizontal: -8,
  },
  gridItem: {
    width: GRID_ITEM,
    height: GRID_ITEM,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  gridPetName: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
