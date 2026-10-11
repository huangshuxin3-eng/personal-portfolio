import type { Metadata } from "next";

import CaseHero from "@/components/case-study/CaseHero";
import Execution from "@/components/case-study/Execution";
import ProblemScope from "@/components/case-study/ProblemScope";
import Reflection from "@/components/case-study/Reflection";
import RulesAI from "@/components/case-study/RulesAI";
import SectionShell from "@/components/case-study/SectionShell";
import Solution from "@/components/case-study/Solution";
import {
  EXECUTION,
  HERO,
  PROBLEM,
  REFLECTION,
  RULES,
  SOLUTION,
} from "@/data/legaltrace";

export const metadata: Metadata = {
  title: "LegalTrace — Case Study · HUANG SHUXIN",
  description:
    "LegalTrace 是一套面向律师的公开信息核查工作流工具。六个部分的项目复盘：问题、方案、事实边界、落地状态与反思。",
};

/** 六屏统一的大标题字号层级（<768 / 768–1023 / ≥1024；<480 再降一档） */
const H2 =
  "text-[30px] font-extrabold leading-[1.06] tracking-[-0.035em] max-[479px]:text-[26px] md:text-[44px] lg:text-[58px]";

function Title({ lines, max = "max-w-[900px]" }: { lines: string[]; max?: string }) {
  return (
    <h2 className={`${H2} ${max}`}>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

export default function LegalTraceCaseStudyPage() {
  return (
    <main className="relative w-full overflow-hidden bg-cream">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* 站点返回条：与 /cv、/portfolio、/demo 保持一致的导航习惯 */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 pt-8 md:px-[52px] xl:px-[72px]">
          <a
            href="/portfolio"
            className="cs-eyebrow transition-colors hover:text-electric focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric"
          >
            返回作品集
          </a>
          <p className="cs-eyebrow">CASE STUDY · 06 SECTIONS</p>
        </div>

        {/* ══ 01 / CASE HERO ══ */}
        <SectionShell
          left={null}
          meta=""
        >
          <CaseHero />
        </SectionShell>

        {/* ══ 02 / PROBLEM + SCOPE ══ */}
        <SectionShell
          left={<Title lines={PROBLEM.title} />}
          meta={PROBLEM.meta}
          lead={PROBLEM.lead}
        >
          <ProblemScope />
        </SectionShell>

        {/* ══ 03 / SOLUTION ══ */}
        <SectionShell
          left={<Title lines={[SOLUTION.title]} max="max-w-[820px]" />}
          meta={SOLUTION.meta}
          lead={SOLUTION.lead}
        >
          <Solution />
        </SectionShell>

        {/* ══ 04 / RULES + AI ══ */}
        <SectionShell
          left={<Title lines={RULES.title} />}
          meta={RULES.meta}
          lead={RULES.lead}
        >
          <RulesAI />
        </SectionShell>

        {/* ══ 05 / EXECUTION ══ */}
        <SectionShell
          left={null}
          meta=""
          lead={EXECUTION.lead}
        >
          <Execution />
        </SectionShell>

        {/* ══ 06 / REFLECTION ══ */}
        <SectionShell
          variant="reflection"
          left={<p className="cs-eyebrow">{REFLECTION.eyebrow}</p>}
          meta={REFLECTION.meta}
        >
          <Reflection />
        </SectionShell>
      </div>
    </main>
  );
}
