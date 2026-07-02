# GitHub Pages 发布说明

当前交付包目录已经可以直接作为 GitHub Pages 静态站点内容使用。

## 目录内容

- `index.html`
- `prd.html`
- `prototype.html`
- `.nojekyll`

## 发布方式

### 方式一：新建单独仓库发布

适合：你希望拿到一个干净的访问地址，专门放这次 PRD 和原型。

1. 在 GitHub 新建一个仓库
2. 把当前 `交付包` 目录里的全部文件上传到仓库根目录
3. 打开仓库 `Settings`
4. 进入 `Pages`
5. 在 `Build and deployment` 中：
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main`，目录选择 `/root`
6. 保存后等待发布

发布完成后，访问地址通常会是：

`https://你的用户名.github.io/仓库名/`

其中：

- `PRD`：`https://你的用户名.github.io/仓库名/prd.html`
- `原型`：`https://你的用户名.github.io/仓库名/prototype.html`
- `统一入口`：`https://你的用户名.github.io/仓库名/`

### 方式二：用户主页仓库发布

适合：你想要更短的访问地址。

1. 仓库名创建为：

`你的用户名.github.io`

2. 上传当前 `交付包` 目录中的全部文件到仓库根目录
3. 在仓库 `Settings -> Pages` 中发布 `main` 分支 `/root`

发布完成后，访问地址通常会是：

- `PRD`：`https://你的用户名.github.io/prd.html`
- `原型`：`https://你的用户名.github.io/prototype.html`
- `统一入口`：`https://你的用户名.github.io/`

## 注意事项

- 这套文件已经是静态页面，不需要额外构建。
- `.nojekyll` 已提供，避免 GitHub Pages 按 Jekyll 规则处理目录。
- 如果你后续修改了 PRD 或原型，需要重新刷新交付包，再覆盖上传到仓库。
