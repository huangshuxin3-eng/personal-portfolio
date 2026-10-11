import HandIllustration from "@/components/HandIllustration";
import { REFLECTION } from "@/data/legaltrace";
import Reveal from "./Reveal";

/**
 * 06 / REFLECTION
 *
 * 留白高潮。左侧项目演进降为辅助信息（细线 + 灰字），
 * 右侧最终观点才是视觉主角。
 *
 * Narrative Density Pass：本屏新增了一段解释正文（pivot 的推导过程）。
 * 为保住留白高潮，只把最有分量的一句留在大字号层级，
 * 其余文字下沉为中号 / 弱色正文，不做成整段 48px 长文。
 */
export default function Reflection() {
  return (
    <>
      <h2 className="mt-[34px] text-[30px] font-extrabold leading-[1.06] tracking-[-0.035em] md:text-[44px] lg:max-w-[720px] lg:text-[58px]">
        {REFLECTION.title}
      </h2>

      <div className="mt-16 grid grid-cols-1 gap-14 lg:mt-[104px] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-[104px]">
        {/* ── 左：项目演进（辅助信息） ── */}
        <div>
          {REFLECTION.evolution.map((t, i) => (
            <div
              key={t}
              className={`flex gap-[18px] py-4 ${
                i === REFLECTION.evolution.length - 1
                  ? "border-y border-ink/[0.09]"
                  : "border-t border-ink/[0.09]"
              }`}
            >
              <span className="pt-1 font-mono text-[10px] tracking-[0.2em] text-ink/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[17.5px] font-bold leading-[1.42] tracking-[-0.012em] text-ink/70">
                {t}
              </p>
            </div>
          ))}
        </div>

        {/* ── 右：最终观点（视觉主角） ── */}
        <div>
          <Reveal>
            <p className="max-w-[760px] text-[28px] font-extrabold leading-[1.34] tracking-[-0.035em] md:text-[38px] lg:text-[48px]">
              {REFLECTION.pivot.before}
              <em className="not-italic text-electric">{REFLECTION.pivot.em}</em>
              {REFLECTION.pivot.after}
            </p>
          </Reveal>

          {/* 结论是怎么得出来的：中号正文，承接大字转折但不与它抢视觉 */}
          <div className="mt-[34px] max-w-[620px] space-y-[20px] text-[15.5px] leading-[1.84] text-ink/70 md:mt-[42px] md:text-[16.5px]">
            {REFLECTION.explain.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>

          <p className="mt-[26px] max-w-[520px] text-[14.5px] leading-[1.82] text-ink/55 md:mt-[38px] md:text-[15.5px]">
            {REFLECTION.small}
          </p>
        </div>
      </div>

      {/* ── 底部：三个真实外链 + next project ── */}
      <div className="mt-[72px] flex items-end justify-between gap-10 max-lg:flex-col max-lg:items-start max-lg:gap-[26px] lg:mt-[118px]">
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {REFLECTION.links.map((l) => (
            <li key={l.t}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cs-eyebrow inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 transition-colors hover:border-electric hover:text-electric focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
              >
                {l.t}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-end gap-4">
          {/* 黄色手势 #3（全页 3 次中的第 3 次） */}
          <span aria-hidden="true" className="block w-[66px] rotate-[-8deg]">
            <HandIllustration width={200} className="h-auto w-full" />
          </span>
          <a
            href={REFLECTION.next.href}
            className="group flex items-center gap-[11px] text-ink"
          >
            <span className="border-b-2 border-stickerYellow pb-0.5 text-[17px] font-extrabold tracking-[-0.01em]">
              {REFLECTION.next.t}
            </span>
            <svg
              width="24"
              height="11"
              viewBox="0 0 26 12"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0"
            >
              <path
                d="M0 6h23M18 1l5 5-5 5"
                stroke="#1A1A1A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
