import type { ReactNode } from "react";

/**
 * 六屏共用的 Section 骨架：左侧标题 / eyebrow + 右侧 mono metadata + 统一分节留白。
 *
 * 六屏的节奏差异靠内容撑开，不靠不同的骨架 —— 所以骨架只有这一份。
 *
 * Narrative Density Pass：新增一个可选的 `lead` 插槽（标题正下方的解释段）。
 * 首次接触项目的人需要先读到「这一屏在讲什么」，再进入图形化内容；
 * 插槽本身只是一段正文，不改变任何既有布局。
 */

/** 常规分节留白：<768 → 24/60/76　768–1279 → 52/76/92　≥1280 → 72/88/104 */
const PAD_DEFAULT =
  "px-6 pt-[60px] pb-[76px] md:px-[52px] md:pt-[76px] md:pb-[92px] xl:px-[72px] xl:pt-[88px] xl:pb-[104px]";

/** REFLECTION 是留白高潮：<768 → 24/64/72　768–1023 → 52/88/96　≥1024 → 72/120/136 */
const PAD_REFLECTION =
  "px-6 pt-[64px] pb-[72px] md:px-[52px] md:pt-[88px] md:pb-[96px] lg:px-[72px] lg:pt-[120px] lg:pb-[136px]";

export default function SectionShell({
  left,
  meta,
  lead,
  variant = "default",
  children,
}: {
  left: ReactNode;
  meta: string;
  /** 标题下的解释段（可选）。与 01 屏 HERO.lead 同一套字号与行距。 */
  lead?: string;
  variant?: "default" | "reflection";
  children: ReactNode;
}) {
  return (
    <section
      className={variant === "reflection" ? PAD_REFLECTION : PAD_DEFAULT}
    >
      {(left || meta) && <div className="flex items-start justify-between gap-10 max-lg:flex-col max-lg:gap-3.5">
        {left}
        <p className="cs-eyebrow lg:pt-[13px] lg:whitespace-nowrap">{meta}</p>
      </div>}
      {lead && (
        <p className="mt-7 max-w-[820px] text-[15.5px] leading-[1.82] text-ink/65 md:mt-9 md:text-[17px]">
          {lead}
        </p>
      )}
      {children}
    </section>
  );
}
