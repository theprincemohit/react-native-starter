import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  type FlatListProps,
  type ViewStyle,
} from 'react-native';

import { darkPalette, lightPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EmptyState, type EmptyStateProps } from './empty-state';
import { SkeletonCard } from './skeleton';

export interface ReusableListProps<T>
  extends Omit<FlatListProps<T>, 'renderItem' | 'data'> {
  data: T[] | null | undefined;
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactElement | null;
  keyExtractor?: (item: T, index: number) => string;

  // Loading states
  isLoading?: boolean;
  skeletonCount?: number;
  renderSkeletonItem?: (index: number) => React.ReactElement;

  // Refreshing
  isRefreshing?: boolean;
  onRefresh?: () => void;

  // Pagination / Load more
  onEndReached?: () => void;
  isLoadingMore?: boolean;

  // Empty state configuration
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: string | React.ReactNode;
  emptyActionTitle?: string;
  onEmptyActionPress?: () => void;
  renderEmptyState?: () => React.ReactElement;

  // Dividers & Spacing
  itemSpacing?: number;
  showSeparators?: boolean;
  contentContainerStyle?: ViewStyle;
}

export function ReusableList<T>({
  data,
  renderItem,
  keyExtractor,
  isLoading = false,
  skeletonCount = 3,
  renderSkeletonItem,
  isRefreshing = false,
  onRefresh,
  onEndReached,
  isLoadingMore = false,
  emptyTitle = 'No Items Available',
  emptyDescription = 'There is currently no data to display.',
  emptyIcon = '📭',
  emptyActionTitle,
  onEmptyActionPress,
  renderEmptyState,
  itemSpacing = 10,
  showSeparators = false,
  contentContainerStyle,
  ...flatListProps
}: ReusableListProps<T>) {
  const colorScheme = useColorScheme();
  const palette = colorScheme === 'dark' ? darkPalette : lightPalette;

  // 1. Initial Loading State (Shimmer Skeleton items)
  if (isLoading && (!data || data.length === 0)) {
    return (
      <View style={[styles.skeletonContainer, contentContainerStyle]}>
        {Array.from({ length: skeletonCount }).map((_, idx) => (
          <View key={`skeleton-${idx}`} style={{ marginBottom: itemSpacing }}>
            {renderSkeletonItem ? renderSkeletonItem(idx) : <SkeletonCard />}
          </View>
        ))}
      </View>
    );
  }

  // 2. Empty State
  const renderEmpty = () => {
    if (renderEmptyState) {
      return renderEmptyState();
    }
    return (
      <EmptyState
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
        actionTitle={emptyActionTitle}
        onActionPress={onEmptyActionPress}
        style={styles.emptyContainer}
      />
    );
  };

  // 3. Separator
  const renderSeparator = () => {
    if (!showSeparators && itemSpacing > 0) {
      return <View style={{ height: itemSpacing }} />;
    }
    if (showSeparators) {
      return (
        <View
          style={[
            styles.separator,
            {
              backgroundColor: palette.border.subtle,
              marginVertical: itemSpacing / 2,
            },
          ]}
        />
      );
    }
    return null;
  };

  // 4. Footer loader (infinite scrolling)
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={palette.primary.main} />
      </View>
    );
  };

  return (
    <FlatList
      data={data ?? []}
      renderItem={renderItem}
      keyExtractor={
        keyExtractor ??
        ((item: any, index: number) =>
          item?.id?.toString() ?? item?.key?.toString() ?? index.toString())
      }
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={palette.primary.main}
            colors={[palette.primary.main]}
          />
        ) : undefined
      }
      contentContainerStyle={[
        data && data.length > 0 ? styles.listContent : styles.emptyListContent,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
      {...flatListProps}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  emptyContainer: {
    paddingVertical: 40,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReusableList;
