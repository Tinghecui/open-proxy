const express = require('express');
const axios = require('axios');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 速率限制（可选）
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

// 应用速率限制到所有请求
app.use(limiter);

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

// OpenAI API 代理中间件
const proxyOpenAI = async (req, res) => {
  try {
    // 构建目标URL
    const targetUrl = `https://api.openai.com${req.path}`;
    
    // 准备请求配置
    const config = {
      method: req.method,
      url: targetUrl,
      headers: {
        ...req.headers,
        'host': 'api.openai.com', // 重要：修改host头
      },
      timeout: 120000, // 2分钟超时
    };

    // 移除不需要的headers
    delete config.headers['host'];
    delete config.headers['content-length'];

    // 如果有请求体，添加到配置中
    if (req.body && Object.keys(req.body).length > 0) {
      config.data = req.body;
    }

    console.log(`Proxying ${req.method} request to: ${targetUrl}`);
    
    // 发送请求到OpenAI
    const response = await axios(config);
    
    // 设置响应头
    Object.keys(response.headers).forEach(key => {
      if (key.toLowerCase() !== 'content-encoding' && 
          key.toLowerCase() !== 'transfer-encoding') {
        res.set(key, response.headers[key]);
      }
    });

    // 返回响应
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    if (error.response) {
      // OpenAI API返回的错误
      console.error('OpenAI API Error:', {
        status: error.response.status,
        data: error.response.data
      });
      
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // 请求发送但没有收到响应
      console.error('No response received:', error.request);
      res.status(502).json({
        error: {
          message: 'Unable to reach OpenAI API',
          type: 'proxy_error'
        }
      });
    } else {
      // 其他错误
      console.error('Request setup error:', error.message);
      res.status(500).json({
        error: {
          message: 'Internal proxy error',
          type: 'proxy_error'
        }
      });
    }
  }
};

// 代理所有以 /v1 开头的请求到 OpenAI
app.all('/v1/*', proxyOpenAI);

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

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      message: `Path ${req.path} not found`,
      type: 'not_found'
    }
  });
});

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      type: 'server_error'
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
