# Global Music Frontier｜全球音乐前沿观察

这是一个无需安装依赖的静态杂志网站，可在本地运行，也可直接部署到 GitHub Pages。

## 本地预览

推荐在本目录打开终端后运行：

```powershell
python -m http.server 8080
```

然后访问 `http://localhost:8080`。

也可以直接双击 `index.html`，但本地服务器方式更接近正式网站环境。

## 每周新增一期

1. 打开 `content/issues.js`。
2. 复制 `window.GMF_ISSUES` 数组中的一期对象，并粘贴到数组最前面。
3. 修改 `id`、日期、标题、卷首语和 `releases` 列表。
4. 写作中可以先把 `status` 设为 `draft`；完成后改成 `published`。
5. 刷新网页，新一期会自动出现在首页和搜索结果中。

每张唱片包含：音乐家、专辑名、国家、风格标签、发行日期、厂牌、短评、推荐曲目及试听链接。新增的风格标签会自动进入标签索引。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个公开仓库，例如 `global-music-frontier`。
2. 将本目录中的所有文件上传到仓库根目录。
3. 在仓库的 `Settings → Pages` 中，把发布来源设为 `Deploy from a branch`。
4. 选择 `main` 分支和根目录 `/ (root)`，保存。
5. GitHub 通常会生成形如 `https://你的用户名.github.io/global-music-frontier/` 的网址。

GitHub Pages 很适合这个首版：免费、容易维护、可绑定自定义域名。它本身不会自动接收 ChatGPT 每周生成的内容；当前可靠流程是让 ChatGPT 输出一期完整的数据对象，你审核后粘贴到 `content/issues.js`，再提交到 GitHub。
