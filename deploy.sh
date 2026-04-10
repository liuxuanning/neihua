#!/bin/bash

# 阿里云服务器部署脚本
# 内化 App 后端服务

echo "========================================="
echo "  内化 App 后端部署脚本"
echo "========================================="

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装"
    exit 1
fi

echo "✅ Docker 已安装"

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 构建并启动
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 测试 API
echo "🧪 测试 API..."
curl -s http://localhost:3000/api || echo "API 未响应"

echo ""
echo "========================================="
echo "✅ 部署完成！"
echo ""
echo "📱 API 地址: http://59.110.5.24/api"
echo ""
echo "📋 常用命令:"
echo "  查看日志: docker-compose logs -f api"
echo "  重启服务: docker-compose restart"
echo "  停止服务: docker-compose down"
echo "========================================="
