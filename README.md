# Doctor · 医学学习网站

这是原生 HTML/CSS/JavaScript 静态网站，无需安装前端依赖或构建。根目录的 `index.html` 是网站总入口。

## 目录怎么分

| 位置 | 用途 | 网站运行是否需要 |
| --- | --- | --- |
| `index.html` | 网站总入口 | 需要 |
| `account.html` | 兼容旧账号链接，跳转回首页 | 保留 |
| `auth.js` | 全局登录、主题、导航与 Supabase 调用 | 需要，保留原路径 |
| `assets/css/` | 跨主题共享样式 | 需要 |
| `assets/js/` | 跨主题导航、测验引擎 | 需要 |
| 各个 `*网页/` 目录 | 主题页面、主题导航、专用样式和图片 | 需要，保留原路径 |
| `CNAME`、`.nojekyll` | GitHub Pages 域名与静态托管标记 | 托管配置，保留 |
| `tools/` | 手机预览、本地管理页、旧推送脚本 | 辅助工具 |
| `docs/plans/` | 各主题的设计规划，按原主题目录分组 | 辅助文档 |
| `素材/` | 宣传图、贴纸素材、临时文件 | 本地素材，已被 Git 忽略 |
| `小红书内容/`（如有） | 本地内容草稿 | 已被 Git 忽略，不提交或上传 |
| `.venv/` | 本地 Python 虚拟环境 | 辅助环境，已被 Git 忽略 |
| `README.md`、`PROJECT_CONTEXT.md`、`AGENTS.md` | 目录说明、项目背景、协作规则 | 辅助文档 |
| `.git/`、`.gitignore`、`.agents/`、`.claude/` | 版本管理和开发工具配置 | 开发使用，保留原位 |

主题目录中的 HTML、CSS、JS、SVG 和图片都属于网站资源，不能仅凭扩展名判断是否可移除。

## 公共资源

- `assets/css/subject-base.css`：解剖学、生理学、病理学、药理学、体检报告的基础样式。
- `assets/css/subject-theme.css`：公共主题样式。
- `assets/css/chapter-accents.css`：章节页面的补充样式。
- `assets/css/quiz.css`：测验样式。
- `assets/js/site-navigation.js`：学科导航、学习路径和页脚。
- `assets/js/quiz-engine.js`：测验题库与交互逻辑。

主题页使用 `../assets/css/...`、`../assets/js/...` 引用公共资源；登录脚本仍使用 `../auth.js`。不要移动主题文件夹，否则会改变现有网址和导航路径。

## 本地查看

在项目根目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

- 网站首页：<http://127.0.0.1:8000/>
- 手机尺寸预览：<http://127.0.0.1:8000/tools/preview.html>
- 本地管理页：<http://127.0.0.1:8000/tools/admin.html>（该文件已被 Git 忽略）。

Windows 如无 `python3` 命令，可使用 `py -m http.server 8000 --bind 127.0.0.1`。关闭预览服务用 `Ctrl+C`。

`tools/push.bat` 是保留的旧 Windows 脚本，仍指向原电脑目录，而且会执行 `git add`、`git commit` 和 `git push`；不能用于当前目录的日常预览。

## 后续文件放哪里

- 网站功能或内容：放到对应主题目录；多主题共用的样式、脚本放入 `assets/`。
- 设计规划：放到 `docs/plans/` 对应主题子目录。
- 开发预览工具：放到 `tools/`。
- 宣传图、贴纸、草稿：放到 `素材/`；本次素材保留在 `素材/小红书宣传图/` 和 `素材/贴纸作图/`。
- 本次发现的 Word 临时锁文件保留在 `素材/temp/`，不是正文文档。

`.gitignore` 仅控制 Git 提交，不能阻止本地 HTTP 服务或手动整目录上传包含这些文件。网站运行所需范围以表格为准，`素材/` 和本地管理工具不应作为网站内容上传。

详细模块说明见 [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md)，协作约定见 [AGENTS.md](AGENTS.md)。
