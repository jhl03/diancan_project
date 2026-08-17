C端开票 交付包

使用方式：
1. 上传当前交付包目录中的全部文件到 GitHub 仓库根目录。
2. 如果要通过网页直接访问，请在仓库 Settings -> Pages 中开启 GitHub Pages。
3. 发布后，直接访问仓库对应站点根路径即可打开首页；首页就是当前原型页。
4. `prototype.html` 与 `index.html` 内容一致，二选一打开即可。
5. 页面里的 Tab 切换、弹窗、文件预览、图片新窗口查看等交互依赖同目录下的 CSS、JS 和图片资源，请不要拆散目录结构。

目录说明：
- `index.html`：GitHub Pages 默认入口，已直接使用当前原型内容
- `prototype.html`：原型主文件
- `C端开票-20260807-105717-最终版.html`：保留原始命名版本
- `proto.css` / `codex-edit.css` / `mini-app-supplier-20260729-172735.css`：样式资源
- `proto.js` / `codex-edit.js` / `mini-app-supplier-20260729-172735.js`：交互脚本
- `供应商端状态机.png`：页面内引用的状态机图片资源

注意：
- GitHub 仓库源码浏览页不是完整交互运行环境；如需正常使用弹窗和页面脚本，请通过 GitHub Pages 地址访问。
- 如果你后续继续修改原型，需要重新覆盖交付包中的 `index.html`、`prototype.html` 和同目录依赖资源。
