import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PetCard from '@/components/PetCard';
import { useFeedStore } from '@/store/feedStore';
import type { Pet } from '@/data/mockPets';

const { height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.78;

export default function OwnerFeed() {
  const feedItems = useFeedStore((s) => s.feedItems);
  const [visibleId, setVisibleId] = useState<string | null>(
    feedItems[0]?.id ?? null
  );

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setVisibleId(viewableItems[0].item?.id ?? null);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  });

  function renderItem({ item }: { item: Pet }) {
    return <PetCard pet={item} isVisible={visibleId === item.id} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🐾 Your Matches</Text>
        <View style={{ width: 40 }} />
      </SafeAreaView>

      <FlashList
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={CARD_HEIGHT}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        decelerationRate="fast"
        snapToInterval={CARD_HEIGHT}
        snapToAlignment="start"
      />

      {/* Bottom hint */}
      <SafeAreaView edges={['bottom']} style={styles.bottomHint}>
        <Text style={styles.hintText}>Swipe up to see more matches</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  bottomHint: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 8,
  },
  hintText: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 12,
  },
});
