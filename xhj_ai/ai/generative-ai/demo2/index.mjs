import dotenv from 'dotenv';
dotenv.config();
// async/await
async function generateImage() {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    // 没有用openai，
    // 本质就是一次http api请求
    const res = await fetch(
        // 文本生成
        // api 地址 多模态的api 服务 生成图片
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation',
        {
            method:'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization':`Bearer ${OPENAI_API_KEY}`
            },
            // 请求体
            body:JSON.stringify({
                "model":"qwen-image-2.0-pro",
                "input": {
                    "message": [
                        "role": "user",
                        "content": [
                            {"image":"https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/thtclx/input1.png"},
                            {"https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/iclsnx/input2.png"},
                            {"https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/gborgw/input3.png"},
                            { "text":"图一中的女生穿着图二的黑色裙子按图三的姿势坐下"}
                        ]
                    ]
                }
            })
        }
    )

}
