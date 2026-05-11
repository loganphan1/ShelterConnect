import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
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
import { useFeedStore } from '@/store/feedStore';
import { useUserStore } from '@/store/userStore';
import type { Pet } from '@/data/mockPets';

type PetType = 'dog' | 'cat';
type PetSize = 'small' | 'medium' | 'large';
type PetAge = 'young' | 'adult' | 'senior';

export default function ShelterPost() {
  const params = useLocalSearchParams<{ petId?: string | string[] }>();

  const petId = Array.isArray(params.petId)
    ? params.petId[0]
    : params.petId;
  const addPost = useFeedStore((s) => s.addPost);
  const editPost = useFeedStore((s) => s.editPost);
  const deletePost = useFeedStore((s) => s.deletePost);
  const feedItems = useFeedStore((s) => s.feedItems);
  const shelterProfile = useUserStore((s) => s.shelterProfile);

  const existingPet = petId ? feedItems.find((p) => p.id === petId) : null;
  const isEditing = !!existingPet;

  const [mediaUri, setMediaUri] = useState<string | null>(existingPet?.media[0]?.uri ?? null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>(existingPet?.media[0]?.type ?? 'image');
  const [name, setName] = useState(existingPet?.name ?? '');
  const [breed, setBreed] = useState(existingPet?.breed ?? '');
  const [ageDisplay, setAgeDisplay] = useState(existingPet?.ageDisplay ?? '');
  const [bio, setBio] = useState(existingPet?.bio ?? '');
  const [petType, setPetType] = useState<PetType>(existingPet?.type ?? 'dog');
  const [petSize, setPetSize] = useState<PetSize>(existingPet?.size ?? 'medium');
  const [petAge, setPetAge] = useState<PetAge>(existingPet?.age ?? 'adult');

  async function pickMedia(type: 'photo' | 'video') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'photo' ? ['images'] : ['videos'],
      allowsEditing: true,
      quality: 0.85,
      aspect: [4, 5],
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setMediaType(type === 'video' ? 'video' : 'image');
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access in Settings.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
      aspect: [4, 5],
    });

    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri);
      setMediaType('image');
    }
  }

  function submit() {
  if (!mediaUri) {
    Alert.alert('Photo required', 'Please add at least one photo or video for this animal.');
    return;
  }

  const trimmedName = name.trim();

  const pet: Pet = {
    id: existingPet?.id ?? `user_${Date.now()}`,
    name: trimmedName || 'Unnamed Pet',
    breed: breed.trim() || 'Mixed breed',
    type: petType,
    size: petSize,
    age: petAge,
    ageDisplay: ageDisplay.trim() || 'Unknown age',
    energyLevel: existingPet?.energyLevel ?? 'medium',
    goodWithKids: existingPet?.goodWithKids ?? true,
    goodWithPets: existingPet?.goodWithPets ?? true,
    hypoallergenic: existingPet?.hypoallergenic ?? false,
    needsYard: existingPet?.needsYard ?? false,
    media: [{ type: mediaType, uri: mediaUri }],
    bio:
      bio.trim() ||
      `Meet ${trimmedName || 'this pet'}! Looking for a loving forever home.`,
    shelterId: existingPet?.shelterId ?? 'user_shelter',
    distanceMiles: existingPet?.distanceMiles ?? 0,
  };

  if (isEditing) {
    editPost(pet);
  } else {
    addPost(pet);
  }

  router.replace({
    pathname: '/shelter/profile',
    params: { fromOnboarding: '1' },
  });
}

  function confirmDelete() {
  if (!petId) {
    Alert.alert('Error', 'Could not find this animal listing.');
    return;
  }

  const removePet = () => {
    console.log('Deleting pet with id:', petId);

    deletePost(petId);

    router.replace({
      pathname: '/shelter/profile',
      params: { fromOnboarding: '1' },
    });
  };

  if (Platform.OS === 'web') {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${
        existingPet?.name ?? 'this animal'
      }? This animal will no longer appear as available.`
    );

    if (confirmed) {
      removePet();
    }

    return;
  }

  Alert.alert(
    'Remove listing',
    `Are you sure you want to remove ${
      existingPet?.name ?? 'this animal'
    }? This animal will no longer appear as available.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: removePet,
      },
    ]
  );
}

  const canSubmit = mediaUri !== null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#FFF3E8', '#FFF8F2']} style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{isEditing ? 'Edit Listing' : 'Post an Animal'}</Text>
            <Text style={styles.headerSub}>{isEditing ? 'Update your listing' : 'Share an animal looking for a home'}</Text>
          </View>
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={canSubmit ? submit : undefined}
          >
            <Text style={styles.submitBtnText}>{isEditing ? 'Save' : 'Post'}</Text>
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Media picker */}
          <View style={styles.mediaPicker}>
            {mediaUri ? (
              <View style={styles.mediaPreview}>
                <Image source={{ uri: mediaUri }} style={styles.previewImage} resizeMode="cover" />
                <TouchableOpacity
                  style={styles.changeMediaBtn}
                  onPress={() => setMediaUri(null)}
                >
                  <Text style={styles.changeMediaText}>Change photo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.mediaButtons}>
                <TouchableOpacity style={styles.mediaBtn} onPress={() => pickMedia('photo')}>
                  <Text style={styles.mediaBtnEmoji}>🖼️</Text>
                  <Text style={styles.mediaBtnLabel}>Photo library</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaBtn} onPress={takePhoto}>
                  <Text style={styles.mediaBtnEmoji}>📷</Text>
                  <Text style={styles.mediaBtnLabel}>Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaBtn} onPress={() => pickMedia('video')}>
                  <Text style={styles.mediaBtnEmoji}>🎥</Text>
                  <Text style={styles.mediaBtnLabel}>Video</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Field label="Pet name *" placeholder="e.g. Buddy">
              <TextInput
                style={styles.input}
                placeholder="e.g. Buddy"
                placeholderTextColor="#bbb"
                value={name}
                onChangeText={setName}
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
              />
            </Field>

            <Field label="Breed" placeholder="">
              <TextInput
                style={styles.input}
                placeholder="e.g. Golden Retriever Mix"
                placeholderTextColor="#bbb"
                value={breed}
                onChangeText={setBreed}
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
              />
            </Field>

            <Field label="Age" placeholder="">
              <TextInput
                style={styles.input}
                placeholder="e.g. 2 years"
                placeholderTextColor="#bbb"
                value={ageDisplay}
                onChangeText={setAgeDisplay}
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
              />
            </Field>

            {/* Type toggle */}
            <Text style={styles.fieldLabel}>Type</Text>
            <View style={styles.toggleRow}>
              {(['dog', 'cat'] as PetType[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.toggleBtn, petType === t && styles.toggleSelected]}
                  onPress={() => setPetType(t)}
                >
                  <Text style={styles.toggleText}>
                    {t === 'dog' ? '🐕 Dog' : '🐈 Cat'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Size toggle */}
            <Text style={styles.fieldLabel}>Size</Text>
            <View style={styles.toggleRow}>
              {(['small', 'medium', 'large'] as PetSize[]).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.toggleBtn, petSize === s && styles.toggleSelected]}
                  onPress={() => setPetSize(s)}
                >
                  <Text style={styles.toggleText}>
                    {s === 'small' ? '🐩 Small' : s === 'medium' ? '🐕 Medium' : '🦮 Large'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Age category */}
            <Text style={styles.fieldLabel}>Life stage</Text>
            <View style={styles.toggleRow}>
              {(['young', 'adult', 'senior'] as PetAge[]).map((a) => (
                <TouchableOpacity
                  key={a}
                  style={[styles.toggleBtn, petAge === a && styles.toggleSelected]}
                  onPress={() => setPetAge(a)}
                >
                  <Text style={styles.toggleText}>
                    {a === 'young' ? '🐣 Young' : a === 'adult' ? '🐾 Adult' : '🧓 Senior'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Field label="Bio" placeholder="">
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Tell adopters about this animal's personality..."
                placeholderTextColor="#bbb"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                textContentType="none"
                autoComplete="off"
                autoCorrect={false}
              />
            </Field>
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.deleteBtn} onPress={confirmDelete}>
              <Text style={styles.deleteBtnText}>🗑 Remove listing</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  placeholder,
  children,
}: {
  label: string;
  placeholder: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
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
    borderBottomWidth: 1,
    borderBottomColor: '#FFE4CC',
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE4CC',
    borderRadius: 19,
  },
  backIcon: {
    fontSize: 18,
    color: '#F97316',
    fontWeight: '700',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  headerSub: {
    fontSize: 11,
    color: '#F97316',
    fontWeight: '600',
    marginTop: 1,
  },
  submitBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  mediaPicker: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  mediaButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  mediaBtn: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFD4B0',
    borderStyle: 'dashed',
  },
  mediaBtnEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  mediaBtnLabel: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '700',
    textAlign: 'center',
  },
  mediaPreview: {
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 280,
  },
  changeMediaBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  changeMediaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  form: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 2,
    gap: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#FFFAF7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1A1A2E',
    borderWidth: 1.5,
    borderColor: '#FFE4CC',
  },
  bioInput: {
    height: 100,
    paddingTop: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFE4CC',
  },
  toggleSelected: {
    borderColor: '#F97316',
    backgroundColor: '#FFF3E8',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  deleteBtn: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
