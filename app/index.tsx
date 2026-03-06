import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '@/store/userStore';

export default function RoleSelection() {
  const setRole = useUserStore((s) => s.setRole);

  function selectOwner() {
    setRole('owner');
    router.push('/owner/questionnaire');
  }

  function selectShelter() {
    setRole('shelter');
    router.push('/shelter/questionnaire');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.paw}>🐾</Text>
        <Text style={styles.title}>ShelterConnect</Text>
        <Text style={styles.subtitle}>
          Connecting loving homes{'\n'}with animals in need
        </Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity style={styles.card} onPress={selectOwner} activeOpacity={0.85}>
          <Text style={styles.cardEmoji}>🏠</Text>
          <Text style={styles.cardTitle}>I'm looking to adopt</Text>
          <Text style={styles.cardDesc}>
            Find your perfect pet match based on your lifestyle
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.cardShelter]}
          onPress={selectShelter}
          activeOpacity={0.85}
        >
          <Text style={styles.cardEmoji}>🏛️</Text>
          <Text style={styles.cardTitle}>I represent a shelter</Text>
          <Text style={styles.cardDesc}>
            Post animals and connect them with loving families
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Every pet deserves a forever home 💛</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    paddingHorizontal: 24,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  paw: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
  },
  cards: {
    flex: 1.2,
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#F0E6FF',
  },
  cardShelter: {
    borderColor: '#FFE4B5',
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: '#888',
    lineHeight: 22,
  },
  footer: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 14,
    paddingBottom: 24,
  },
});
