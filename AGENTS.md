# AGENTS.md instructions for Doctor

## Communication

- 默认使用中文回复。
- 代码、命令、变量名、文件路径保持英文。
- 结论先行，简洁直接；发现风险或更好的做法要直接说明。

## Project Overview

- 这是一个医学学习类静态网站项目。
- 根目录提供总入口、账号页和全局鉴权/导航逻辑。
- 各医学主题目录是相对独立的静态网页模块，例如：
  - `解剖学网页/`
  - `生理学网页/`
  - `病理学网页/`
  - `药理学网页/`
  - `心血管网页/`
  - `消化网页/`
  - `呼吸网页/`
  - `代谢网页/`
  - `体检报告网页/`
  - `脑血管网页/`
  - `身体说明书网页/`
- 更详细的结构说明见 `PROJECT_CONTEXT.md`。

## Editing Rules

- 优先保持现有静态 HTML/CSS/JS 结构，不引入构建工具，除非用户明确要求。
- 修改某个主题模块时，优先只改该目录内的 `html`、`style.css`、`nav.js`。
- 多个主题重复模式明显时，可以同步修改，但要先说明影响范围。
- 不要随意改动 `auth.js`，它包含全局登录、主题、导航和 Supabase 相关逻辑。
- 不要提交或上传 `小红书内容/`，该目录是本地内容草稿。

## Git Rules

- 不自动 `git commit` 或 `git push`，除非用户明确要求。
- 提交前先展示将要提交的变更摘要。
- `commit message` 使用简洁英文。

## Red Lines

以下操作必须先问用户：

- 删除文件、目录或 git 历史。
- 修改 `.env`、密钥、token、证书、CI/CD 配置。
- `git push`、`git rebase`、`git reset --hard`、强制推送。
- 公开发布、生产部署、`npm publish` 等。
