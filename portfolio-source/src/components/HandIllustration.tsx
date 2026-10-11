"use client";

import { useId } from "react";

/**
 * 参考视频底部的复古卡通手势插画。
 * 黄色填充 + 黑色粗描边 + 网点（halftone）阴影
 */
export default function HandIllustration({
  width = 200,
  className = "",
  flip = false,
}: {
  width?: number;
  className?: string;
  flip?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gHand = `gh${uid}`;
  const dots = `dt${uid}`;

  return (
    <svg
      width={width}
      height={Math.round(width * 1.2)}
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gHand} x1="0.1" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FFE27A" />
          <stop offset="55%" stopColor="#FFC93C" />
          <stop offset="100%" stopColor="#EFA51C" />
        </linearGradient>
        <pattern id={dots} width="6.5" height="6.5" patternUnits="userSpaceOnUse">
          <circle cx="3.25" cy="3.25" r="1.4" fill="#1A1A1A" opacity="0.5" />
        </pattern>
      </defs>

      {/* 手掌 + 食指（整体轮廓，描边+填充） */}
      <g
        stroke="#12100E"
        strokeWidth="7"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={`url(#${gHand})`}
      >
        <path
          d="M96 232
             C74 232 60 220 58 198
             L56 150
             C55 140 64 134 72 138
             C78 141 81 147 82 154
             L84 118
             C85 104 98 96 109 102
             C116 106 119 113 119 121
             L121 92
             C122 78 138 70 149 78
             C156 83 158 92 157 100
             L158 128
             C160 118 174 116 180 126
             C183 131 184 137 183 143
             L182 178
             C180 210 166 232 138 232 Z"
        />
        <path
          d="M56 162 C40 160 30 172 36 184 C40 192 50 196 58 194"
        />
      </g>

      {/* 网点阴影 */}
      <ellipse
        cx="122"
        cy="196"
        rx="32"
        ry="20"
        fill={`url(#${dots})`}
        opacity="0.55"
      />
    </svg>
  );
}
