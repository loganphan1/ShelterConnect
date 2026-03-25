import * as Google from 'expo-auth-session/providers/google';
import * as Crypto from 'expo-crypto';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
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

WebBrowser.maybeCompleteAuthSession();

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
        router.replace(shelterProfile?.name ? '/shelter/profile' : '/shelter/questionnaire');
      } else {
        // No role persisted yet — shouldn't happen on login, but fall back safely
        router.replace('/role-select');
      }
    }, 1400);
  }

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      if (token) handleGoogleAuth(token);
    } else if (response?.type === 'error') {
      Alert.alert('Google sign-in failed', response.error?.message ?? 'Unknown error');
    }
  }, [response]);

  async function handleGoogleAuth(accessToken: string) {
    try {
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const googleUser = await res.json();
      // Use a deterministic password derived from the stable Google sub ID
      const password = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        `google:${googleUser.id}`
      );
      let { data, error } = await supabase.auth.signInWithPassword({ email: googleUser.email, password });
      if (error?.message?.toLowerCase().includes('invalid login credentials')) {
        ({ data, error } = await supabase.auth.signUp({
          email: googleUser.email,
          password,
          options: { data: { full_name: googleUser.name, avatar_url: googleUser.picture } },
        }));
      }
      if (error?.message?.toLowerCase().includes('already registered')) {
        Alert.alert('Account conflict', 'This Google account was registered with different credentials. Please contact support or delete the account and try again.');
        return;
      }
      if (error || !data.user) {
        Alert.alert('Sign-in failed', error?.message ?? 'Could not authenticate with Google.');
        return;
      }
      await signIn(data.user.id, googleUser.email, googleUser.name, googleUser.picture);
      navigateAfterAuth();
    } catch {
      Alert.alert('Error', 'Could not complete Google sign-in.');
    }
  }

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error || !data.user) {
      Alert.alert('Login failed', error?.message ?? 'Incorrect email or password.');
      return;
    }
    await signIn(data.user.id, data.user.email ?? email, data.user.user_metadata?.full_name);
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

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.btnGoogle, !request && { opacity: 0.5 }]}
              activeOpacity={0.88}
              disabled={!request}
              onPress={() => promptAsync()}
            >
              <Text style={styles.googleIcon}>G</Text>
              <Text style={styles.btnGoogleText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => router.replace('/auth/signup')}
          >
            <Text style={styles.switchText}>
              Don't have an account?{' '}
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
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 12, color: '#bbb', fontSize: 14 },
  btnGoogle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    gap: 10,
  },
  googleIcon: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
  btnGoogleText: { fontSize: 16, fontWeight: '600', color: '#1A1A2E' },
  switchRow: { alignItems: 'center', marginTop: 28 },
  switchText: { fontSize: 15, color: '#888' },
  switchLink: { color: '#F97316', fontWeight: '700' },
});
