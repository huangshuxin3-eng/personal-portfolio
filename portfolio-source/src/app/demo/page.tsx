import type { Metadata } from "next";
import DemoPlayer from "./DemoPlayer";
import styles from "./demo.module.css";

export const metadata: Metadata = {
  title: "LegalTrace · Demo — HUANG SHUXIN",
  description: "LegalTrace 真实操作演示：创建核查任务、保存证据、确认 AI 分析与导出报告。",
};

export default function DemoPage() {
  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <nav className={styles.topbar} aria-label="页面导航">
          <a href="/">← BACK TO HOME</a>
          <span>03 / PRODUCT DEMO</span>
        </nav>
        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>SEE IT IN ACTION</p>
            <h1>LegalTrace<span className={styles.sticker}>Demo</span></h1>
          </div>
          <p className={styles.intro}>从创建任务到导出报告，<br />看一次公开信息核查如何完成。</p>
        </header>
        <section aria-label="LegalTrace 操作视频">
          <DemoPlayer />
        </section>
        <div className={styles.bottom}>
          <p>完整操作录屏 · 约 3 分 19 秒</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="https://legal-web-verification-workbench.vercel.app/" target="_blank" rel="noopener noreferrer">在线体验 LegalTrace<span className={styles.srOnly}>（在新标签页打开）</span></a>
            <a href="/portfolio/legaltrace/">阅读 Case Study</a>
          </div>
        </div>
        <footer className={styles.footer}><span>HUANG SHUXIN / AI PRODUCT PORTFOLIO</span><a href="/portfolio/">VIEW PORTFOLIO</a></footer>
      </div>
    </main>
  );
}
