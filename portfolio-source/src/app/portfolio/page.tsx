

export default function PortfolioPage() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-cream px-5 py-16 sm:px-10">
      <div className="mx-auto max-w-[900px]">
        <a
          href="/"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.28em] text-ink/60 transition-colors hover:text-electric"
        >
          返回首页
        </a>

        <h1 className="text-[42px] font-extrabold leading-[0.95] tracking-[-0.02em] sm:text-[64px]">
          精选作品
        </h1>
        <p className="mt-3 font-mono text-[11px] tracking-[0.3em] text-ink/50">
          LEGALTRACE · 非诉网核工作台
        </p>

        {/* LegalTrace 详情入口：Case Study */}
        <a
          href="/portfolio/legaltrace"
          className="mt-10 block rounded-lg border border-ink/10 bg-white/60 p-6 transition-colors hover:border-electric/40 hover:bg-white"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold">LegalTrace</h2>
            <span className="font-mono text-[11px] tracking-[0.24em] text-ink/50">
              CASE STUDY · 06 SECTIONS
            </span>
          </div>
          <p className="mt-2 text-sm text-ink/60">
            LegalTrace 是一套面向律师的公开信息核查工作流工具。
          </p>
          <p className="mt-4 font-mono text-[11px] tracking-[0.24em] text-electric">
            查看完整 Case Study
          </p>
        </a>

        <a
          href="https://legal-web-verification-workbench.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-electric px-6 py-2.5 text-[13px] font-bold"
          style={{ color: "#FFD02C" }}
        >
          打开线上产品
        </a>
      </div>
    </main>
  );
}
