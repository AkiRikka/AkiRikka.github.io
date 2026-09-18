# Aki's blog

使用 [Hugo](https://gohugo.io/) 与 [Blowfish](https://blowfish.page/) 构建的个人博客。

## 本地预览

需要 Hugo 0.162.0 或更高版本；CI 当前固定使用 0.166.0。

```bash
git submodule update --init --recursive
hugo server --buildDrafts
```

生产构建：

```bash
hugo build --gc --minify --cleanDestinationDir
```

## 内容结构

文章按主题和页面包组织：

```text
content/
├── paper/<slug>/index.zh-cn.md
├── graphics/<slug>/index.zh-cn.md
├── acgn/<slug>/index.zh-cn.md
├── music/<slug>/index.zh-cn.md
├── travel/<slug>/index.zh-cn.md
└── other/<slug>/index.zh-cn.md
```

每篇文章使用一个 leaf bundle，Markdown 和图片放在同一个目录中。`slug` 使用稳定、可读的英文 kebab-case，例如 `physically-based-rendering`；日期由 front matter 管理，不再建议把 Unix 时间戳放进新目录名。旧目录不必重命名，以免破坏已有 URL。

## 新建文章

普通文章使用通用模板：

```bash
hugo new content --kind article graphics/ray-tracing-notes
```

论文阅读使用论文模板：

```bash
hugo new content --kind paper paper/attention-is-all-you-need
```

命令会创建 `<栏目>/<slug>/index.zh-cn.md`，并填入日期、草稿状态、摘要、标签以及写作提纲。将 `featured.jpg`、示意图等图片直接放进同一目录即可。

同一系列的文章不需要嵌套目录。在每篇文章的 front matter 中取消下面两行的注释：

```yaml
series: ["Physically Based Rendering"]
series_order: 1
```

Blowfish 会自动生成系列导航。发布前请补齐 `description` 和 `tags`，确认内容后再将 `draft` 改为 `false`。

## Zen Mode

文章默认进入 Zen Mode，读者通过文章标题下方的展开按钮或无障碍设置面板切换后，选择会保存在浏览器中。若要让普通模式成为首次访问时的默认值，将 `config/_default/params.toml` 中的 `article.zenModeDefault` 改为 `false`。

## 部署

推送到 `main` 后，GitHub Actions 会以固定 Hugo 版本构建站点并发布到 `gh-pages` 分支。Pull Request 只执行构建检查，不会部署。
