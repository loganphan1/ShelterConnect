import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type Props = {
  progress: number; // 0 to 1
  totalSteps: number;
  currentStep: number;
};

// Goal-gradient: perceived acceleration as progress approaches 1
function goalGradientEasing(t: number): number {
  // Standard t for most of progress, then accelerate in final 30%
  if (t < 0.7) return t;
  const tail = (t - 0.7) / 0.3;
  return 0.7 + tail * tail * 0.3;
}

export default function ProgressBar({ progress, currentStep, totalSteps }: Props) {
  const width = useSharedValue(0);

  useEffect(() => {
    const easedProgress = goalGradientEasing(progress);
    width.value = withSpring(easedProgress, {
      damping: 20,
      stiffness: 120,
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fillWrapper, animatedStyle]}>
          <LinearGradient
            colors={['#FB923C', '#EC4899', '#F97316']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
  },
  track: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fillWrapper: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
});
