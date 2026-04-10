# Render 部署指南

## 🚀 快速部署步骤

### 1. 推送代码到 Git

首先确保代码已推送到 Gitee/GitHub：

```bash
cd /workspace/neihua-app
git add -A
git commit -m "feat: 添加 Render 部署配置"
git push
```

### 2. 注册 Render 账号

1. 打开 [Render 官网](https://render.com)
2. 点击 **Get Started** 注册账号
3. 可以用 GitHub/GitLab/Google 账号直接登录

### 3. 创建 PostgreSQL 数据库

1. 登录后点击 **New** → **PostgreSQL**
2. 填写信息：
   - **Name**: `neihua-db`
   - **Database**: `neihua`
   - **Region**: `Singapore` 或 `Oregon`（选离你近的）
   - **Plan**: `Free`
3. 点击 **Create Database**
4. 创建完成后，记录下数据库信息（后面要用）

### 4. 创建 Web Service

1. 点击 **New** → **Web Service**
2. 连接 Git 仓库：
   - 选择 **Public Git repository**
   - 输入你的仓库地址（如：`https://gitee.com/你的用户名/neihua-app.git`）
   - 点击 **Connect**
3. 配置服务：
   - **Name**: `neihua-api`
   - **Region**: 和数据库保持一致
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Plan**: `Free`
4. 配置环境变量（Advanced → Add Environment Variable）：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DB_HOST` | 从数据库页面复制 |
| `DB_PORT` | 从数据库页面复制 |
| `DB_USERNAME` | 从数据库页面复制 |
| `DB_PASSWORD` | 从数据库页面复制 |
| `DB_DATABASE` | 从数据库页面复制 |
| `JWT_SECRET` | 随便填一个复杂字符串 |
| `OPENAI_API_KEY` | 你的 MiniMax API Key |

5. 点击 **Create Web Service**

### 5. 等待部署完成

- Render 会自动拉取代码、构建、部署
- 第一次部署大约需要 5-10 分钟
- 部署成功后会显示一个 URL，如：`https://neihua-api.onrender.com`

### 6. 测试 API

部署完成后，访问：
```
https://你的服务地址.onrender.com/api
```

应该看到：`{"message":"Cannot GET /api","statusCode":404}`（说明服务已启动）

---

## 📱 配置移动端

部署成功后，修改移动端的 API 地址：

编辑 `mobile/src/services/api.ts`：
```typescript
const API_BASE_URL = 'https://你的服务地址.onrender.com/api';
```

---

## ⚠️ 注意事项

### 免费版限制

| 项目 | 限制 |
|------|------|
| Web Service | 750 小时/月（够用） |
| PostgreSQL | 90 天后过期，需手动续期 |
| 空闲休眠 | 15 分钟无访问会休眠，首次访问需等待 30 秒 |

### 数据库续期

PostgreSQL 免费版每 90 天需要手动续期：
1. 进入数据库页面
2. 点击 **Extend Free Period**

### 冷启动问题

免费版服务会休眠，首次访问会慢：
- 可以用 UptimeRobot 等监控服务定时访问
- 或升级付费版解决

---

## 🔧 常见问题

### Q: 部署失败怎么办？

查看日志：
1. 进入 Web Service 页面
2. 点击 **Logs** 查看错误信息

### Q: 数据库连接失败？

检查环境变量是否正确填写，特别是：
- `DB_HOST`
- `DB_PASSWORD`

### Q: 如何查看 API 是否正常？

使用 curl 或 Postman 测试：
```bash
# 注册测试账号
curl -X POST https://你的服务地址.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"测试用户"}'
```

---

## 📞 需要帮助？

如果部署过程中遇到问题，告诉我具体的错误信息，我来帮你解决。
