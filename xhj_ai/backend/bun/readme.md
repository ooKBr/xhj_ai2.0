# Bun
Bun 是比node 更快、开箱即用、零配置的JS/TS 运行时+包管理器。
node 优化的升级版，性能特别好
ahthropic 收购了 用于claude code 底层

## typescript
来自微软，是js 的超集，添加了类型约束
js 弱类型，经常会出类型错误
- 静态的类型编译  ts -> js 编译的过程中检查类型或代码错误
- ts 非常强大，已经是AI Agent 的标配

## js 的易错性
- 浏览器input 输入，如12 我们以为输入的是数字，但实际是字符串
- + 身兼多职 加法和字符串拼接
- 这种问题又不报错，导致错误可能隐藏在系统里很久。
ts 来解决

## 安装
powershell -c "irm bun.sh/install/windows | iex"