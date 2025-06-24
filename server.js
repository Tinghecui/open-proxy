const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());

// 日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'OpenAI Proxy Server is running' 
  });
});

// 根路径信息
app.get('/', (req, res) => {
  res.json({
    message: 'OpenAI API Proxy Server',
    version: '1.0.0',
    usage: {
      'chat_completions': 'POST /v1/chat/completions',
      'completions': 'POST /v1/completions',
      'models': 'GET /v1/models',
      'health_check': 'GET /health'
    },
    note: 'Replace https://api.openai.com with this server URL'
  });
});

// 使用 http-proxy-middleware 创建代理
const proxyOptions = {
  target: 'https://api.openai.com',
  changeOrigin: true,
  logLevel: 'info',
  on: {
    proxyReq: (proxyReq, req, res) => {
      console.log(`Proxying ${req.method} request to: https://api.openai.com${req.url}`);
    },
    error: (err, req, res) => {
      console.error('Proxy error:', err.message);
      res.status(500).json({
        error: {
          message: 'Proxy error occurred',
          type: 'proxy_error'
        }
      });
    }
  }
};

// 代理所有以 /v1 开头的请求到 OpenAI
app.use('/v1', createProxyMiddleware(proxyOptions));

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Path ${req.path} not found`,
      type: 'not_found'
    }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`OpenAI Proxy Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Usage: Replace 'https://api.openai.com' with 'http://your-server:${PORT}'`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
