# 中央文件夹动效收尾（等待人工视觉验收）

本次收尾未修改任何产品动画或验证脚本，没有新增取证脚本、采样策略或测试覆盖。只运行现有门禁和 Desktop 录屏，保存日志与录屏抽帧。

## 本轮产品修改（相对本轮 checkpoint / 当前 Git 基准）

- dist/app.js：640ms 横向淡出轮播改为 380ms 不透明裁切擦切；位移 9%；拖动按 .42 容器宽归一化，释放回弹 420ms；结束清理 transform、clip-path、z-index。
- dist/hand-guide.js：大手读取切换事件的实际 duration，380ms 为 fallback；拖动跟随 progress 和 direction，DRAG_SWEEP=1.35；保留大手既有造型、尺寸和首次引导。
- build.mjs：构建输出改为本轮 review/homepage-motion-refinement-1/build。
- review/homepage-motion-refinement-1/：此前已有 checkpoint、验证和取证工程。本次仅新增最终执行日志、录像及录像抽帧、本说明，未继续扩展该工程。

index.html、style.css、hand-guide.css、retro-hand.svg 未修改。上述产品修改在本次收尾开始前已经存在，本次没有为了测试通过改动切换方案。

## 动画参数

主切换 380ms；回弹 420ms；主体位移 stage.clientWidth × .09；缓动 cubic-bezier(.2,.88,.22,1)。在 1440×900 中实际容器约 687.69px，9% 位移约 61.9px。移动幅度参数作用于 SVG 容器，不等同于可见 path 宽度。

不使用主体 opacity 交叉淡化；新旧片由方向相反的 inset clip-path 裁切。旧片裁切补偿其位移，避免裁切边缘错开；新片在上层。文件夹 SVG 造型和材质不变。标题文字仍保留原来 120ms 淡出 / 220ms 淡入，本轮没有声称已解决其短暂无字状态。

## 门禁结果

| 项目 | 状态 | 证据 / 说明 |
|---|---|---|
| 类型检查 | 通过 | typecheck-final.log，退出码 0 |
| 构建 | 通过 | build-final.log，退出码 0，六个资源 |
| Desktop 核心区域 25 个既有采样 | 通过 | verify-final.log；380ms 各步页面底色像素 0 |
| Desktop 裁切/位移残留清理 | 通过 | verify-final.log |
| Desktop 连续按键锁、边界、拖动回弹与反向拖动 | 通过 | verify-final.log |
| Desktop JavaScript 错误 | 通过 | 日志零错误；录屏 errors=[] |
| 现有 140 帧实时无底色闪白 | 已有结果，未重新运行 | probe/realtime-after.json；不追加采样策略 |
| 移动端脚本 | 唯一一次限时运行；日志中的项目通过，整体运行超时 | 限制 75 秒，最后输出 mobile: no JavaScript errors across the whole interaction set；results.json 已写入，但进程未退出 |
| 整套 verify.mjs 正常完成退出 | 超时 / 未完成 | 75 秒后终止，不重试；不能标成整体通过 |
| Desktop 与 checkpoint 静态一致性 | 不通过“一致”要求；未作为断言失败 | 日志 n=111133 / total=1296000，mx=208；约 8.58% 像素最大 RGB 差值 >4。脚本只打印该比较，没有断言；不得解释成通过 |
| Desktop 最终代码完整录屏 | 通过 | record-final.log，进程退出码 0；最终 CV / 01 / 03，clips 全为 '-'，零页面错误 |
| 本次扩大 reduced-motion、跨浏览器、真机测试 | 未运行 | 按收尾要求不扩大覆盖，不能借旧轮次结果宣称本轮通过 |
| 用户人工视觉验收 | 未完成 | 等待用户查看录屏与关键帧 |

## 单次限时定位的卡点

verify.mjs 运行到最后一个 Mobile 项目，日志已输出其零 JavaScript 错误。results.json 与最后日志同时间写入，说明已经越过移动端交互断言并写出结果；随后 75 秒总时限到达，Node 进程仍未退出，被终止。

卡在测试结束/资源清理阶段（finally 中 browser.close()/server.close() 的正常退出未完成）；本次没有进一步区分具体是哪一个 await，也没有继续尝试新的定位脚本。不能将这一超时视为产品动画失败，也不能将整套执行标成通过。

此外，MP4 转码尝试没有完成，已中断；本次直接交付已正常保存的原始 WebM。原始录像记录成功，不受转码未完成影响。

## 视频与关键帧

- recordings/motion-desktop.webm：最终代码的真实 Chrome Desktop 1440×900 录屏。含首次大手引导、CV→Portfolio→Demo、反向回 CV、鼠标中途松手与反向拖动、快速连续按键；非合成动画。现有录屏脚本没有独立安排鼠标拖动提交到下一文件夹，因此这项没有额外宣称通过。
- recordings/final-state.json：最终 CV、01 / 03、裁切已清理，错误列表为空。
- recordings/switch-3.50.png、switch-3.65.png、switch-3.80.png：从这段最终原始录像抽出的擦切关键画面；时间是录像绝对时间，不是单次动画归一化进度。
- probe/switch-before-after.jpg：此前已有的修改前（上）/修改后（下）切换联系表。用于视觉趋势对比，不冒充本次新录屏帧。

## 剩余风险与暂停范围

1. Desktop 静态比较存在可见规模的差异，原因未继续定位，需人工判定；不能声称静态画面逐像素不变。
2. 现有对比帧显示标题切换中可能出现只有蓝色底的短暂状态，这是既有标题淡入淡出，不在本次擦切收尾中继续修改。
3. 当前无闪白结果来自核心区域及既有实时采样，不等于证明所有边缘、全部浏览器和所有帧完全无穿透。裁切边缘的视觉质量仍需人工观看。
4. Mobile 日志项目完成但清理退出超时；不继续排查，也不据此改动画。
5. 录屏中的快速按键受现有锁控制，并不意味着每次键入都切换一次。

已暂停，不再追加验证或动画调整。未 commit、push 或部署，等待用户视觉验收。
