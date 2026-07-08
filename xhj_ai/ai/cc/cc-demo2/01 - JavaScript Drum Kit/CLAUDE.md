# CLAUDE.md

此文件为 Claude Code（claude.ai/code）在处理此仓库中的代码时提供指导。

## 项目概述

JavaScript Drum Kit — 来自 Wes Bos 的 [JavaScript30](https://javascript30.com/) 课程的第 01 个项目。一个纯前端应用，当按下键盘按键时播放鼓声。无构建工具、无依赖、无测试。直接在浏览器中打开 `index-START.html` 或 `index-FINISHED.html`。

## 文件作用

- **`index-START.html`** — 含空 `<script>` 块的起始模板（练习起点）
- **`index-FINISHED.html`** — 含完整 JavaScript 的最终解决方案
- **`style.css`** — 所有样式，包括用于视觉反馈的 `.playing` 过渡类
- **`sounds/*.wav`** — 9 个鼓声样本（boom、clap、hihat、kick、openhat、ride、snare、tink、tom）
- **`background.jpg`** — 全屏背景图像

## 工作原理

1. 每个 `.key` div 都有一个 `data-key` 属性，匹配 ASCII 键码（例如 `data-key="65"` = 'A'）
2. 每个 `<audio>` 元素都有一个匹配的 `data-key`，指向对应的 `.wav` 文件
3. `keydown` 监听器将按下键的 `keyCode` 映射到对应的 `<audio>` 和 `.key` div
4. 播放音频（`audio.currentTime = 0; audio.play()`），并添加 `.playing` CSS 类以实现缩放和发光效果
5. 当 transform 过渡结束时，`transitionend` 监听器会移除 `.playing`
