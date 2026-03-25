import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PetCard from '@/components/PetCard';
import { useFeedStore } from '@/store/feedStore';
import { useUserStore } from '@/store/userStore';
import type { Pet } from '@/data/mockPets';

const { height } = Dimensions.get('window');
const CARD_HEIGHT = height;

type SortMode = 'score' | 'distance';
type TypeFilter = 'all' | 'dog' | 'cat';

export default function OwnerFeed() {
  const feedItems = useFeedStore((s) => s.feedItems);
  const savedPetIds = useUserStore((s) => s.savedPetIds);
  const insets = useSafeAreaInsets();

  const [sortMode, setSortMode] = useState<SortMode>('score');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [visibleId, setVisibleId] = useState<string | null>(
    feedItems[0]?.id ?? null
  );

  const displayItems = useMemo(() => {
    let items = typeFilter === 'all' ? feedItems : feedItems.filter((p) => p.type === typeFilter);
    if (sortMode === 'score') {
      items = [...items].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    } else {
      items = [...items].sort((a, b) => a.distanceMiles - b.distanceMiles);
    }
    return items;
  }, [feedItems, sortMode, typeFilter]);

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

  const HEADER_HEIGHT = insets.top + 56;
  const hasActiveFilters = typeFilter !== 'all' || sortMode !== 'score';

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🐾 Your Matches</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.filterToggleBtn, hasActiveFilters && styles.filterToggleBtnActive]}
            onPress={() => setFiltersOpen((o) => !o)}
            activeOpacity={0.75}
          >
            <Text style={[styles.filterToggleText, hasActiveFilters && styles.filterToggleTextActive]}>
              {filtersOpen ? '✕' : '⊞'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/owner/saved')} style={styles.savedBtn}>
            <Text style={styles.savedBtnText}>❤️</Text>
            {savedPetIds.length > 0 && (
              <View style={styles.savedBadge}>
                <Text style={styles.savedBadgeText}>{savedPetIds.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Collapsible sort / filter bar */}
      {filtersOpen && (
        <View style={[styles.filterBar, { top: HEADER_HEIGHT }]}>
          <View style={styles.pillGroup}>
            {(['all', 'dog', 'cat'] as TypeFilter[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.pill, typeFilter === type && styles.pillActive]}
                onPress={() => setTypeFilter(type)}
                activeOpacity={0.75}
              >
                <Text style={[styles.pillText, typeFilter === type && styles.pillTextActive]}>
                  {type === 'all' ? 'All' : type === 'dog' ? 'Dogs' : 'Cats'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.pillGroup}>
            <TouchableOpacity
              style={[styles.pill, sortMode === 'score' && styles.pillActive]}
              onPress={() => setSortMode('score')}
              activeOpacity={0.75}
            >
              <Text style={[styles.pillText, sortMode === 'score' && styles.pillTextActive]}>
                Best Match
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.pill, sortMode === 'distance' && styles.pillActive]}
              onPress={() => setSortMode('distance')}
              activeOpacity={0.75}
            >
              <Text style={[styles.pillText, sortMode === 'distance' && styles.pillTextActive]}>
                Nearest
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlashList
        data={displayItems}
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
    zIndex: 20,
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
  headerRight: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  filterToggleBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  filterToggleBtnActive: {
    backgroundColor: '#F97316',
  },
  filterToggleText: {
    color: '#fff',
    fontSize: 18,
  },
  filterToggleTextActive: {
    color: '#fff',
  },
  savedBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  savedBtnText: {
    fontSize: 20,
  },
  savedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EC4899',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  savedBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  filterBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    gap: 8,
  },
  pillGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pillActive: {
    backgroundColor: '#F97316',
    borderColor: '#F97316',
  },
  pillText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
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
