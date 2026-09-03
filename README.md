# 灯下诗词 · 白灯客

> 一个传统水墨国风的唐诗宋词鉴赏单页应用，纯前端、零依赖、零构建。
> 收录 50 首经典诗词（唐诗 25 + 宋词 25），支持卡片浏览、详情弹窗、收藏与「宣纸 / 墨夜」双色主题切换。

🌐 **在线演示：** https://icexuan-2707.github.io/tang-song-poetry/

---

## ✨ 功能特性

- **分类浏览**：左侧「唐诗 / 宋词 / 收藏」三模块，覆盖「分类浏览 → 个人收藏」。
- **卡片 + 详情**：卡片网格布局，点击展开详情弹窗（标题 → 作者 → 原文 → 作者简介）。
- **收藏持久化**：红心收藏写入 `localStorage`，刷新不丢失。
- **双色主题**：宣纸（亮）/ 墨夜（暗）一键切换，并记忆偏好。
- **水墨视觉**：各视图配专属水墨 Hero 背景图，思源宋体营造古籍排版气质。
- **响应式**：桌面双栏、移动端单栏自适应。

## 🛠 技术栈

原生 **HTML + CSS + JavaScript（经典脚本，无框架、无构建步骤）**。

- 4 个 JS 文件按 `data → state → ui → app` 顺序加载，全局作用域共享、低耦合。
- 全部样式由 CSS 变量驱动，改一处即全局生效。
- 详情弹窗使用原生 `<dialog>` 元素。
- 可直接双击 `index.html` 运行（`file://` 可用），无需服务器。

## 🚀 快速开始

**方式一（最简单）：** 直接双击 `index.html` 在浏览器打开。

**方式二（更接近线上）：**
```bash
# 进入仓库目录后
python -m http.server 8080
# 浏览器访问 http://localhost:8080
```

**本地修改后同步到本仓库：**
```bash
git clone https://github.com/ICEXUAN-2707/tang-song-poetry.git
cd tang-song-poetry
# 修改代码后，更新 index.html 中对应的 ?v= 缓存戳，再提交推送
git add -A && git commit -m "your message" && git push
```

## 📁 项目结构

```
tang-song-poetry/
├── index.html            # 页面骨架：侧边栏 + 主内容区 + 详情弹窗
├── css/
│   ├── variables.css     # 全局变量与双色主题（light / dark）
│   ├── base.css          # 重置、排版、无障碍
│   ├── layout.css        # 侧边栏 / 主内容 / 网格 / 响应式
│   └── components.css    # Hero、卡片、弹窗、收藏按钮、页脚
├── js/
│   ├── data.js           # 诗词数据 + 查询工具函数
│   ├── state.js          # 状态管理 + localStorage 持久化
│   ├── ui.js             # 所有 DOM 渲染与事件绑定
│   └── app.js            # 入口：初始化、业务编排
├── assets/
│   ├── hero-tang.png     # 唐诗 Hero（山水诗）
│   ├── hero-song.png     # 宋词 Hero（春江花月夜）
│   └── hero-favorites.png  # 收藏 Hero（藏）
├── 项目文档.md            # 详细项目文档（风格/架构 + 零基础学习指南）
└── README.md
```

## 🏗 架构速览

采用 **「数据 → 状态 → 视图 → 编排」** 分层（类似 MVC / 单向数据流），四个文件互不 `import`，统一由 `app.js` 协调：

| 层 | 文件 | 职责 |
|----|------|------|
| 数据层 | `data.js` | 持有 `POEMS` 数组与查询函数 |
| 状态层 | `state.js` | 持有 `state` 对象、主题与收藏持久化 |
| 视图层 | `ui.js` | 把数据画到屏幕、绑定用户操作 |
| 编排层 | `app.js` | 连接 UI 事件与 state 变更 |

**数据流：** 用户操作 → 更新 `state` → 调用 `ui` 的 `render*` 重新渲染 → 页面即时反馈。

## 🎨 双色主题

所有颜色写成 `var(--xxx)`，切换时只改 `body[data-theme]`，浏览器自动换肤；偏好存入 `localStorage`。

## 📚 团队学习文档

👉 **[项目文档.md](./项目文档.md)** —— 一份双目标文档：
1. 了解项目风格与整体架构（分层、数据流、各文件职责、设计风格解析）；
2. 面向零基础团队，从 0 学习 HTML / CSS / JS（结合本项目的真实代码讲解 + 动手练习）。

建议先通读文档「第五部分」打基础，再回到「第二、三部分」对照真实代码理解架构，最后用「动手练习」上手机改。

## 🤝 扩展指引

- **加诗词**：在 `data.js` 的 `POEMS` 追加对象，其余逻辑自动适配。
- **加模块**：`index.html` 加 `nav-item` → `state.js` 的 `VIEWS` 登记 → `ui.js` 的 `HERO_IMAGES` 登记 → `getDisplayedPoems()` 加分支。
- **换肤**：在 `variables.css` 加第三套变量值，扩展 `state.js` 的 `THEMES`。
- **接后端**：把 `state.js` 的 `localStorage` 读写替换为 `fetch` 调用即可平滑升级。

## 📄 说明

内容版权归原作者及原出版方所有，本站点仅作非营利性整理与展示，仅供学习与鉴赏之用。
