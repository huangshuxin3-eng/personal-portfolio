# Digital stationery · 第一阶段

独立静态视觉稿；不覆盖原橙色作品集或 LegalTrace 产品。

参考：用户提供的 reference_reel_zoom_1.jpg、reference_reel_zoom_2.jpg，以及 2026-10-11 003841 屏幕录制。

本阶段：CV 聚焦首屏、可编辑 SVG 文件夹、五个景深背景文件夹、颗粒渐变、标题贴纸、原创手势提示与响应式。切换和打开动效留到视觉确认之后，当前没有假冒可操作的控件。

轮廓校准：可见文件夹约 1.33:1，前封面、三层纸张和窄侧边独立叠放；标题与文件夹作为连续构图排布。近景模糊 1.5–2px，中景 4–5px，远景 7–9px。保留已确认的颗粒强度及 Bricolage Grotesque 字体。

视觉检查覆盖 1440×900、390×844、610×604、936×604、360×640；确认无横向溢出，说明不覆盖文件夹，手势及页脚完整可见。截图在 review/。verify.mjs 的预览 URL、Playwright 模块和浏览器位置均由命令参数传入，不属于网站部署资源。

源文件：dist/index.html、dist/style.css、dist/app.js。三个文件夹的配色与后续路由已在 folders 数据中定义。所有资源引用可部署，不依赖本机路径或端口。字体使用 Google Fonts，离线有系统字体回退。

后续：FolderCarousel 的拖动、滚轮、键盘和触控；点击展开；/cv、/portfolio、/demo。现有真实简历可复用；参考录屏不作为工作台 Demo。

## V1 Integration Slice 1（当前统一构建）

上文为首页早期历史说明。当前发布基础仍是 dist/ 的已验收原生动态首页；作品集源码位于 portfolio-source/，复用 WorkBuddy 2026-10-11-00-47-08，原项目未修改。

新机器准备依赖：进入 portfolio-source/ 执行 npm ci；返回 folder-study/ 执行 node build.mjs。
本机本轮复用原有依赖安装的只读运行路径（忽略的 node_modules junction），未安装新动画库；源码与 lockfile 均在独立副本内，正常安装后无需 WorkBuddy 路径。CaseHero 继续使用其原有 motion 依赖；首页没有引入 React 或 motion。

最终发布目录：site/。本地预览：python -m http.server 4194 --bind 127.0.0.1 --directory site。
构建执行首页 JS checkJs、Next 编译与类型检查、静态导出、必要资产检查，并重新生成 site/。仅复制 dist/ 六项首页资源及导出的 portfolio/、_next/、legaltrace/；不会复制 Next 原首页、CV、Demo 或默认 404。

URL：/、/portfolio/、/portfolio/legaltrace/。主机需支持目录 index.html 和无尾斜杠目录跳转；不应把全部路径重写到首页 index.html。本轮未选定或配置线上平台。
图片位于 portfolio-source/public/legaltrace/，全局图片忽略规则已设置正式资源例外。原构建的字体文件及完整字体声明保存在 src/fonts/、src/app/fonts.css，不依赖构建时 Google Fonts 下载。首页原有异步字体请求保持原样。

所有作品集内部导航为普通 a 链接，返回原生首页不会使用 Next 客户端路由。页面仍加载 React 客户端代码以保留原有插画运动及 IntersectionObserver 显现。
首页点击：Portfolio 打开 /portfolio/；CV、Demo 仅显示未开放状态。鼠标移动超过 7px、取消拖动、索引变化及动画锁期间不激活入口；键盘 Enter/Space 支持入口操作。

恢复快照：review/integration-slice-1/baseline/ 保存修改前首页 dist/ 和 Git 差异，本地忽略、不提交。
必要回归脚本：review/integration-slice-1/desktop-review.mjs（真实最终 site/ HTTP 服务、Desktop1440×900）；结果、截图和录屏同目录，媒体不入 Git。
