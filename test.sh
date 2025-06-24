#!/bin/bash

# OpenAI API 代理流式测试脚本 (Simple版本)
# 请确保设置了 OPENAI_API_KEY 环境变量

if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ 错误: 请设置 OPENAI_API_KEY 环境变量"
    echo "使用方法: export OPENAI_API_KEY='your-api-key-here'"
    exit 1
fi

echo "🚀 测试 OpenAI API 代理服务器 (Simple版本)..."
echo "代理服务器地址: http://localhost:3000"
echo ""

# 测试基本聊天补全接口
echo "📝 测试基本聊天补全接口..."
echo "模型: gpt-3.5-turbo"
echo ""

curl -X POST "http://localhost:3000/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user", 
                "content": "Say hello in Chinese, keep it short"
            }
        ],
        "max_tokens": 50
    }'

echo ""
echo ""
echo "📡 测试流式聊天补全接口..."
echo "模型: gpt-3.5-turbo (stream=true)"
echo ""

curl -X POST "http://localhost:3000/v1/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "user", 
                "content": "用中文写一句话问候，简短一点"
            }
        ],
        "max_tokens": 30,
        "stream": true
    }' --no-buffer

echo ""
echo ""
echo "✅ 测试完成！"
echo ""
echo "💡 说明:"
echo "- 如果看到完整的JSON响应，说明基本代理工作正常"
echo "- 如果看到 'data:' 开头的流式数据，说明流式代理工作正常"
echo "- 如果出现错误，请检查API Key是否正确设置"
