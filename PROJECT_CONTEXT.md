# Doctor Project Context

## 项目定位

`Doctor` 是一个医学学习/科普类静态网站项目，当前没有前端构建流程，主要由原生 `HTML`、`CSS`、`JavaScript` 文件组成。

项目面向医学知识学习、体检报告理解、疾病/药物速查等场景。整体结构是“总入口 + 多个独立主题模块”。

## 目录分类

快速判断运行文件与辅助文件见 `README.md`。网站入口、`auth.js` 和主题目录保留原路径；公共资源集中到 `assets/`，辅助工具放在 `tools/`，规划文档放在 `docs/plans/`，本地素材放在 `素材/`。

## 入口与公共资源

- `index.html`：网站总入口，展示各医学主题入口卡片。
- `account.html`：旧账号链接兼容页，跳转回首页。
- `auth.js`：全局认证、顶部导航、Supabase REST API 调用等公共逻辑。
- `assets/css/subject-base.css`：解剖学、生理学、病理学、药理学、体检报告共用的基础样式。
- `assets/css/subject-theme.css`、`assets/css/chapter-accents.css`、`assets/css/quiz.css`：公共主题、章节和测验样式。
- `assets/js/site-navigation.js`、`assets/js/quiz-engine.js`：公共导航和测验逻辑。
- `tools/preview.html`：手机尺寸预览工具，默认打开 `../index.html`。
- `CNAME`：GitHub Pages 自定义域名配置。
- `.nojekyll`：GitHub Pages 静态托管标记。
- `.gitignore`：本地忽略规则。
- `docs/plans/`：按主题归档的设计规划。
- `素材/`：宣传图、贴纸素材与临时文件，已忽略。
- `tools/admin.html`：本地后台管理页，已忽略，不提交远程。
- `tools/push.bat`：旧 Windows 推送脚本，仍含原电脑目录，已忽略，不提交远程；不要直接用于当前项目。
- `.venv/`：本地 Python 虚拟环境，已忽略。
- `小红书内容/`：本地内容草稿目录，已忽略，不提交远程。

## 主题模块结构

每个主题目录一般采用类似结构：

- `index.html`：该主题首页。
- `chapter*.html`：章节内容页。
- `style.css`：该主题样式。
- `nav.js`：该主题内导航。
- 设计规划统一存放于 `docs/plans/<主题目录>/设计规划.txt`，不参与页面运行。
- 额外工具页：如速查、风险评估、症状检查、用药指南等。

当前主要模块：

- `解剖学网页/`：解剖学章节、术语、日常场景、对比、身体信号等。
- `生理学网页/`：生理学章节、机制、场景、术语等。
- `病理学网页/`：病理学章节、疾病图谱、用药逻辑、术语等。
- `药理学网页/`：药理学章节、药物索引、受体图谱、相互作用指南等。
- `心血管网页/`：心血管章节、症状检查、风险评分、用药指南等。
- `消化网页/`：消化系统章节、症状检查、肠镜指南、消化药物等。
- `呼吸网页/`：呼吸系统章节、咳嗽检查、肺功能、结节指南等。
- `代谢网页/`：代谢章节、血糖监测、代谢指标、用药指南等。
- `体检报告网页/`：体检指标解读、异常信号、复查建议等。
- `脑血管网页/`：脑血管章节、卒中卡片、风险清单、康复时间线等。
- `身体说明书网页/`：面向普通人的身体速查工具集合。

## 公共模式

- 页面语言以中文为主。
- 多数主题是静态页面，不依赖框架。
- 主题目录内的 `nav.js` 会动态插入顶部导航、侧边栏或返回入口。
- 根目录 `auth.js` 提供跨页面公共能力，子目录页面如需引用通常要设置相对路径上下文。
- `assets/js/site-navigation.js` 统一补充学科导航、首页底部跳转与两行页脚（学科名 + 健康教育提示）。
- 解剖学、生理学、病理学、药理学、体检报告的通用样式统一维护在`assets/css/subject-base.css`；其余主题仍保持各自的专用样式。
- 主页通用响应式规则统一采用两档：`max-width: 900px` 处理布局切换，`max-width: 560px` 处理手机阅读、卡片和按钮；章节插图、测验等专用组件可保留必要的独立断点。

## 常用操作

查看状态：

```powershell
git status --short
```

查看项目文件：

```powershell
rg --files
```

本地预览静态页面：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

然后访问 `http://127.0.0.1:8000/`；手机预览入口是 `/tools/preview.html`。Windows 可将 `python3` 换成 `py`。

提交前检查改动：

```powershell
git diff --stat
git diff
```

## 协作建议

- 做单个主题页面时，先读该目录下的 `index.html`、`style.css`、`nav.js` 和目标页面。
- 做全站入口或认证导航时，重点读 `index.html`、`auth.js`、`account.html`。
- 做内容新增时，优先复用同目录已有页面结构和 CSS class。
- 做视觉调整时，先限定在目标主题目录，避免无意影响全站。
- 涉及登录、会员、Supabase、全局导航时要谨慎，因为 `auth.js` 是共享入口。
