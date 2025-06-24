#!/bin/bash

# OpenAI API 代理测试脚本
# 请确保设置了 OPENAI_API_KEY 环境变量

if [ -z "$OPENAI_API_KEY" ]; then
    echo "错误: 请设置 OPENAI_API_KEY 环境变量"
    echo "使用方法: export OPENAI_API_KEY='your-api-key-here'"
    exit 1
fi

echo "🚀 测试 OpenAI API 代理服务器..."
echo "代理服务器地址: http://localhost:3000"
echo ""

# 测试聊天补全接口
echo "📝 测试聊天补全接口..."
curl -X POST "http://localhost:3000/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user", 
                "content": "Say hello in Chinese"
            }
        ],
        "max_tokens": 50
    }' | jq .

echo ""
echo "✅ 测试完成！"
echo ""
echo "💡 使用说明："
echo "将你的 OpenAI API 请求中的 https://api.openai.com 替换为 http://your-server:3000"
