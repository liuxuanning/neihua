import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useKnowledgeStore } from '../store';

const AddKnowledgeScreen = () => {
  const navigation = useNavigation();
  const { addKnowledge } = useKnowledgeStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [reflection, setReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await addKnowledge({
        title: title.trim(),
        content: content.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        userReflection: reflection.trim() || undefined,
      });
      navigation.goBack();
    } catch (error) {
      console.error('添加失败', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = title.trim() && content.trim();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 标题输入 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>标题 *</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="给知识点起个名字"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          {/* 内容输入 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>内容 *</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="记录你学到的知识..."
              placeholderTextColor={COLORS.textMuted}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 来源 URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>来源链接（可选）</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor={COLORS.textMuted}
              value={sourceUrl}
              onChangeText={setSourceUrl}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* 思考感悟 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>思考与感悟</Text>
            <Text style={styles.labelHint}>这段知识最打动你的是什么？</Text>
            <TextInput
              style={styles.reflectionInput}
              placeholder="记录你的思考和感悟..."
              placeholderTextColor={COLORS.textMuted}
              value={reflection}
              onChangeText={setReflection}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* 提示信息 */}
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              添加知识点后，AI 会自动提炼核心要点并生成复习卡片，帮助你更高效地记忆和理解。
            </Text>
          </View>
        </ScrollView>

        {/* 提交按钮 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            <Text style={[styles.submitButtonText, !isValid && styles.submitButtonTextDisabled]}>
              {isSubmitting ? '保存中...' : '保存知识点'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  inputGroup: {
    marginTop: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  labelHint: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    marginTop: -SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },
  titleInput: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  contentInput: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    minHeight: 150,
  },
  reflectionInput: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    minHeight: 100,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: SPACING.lg,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.backgroundLight,
  },
  submitButtonText: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: COLORS.white,
  },
  submitButtonTextDisabled: {
    color: COLORS.textMuted,
  },
});

export default AddKnowledgeScreen;
