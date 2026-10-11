import HandIllustration from "@/components/HandIllustration";
import { SHOTS, SOLUTION } from "@/data/legaltrace";
import Reveal from "./Reveal";
import Shot from "./Shot";

/**
 * 03 / SOLUTION
 *
 * 六屏里真实产品截图占比最高、解释性文字最少的一屏。
 *
 * 关于列宽：设计稿给的是 1.72 : 1，那是基于「占位框 1.647 / 0.69」两种比例算出来的。
 * 真实素材两张都是约 2:1 的横版截图，按 1.065 : 1 分栏才能让两张卡等高
 * （左侧 2.023、右侧 1.900，比值 1.065）—— 既保留「左为主端」的意图，
 * 也不需要裁掉任何截图内容。
 */
export default function Solution() {
  return (
    <>
      <div className="relative mt-12 grid grid-cols-[minmax(0,1.065fr)_minmax(0,1fr)] items-start gap-10 max-lg:grid-cols-1 lg:gap-[100px]">
        {/* ── 左：Web 工作台 ── */}
        <div>
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-[17px] font-extrabold tracking-[-0.015em] lg:whitespace-nowrap">
              {SOLUTION.web.name}
            </p>
            <p className="cs-eyebrow">{SOLUTION.web.meta}</p>
          </div>
          <Shot
            shot={SHOTS.workbench}
            className="h-auto w-full rotate-[-0.4deg] max-lg:rotate-0"
          />
        </div>

        {/* ── 右：网页核查助手（完整截图，保留中国执行信息公开网的真实上下文） ── */}
        <div>
          <div className="mb-3.5 flex flex-wrap items-baseline justify-between gap-4">
            <p className="text-[17px] font-extrabold tracking-[-0.015em]">
              {SOLUTION.helper.name}
            </p>
          </div>
          <p className="cs-eyebrow mb-3.5">{SOLUTION.helper.meta}</p>
          <Shot
            shot={SHOTS.extension}
            className="h-auto w-full rotate-[0.6deg] max-lg:rotate-0"
          />
        </div>

        {/* 黄色手势 #2（全页 3 次中的第 2 次）：browser → workspace
            ≥1024 时列间距留出 100px 的真实中缝，手势与箭头正好落在缝里，不压任何产品内容。
            <1024 时手势改为文档流内独立一行：手块显式给高（59px 箭头 + 绝对定位的手掌向下
            约 79px），否则手掌会溢出容器、压到下方的「证据留痕 → 工作台复核」分隔线。 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[44%] z-[6] w-[130px] -translate-x-1/2 rotate-[-11deg] max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:mx-auto max-lg:h-[138px] max-lg:translate-x-0 max-lg:rotate-[-4deg]"
        >
          <svg
            viewBox="0 0 186 84"
            fill="none"
            className="h-[59px] w-[130px]"
            aria-hidden="true"
          >
            <path
              d="M178 24 C138 4 74 8 26 44"
              stroke="#FFD02C"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M44 24 L20 46 L54 54"
              stroke="#FFD02C"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="absolute left-1/2 top-[46px] block w-[66px] -translate-x-1/2 rotate-[26deg]">
            <HandIllustration width={200} className="h-auto w-full" />
          </span>
        </div>
      </div>

      {/* ── 把两端扣成一次接力（同时也是「两端之间的关系」的那句话） ── */}
      <div className="mt-[38px] flex items-center gap-[22px]">
        <hr className="h-px flex-1 border-0 bg-ink/10" />
        <span className="font-mono text-[9.5px] uppercase tracking-[0.32em] text-ink/45 md:whitespace-nowrap">
          {SOLUTION.handLabel}
        </span>
        <hr className="h-px flex-1 border-0 bg-ink/10" />
      </div>

      {/* ── 完整 workflow：一条连续路径 ── */}
      <div className="mt-16 border-y border-ink/[0.22] py-[34px]">
        <div className="grid grid-cols-7 max-lg:grid-cols-2 max-lg:gap-x-0 max-lg:gap-y-[18px]">
          {SOLUTION.workflow.map((t, i) => (
            <div key={t} className="relative pr-[18px]">
              <span className="font-mono text-[9.5px] tracking-[0.22em] text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2.5 font-mono text-[13.5px] font-bold tracking-[0.01em] max-md:text-[12px]">
                {t}
              </p>
              {i < SOLUTION.workflow.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute right-[7px] top-[7px] hidden h-px w-[22px] bg-ink/[0.22] lg:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <Reveal>
        <p className="mt-[52px] max-w-[1010px] text-[21px] font-extrabold leading-[1.4] tracking-[-0.028em] md:text-[31px]">
          {SOLUTION.close.before}
          <em className="not-italic text-electric">{SOLUTION.close.em}</em>
          {SOLUTION.close.after}
        </p>
      </Reveal>
    </>
  );
}
