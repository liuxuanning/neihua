# 阿里云服务器部署指南

## 📋 服务器信息

| 项目 | 值 |
|------|-----|
| 服务器 IP | 59.110.5.24 |
| 系统 | Ubuntu（推荐） |
| 已安装 | Docker |

---

## 🚀 部署步骤

### 第一步：连接服务器

```bash
ssh root@59.110.5.24
```

---

### 第二步：安装 Docker（如未安装）

```bash
# 更新包
apt update && apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | bash

# 安装 Docker Compose
apt install docker-compose -y

# 验证安装
docker --version
docker-compose --version
```

---

### 第三步：创建项目目录

```bash
mkdir -p /opt/neihua
cd /opt/neihua
```

---

### 第四步：上传项目代码

**方式 A：从 GitHub 克隆**

```bash
git clone https://github.com/liuxuanning/neihua.git .
```

**方式 B：手动创建文件**

创建以下文件结构：
```
/opt/neihua/
├── docker-compose.yml
├── nginx.conf
├── deploy.sh
└── backend/
    ├── Dockerfile
    ├── package.json
    └── src/
```

---

### 第五步：配置安全组

在阿里云控制台开放端口：

| 端口 | 用途 |
|------|------|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3000 | API（可选） |

---

### 第六步：执行部署

```bash
cd /opt/neihua
chmod +x deploy.sh
./deploy.sh
```

---

## 📱 部署完成后

### API 地址

```
http://59.110.5.24/api
```

### 测试接口

```bash
# 测试注册
curl -X POST http://59.110.5.24/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","name":"测试用户"}'

# 测试登录
curl -X POST http://59.110.5.24/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## 🔧 常用命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f api

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新部署
git pull
docker-compose up -d --build
```

---

## 🔐 配置 HTTPS（推荐）

### 使用 Let's Encrypt 免费证书

```bash
# 安装 certbot
apt install certbot python3-certbot-nginx -y

# 申请证书
certbot --nginx -d your-domain.com

# 自动续期
certbot renew --dry-run
```

---

## 📊 监控与维护

### 查看资源占用

```bash
docker stats
```

### 查看磁盘占用

```bash
df -h
```

### 备份数据库

```bash
docker exec neihua-db pg_dump -U neihua neihua > backup.sql
```

---

## ⚠️ 注意事项

1. **修改密码**：修改 `docker-compose.yml` 中的数据库密码
2. **修改 JWT_SECRET**：设置一个复杂的密钥
3. **定期备份**：定期备份数据库数据
4. **安全组**：只开放必要的端口

---

## 🆘 常见问题

### Q: 服务启动失败？

```bash
# 查看详细日志
docker-compose logs api

# 检查端口占用
netstat -tlnp | grep 3000
```

### Q: 数据库连接失败？

```bash
# 检查数据库是否运行
docker-compose ps postgres

# 进入数据库容器
docker exec -it neihua-db psql -U neihua -d neihua
```

### Q: 外网无法访问？

1. 检查阿里云安全组是否开放端口
2. 检查服务器防火墙：
```bash
ufw status
ufw allow 80
ufw allow 3000
```

---

## 📞 需要帮助？

如果部署过程中遇到问题，把错误日志发给我。
