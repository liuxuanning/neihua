import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { apiService } from '../services/api';
import { Knowledge } from '../types';

const KnowledgeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id: string };
  const [knowledge, setKnowledge] = useState<Knowledge | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKnowledge();
  }, [id]);

  const fetchKnowledge = async () => {
    try {
      const data = await apiService.getKnowledge(id);
      setKnowledge(data);
    } catch (error) {
      console.error('获取知识点失败', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!knowledge) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>知识点不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 标题 */}
        <Text style={styles.title}>{knowledge.title}</Text>

        {/* 元信息 */}
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            创建于 {formatDate(knowledge.createdAt)}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.metaText}>
            复习 {knowledge.reviewCount} 次
          </Text>
        </View>

        {/* 标签 */}
        {knowledge.tags && knowledge.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {knowledge.tags.map((tag) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 原文内容 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>内容</Text>
          <Text style={styles.content}>{knowledge.content}</Text>
        </View>

        {/* AI 提炼 */}
        {knowledge.aiSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI 提炼</Text>
            <View style={styles.aiCard}>
              <Text style={styles.aiSummary}>{knowledge.aiSummary}</Text>
              {knowledge.aiKeywords && knowledge.aiKeywords.length > 0 && (
                <View style={styles.keywordsContainer}>
                  {knowledge.aiKeywords.map((keyword, index) => (
                    <View key={index} style={styles.keyword}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {/* 用户思考 */}
        {knowledge.userReflection && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>我的思考</Text>
            <View style={styles.reflectionCard}>
              <Text style={styles.reflectionText}>{knowledge.userReflection}</Text>
            </View>
          </View>
        )}

        {/* 来源 */}
        {knowledge.sourceUrl && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>来源</Text>
            <TouchableOpacity style={styles.sourceCard}>
              <Text style={styles.sourceText} numberOfLines={1}>
                {knowledge.sourceTitle || knowledge.sourceUrl}
              </Text>
              <Text style={styles.sourceArrow}>↗</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 学习进度 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>学习进度</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>理解程度</Text>
              <Text style={styles.progressValue}>
                {knowledge.understandingLevel}/5
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(knowledge.understandingLevel / 5) * 100}%` },
                ]}
              />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>下次复习</Text>
              <Text style={styles.progressValue}>
                {knowledge.nextReviewDate
                  ? formatDate(knowledge.nextReviewDate)
                  : '待安排'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 底部操作 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate('复习' as never)}
        >
          <Text style={styles.reviewButtonText}>开始复习</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMuted,
  },
  title: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  tag: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  tagText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  content: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 26,
  },
  aiCard: {
    backgroundColor: COLORS.primaryLight + '20',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  aiSummary: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  keyword: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  keywordText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.white,
  },
  reflectionCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  reflectionText: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  sourceText: {
    flex: 1,
    fontSize: FONT_SIZE.md,
    color: COLORS.primary,
  },
  sourceArrow: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  progressCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressLabel: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textSecondary,
  },
  progressValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  footer: {
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reviewButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default KnowledgeDetailScreen;
