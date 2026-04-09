import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useReviewStore } from '../store';
import { Knowledge } from '../types';

const ReviewScreen = () => {
  const {
    todayReviews,
    stats,
    fetchTodayReviews,
    fetchStats,
    submitReview,
    currentReviewIndex,
    nextReview,
  } = useReviewStore();

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);

  useEffect(() => {
    fetchTodayReviews();
    fetchStats();
  }, []);

  const currentReview = todayReviews[currentReviewIndex];

  const handleScoreSelect = async (score: number) => {
    setSelectedScore(score);
  };

  const handleNext = async () => {
    if (currentReview && selectedScore !== null) {
      await submitReview(currentReview.id, selectedScore);
      setShowAnswer(false);
      setSelectedScore(null);
      nextReview();
    }
  };

  const scoreOptions = [
    { value: 0, label: '完全忘记', color: COLORS.error },
    { value: 1, label: '只有印象', color: '#F97316' },
    { value: 2, label: '模糊记得', color: '#EAB308' },
    { value: 3, label: '基本记得', color: '#84CC16' },
    { value: 4, label: '记得清楚', color: '#22C55E' },
    { value: 5, label: '完全记住', color: COLORS.success },
  ];

  if (todayReviews.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎉</Text>
          <Text style={styles.emptyTitle}>今日复习完成!</Text>
          <Text style={styles.emptySubtitle}>
            没有需要复习的知识点了，继续加油！
          </Text>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>今日统计</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.streakDays || 0}</Text>
                <Text style={styles.statLabel}>连续天数</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats?.totalReviews || 0}</Text>
                <Text style={styles.statLabel}>总复习次数</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {stats?.averageScore.toFixed(1) || 0}
                </Text>
                <Text style={styles.statLabel}>平均分数</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 进度指示 */}
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {currentReviewIndex + 1} / {todayReviews.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentReviewIndex + 1) / todayReviews.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* 问题卡片 */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>知识点</Text>
          <Text style={styles.questionTitle}>{currentReview?.title}</Text>

          {!showAnswer ? (
            <TouchableOpacity
              style={styles.showAnswerButton}
              onPress={() => setShowAnswer(true)}
            >
              <Text style={styles.showAnswerText}>点击显示内容</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.answerSection}>
              <Text style={styles.answerText}>{currentReview?.content}</Text>
            </View>
          )}
        </View>

        {/* 评分按钮 */}
        {showAnswer && (
          <View style={styles.scoreSection}>
            <Text style={styles.scoreLabel}>你的记忆程度如何？</Text>
            <View style={styles.scoreOptions}>
              {scoreOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.scoreButton,
                    selectedScore === option.value && {
                      backgroundColor: option.color,
                      borderColor: option.color,
                    },
                  ]}
                  onPress={() => handleScoreSelect(option.value)}
                >
                  <Text
                    style={[
                      styles.scoreButtonText,
                      selectedScore === option.value && styles.scoreButtonTextActive,
                    ]}
                  >
                    {option.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.scoreHint}>
              {selectedScore !== null && scoreOptions.find(o => o.value === selectedScore)?.label}
            </Text>

            <TouchableOpacity
              style={[
                styles.nextButton,
                selectedScore === null && styles.nextButtonDisabled,
              ]}
              onPress={handleNext}
              disabled={selectedScore === null}
            >
              <Text style={styles.nextButtonText}>
                {currentReviewIndex === todayReviews.length - 1 ? '完成' : '下一个'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  progressHeader: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  progressText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  questionCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  questionLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  questionTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  showAnswerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  showAnswerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  answerSection: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  answerText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  scoreSection: {
    marginBottom: SPACING.xl,
  },
  scoreLabel: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  scoreOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  scoreButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  scoreButtonTextActive: {
    color: COLORS.white,
  },
  scoreHint: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.backgroundLight,
  },
  nextButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  statsCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '100%',
  },
  statsTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});

export default ReviewScreen;
