# 系统模块
import os
# 写爬虫 爬取到内容，找到我们需要的部分，用正则
import re
# 子进程 子Agent 在全新的子进程运行，直接隔离
import subprocess
# 路径模块
from pathlib import Path
import json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv(override=True)
print(os.getenv("DEEPSEEK_API_KEY"))
# Agent工作目录 安全的，被授权的
# python 没有常量变量之分，都是变量，用约定大写表示常量
WORKDIR = Path.cwd()
# print(WORKDIR)
MODEL = os.getenv("DEEPSEEK_MODEL")

client = OpenAI(
    base_url = os.getenv("DEEPSEEK_BASE_URL"),
    api_key = os.getenv("DEEPSEEK_API_KEY")
)

resp = client.chat.completions.create(
    model = os.getenv("DEEPSEEK_MODEL"),
    messages = [
        {"role": "user", "content": "你好"}
    ]
)
print(resp.choices[0].message.content)

# print("sub agents ,harness 的高级拓展模块") 
