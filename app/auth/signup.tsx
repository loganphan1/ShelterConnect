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

export default function SignUp() {
  const signIn = useUserStore((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  function navigateAfterAuth() {
    setToast(true);
    setTimeout(() => router.replace('/role-select'), 1400);
  }

  async function handleSignUp() {
  if (!email || !password || !confirm) {
    Alert.alert('Missing fields', 'Please fill in all fields.');
    return;
  }

  if (password !== confirm) {
    Alert.alert('Password mismatch', 'Passwords do not match.');
    return;
  }

  setLoading(true);

  console.log('Trying signup with:', email.trim());

const { data, error } = await supabase.auth.signUp({
  email: email.trim(),
  password,
});

console.log('Signup data:', data);
console.log('Signup error:', error);
  // const { data, error } = await supabase.auth.signUp({
  //   email: email.trim(),
  //   password,
  // });

  setLoading(false);

  if (error) {
    Alert.alert('Sign-up failed', error.message);
    return;
  }

  if (!data.session) {
    Alert.alert(
      'Verify your email',
      'Your account was created, but you need to verify your email before logging in. Please check your inbox, then log in.'
    );

    router.replace('/auth/login');
    return;
  }

  if (!data.user) {
    Alert.alert('Sign-up failed', 'Could not create account.');
    return;
  }

  await signIn(data.user.id, data.user.email ?? email.trim());
  navigateAfterAuth();
}

  return (
    <SafeAreaView style={styles.safe}>
      <Toast message="Account created successfully!" visible={toast} />

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

          <Text style={styles.heading}>Create Account</Text>
          <Text style={styles.subheading}>Join ShelterConnect today</Text>

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
              placeholder="Min. 8 characters"
              placeholderTextColor="#bbb"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat your password"
              placeholderTextColor="#bbb"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
            />

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleSignUp}
              disabled={loading}
            >
              <LinearGradient
                colors={['#F97316', '#EC4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
              >
                <Text style={styles.btnPrimaryText}>
                  {loading ? 'Creating account…' : 'Sign Up'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => router.replace('/auth/login')}
          >
            <Text style={styles.switchText}>
              Already have an account?{' '}
              <Text style={styles.switchLink}>Log in</Text>
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