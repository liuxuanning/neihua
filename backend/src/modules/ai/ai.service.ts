/**
 * AI 服务
 * 支持 OpenAI / MiniMax API
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService implements OnModuleInit {
  private openai: OpenAI;
  private model: string;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get('AI_API_KEY') || this.configService.get('OPENAI_API_KEY');
    const baseUrl = this.configService.get('AI_BASE_URL') || 'https://api.minimax.chat/v1';
    this.model = this.configService.get('AI_MODEL') || 'abab6.5s-chat';

    this.openai = new OpenAI({
      apiKey,
      baseURL: baseUrl,
    });
  }

  /**
   * 提取文章核心要点
   */
  async extractKeyPoints(content: string): Promise<{
    summary: string;
    keywords: string[];
    mainPoints: string[];
  }> {
    const prompt = `请分析以下内容，提取核心要点：

内容：
${content}

请以 JSON 格式返回：
{
  "summary": "100字以内的摘要",
  "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
  "mainPoints": ["要点1", "要点2", "要点3"]
}`;

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{}';
    return this.parseJson(text);
  }

  /**
   * 生成启发式问题
   */
  async generateQuestions(
    content: string,
    count: number = 3,
  ): Promise<string[]> {
    const prompt = `基于以下知识点，生成 ${count} 个启发式问题，帮助用户深度思考：

知识点：
${content}

要求：
- 问题应该引发深度思考，而非简单的是非题
- 问题应该帮助用户将知识与自身经验联系
- 问题应该促进知识的内化

直接返回 JSON 数组格式：{"questions": ["问题1", "问题2", "问题3"]}`;

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{"questions": []}';
    const result = this.parseJson(text);
    return result.questions || [];
  }

  /**
   * AI 对话深挖
   */
  async chat(
    knowledgeId: string,
    content: string,
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
  ): Promise<string> {
    const systemPrompt = `你是一位知识教练，正在帮助用户深入理解以下知识点：

知识点内容：
${content}

你的任务：
1. 通过提问引导用户深度思考
2. 帮助用户建立知识与现实的联系
3. 鼓励用户用自己的话复述理解
4. 发现用户的理解偏差并温和纠正
5. 提供类比帮助理解抽象概念

对话风格：
- 友好、耐心、鼓励性
- 每次回复控制在 100-200 字
- 优先使用开放式问题`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: messages as any,
    });

    return response.choices[0].message.content || '';
  }

  /**
   * 生成思维导图
   */
  async generateMindmap(content: string): Promise<Record<string, any>> {
    const prompt = `将以下知识点转换为思维导图结构：

内容：
${content}

请以 JSON 格式返回思维导图结构：
{
  "title": "中心主题",
  "children": [
    {
      "title": "分支1",
      "children": [
        { "title": "子分支1-1" },
        { "title": "子分支1-2" }
      ]
    },
    {
      "title": "分支2",
      "children": [...]
    }
  ]
}

要求：
- 层次不超过 3 层
- 每个节点文字简洁
- 突出核心概念和关系`;

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{}';
    return this.parseJson(text);
  }

  /**
   * 费曼学习法检验
   */
  async feynmanTest(
    content: string,
    userExplanation: string,
  ): Promise<{
    score: number;
    feedback: string;
    missingPoints: string[];
    suggestions: string[];
  }> {
    const prompt = `用户正在尝试用费曼学习法理解一个知识点。

原始知识点：
${content}

用户的解释：
${userExplanation}

请评估用户的理解程度，返回 JSON：
{
  "score": 1-5 的理解度评分,
  "feedback": "鼓励性的反馈",
  "missingPoints": ["遗漏或理解不准确的关键点"],
  "suggestions": ["改进建议"]
}`;

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{}';
    return this.parseJson(text);
  }

  /**
   * 生成复习卡片
   */
  async generateFlashcards(content: string): Promise<
    Array<{
      question: string;
      answer: string;
      difficulty: 'easy' | 'medium' | 'hard';
    }>
  > {
    const prompt = `将以下知识点转换为问答卡片，用于间隔重复记忆：

内容：
${content}

请生成 3-5 张卡片，返回 JSON 数组：
{
  "cards": [
    {
      "question": "问题（应该触发主动回忆）",
      "answer": "答案",
      "difficulty": "easy/medium/hard"
    }
  ]
}`;

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '{"cards": []}';
    const result = this.parseJson(text);
    return result.cards || [];
  }

  /**
   * 解析 JSON 响应
   */
  private parseJson(text: string): any {
    try {
      // 尝试直接解析
      return JSON.parse(text);
    } catch {
      // 尝试提取 JSON 块
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[1]);
      }
      // 尝试提取花括号内容
      const braceMatch = text.match(/\{[\s\S]*\}/);
      if (braceMatch) {
        return JSON.parse(braceMatch[0]);
      }
      // 返回默认值
      return {};
    }
  }
}
