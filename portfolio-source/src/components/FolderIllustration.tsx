"use client";

import { useId } from "react";

export interface FolderIllustrationProps {
  frontFrom: string;
  frontTo: string;
  back: string;
  edge: string;
  paper?: string;
  width?: number;
  className?: string;
  grain?: number;
}

const VB = 560;

/**
 * Y2K 文件夹插画（参考视频还原）。
 *
 * 图层自下而上：
 *   1. 背板：右上角露出的深色圆角块
 *   2. 白纸：带一排黑色竖线短划
 *   3. 右侧楔形：细长深色三角
 *   4. 前封面：倾斜四边形 + 左上角口袋折角
 *   5. 颗粒：左下密 → 右上疏（feTurbulence 烘焙进渐变）
 */
export default function FolderIllustration({
  frontFrom,
  frontTo,
  back,
  edge,
  paper = "#FFFFFF",
  width = 560,
  className = "",
  grain = 1,
}: FolderIllustrationProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gFront = `gf${uid}`;
  const gPaper = `gp${uid}`;
  const fGrain = `fg${uid}`;
  const fGrainFine = `fgf${uid}`;
  const fGrainSoft = `fgs${uid}`;
  const clipFront = `cf${uid}`;
  const clipPaper = `cp${uid}`;
  const maskFront = `mf${uid}`;

  /** 前封面轮廓：倾斜四边形，左上角带口袋折角 */
  const FRONT = `M92 250
    L92 316
    L106 500
    L438 500
    L414 268
    C412 258 404 251 394 251
    L268 246
    C260 245 254 240 253 232
    L248 208
    C246 198 237 191 227 191
    L144 195
    C112 197 92 220 92 250 Z`;

  return (
    <svg
      width={width}
      height={width}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* 前封面渐变：左下极深 → 右上浅 */}
        <linearGradient id={gFront} x1="0.05" y1="1" x2="0.82" y2="0.02">
          <stop offset="0%" stopColor={frontFrom} />
          <stop offset="45%" stopColor={frontFrom} />
          <stop offset="86%" stopColor={frontTo} />
          <stop offset="100%" stopColor={frontTo} />
        </linearGradient>

        <linearGradient id={gPaper} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0ECE7" />
        </linearGradient>

        {/* 颗粒纹理源：高对比黑白噪点，alpha 由均匀值提供 */}
        <filter id={fGrain} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.13"
            numOctaves="4"
            stitchTiles="stitch"
            result="t"
          />
          {/* 拉高对比：噪声 → 纯黑白斑点 */}
          <feComponentTransfer in="t" result="hi">
            <feFuncR type="discrete" tableValues="0 0 0 0.5 1 1 1" />
            <feFuncG type="discrete" tableValues="0 0 0 0.5 1 1 1" />
            <feFuncB type="discrete" tableValues="0 0 0 0.5 1 1 1" />
            <feFuncA type="linear" slope="0" intercept="0.45" />
          </feComponentTransfer>
        </filter>

        {/* 细密颗粒：高对比小颗粒 */}
        <filter id={fGrainFine} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="2"
            stitchTiles="stitch"
            result="t"
          />
          <feComponentTransfer in="t" result="hi">
            <feFuncR type="discrete" tableValues="0 0 0 0.5 1 1" />
            <feFuncG type="discrete" tableValues="0 0 0 0.5 1 1" />
            <feFuncB type="discrete" tableValues="0 0 0 0.5 1 1" />
            <feFuncA type="linear" slope="0" intercept="0.2" />
          </feComponentTransfer>
        </filter>

        {/* 柔和颗粒（用于背景小文件夹） */}
        <filter id={fGrainSoft} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
            result="n"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>

        <clipPath id={clipFront}>
          <path d={FRONT} />
        </clipPath>

        <clipPath id={clipPaper}>
          <path d="M262 240 L400 234 L412 282 L272 288 Z" />
        </clipPath>

        {/* 颗粒强度遮罩：左下浓 → 右上淡 */}
        <linearGradient id={maskFront} x1="0" y1="1" x2="0.9" y2="0.1">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.3" />
        </linearGradient>
        <mask id={`m-${maskFront}`}>
          <rect x="0" y="0" width={VB} height={VB} fill={`url(#${maskFront})`} />
        </mask>
      </defs>

      {/* ===== 1. 背板：右上露出圆角一角 ===== */}
      <path
        d="M196 216
           L374 208
           C388 208 398 217 399 231
           L414 320
           L214 328 Z"
        fill={back}
      />

      {/* ===== 2. 白纸 + 竖线短划（位于前封面之下，仅从上方露出） ===== */}
      <g clipPath={`url(#${clipPaper})`}>
        <rect x="110" y="240" width="340" height="140" fill={`url(#${gPaper})`} />
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1={282 + i * 17}
            y1="250"
            x2={280 + i * 17}
            y2="278"
            stroke="#1A1A1A"
            strokeWidth="2.6"
            opacity="0.7"
          />
        ))}
      </g>

      {/* ===== 3. 右侧楔形 ===== */}
      <path d="M410 250 L456 247 L460 494 L438 500 Z" fill={edge} />

      {/* ===== 4. 前封面（渐变 + 双层颗粒） ===== */}
      <g clipPath={`url(#${clipFront})`}>
        <g mask={`url(#m-${maskFront})`}>
          {/* 底色渐变 */}
          <rect
            x="80"
            y="180"
            width="380"
            height="340"
            fill={`url(#${gFront})`}
            opacity={grain}
          />
          {/* 粗颗粒层：砂纸质感 */}
          <rect
            x="80"
            y="180"
            width="380"
            height="340"
            filter={`url(#${fGrain})`}
            opacity={0.6 * grain}
            style={{ mixBlendMode: "overlay" }}
          />
          {/* 细密颗粒层：胶印网点 */}
          <rect
            x="80"
            y="180"
            width="380"
            height="340"
            filter={`url(#${fGrainFine})`}
            opacity={0.3 * grain}
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
      </g>

      {/* 前封面上缘高光（仅折角一段） */}
      <path
        d="M98 244 C118 214 118 199 148 197 L222 193"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}
