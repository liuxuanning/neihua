# 使用 Node.js 20 Alpine 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装所有依赖（包括 devDependencies，构建需要）
RUN npm install

# 复制源代码
COPY . .

# 构建 TypeScript
RUN npm run build

# 删除开发依赖，减小镜像体积
RUN npm prune --omit=dev

# 暴露端口
EXPOSE $PORT

# 启动命令
CMD ["node", "dist/main.js"]
