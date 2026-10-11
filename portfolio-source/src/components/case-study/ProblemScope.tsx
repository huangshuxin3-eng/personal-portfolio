import { PROBLEM } from "@/data/legaltrace";
import Reveal from "./Reveal";

/**
 * 02 / PROBLEM + SCOPE
 *
 * 这一屏的视觉核心是「重复动作」：CASE 01–04 做成真实错位堆叠的 records，
 * 不读正文也能看出同一条路径在被反复执行。
 * 流程两端（查询 / 查看结果 / 写报告）压低权重，中间四步放大。
 * Insight 是第二视觉锚点；Scope 用顶部细线 + 青色柔光自然承接 Problem。
 *
 * 标题下的解释段由 SectionShell 的 lead 插槽统一渲染；
 * 本组件内另有一段取舍说明，落在 WHY ZXGK FIRST? 之前。
 */
export default function ProblemScope() {
  return (
    <>
      <div className="mt-[60px] grid grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] items-start gap-[70px] max-lg:grid-cols-1 max-lg:gap-14">
        {/* ── 左：真实人工流程，中段放大 ── */}
        <div>
          {PROBLEM.steps.map((s, i) => {
            const isLast = i === PROBLEM.steps.length - 1;
            return s.big ? (
              <div key={s.idx} className="relative py-2">
                {/* 重影：同一条动作的重复感 */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[42px] top-2 select-none text-[27px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink/10 md:text-[40px]"
                >
                  {s.t}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[68px] top-[15px] hidden select-none text-[40px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink/5 md:block"
                >
                  {s.t}
                </span>
                <div className="relative flex items-baseline gap-[18px]">
                  <span className="w-6 flex-none font-mono text-[10px] font-bold tracking-[0.24em] text-electric">
                    {s.idx}
                  </span>
                  <span className="text-[27px] font-extrabold leading-[1.08] tracking-[-0.035em] text-ink md:text-[40px]">
                    {s.t}
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={s.idx}
                className={`flex items-baseline gap-[18px] py-3 ${
                  isLast ? "" : "border-b border-ink/10"
                }`}
              >
                <span className="w-6 flex-none font-mono text-[10px] tracking-[0.24em] text-ink/30">
                  {s.idx}
                </span>
                <span className="text-[15px] text-ink/30">{s.t}</span>
              </div>
            );
          })}
        </div>

        {/* ── 右：重复动作 = 真实堆叠的 records ── */}
        <div className="pt-1.5">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.34em] text-ink/45">
              {PROBLEM.recordsHead.k}
            </span>
            <span className="font-mono text-[11px] font-bold tracking-[0.18em] text-electric">
              {PROBLEM.recordsHead.n}
            </span>
          </div>

          <div className="relative mt-5 h-[336px] max-lg:h-auto">
            {PROBLEM.records.map((id) => (
              <div
                key={id}
                className="cs-rec w-[min(100%,560px)] rounded-[4px] border border-ink/[0.22] bg-white px-[19px] pb-[18px] pt-[17px] shadow-[0_12px_26px_rgba(26,26,26,0.085)]"
              >
                <div className="flex items-center justify-between gap-2.5 font-mono text-[10px] tracking-[0.24em] text-ink/45">
                  <span className="font-bold text-electric">{id}</span>
                  <span>PDF</span>
                </div>
                <p className="mt-[11px] font-mono text-[11.5px] tracking-[0.14em] text-ink/70">
                  {PROBLEM.recordActs}
                </p>
                <div className="mt-3 flex gap-[5px]" aria-hidden="true">
                  {[0, 1, 2, 3].map((d) => (
                    <i
                      key={d}
                      className="h-[9px] w-[9px] rounded-[1px] bg-electric/85"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-[18px] font-mono text-[10px] leading-[2] tracking-[0.2em] text-ink/30">
            {PROBLEM.recordsNote.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* ── Insight：第二视觉锚点 ── */}
      <Reveal>
        <div className="mt-[82px] border-y border-ink/[0.22] py-[62px] max-md:mt-14 max-md:py-10">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.38em] text-ink/45">
            <span className="cs-dot" />
            {PROBLEM.insight.k}
          </p>
          <p className="mt-[26px] max-w-[1040px] text-[27px] font-extrabold leading-[1.16] tracking-[-0.038em] max-md:mt-[18px] md:text-[40px] lg:text-[54px]">
            {PROBLEM.insight.before}
            <em className="not-italic text-electric">{PROBLEM.insight.em}</em>
            {PROBLEM.insight.after}
          </p>
        </div>
      </Reveal>

      {/* ── Problem → Scope 的自然承接 ── */}
      <Reveal>
        <div className="mt-[76px] flex flex-wrap items-center gap-x-[14px] gap-y-2 font-mono text-[11px] tracking-[0.16em]">
          {PROBLEM.bridge.map((b, i) => (
            <span key={b.t} className="flex items-center gap-x-[14px]">
              {i > 0 && (
                <i className="text-[12px] not-italic text-ink/30">→</i>
              )}
              <b className={b.on ? "text-electric" : "font-bold text-ink/55"}>
                {b.t}
              </b>
            </span>
          ))}
        </div>
      </Reveal>

      {/* ── 取舍说明：落在 WHY ZXGK FIRST? 之前，解释 V1 为什么先做窄 ── */}
      <Reveal>
        <p className="mt-[38px] max-w-[760px] text-[15.5px] leading-[1.82] text-ink/65 md:text-[17px]">
          {PROBLEM.beforeScope}
        </p>
      </Reveal>

      {/* ── Scope：承接 Problem，不是另一张独立 PPT ── */}
      <Reveal>
        <div className="relative mt-7 overflow-hidden border-t border-ink/[0.22] pt-11">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-[30px] right-[-60px] h-[340px] w-[340px] rounded-full max-lg:-top-[10px] max-lg:right-0 max-lg:h-[260px] max-lg:w-[260px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(152,235,233,0.34), rgba(152,235,233,0))",
            }}
          />
          <p className="relative font-mono text-[11px] font-bold uppercase tracking-[0.34em] text-electric">
            {PROBLEM.scope.k}
          </p>
          <p className="relative mt-5 max-w-[760px] text-[19px] font-extrabold leading-[1.52] tracking-[-0.018em] md:text-[27px]">
            {PROBLEM.scope.lead}
            <span className="text-ink/45">{PROBLEM.scope.rest}</span>
          </p>
          <div className="relative mt-[34px] flex flex-wrap items-center gap-x-[11px] gap-y-[9px]">
            {PROBLEM.scope.flow.map((f, i) => (
              <span key={f} className="flex items-center gap-x-[11px]">
                {i > 0 && (
                  <span className="font-mono text-[11px] text-ink/25">→</span>
                )}
                <b className="font-mono text-[11.5px] font-bold tracking-[0.14em] text-electric">
                  {f}
                </b>
              </span>
            ))}
          </div>
          <p className="relative mt-9 max-w-[760px] border-t border-ink/10 pt-6 text-[18px] font-extrabold tracking-[-0.02em] md:text-[23px]">
            {PROBLEM.scope.close}
          </p>
        </div>
      </Reveal>
    </>
  );
}
