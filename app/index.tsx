import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Landing() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.paw}>🐾</Text>
        <Text style={styles.title}>ShelterConnect</Text>
        <Text style={styles.subtitle}>
          Connecting loving homes{'\n'}with animals in need
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/auth/signup')}
        >
          <LinearGradient
            colors={['#F97316', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>Sign Up</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          activeOpacity={0.88}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.btnOutlineText}>Log In</Text>
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
    paddingHorizontal: 28,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paw: {
    fontSize: 72,
    marginBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    lineHeight: 28,
  },
  actions: {
    paddingBottom: 16,
    gap: 14,
  },
  btnPrimary: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  btnOutline: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F97316',
  },
  btnOutlineText: {
    color: '#F97316',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  footer: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 14,
    paddingBottom: 20,
    paddingTop: 8,
  },
});
