import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useAuthStore, useReviewStore, useFocusStore } from '../store';

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const { stats: reviewStats } = useReviewStore();
  const { stats: focusStats } = useFocusStore();

  const handleLogout = () => {
    Alert.alert('退出登录', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      { text: '确定', style: 'destructive', onPress: logout },
    ]);
  };

  const menuItems = [
    {
      title: '数据统计',
      items: [
        { label: '复习统计', value: `${reviewStats?.totalReviews || 0} 次` },
        { label: '专注时长', value: `${focusStats?.totalDuration || 0} 分钟` },
        { label: '连续学习', value: `${focusStats?.streakDays || 0} 天` },
      ],
    },
    {
      title: '功能设置',
      items: [
        { label: '专注时长', value: '25 分钟', onPress: () => {} },
        { label: '每日目标', value: '5 个知识点', onPress: () => {} },
        { label: '通知提醒', value: '已开启', onPress: () => {} },
      ],
    },
    {
      title: '其他',
      items: [
        { label: '关于内化', value: '', onPress: () => {} },
        { label: '意见反馈', value: '', onPress: () => {} },
        { label: '隐私政策', value: '', onPress: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 用户信息 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0) || '学'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || '学习者'}</Text>
            <Text style={styles.userEmail}>{user?.email || ''}</Text>
            {user?.isPro && (
              <View style={styles.proBadge}>
                <Text style={styles.proText}>Pro</Text>
              </View>
            )}
          </View>
        </View>

        {/* 成就统计 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviewStats?.knowledgeMastered || 0}</Text>
            <Text style={styles.statLabel}>已掌握</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reviewStats?.knowledgeLearning || 0}</Text>
            <Text style={styles.statLabel}>学习中</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{focusStats?.longestStreak || 0}</Text>
            <Text style={styles.statLabel}>最长连续</Text>
          </View>
        </View>

        {/* 菜单列表 */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={item.onPress}
                >
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <View style={styles.menuRight}>
                    {item.value && (
                      <Text style={styles.menuValue}>{item.value}</Text>
                    )}
                    <Text style={styles.menuArrow}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* 升级提示 */}
        {!user?.isPro && (
          <TouchableOpacity style={styles.upgradeCard}>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeEmoji}>✨</Text>
              <View style={styles.upgradeText}>
                <Text style={styles.upgradeTitle}>升级 Pro 版本</Text>
                <Text style={styles.upgradeSubtitle}>
                  解锁无限知识点、AI 对话、思维导图等高级功能
                </Text>
              </View>
            </View>
            <Text style={styles.upgradePrice}>¥12/月</Text>
          </TouchableOpacity>
        )}

        {/* 退出登录 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>

        {/* 版本信息 */}
        <Text style={styles.version}>版本 1.0.0</Text>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userInfo: {
    marginLeft: SPACING.lg,
    flex: 1,
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  proBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  proText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  menuSection: {
    marginBottom: SPACING.lg,
  },
  menuSectionTitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    marginRight: SPACING.sm,
  },
  menuArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  upgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  upgradeEmoji: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  upgradeSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  upgradePrice: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  logoutButton: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoutText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.error,
  },
  version: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});

export default ProfileScreen;
