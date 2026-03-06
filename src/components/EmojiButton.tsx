import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  emoji: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function EmojiButton({ emoji, label, selected, onPress }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    scale.value = withSpring(0.93, { damping: 8, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 8, stiffness: 200 });
    });
    onPress();
  }

  return (
    <AnimatedTouchable
      style={[styles.button, selected && styles.selected, animatedStyle]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    margin: 6,
    minHeight: 110,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F5F0FF',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  emoji: {
    fontSize: 44,
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
  labelSelected: {
    color: '#7C3AED',
  },
});
