#!/bin/bash

# OpenAI 代理服务器启动脚本

echo "🚀 启动 OpenAI API 代理服务器..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
fi

# 启动服务器
echo "✅ 启动服务器..."
echo "📍 服务器地址: http://localhost:3000"
echo "🔍 健康检查: http://localhost:3000/health"
echo "📖 使用说明: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm start
