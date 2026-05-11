import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Pet } from '@/data/mockPets';
import { useUserStore } from '@/store/userStore';
import { useFeedStore } from '@/store/feedStore';
import { useEffect } from 'react';
import { fetchShelterById, fetchPetsByShelterId } from '@/services/petService';
import type { Shelter } from '@/data/mockPets';

const { width, height } = Dimensions.get('window');
const GRID_ITEM = (width - 56) / 3;

export default function ShelterProfile() {
  const params = useLocalSearchParams<{ shelterId?: string; fromOnboarding?: string }>();
  const shelterProfile = useUserStore((s) => s.shelterProfile);
  const feedItems = useFeedStore((s) => s.feedItems);
  const savedPetIds = useUserStore((s) => s.savedPetIds);
  const toggleSave = useUserStore((s) => s.toggleSave);
  const [viewedShelter, setViewedShelter] = useState<Partial<Shelter> | null>(null);
  const [viewedPets, setViewedPets] = useState<Pet[]>([]);
  useEffect(() => {
  async function loadShelterData() {
    if (!params.shelterId) return;

    try {
      const shelter = await fetchShelterById(params.shelterId);
      const pets = await fetchPetsByShelterId(params.shelterId);

      setViewedShelter(shelter);
      setViewedPets(pets);
    } catch (error) {
      console.log('Failed to load shelter:', error);
    }
  }

  loadShelterData();
}, [params.shelterId]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
const isOwnProfile = !params.shelterId || params.fromOnboarding === '1';

const activeShelter = isOwnProfile ? shelterProfile : viewedShelter;

const displayName = activeShelter?.name ?? 'Shelter';
const displayPhone = activeShelter?.phone ?? '—';
const displayAddress = activeShelter?.address ?? '—';
const displayAbout =
  activeShelter?.about ??
  'Welcome to our shelter. We are dedicated to finding loving homes for every animal in our care.';
const displayHours = activeShelter?.hours ?? 'Mon–Fri 9am–5pm';
const displayFee = (activeShelter as any)?.adoptionFee ?? '—';
const displayVisit = (activeShelter as any)?.requiresHomeVisit ?? '—';
const displayVax = (activeShelter as any)?.vaccinationPolicy ?? '—';
const shelterId = params.shelterId ?? shelterProfile?.id;

const pets = isOwnProfile
  ? feedItems.filter((p) => p.shelterId === shelterId)
  : viewedPets;
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shelter Profile</Text>
        {isOwnProfile ? (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <TouchableOpacity
        onPress={() => router.push('/shelter/questionnaire')}
        style={styles.editBtn}
      >
        <Text style={styles.editBtnText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/shelter/post')} style={styles.postBtn}>
        <Text style={styles.postBtnText}>+ Post</Text>
      </TouchableOpacity>
    </View>
        ) : (
          <View style={{ width: 60 }} />
        )}
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
          <StatItem emoji="🐾" label="Animals"    value={String(pets.length)} />
          <StatItem emoji="💰" label="Fee"         value={displayFee} />
          <StatItem emoji="🏠" label="Home visit"  value={displayVisit} />
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <InfoRow emoji="📞" label="Phone"   value={displayPhone} />
          <InfoRow emoji="📍" label="Address" value={displayAddress} />
          <InfoRow emoji="🕐" label="Hours"   value={displayHours} />
        </View>

        {/* Adoption info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Info</Text>
          <InfoRow emoji="💰" label="Adoption fee"        value={displayFee} />
          <InfoRow emoji="🏠" label="Home visit required" value={displayVisit} />
          <InfoRow emoji="💉" label="Vaccination records" value={displayVax} />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Us</Text>
          <Text style={styles.aboutText}>{displayAbout}</Text>
        </View>

        {/* Add listing button (own profile) */}
        {isOwnProfile && (
          <TouchableOpacity
            onPress={() => router.push('/shelter/post')}
            activeOpacity={0.85}
            style={styles.postAnimalBtn}
          >
            <Text style={styles.postAnimalText}>+ Add Animal Listing</Text>
          </TouchableOpacity>
        )}

        {/* Animal grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isOwnProfile ? 'Manage Available Animals' : 'Available Animals'}
          </Text>
          {isOwnProfile && (
            <Text style={styles.manageHint}>Tap an animal to edit or remove its listing.</Text>
          )}

          {pets.length > 0 ? (
            <View style={styles.grid}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.gridItem}
                  activeOpacity={0.85}
                  onPress={() =>
                    isOwnProfile
                      ? router.push({ pathname: '/shelter/post', params: { petId: pet.id } })
                      : setSelectedPet(pet)
                  }
                >
                  <Image source={{ uri: pet.media[0]?.uri }} style={styles.gridImage} />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridPetName}>{pet.name}</Text>
                    <Text style={styles.gridSubText}>
                      {isOwnProfile ? 'Edit' : 'View'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              {isOwnProfile
                ? 'No animal listings yet. Add your first available animal.'
                : 'No available animals listed right now.'}
            </Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Pet Detail Modal ── */}
      <Modal
        visible={selectedPet !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedPet(null)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setSelectedPet(null)}
        />
        {selectedPet && (
          <View style={styles.sheet}>
            {/* Photo */}
            <View style={styles.sheetImageWrap}>
              <Image
                source={{ uri: selectedPet.media[0]?.uri }}
                style={styles.sheetImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)']}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
              />
              <View style={styles.sheetNameRow}>
                <Text style={styles.sheetPetName}>{selectedPet.name}</Text>
                <View style={styles.sheetAgePill}>
                  <Text style={styles.sheetAgePillText}>{selectedPet.ageDisplay}</Text>
                </View>
              </View>
              {selectedPet.score !== undefined && (
                <View style={styles.sheetMatchBadge}>
                  <Text style={styles.sheetMatchText}>⭐ {selectedPet.score}% match</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.sheetClose}
                onPress={() => setSelectedPet(null)}
              >
                <Text style={styles.sheetCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Info */}
            <ScrollView style={styles.sheetBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.sheetBreed}>
                {selectedPet.breed} · {selectedPet.size.charAt(0).toUpperCase() + selectedPet.size.slice(1)}
              </Text>

              {/* Trait chips */}
              <View style={styles.chipsRow}>
                {selectedPet.goodWithKids && (
                  <View style={[styles.chip, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={styles.chipText}>👶 Kid-friendly</Text>
                  </View>
                )}
                {selectedPet.goodWithPets && (
                  <View style={[styles.chip, { backgroundColor: '#F0FDFA' }]}>
                    <Text style={styles.chipText}>🐾 Pet-friendly</Text>
                  </View>
                )}
                {selectedPet.hypoallergenic && (
                  <View style={[styles.chip, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={styles.chipText}>🌿 Hypoallergenic</Text>
                  </View>
                )}
                {selectedPet.needsYard && (
                  <View style={[styles.chip, { backgroundColor: '#FEFCE8' }]}>
                    <Text style={styles.chipText}>🏡 Needs yard</Text>
                  </View>
                )}
              </View>

              <Text style={styles.sheetBio}>{selectedPet.bio}</Text>

              {/* Actions */}
              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    savedPetIds.includes(selectedPet.id) && styles.saveBtnActive,
                  ]}
                  onPress={() => toggleSave(selectedPet.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.saveBtnText,
                    savedPetIds.includes(selectedPet.id) && styles.saveBtnTextActive,
                  ]}>
                    {savedPetIds.includes(selectedPet.id) ? '❤️ Saved' : '🤍 Save'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: 1 }}
                  activeOpacity={0.85}
                  onPress={() => Linking.openURL(`tel:${displayPhone.replace(/\D/g, '')}`)}
                >
                  <LinearGradient
                    colors={['#F97316', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.adoptBtn}
                  >
                    <Text style={styles.adoptBtnText}>📞 Call to Adopt</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>
        )}
      </Modal>
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
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  editBtn: {
    backgroundColor: '#FFF3E8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#F97316',
  },
  editBtnText: {
    color: '#F97316',
    fontWeight: '700',
    fontSize: 14,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 22, color: '#444' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E' },
  postBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  hero: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24 },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#FFF3E8', alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 3, borderColor: '#F97316',
  },
  avatarEmoji: { fontSize: 48 },
  shelterName: { fontSize: 26, fontWeight: '800', color: '#1A1A2E', marginBottom: 6, textAlign: 'center' },
  address: { fontSize: 14, color: '#888', textAlign: 'center' },

  statsRow: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#fff',
    borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statEmoji: { fontSize: 24 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  statLabel: { fontSize: 12, color: '#888' },

  section: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: '#fff',
    borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },

  infoRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  infoEmoji: { fontSize: 20, marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#999', marginBottom: 2 },
  infoValue: { fontSize: 15, color: '#1A1A2E', fontWeight: '500' },

  aboutText: { fontSize: 15, color: '#555', lineHeight: 22 },

  postAnimalBtn: {
    marginHorizontal: 20, marginBottom: 20, backgroundColor: '#F97316',
    borderRadius: 16, paddingVertical: 16, alignItems: 'center',
    shadowColor: '#F97316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  postAnimalText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridItem: { width: GRID_ITEM, height: GRID_ITEM, borderRadius: 12, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
  gridOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 5, paddingHorizontal: 6,
    borderBottomLeftRadius: 12, borderBottomRightRadius: 12,
  },
  gridPetName: { color: '#fff', fontSize: 11, fontWeight: '700' },
  gridSubText: { color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 1 },
  manageHint: { fontSize: 14, color: '#777', marginBottom: 14, lineHeight: 20 },
  emptyText: { fontSize: 14, color: '#777', lineHeight: 20 },

  // ── Modal / Sheet ──
  modalBackdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: height * 0.80,
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  sheetImageWrap: { width: '100%', height: 240 },
  sheetImage: { width: '100%', height: '100%' },
  sheetNameRow: {
    position: 'absolute', bottom: 14, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  sheetPetName: {
    fontSize: 28, fontWeight: '800', color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  sheetAgePill: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  sheetAgePillText: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  sheetMatchBadge: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: '#F97316', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20,
  },
  sheetMatchText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  sheetClose: {
    position: 'absolute', top: 12, left: 12,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetCloseText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  sheetBody: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  sheetBreed: { fontSize: 15, fontWeight: '600', color: '#888', marginBottom: 10 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#444' },
  sheetBio: { fontSize: 15, color: '#555', lineHeight: 22, marginBottom: 20 },

  sheetActions: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  saveBtn: {
    paddingHorizontal: 20, paddingVertical: 13, borderRadius: 18,
    borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: '#F9FAFB',
  },
  saveBtnActive: { borderColor: '#EC4899', backgroundColor: '#FFF0F5' },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#666' },
  saveBtnTextActive: { color: '#EC4899' },
  adoptBtn: { borderRadius: 18, paddingVertical: 13, alignItems: 'center' },
  adoptBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
