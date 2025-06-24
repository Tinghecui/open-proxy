# OpenAI API 代理服务器

简单高效的 OpenAI API 代理服务器，支持完整的流式响应，一键部署到任何环境。

> 🎉 **一键部署**: `docker run -d -p 3000:3000 docker.io/jamescui6677/openai-proxy:latest`

## ✨ 功能特性

- 🚀 **完整代理**: 支持所有 OpenAI API 端点
- 🌊 **流式响应**: 完美支持 `stream=true` 模式
- 🐳 **容器化**: Docker 开箱即用
- 🔧 **零配置**: 无需复杂设置
- 📊 **健康检查**: 内置监控端点
- 🌐 **CORS 支持**: 跨域请求友好

## 🚀 快速开始

### Docker 部署（推荐）

```bash
# 1. 直接使用预构建镜像（推荐）
docker run -d \
  --name openai-proxy \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key_here \
  docker.io/jamescui6677/openai-proxy:latest

# 2. 或自行构建镜像
docker build -t openai-proxy .
docker run -d \
  --name openai-proxy \
  -p 3000:3000 \
  -e OPENAI_API_KEY=your_api_key_here \
  openai-proxy:latest

# 3. 使用 docker-compose
docker-compose up -d
```

### 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 启动服务
npm start
```

## 🔧 使用方法

将 OpenAI API 请求中的 `https://api.openai.com` 替换为你的代理服务器地址：

```bash
# 流式聊天示例
curl -X POST http://localhost:3000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }' --no-buffer
```

## 🐳 Docker 使用

### 基本运行

```bash
# 使用预构建镜像（推荐）
docker run -d \
  --name openai-proxy \
  -p 3000:3000 \
  -e TARGET_URL=https://api.openai.com \
  docker.io/jamescui6677/openai-proxy:latest

# 使用 .env 文件
docker run -d \
  --name openai-proxy \
  -p 3000:3000 \
  --env-file .env \
  docker.io/jamescui6677/openai-proxy:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'
services:
  openai-proxy:
    image: docker.io/jamescui6677/openai-proxy:latest
    ports:
      - "3000:3000"
    environment:
      - TARGET_URL=https://api.openai.com
      - OPENAI_API_KEY=your_api_key_here  # 可选
    restart: unless-stopped
```

启动命令：
```bash
docker-compose up -d
```

### 容器管理

```bash
# 查看状态
docker ps

# 查看日志
docker logs openai-proxy -f

# 重启容器
docker restart openai-proxy

# 停止并删除
docker stop openai-proxy && docker rm openai-proxy
```

## ⚙️ 配置选项

| 环境变量 | 默认值 | 说明 |
|---------|--------|------|
| `PORT` | 3000 | 服务端口 |
| `TARGET_URL` | https://api.openai.com | 目标 API 地址 |
| `OPENAI_API_KEY` | - | OpenAI API 密钥（可选） |

## 📡 API 端点

- `GET /` - 服务信息
- `GET /health` - 健康检查
- `ALL /v1/*` - OpenAI API 代理

## 🛠️ 故障排除

### 测试健康状态

```bash
curl http://localhost:3000/health
# 响应: {"status":"ok","timestamp":"...","message":"OpenAI Proxy Server is running"}
```

### 常见问题

1. **连接失败**: 检查网络和防火墙设置
2. **代理错误**: 确认 `TARGET_URL` 配置正确
3. **权限问题**: 检查 `OPENAI_API_KEY` 是否有效

### 查看日志

```bash
# Docker 容器日志
docker logs openai-proxy

# 本地运行日志
npm start  # 直接在终端查看
```

## 📦 镜像信息

- **Docker Hub**: `docker.io/jamescui6677/openai-proxy:latest`
- **镜像大小**: ~139MB
- **基础镜像**: node:18-alpine
- **架构支持**: linux/amd64

### 快速拉取

```bash
# 拉取最新镜像
docker pull docker.io/jamescui6677/openai-proxy:latest

# 立即运行
docker run -d -p 3000:3000 docker.io/jamescui6677/openai-proxy:latest
```

## 📄 许可证

MIT License
