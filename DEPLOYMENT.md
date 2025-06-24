# OpenAI API 代理服务器部署指南

## 本地测试

### 1. 启动服务器
```bash
npm start
```

### 2. 测试健康检查
```bash
curl http://localhost:3000/health
```

### 3. 测试 API 代理（需要 OpenAI API Key）
```bash
export OPENAI_API_KEY="your-api-key-here"
./test.sh
```

## 海外服务器部署

### 方法一：直接部署

1. **上传代码到服务器**
```bash
# 打包代码
tar -czf openai-proxy.tar.gz .

# 上传到服务器
scp openai-proxy.tar.gz user@your-server:/home/user/

# 在服务器上解压
ssh user@your-server
cd /home/user/
tar -xzf openai-proxy.tar.gz
cd openai-proxy
```

2. **安装 Node.js 和依赖**
```bash
# 安装 Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装依赖
npm install
```

3. **使用 PM2 部署**
```bash
# 安装 PM2
sudo npm install -g pm2

# 启动应用
pm2 start server.js --name openai-proxy

# 设置开机自启
pm2 startup
pm2 save
```

### 方法二：Docker 部署

1. **构建和运行**
```bash
# 构建镜像
docker build -t openai-proxy .

# 运行容器
docker run -d -p 3000:3000 --name openai-proxy --restart unless-stopped openai-proxy
```

2. **使用 Docker Compose**
```bash
docker-compose up -d
```

### 方法三：使用 Nginx 反向代理 + HTTPS

1. **安装 Nginx**
```bash
sudo apt update
sudo apt install nginx
```

2. **配置 Nginx**
```nginx
# /etc/nginx/sites-available/openai-proxy
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

3. **启用站点**
```bash
sudo ln -s /etc/nginx/sites-available/openai-proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **设置 HTTPS（使用 Let's Encrypt）**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 使用方法

### 原始 OpenAI API 请求
```bash
curl "https://api.openai.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
    }'
```

### 通过代理服务器的请求
```bash
curl "http://your-server:3000/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
    }'
```

### 如果使用了 HTTPS
```bash
curl "https://your-domain.com/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-4",
        "messages": [{"role": "user", "content": "Hello!"}]
    }'
```

## 监控和维护

### 查看日志
```bash
# PM2 日志
pm2 logs openai-proxy

# Docker 日志
docker logs openai-proxy

# 直接运行的日志
tail -f output.log
```

### 监控状态
```bash
# PM2 状态
pm2 status

# Docker 状态
docker ps

# 健康检查
curl http://your-server:3000/health
```

### 重启服务
```bash
# PM2 重启
pm2 restart openai-proxy

# Docker 重启
docker restart openai-proxy
```

## 安全建议

1. **使用 HTTPS**: 在生产环境中必须使用 HTTPS
2. **防火墙**: 只开放必要的端口（80, 443, SSH）
3. **定期更新**: 保持系统和依赖包更新
4. **监控**: 设置监控和告警系统
5. **备份**: 定期备份配置和代码

## 故障排除

### 常见问题
1. **端口被占用**: 修改 PORT 环境变量
2. **权限问题**: 检查文件权限和用户权限
3. **网络问题**: 检查防火墙和网络配置
4. **内存不足**: 监控服务器资源使用情况

### 调试模式
```bash
# 设置调试模式
DEBUG=* npm start

# 或者查看详细日志
npm run dev
```
