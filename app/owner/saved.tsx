import { router } from 'expo-router';
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
import { useFeedStore } from '@/store/feedStore';
import { useUserStore } from '@/store/userStore';
import { MOCK_SHELTERS } from '@/data/mockPets';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function SavedPets() {
  const savedPetIds = useUserStore((s) => s.savedPetIds);
  const toggleSave = useUserStore((s) => s.toggleSave);
  const feedItems = useFeedStore((s) => s.feedItems);

  const savedPets = feedItems.filter((p) => savedPetIds.includes(p.id));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Animals</Text>
        <View style={{ width: 40 }} />
      </View>

      {savedPets.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>No saved animals yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart on any animal in your feed to save them here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          {savedPets.map((pet) => {
            const shelter = MOCK_SHELTERS.find((s) => s.id === pet.shelterId);
            return (
              <TouchableOpacity
                key={pet.id}
                style={styles.card}
                onPress={() => router.push({ pathname: '/shelter/profile', params: { shelterId: pet.shelterId } })}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: pet.media[0].uri }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.unsaveBtn}
                  onPress={() => toggleSave(pet.id)}
                  hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <Text style={styles.unsaveBtnText}>❤️</Text>
                </TouchableOpacity>
                <View style={styles.cardInfo}>
                  <Text style={styles.petName} numberOfLines={1}>{pet.name}</Text>
                  <Text style={styles.petBreed} numberOfLines={1}>{pet.breed}</Text>
                  {shelter && (
                    <Text style={styles.shelterName} numberOfLines={1}>🏠 {shelter.name}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F0E6FF',
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
  },
  unsaveBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unsaveBtnText: {
    fontSize: 16,
  },
  cardInfo: {
    padding: 12,
    gap: 2,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  petBreed: {
    fontSize: 13,
    color: '#666',
  },
  shelterName: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
