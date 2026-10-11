# Homepage Motion Refinement Slice 1 — accepted checkpoint

2026-10-11：用户已人工验收中央文件夹擦切和取消拖动回弹。本文是本阶段最终状态；早期 final-review.md 与 cancel-fix/修复说明.md 中的“等待验收”属于历史记录，当前以本文为准。

基准 commit：3e8ddfa432aef12c6e72d0acb88e175d1b09a14f。

## 已验收的产品修改

- dist/app.js：380ms 不透明横向擦切，主体位移9%，420ms取消回弹；缓动 cubic-bezier(.2,.88,.22,1)。拖动持续控制裁切，结束清理裁切、位移与层级。
- dist/app.js 的取消分支：当前文件夹回弹终点使用 rest.from，待进入文件夹仍使用 rest.incoming 隐藏。修复“取消拖动将当前文件夹裁空，直到reset后突然恢复”的问题。
- dist/hand-guide.js：沿用大手视觉与首次引导，根据文件夹事件的实际duration、方向和拖动progress联动。
- build.mjs：本阶段六个静态资源的验证及构建输出目录。

此次 Git checkpoint 收尾没有修改产品源码、参数、SVG、布局、贴纸或背景；只核对、记录、整理提交范围。

## 提交前检查

| 检查 | 状态 |
|---|---|
| 本次 allowJs/checkJs 类型检查 | 通过，退出码0 |
| 本次 node build.mjs：语法及六个资源完整性 | 通过，退出码0 |
| 本次 git diff --check | 通过 |
| 已完成的 Desktop 定向回归：同输入取消、反向拖动、正反切换、连续输入锁、双向提交、大手退出、无残留动画或裁切 | 通过；checkpoint 收尾未重复录屏或扩大覆盖 |
| 用户人工视觉验收 | 通过，用户明确确认 |
| 此前 verify.mjs 全量运行 | 75秒超时：结果写出后清理退出未完成，不能标为整套通过；本次未重跑 |
| 此前 Desktop 与 checkpoint 静态像素对比 | 有111133/1296000像素差异（最大RGB差值>4），未完成原因定位；不宣称像素一致 |
| 本次移动端、跨浏览器或真机扩大测试 | 未运行 |

没有将历史超时或对比差异改写为通过。用户已对当前视觉与回弹作出人工验收，这一确认不等同于全量自动测试通过。

## 保留的必要脚本与文字记录

- verify.mjs：现有擦切与相关交互检查；保留其历史超时限制，运行时应设外部总时限。
- record.mjs：现有Desktop1440×900录屏脚本。
- cancel-fix/targeted.mjs：本次取消回弹的有限Desktop定向复现与回归。
- final-review.md：早期收尾结果与风险历史。
- cancel-fix/修复说明.md：根因、最小修复与关键状态。

不提交录屏、截图、构建副本、临时探针、日志、运行时结果或修复前源码快照；这些仍留在本地并由.gitignore排除。必要源资源dist/retro-hand.svg已在基准中，不受媒体忽略影响。

## 可重跑的命令（项目目录下）

```powershell
node '..\..\nonlit-workbench\node_modules\typescript\bin\tsc' --allowJs --checkJs --noEmit --target ES2022 --module ES2022 --lib DOM,DOM.Iterable,ES2022 dist/app.js dist/hand-guide.js
node build.mjs
$env:PLAYWRIGHT_BROWSERS_PATH = (Resolve-Path 'review/interaction-slice-1/tools').Path
node review/homepage-motion-refinement-1/cancel-fix/targeted.mjs after
```

测试脚本沿用本机Playwright与Chrome路径，录屏工具不是生产依赖。targeted.mjs的before模式仅供本地历史复现，需要未提交的cancel-fix/app-before.js；Git checkout的常规回归使用after模式。不要为复跑而将历史错误恢复到生产文件。

## 收尾边界

仅创建本地commit，不push、不部署。提交后暂停；下一阶段等待用户开始顶部蓝色贴纸的黄色文字滚动换字，不继续中央文件夹非必要微调。
