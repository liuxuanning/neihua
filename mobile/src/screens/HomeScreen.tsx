import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useAuthStore, useReviewStore, useFocusStore } from '../store';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { todayReviews, fetchTodayReviews } = useReviewStore();
  const { stats: focusStats, fetchStats: fetchFocusStats } = useFocusStore();

  useEffect(() => {
    fetchTodayReviews();
    fetchFocusStats();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 头部问候 */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting()}，</Text>
          <Text style={styles.userName}>{user?.name || '学习者'}</Text>
        </View>

        {/* 今日概览卡片 */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>今日概览</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todayReviews.length}</Text>
              <Text style={styles.statLabel}>待复习</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{focusStats?.todayDuration || 0}</Text>
              <Text style={styles.statLabel}>专注(分钟)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{focusStats?.streakDays || 0}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
          </View>
        </View>

        {/* 快捷操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('AddKnowledge' as never)}
            >
              <Text style={styles.actionIcon}>✍️</Text>
              <Text style={styles.actionText}>记录知识</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('专注' as never)}
            >
              <Text style={styles.actionIcon}>🎯</Text>
              <Text style={styles.actionText}>开始专注</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('复习' as never)}
            >
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionText}>复习记忆</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 今日待复习 */}
        {todayReviews.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>今日待复习</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>查看全部</Text>
              </TouchableOpacity>
            </View>
            {todayReviews.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.reviewItem}
                onPress={() =>
                  navigation.navigate('KnowledgeDetail' as never, {
                    id: item.id,
                  } as never)
                }
              >
                <View style={styles.reviewContent}>
                  <Text style={styles.reviewTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.reviewMeta}>
                    复习 {item.reviewCount + 1} 次
                  </Text>
                </View>
                <Text style={styles.reviewArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 学习建议 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学习建议</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>间隔复习更高效</Text>
              <Text style={styles.tipText}>
                根据艾宾浩斯遗忘曲线，今天有 {todayReviews.length}{' '}
                个知识点需要复习，及时巩固记忆效果更佳！
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  header: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textSecondary,
  },
  userName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  overviewCard: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    marginBottom: SPACING.md,
    opacity: 0.9,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: SPACING.xs,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  reviewContent: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  reviewMeta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  reviewArrow: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.textMuted,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default HomeScreen;
