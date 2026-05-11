import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmojiButton from '@/components/EmojiButton';
import ProgressBar from '@/components/ProgressBar';
import { SHELTER_QUESTIONS } from '@/data/shelterQuestions';
import { useUserStore } from '@/store/userStore';

export default function ShelterQuestionnaire() {
  const setShelterProfile = useUserStore((s) => s.setShelterProfile);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    SHELTER_QUESTIONS.forEach((q) => {
      if (q.type === 'choice') {
        defaults[q.id] = q.options[q.defaultIndex].value;
      }
    });
    return defaults;
  });
  const [animKey, setAnimKey] = useState(0);

  const question = SHELTER_QUESTIONS[currentIndex];
  const progress = (currentIndex + 1) / SHELTER_QUESTIONS.length;
  const isLast = currentIndex === SHELTER_QUESTIONS.length - 1;

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function goNext() {
    const value =
      (answers[question.id] || '').trim() ||
      (question.type === 'text' || question.type === 'phone' ? question.defaultValue : '');
    setShelterProfile({ [question.id]: value } as any);

    if (isLast) {
      router.replace({ pathname: '/shelter/profile', params: { fromOnboarding: '1' } });
      return;
    }

    setAnimKey((k) => k + 1);
    setCurrentIndex((i) => i + 1);
  }

function goBack() {
  if (currentIndex === 0) {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
    return;
  }

  setAnimKey((k) => k + 1);
  setCurrentIndex((i) => i - 1);
}


  const canProceed = true;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#FFF3E8', '#FFF8F2']} style={styles.topBar}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>🏛️ Shelter Setup</Text>
            <Text style={styles.stepText}>{currentIndex + 1} of {SHELTER_QUESTIONS.length}</Text>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{Math.round(((currentIndex + 1) / SHELTER_QUESTIONS.length) * 100)}%</Text>
          </View>
        </LinearGradient>

        <ProgressBar
          progress={progress}
          currentStep={currentIndex + 1}
          totalSteps={SHELTER_QUESTIONS.length}
        />

        <Animated.View
          key={animKey}
          entering={FadeInRight.duration(280).springify()}
          exiting={FadeOutLeft.duration(200)}
          style={styles.questionContainer}
        >
          <Text style={styles.questionTitle}>{question.title}</Text>
          <Text style={styles.questionSubtitle}>{question.subtitle}</Text>

          {(question.type === 'text' || question.type === 'phone') && (
            <TextInput
              key={question.id}
              style={styles.textInput}
              placeholder={question.placeholder}
              placeholderTextColor="#bbb"
              defaultValue={answers[question.id] ?? ''}
              onChangeText={(t) => setAnswers((prev) => ({ ...prev, [question.id]: t }))}
              keyboardType="default"
              autoFocus
              autoComplete="off"
              autoCorrect={false}
              spellCheck={false}
              textContentType="none"
              importantForAutofill="no"
              returnKeyType="next"
              onSubmitEditing={goNext}
            />
          )}

          {question.type === 'choice' && (
            <View style={styles.optionsContainer}>
              {(() => {
                const rows: (typeof question.options)[] = [];
                for (let i = 0; i < question.options.length; i += 2) {
                  rows.push(question.options.slice(i, i + 2));
                }
                return rows.map((row, rowIdx) => (
                  <View key={rowIdx} style={styles.row}>
                    {row.map((option) => (
                      <EmojiButton
                        key={option.value}
                        emoji={option.emoji}
                        label={option.label}
                        selected={answers[question.id] === option.value}
                        onPress={() => selectAnswer(option.value)}
                      />
                    ))}
                  </View>
                ));
              })()}
            </View>
          )}
        </Animated.View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
            <LinearGradient
              colors={['#F97316', '#EC4899']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextButton}
            >
              <Text style={styles.nextButtonText}>
                {isLast ? 'Create profile 🏛️' : 'Next →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  headerLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  stepText: {
    fontSize: 12,
    color: '#F97316',
    fontWeight: '600',
    marginTop: 1,
  },
  stepBadge: {
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  stepBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  questionTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A2E',
    lineHeight: 38,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  textInput: {
    marginHorizontal: 8,
    backgroundColor: '#FFFAF7',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    color: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#FFE4CC',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  optionsContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  nextButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
