import { RULES } from "@/data/legaltrace";
import Reveal from "./Reveal";

/** 三张规则卡的轻微错位（<1024 全部回正，避免窄屏横向溢出） */
const TILT = [
  "-translate-x-1.5 -rotate-[1.6deg]",
  "translate-x-3.5 rotate-[1.2deg]",
  "translate-x-0.5 -rotate-[0.7deg]",
];

/**
 * 04 / RULES + AI
 *
 * 这一屏是整套 Case Study 的色彩高潮，结构与内容已冻结，
 * 这里只做真实网页实现需要的对齐 / 间距 / 字号层级 / 阴影统一。
 *
 * 层级：事实规则（左）→ AI pipeline（右）→ SYSTEM / AI / LAWYER（右卡底部）
 */
export default function RulesAI() {
  return (
    <>
      <div className="mt-[60px] grid grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)] items-start gap-[58px] max-lg:grid-cols-1 max-lg:gap-11">
        {/* ── 左：三张事实规则卡（轻微错位） ── */}
        <div className="flex flex-col gap-6">
          {RULES.cards.map((c, i) => (
            <article
              key={c.n}
              className={`cs-card px-[20px] py-[22px] pb-6 md:px-[30px] md:py-[29px] md:pb-[31px] ${TILT[i]} max-lg:translate-x-0 max-lg:rotate-0`}
            >
              <p className="font-mono text-[10px] font-bold tracking-[0.28em] text-electric">
                {c.n}
              </p>

              {c.t && (
                <p className="mt-[17px] font-mono text-[21px] font-bold tracking-[0.02em]">
                  {c.t}
                </p>
              )}

              {c.rows && (
                <div className="mt-[17px] flex flex-col gap-[9px] font-mono text-[13px] tracking-[0.06em]">
                  {c.rows.map((r) => (
                    <div
                      key={r.t}
                      className={`flex items-center gap-3 ${
                        r.ok ? "font-bold text-electric" : "text-ink/45"
                      }`}
                    >
                      <span className="inline-block w-4 text-center font-bold">
                        {r.mark}
                      </span>
                      <span>{r.t}</span>
                    </div>
                  ))}
                </div>
              )}

              <p
                className={`max-w-[38ch] text-[15px] leading-[1.74] text-ink/55 ${
                  c.t ? "mt-4" : "mt-5"
                }`}
              >
                {c.body}
              </p>
            </article>
          ))}
        </div>

        {/* ── 右：全页唯一重渐变主卡 ── */}
        <div className="cs-ai relative overflow-hidden rounded-[5px] px-7 py-[34px] pb-8 md:px-11 md:py-[46px] md:pb-[42px]">
          <div
            aria-hidden="true"
            className="cs-ai-grain pointer-events-none absolute inset-0 opacity-50"
          />
          <div className="relative">
            <p className="cs-eyebrow text-white/65">{RULES.ai.eyebrow}</p>

            <h3 className="mt-5 max-w-[520px] text-[31px] font-extrabold leading-[1.02] tracking-[-0.04em] text-white md:text-[38px] lg:text-[52px]">
              {RULES.ai.title.l1}
              <br />
              {RULES.ai.title.l2}{" "}
              <em className="not-italic text-stickerYellow">
                {RULES.ai.title.em}
              </em>
            </h3>

            <div className="mt-[38px]">
              {RULES.ai.pipeline.map((p, i) => (
                <div
                  key={p.t}
                  className={`flex items-center gap-3.5 py-[11px] ${
                    i === RULES.ai.pipeline.length - 1
                      ? ""
                      : "border-b border-white/[0.16]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-cvCyan" />
                  <span className="font-mono text-[11.5px] uppercase tracking-[0.2em] text-white/95">
                    {p.t}
                  </span>
                  <span className="ml-auto font-mono text-[9.5px] tracking-[0.2em] text-white/45">
                    {p.x}
                  </span>
                </div>
              ))}
            </div>

            {/* pipeline 下方的一句话分工说明：解释这条链上「谁碰什么」 */}
            <p className="mt-[26px] max-w-[62ch] text-[14.5px] leading-[1.78] text-white/75">
              {RULES.ai.note}
            </p>

            <dl className="mt-9 grid grid-cols-3 gap-4 max-lg:grid-cols-1">
              {RULES.ai.roles.map((r) => (
                <div
                  key={r.dt}
                  className="rounded-[4px] border border-white/25 bg-white/[0.06] px-[15px] py-4 pb-[18px]"
                >
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-cvCyan">
                    {r.dt}
                  </dt>
                  <dd className="mt-[11px] text-[13.5px] leading-[1.68] text-white/90">
                    {r.dd}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <Reveal>
        <p className="mt-[62px] text-center text-[20px] font-extrabold tracking-[-0.03em] max-lg:mt-11 md:text-[26px] lg:text-[33px]">
          {RULES.close.before}
          <em className="not-italic text-electric">{RULES.close.em}</em>
          {RULES.close.after}
        </p>
      </Reveal>
    </>
  );
}
