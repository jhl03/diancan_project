# GitHub Pages 发布说明

当前交付包已经整理为可直接发布的静态原型目录。

## 包内文件

- `index.html`
- `prototype.html`
- `C端开票-20260807-105717-最终版.html`
- `proto.css`
- `codex-edit.css`
- `mini-app-supplier-20260729-172735.css`
- `proto.js`
- `codex-edit.js`
- `mini-app-supplier-20260729-172735.js`
- `供应商端状态机.png`
- `.nojekyll`

## 推荐发布方式

1. 在 GitHub 新建一个仓库。
2. 把当前交付包目录中的全部文件上传到仓库根目录。
3. 打开仓库 `Settings`。
4. 进入 `Pages`。
5. 在 `Build and deployment` 中：
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main`
   - 目录选择 `/root`
6. 保存并等待 GitHub 发布完成。

## 发布后的访问方式

- 根路径：`https://你的用户名.github.io/仓库名/`
- 原型页：`https://你的用户名.github.io/仓库名/prototype.html`

由于当前交付包中的 `index.html` 已直接使用原型页内容，所以访问根路径时就能直接进入页面并使用目录跳转、Tab 切换、弹窗和文件预览能力。

## 注意事项

- 请整包上传，不要只上传单个 HTML。
- `.nojekyll` 已提供，避免 GitHub Pages 因 Jekyll 规则忽略部分静态资源。
- 如果你后续继续修改当前原型，需要重新生成新的交付包，再覆盖上传到仓库。
