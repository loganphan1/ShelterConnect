import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmojiButton from '@/components/EmojiButton';
import ProgressBar from '@/components/ProgressBar';
import { OWNER_QUESTIONS } from '@/data/ownerQuestions';
import { fetchPetsForOwner } from '@/services/petService';
import { useFeedStore } from '@/store/feedStore';
import { useUserStore } from '@/store/userStore';

const { width } = Dimensions.get('window');

export default function OwnerQuestionnaire() {
  const { ownerAnswers, setOwnerAnswer } = useUserStore();
  const setFeedItems = useFeedStore((s) => s.setFeedItems);

  // Initialize defaults
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    OWNER_QUESTIONS.forEach((q) => {
      defaults[q.id] = q.options[q.defaultIndex].value;
    });
    return defaults;
  });
  const [animKey, setAnimKey] = useState(0);

  const question = OWNER_QUESTIONS[currentIndex];
  const progress = (currentIndex + 1) / OWNER_QUESTIONS.length;
  const isLast = currentIndex === OWNER_QUESTIONS.length - 1;

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

async function goNext() {
  try {
    await setOwnerAnswer(question.id, answers[question.id]);

    if (isLast) {
      const allAnswers = { ...ownerAnswers, [question.id]: answers[question.id] };
      const matched = await fetchPetsForOwner(allAnswers);
      setFeedItems(matched);
      router.replace('/owner/feed');
      return;
    }

    setAnimKey((k) => k + 1);
    setCurrentIndex((i) => i + 1);
  } catch (error) {
    Alert.alert(
      'Login required',
      'Please verify your email and log in before completing the questionnaire.'
    );

    router.replace('/auth/login');
  }
}

  function goBack() {
    if (currentIndex === 0) {
      router.back();
      return;
    }
    setAnimKey((k) => k + 1);
    setCurrentIndex((i) => i - 1);
  }

  const selectedValue = answers[question.id];

  // Group options into rows of 2
  const rows: (typeof question.options)[] = [];
  for (let i = 0; i < question.options.length; i += 2) {
    rows.push(question.options.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>
          {currentIndex + 1} / {OWNER_QUESTIONS.length}
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        currentStep={currentIndex + 1}
        totalSteps={OWNER_QUESTIONS.length}
      />

      {/* Question */}
      <Animated.View
        key={animKey}
        entering={FadeInRight.duration(280).springify()}
        exiting={FadeOutLeft.duration(200)}
        style={styles.questionContainer}
      >
        <Text style={styles.questionTitle}>{question.title}</Text>
        <Text style={styles.questionSubtitle}>{question.subtitle}</Text>

        {/* Answer buttons */}
        <View style={styles.optionsContainer}>
          {rows.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.row}>
              {row.map((option) => (
                <EmojiButton
                  key={option.value}
                  emoji={option.emoji}
                  label={option.label}
                  selected={selectedValue === option.value}
                  onPress={() => selectAnswer(option.value)}
                />
              ))}
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Next button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={goNext} activeOpacity={0.85}>
          <Text style={styles.nextButtonText}>
            {isLast ? 'Find my matches 🐾' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 20,
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
  stepText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '600',
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
    backgroundColor: '#F97316',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
