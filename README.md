# 内化 App - 知识内化与思维提升应用

一款面向当代年轻人的知识管理应用，专注于解决注意力分散、记忆力差、知识碎片化三大痛点。

## 🚀 核心功能

- **🎯 专注模式**：番茄钟专注训练，帮助提升注意力
- **📚 知识管理**：记录收藏知识点，AI 自动提炼核心要点
- **🔄 科学记忆**：艾宾浩斯遗忘曲线 + SM-2 间隔重复算法
- **📊 知识体系**：可视化知识图谱，构建个人知识网络

## 📁 项目结构

```
neihua-app/
├── backend/          # NestJS 后端服务
│   ├── src/
│   │   ├── modules/  # 功能模块
│   │   │   ├── auth/       # 认证模块
│   │   │   ├── knowledge/  # 知识点模块
│   │   │   ├── review/     # 复习模块
│   │   │   ├── focus/      # 专注模块
│   │   │   └── ai/         # AI 服务模块
│   │   ├── common/   # 公共组件
│   │   └── config/   # 配置文件
│   └── package.json
│
└── mobile/           # React Native 移动端
    ├── src/
    │   ├── screens/      # 页面组件
    │   ├── components/   # UI 组件
    │   ├── navigation/   # 导航配置
    │   ├── store/        # 状态管理
    │   ├── services/     # API 服务
    │   ├── types/        # TypeScript 类型
    │   └── constants/    # 常量配置
    └── package.json
```

## 🛠 技术栈

### 后端
- **框架**：NestJS
- **数据库**：PostgreSQL
- **ORM**：TypeORM
- **认证**：JWT + Passport
- **AI**：OpenAI API

### 移动端
- **框架**：React Native (Expo)
- **导航**：React Navigation
- **状态管理**：Zustand
- **HTTP 客户端**：Axios

## 🏃‍♂️ 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- npm 或 pnpm

### 后端启动

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入数据库配置和 OpenAI API Key

# 启动开发服务器
npm run start:dev
```

### 移动端启动

```bash
# 进入移动端目录
cd mobile

# 安装依赖
npm install

# 启动 Expo 开发服务器
npx expo start

# 按 'i' 打开 iOS 模拟器
# 按 'a' 打开 Android 模拟器
# 或使用 Expo Go 应用扫码在真机上运行
```

## 📝 API 文档

### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/refresh | 刷新 Token |
| GET | /api/auth/me | 获取当前用户 |

### 知识点接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/knowledge | 获取知识点列表 |
| POST | /api/knowledge | 创建知识点 |
| GET | /api/knowledge/:id | 获取知识点详情 |
| PUT | /api/knowledge/:id | 更新知识点 |
| DELETE | /api/knowledge/:id | 删除知识点 |
| POST | /api/knowledge/import | 从 URL 导入 |

### 复习接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/review/today | 获取今日待复习 |
| POST | /api/review/submit | 提交复习结果 |
| GET | /api/review/stats | 获取复习统计 |
| GET | /api/review/calendar | 获取复习日历 |

### 专注接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/focus/start | 开始专注会话 |
| PUT | /api/focus/:id/end | 结束专注会话 |
| GET | /api/focus/stats | 获取专注统计 |

## 🧠 核心算法

### 记忆引擎

采用**艾宾浩斯遗忘曲线 + SuperMemo SM-2** 双层算法：

1. **前 3 次复习**：使用艾宾浩斯标准间隔（1天、2天、4天）
2. **后续复习**：切换至 SM-2 动态算法，根据用户反馈调整间隔

```
新知识点 → 艾宾浩斯标准间隔 → 用户评分 → SM-2 动态调整
```

## 📄 许可证

MIT License

---

**内化** - 不只是收藏，更是理解 🧠
