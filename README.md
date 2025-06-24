# OpenAI API 代理服务器

这是一个简单的 OpenAI API 代理服务器，可以部署在海外服务器上，帮助转发 OpenAI API 请求。

## 功能特性

- ✅ 完整的 OpenAI API 代理转发
- ✅ 支持所有 OpenAI API 端点 (`/v1/*`)
- ✅ 请求速率限制保护
- ✅ 错误处理和日志记录
- ✅ 健康检查端点
- ✅ CORS 支持
- ✅ 优雅关闭

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
# 生产环境
npm start

# 开发环境（自动重启）
npm run dev
```

### 3. 使用代理

将你的 OpenAI API 请求中的 `https://api.openai.com` 替换为你的代理服务器地址即可。

**原始请求：**
```bash
curl "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4",
        "messages": [
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'
```

**使用代理后：**
```bash
curl "http://your-server:3000/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4",
        "messages": [
            {
                "role": "user",
                "content": "Hello!"
            }
        ]
    }'
```

## 部署

### Docker 部署

```bash
# 构建镜像
docker build -t openai-proxy .

# 运行容器
docker run -d -p 3000:3000 --name openai-proxy openai-proxy
```

### PM2 部署

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start server.js --name openai-proxy

# 查看状态
pm2 status

# 查看日志
pm2 logs openai-proxy
```

### 直接部署

```bash
# 后台运行
nohup node server.js > output.log 2>&1 &
```

## 环境变量

创建 `.env` 文件来配置环境变量：

```env
# 服务器端口
PORT=3000

# 其他配置...
```

## API 端点

- `GET /` - 服务器信息和使用说明
- `GET /health` - 健康检查
- `ALL /v1/*` - OpenAI API 代理

## 配置选项

### 速率限制

默认配置：每个 IP 每 15 分钟最多 100 个请求。可以在 `server.js` 中修改：

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 时间窗口
  max: 100, // 最大请求数
});
```

### 超时设置

默认请求超时时间为 2 分钟，可以在 `server.js` 中修改：

```javascript
const config = {
  // ...
  timeout: 120000, // 毫秒
};
```

## 安全建议

1. **使用 HTTPS**: 在生产环境中使用反向代理（如 Nginx）来提供 HTTPS
2. **防火墙**: 限制只允许必要的端口访问
3. **认证**: 如需要，可以添加 API Key 认证
4. **监控**: 设置服务器监控和日志收集

## 故障排除

### 常见问题

1. **CORS 错误**: 服务器已启用 CORS，如果仍有问题，检查客户端设置
2. **超时错误**: 检查网络连接，必要时增加超时时间
3. **速率限制**: 如触发速率限制，等待或调整限制设置

### 查看日志

服务器会输出详细的请求日志，包括：
- 请求时间和 IP
- 代理的目标 URL
- 错误信息

## 许可证

MIT License
