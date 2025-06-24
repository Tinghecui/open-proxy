#!/bin/bash

# Docker Hub 推送脚本
# 使用方法: ./push-docker.sh

echo "🐳 准备推送 OpenAI Proxy 镜像到 Docker Hub..."

# 检查本地镜像是否存在
if ! docker images | grep -q "jamescui6677/openai-proxy"; then
    echo "❌ 本地镜像不存在，正在重新构建和标记..."
    docker build -t openai-proxy .
    docker tag openai-proxy:latest docker.io/jamescui6677/openai-proxy:latest
fi

echo "📦 镜像信息:"
docker images | grep jamescui6677/openai-proxy

echo ""
echo "🔑 请确保您已登录 Docker Hub:"
echo "   docker login"
echo ""

read -p "是否继续推送镜像到 Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 正在推送镜像..."
    docker push docker.io/jamescui6677/openai-proxy:latest
    
    if [ $? -eq 0 ]; then
        echo "✅ 镜像推送成功!"
        echo "🎉 用户现在可以使用以下命令拉取镜像:"
        echo "   docker pull docker.io/jamescui6677/openai-proxy:latest"
        echo "   docker run -d -p 3000:3000 docker.io/jamescui6677/openai-proxy:latest"
    else
        echo "❌ 镜像推送失败，请检查网络连接和登录状态"
        exit 1
    fi
else
    echo "⏸️  推送已取消"
fi
