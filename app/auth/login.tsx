import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from '@/components/Toast';
import { supabase } from '@/lib/supabase';
import { useUserStore } from '@/store/userStore';

export default function Login() {
  const signIn = useUserStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  function navigateAfterAuth() {
    setToast(true);

    setTimeout(() => {
      const { role, ownerAnswers, shelterProfile } = useUserStore.getState();

      if (role === 'owner') {
        const hasAnswers = Object.keys(ownerAnswers).length >= 10;
        router.replace(hasAnswers ? '/owner/feed' : '/owner/questionnaire');
      } else if (role === 'shelter') {
        router.replace(
          shelterProfile?.name ? '/shelter/profile' : '/shelter/questionnaire'
        );
      } else {
        router.replace('/role-select');
      }
    }, 1400);
  }

  async function handleLogin() {
  if (!email || !password) {
    Alert.alert('Missing fields', 'Please enter your email and password.');
    return;
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  setLoading(false);

  if (error) {
    const message = error.message.toLowerCase();

    if (
      message.includes('email not confirmed') ||
      message.includes('email_not_confirmed') ||
      message.includes('not confirmed')
    ) {
      Alert.alert(
        'Verify your email',
        'Please verify your email before logging in. Check your inbox for the confirmation email, then try again.'
      );
      return;
    }

    Alert.alert('Login failed', error.message);
    return;
  }

  if (!data.session || !data.user) {
    Alert.alert(
      'Verify your email',
      'Please verify your email before logging in. Check your inbox for the confirmation email, then try again.'
    );
    return;
  }

  await signIn(
    data.user.id,
    data.user.email ?? email.trim(),
    data.user.user_metadata?.full_name
  );

  navigateAfterAuth();
}

  return (
    <SafeAreaView style={styles.safe}>
      <Toast message="Welcome back!" visible={toast} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to your account</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#bbb"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Your password"
              placeholderTextColor="#bbb"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#F97316', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
              >
                <Text style={styles.btnPrimaryText}>
                  {loading ? 'Signing in…' : 'Log In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => router.replace('/auth/signup')}
          >
            <Text style={styles.switchText}>
              Don&apos;t have an account?{' '}
              <Text style={styles.switchLink}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF8F0' },
  scroll: { paddingHorizontal: 28, paddingBottom: 40 },
  back: { paddingTop: 8, paddingBottom: 24 },
  backText: { color: '#F97316', fontSize: 16, fontWeight: '600' },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: { fontSize: 16, color: '#888', marginBottom: 32 },
  form: { gap: 12 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: -4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A2E',
  },
  btnPrimary: {
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 8,
  },
  btnPrimaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  switchRow: { alignItems: 'center', marginTop: 28 },
  switchText: { fontSize: 15, color: '#888' },
  switchLink: { color: '#F97316', fontWeight: '700' },
});