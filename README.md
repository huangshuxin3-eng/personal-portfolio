# Digital stationery · 第一阶段

独立静态视觉稿；不覆盖原橙色作品集或 LegalTrace 产品。

参考：用户提供的 reference_reel_zoom_1.jpg、reference_reel_zoom_2.jpg，以及 2026-10-11 003841 屏幕录制。

本阶段：CV 聚焦首屏、可编辑 SVG 文件夹、五个景深背景文件夹、颗粒渐变、标题贴纸、原创手势提示与响应式。切换和打开动效留到视觉确认之后，当前没有假冒可操作的控件。

轮廓校准：可见文件夹约 1.33:1，前封面、三层纸张和窄侧边独立叠放；标题与文件夹作为连续构图排布。近景模糊 1.5–2px，中景 4–5px，远景 7–9px。保留已确认的颗粒强度及 Bricolage Grotesque 字体。

视觉检查覆盖 1440×900、390×844、610×604、936×604、360×640；确认无横向溢出，说明不覆盖文件夹，手势及页脚完整可见。截图在 review/。verify.mjs 的预览 URL、Playwright 模块和浏览器位置均由命令参数传入，不属于网站部署资源。

源文件：dist/index.html、dist/style.css、dist/app.js。三个文件夹的配色与后续路由已在 folders 数据中定义。所有资源引用可部署，不依赖本机路径或端口。字体使用 Google Fonts，离线有系统字体回退。

后续：FolderCarousel 的拖动、滚轮、键盘和触控；点击展开；/cv、/portfolio、/demo。现有真实简历可复用；参考录屏不作为工作台 Demo。
