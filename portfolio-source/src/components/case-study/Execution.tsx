import FolderIllustration from "@/components/FolderIllustration";
import { EXECUTION } from "@/data/legaltrace";
import Reveal from "./Reveal";

/** 四份成果物的错位摆放（<1024 全部转为纵向堆叠） */
const FILEDOC = [
  "top-[22px] w-[252px] translate-x-[-138%] rotate-[-8deg]",
  "top-[12px] z-[3] w-[272px] translate-x-[-50%] rotate-[1.5deg]",
  "top-[28px] w-[248px] translate-x-[38%] rotate-[8deg]",
  "top-[130px] z-[6] w-[238px] translate-x-[-130%] rotate-[-7deg] shadow-[0_26px_44px_rgba(26,26,26,0.16)]",
];

const FILEDOC_BASE =
  "absolute left-1/2 z-[2] flex items-center gap-3 rounded-[3px] border border-ink/[0.22] bg-white px-4 py-3.5 font-mono text-[12px] tracking-[0.1em] shadow-[0_14px_30px_rgba(26,26,26,0.11)] max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:z-auto max-lg:mt-2.5 max-lg:w-full max-lg:translate-x-0 max-lg:rotate-0";

/**
 * 05 / EXECUTION
 *
 * 信息优先级：先读到「产品已经真实运行」（LIVE / INSTALLABLE / RESUMABLE），
 * 再读到「一次核查产生了什么成果」（文件夹 + 四份成果物）。
 *
 * 这一屏不放任何未实测的效率数字 / 测试数量 / 用户数量。
 * 四份成果物是 HTML/CSS 画的示意图标，不是伪造的文件截图。
 */
export default function Execution() {
  return (
    <>
      {/* ── 第一层：产品已经真实运行 ── */}
      <div className="mt-[52px] grid grid-cols-3 gap-[22px] max-lg:grid-cols-1">
        {EXECUTION.status.map((s) => {
          const inner = (
            <>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] bg-electric"
              />
              <span className="flex items-center gap-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-electric">
                <i className="cs-dot" />
                {s.k}

              </span>
              <span className="mt-3.5 block">
                <span className="inline-block rounded-[2px] border border-ink/[0.22] px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                  {s.v}
                </span>
              </span>
              <span className="mt-3.5 block text-[14.5px] leading-[1.72] text-ink/55">
                {s.d}
              </span>
            </>
          );

          return s.href ? (
            <a
              key={s.k}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="cs-card relative block overflow-hidden px-7 py-[26px] pb-[30px] transition-transform duration-300 ease-out hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric motion-reduce:hover:translate-y-0"
            >
              {inner}
            </a>
          ) : (
            <div
              key={s.k}
              className="cs-card relative overflow-hidden px-7 py-[26px] pb-[30px]"
            >
              {inner}
            </div>
          );
        })}
      </div>

      {/* ── 第二层：一次核查产生的成果 ── */}
      <p className="mt-[66px] font-mono text-[10px] uppercase tracking-[0.36em] text-ink/45">
        {EXECUTION.filesLabel}
      </p>

      <div className="relative mt-[30px] h-[400px] max-lg:mt-[26px] max-lg:h-auto">
        <div className="absolute left-1/2 top-[-166px] z-[4] w-[620px] -translate-x-1/2 max-lg:relative max-lg:left-auto max-lg:top-auto max-lg:mx-auto max-lg:mb-3 max-lg:w-[min(100%,320px)] max-lg:translate-x-0">
          <div className="cs-float">
            <FolderIllustration
              width={620}
              frontFrom="#4229E8"
              frontTo="#BCAAF5"
              back="#2E1CA8"
              edge="#1B1160"
              grain={1}
              className="h-auto w-full"
            />
          </div>
        </div>

        {EXECUTION.files.map((f, i) => (
          <div key={f} className={`${FILEDOC_BASE} ${FILEDOC[i]}`}>
            <span
              aria-hidden="true"
              className="relative h-6 w-5 flex-none rounded-[2px] border border-ink/[0.22] bg-[#FCFBFA]"
            >
              <span className="absolute inset-x-1 top-1.5 h-0.5 bg-ink/[0.18] shadow-[0_5px_0_rgba(26,26,26,0.13),0_10px_0_rgba(26,26,26,0.09)]" />
            </span>
            <span>{f}</span>
          </div>
        ))}
      </div>

      {/* ── 过渡句：把「跑了哪些文件」收束为「交付了什么成果」，再引出下方成果区 ── */}
      <p className="mt-[30px] max-w-[760px] text-[15.5px] leading-[1.82] text-ink/65 md:text-[17px]">
        {EXECUTION.filesNote}
      </p>

      {/* ── 成果区 ── */}
      <div className="mt-12 border-t border-ink/[0.22] pt-[30px]">
        <p className="font-mono text-[10px] uppercase tracking-[0.36em] text-ink/45">
          {EXECUTION.deliverableLabel}
        </p>
        <div className="cs-deli mt-[22px] overflow-hidden rounded-[4px] border border-ink/10 bg-white">
          {EXECUTION.deliverables.map((d) => (
            <div key={d.t} className="px-6 py-[22px] pb-6">
              <p className="font-mono text-[12.5px] font-bold tracking-[0.16em]">
                {d.t}
              </p>
              <p className="mt-2.5 text-[12.5px] text-ink/45">{d.s}</p>
            </div>
          ))}
        </div>
      </div>

      <Reveal>
        <p className="mt-10 max-w-[860px] text-[19px] font-extrabold leading-[1.46] tracking-[-0.022em] md:text-[25px]">
          {EXECUTION.close}
        </p>
      </Reveal>

      <p className="mt-[38px] font-mono text-[9px] uppercase tracking-[0.2em] text-ink/30 md:text-[10px] md:tracking-[0.28em]">
        {EXECUTION.tech}
      </p>
    </>
  );
}
