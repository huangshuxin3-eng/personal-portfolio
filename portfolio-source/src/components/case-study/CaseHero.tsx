"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import HandIllustration from "@/components/HandIllustration";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HERO, SHOTS } from "@/data/legaltrace";
import Reveal from "./Reveal";
import Shot from "./Shot";

/**
 * 01 / CASE HERO
 *
 * 构图：Web 工作台是「悬浮主物件」，网页核查助手是前压的竖向前景物件。
 * 层级优先级：LegalTrace → 主产品视觉 → 一句话定位 → Before / After → metadata。
 *
 * 动效只有一处：主截图非常轻的视差（±22px）。reduced-motion 下完全关闭。
 */
export default function CaseHero() {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: stage,
    offset: ["start end", "end start"],
  });
  const yMain = useTransform(scrollYProgress, [0, 1], [22, -22]);
  const yFront = useTransform(scrollYProgress, [0, 1], [-16, 26]);

  const mainStyle = reduced ? undefined : { y: yMain };
  const frontStyle = reduced ? undefined : { y: yFront };

  return (
    <>
      {/* ── 标题区 ── */}
      <div className="mt-[30px]">
        <h1 className="text-[52px] font-extrabold leading-[0.9] tracking-[-0.045em] max-[479px]:text-[44px] md:text-[74px] lg:text-[104px]">
          {HERO.title}
        </h1>
        <h2 className="mt-4 text-[26px] font-extrabold leading-[1.18] tracking-[-0.02em] md:text-[34px] lg:text-[44px]">
          {HERO.titleZh}
        </h2>
        <p className="mt-[22px] max-w-[44ch] text-[15.5px] leading-[1.78] text-ink/70 md:text-[17px]">
          {HERO.lead}
        </p>
      </div>

      {/* ── 悬浮主物件：工作台（后·大）+ 核查助手（前·小） ── */}
      <div
        ref={stage}
        className="relative mt-10 h-auto md:mt-[54px] lg:pb-[180px] xl:h-[772px] xl:pb-0"
      >
        <motion.div
          style={mainStyle}
          className="relative z-[2] w-full lg:rotate-[-0.5deg] xl:absolute xl:left-0 xl:top-0 xl:w-[1120px]"
        >
          <Shot shot={SHOTS.workbench} priority className="h-auto w-full" />
        </motion.div>

        <motion.div
          style={frontStyle}
          className="absolute right-0 top-[96px] z-[5] w-[34%] rotate-[1.4deg] max-lg:relative max-lg:right-auto max-lg:top-auto max-lg:ml-auto max-lg:mt-[-52px] max-lg:w-[74%] max-lg:max-w-[360px] max-lg:rotate-[0.8deg] xl:top-[88px] xl:w-[380px]"
        >
          <Shot
            shot={SHOTS.extensionPanel}
            className="h-auto w-full rounded-[6px] shadow-[0_48px_82px_rgba(26,26,26,0.22)]"
          />
        </motion.div>

        {/* 黄色手势 #1（全页 3 次中的第 1 次）：指向前景卡 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[46px] right-[390px] z-[7] w-[98px] rotate-[-19deg] lg:bottom-[72px] lg:right-[34%] lg:w-[84px] max-lg:relative max-lg:bottom-auto max-lg:right-auto max-lg:ml-auto max-lg:mt-[-40px] max-lg:w-[78px] xl:bottom-[46px] xl:right-[390px] xl:w-[98px]"
        >
          <HandIllustration width={200} className="h-auto w-full" />
        </div>
      </div>

      {/* ── Before / After：低权重细线带 ── */}
      <Reveal>
        <div className="mt-11 grid grid-cols-2 border-y border-ink/10 max-lg:mt-10 max-lg:grid-cols-1">
          <div className="py-[26px]">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.38em] text-ink/45">
              优化前
            </p>
            <div className="mt-[18px] flex flex-wrap items-center gap-x-[9px] gap-y-2">
              {HERO.before.map((s, i) => (
                <span key={s.t} className="flex items-center gap-x-[9px]">
                  {i > 0 && (
                    <span className="font-mono text-[11px] text-ink/25">→</span>
                  )}
                  <span
                    className={
                      s.hot
                        ? "inline-block rounded-[3px] border border-electric bg-electric px-3 py-1.5 text-[13.5px] font-bold text-white"
                        : "inline-block rounded-[3px] border border-ink/10 px-[11px] py-[5px] text-[13px] text-ink/45"
                    }
                  >
                    {s.t}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="border-l border-ink/10 py-[26px] pl-11 max-lg:border-l-0 max-lg:border-t max-lg:pl-0">
            <p className="font-mono text-[9.5px] uppercase tracking-[0.38em] text-electric">
              优化后
            </p>
            <div className="mt-[18px] flex flex-wrap items-center gap-x-[9px] gap-y-2">
              {HERO.after.map((t, i) => (
                <span key={t} className="flex items-center gap-x-[9px]">
                  {i > 0 && (
                    <span className="font-mono text-[11px] text-ink/25">→</span>
                  )}
                  <span className="inline-block rounded-[3px] border border-electric/30 bg-electric/5 px-[11px] py-[5px] text-[13px] font-bold text-electric">
                    {t}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── 底部 metadata（比正文更轻） ── */}
      <div className="mt-[30px] flex items-center justify-between gap-[30px] max-md:flex-col max-md:items-start max-md:gap-2">
        {HERO.foot.map((t) => (
          <p key={t} className="cs-eyebrow">
            {t}
          </p>
        ))}
      </div>
    </>
  );
}
