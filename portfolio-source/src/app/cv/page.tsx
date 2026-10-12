import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import styles from "./resume.module.css";

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk-latin.woff2",
  weight: "400 700",
  display: "swap",
  variable: "--cv-font",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "黄舒心 · CV — AI 产品经理 / 产品运营实习",
  description: "黄舒心的网页简历：教育背景、LegalTrace 项目、工作与实习经历及专业技能。",
};

const liveUrl = "https://legal-web-verification-workbench.vercel.app/";
const githubUrl = "https://github.com/huangshuxin3-eng/legal-web-verification-workbench";

function Section({ number, english, title, children }: {
  number: string; english: string; title: string; children: ReactNode;
}) {
  return (
    <section className={styles.section} aria-labelledby={`cv-section-${number}`}>
      <h2 className={styles.sectionLabel} id={`cv-section-${number}`}>
        <span className={styles.number}>{number}</span>
        <span className={styles.english}>{english}</span>
        <span className={styles.sectionTitle}>{title}</span>
      </h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}

function Detail({ title, children }: { title: string; children: ReactNode }) {
  return <div className={styles.detail}><h4>{title}</h4><p>{children}</p></div>;
}

export default function CvPage() {
  return (
    <main className={`${styles.page} ${spaceGrotesk.variable}`}>
      <div className={styles.sheet}>
        <nav className={styles.topbar} aria-label="页面导航">
          <a href="/">← BACK TO HOME</a>
          <span>01 / CURRICULUM VITAE</span>
        </nav>

        <header className={styles.hero}>
          <div>
            <p className={styles.eyebrow}>PRODUCT THINKING · AI APPLICATIONS</p>
            <h1>黄舒心</h1>
            <p className={styles.nameEnglish}>HUANG SHUXIN</p>
          </div>
          <address className={styles.contact}>
            <a href="tel:15397398771">15397398771</a>
            <a href="mailto:huangshuxin3@gmail.com">huangshuxin3@gmail.com</a>
            <div className={styles.contactLinks}>
              <a href="/portfolio/">View Portfolio</a>
              <a href="mailto:huangshuxin3@gmail.com">Email Me</a>
            </div>
          </address>
        </header>

        <Section number="01" english="EDUCATION" title="教育背景">
          <div className={styles.education}>
            <article>
              <h3>上海交通大学</h3>
              <p className={styles.role}>法律硕士（非法学）</p>
              <p className={styles.date}>2025.09–2028.06</p>
              <p className={styles.grade}>GPA：3.77/4.00<br />排名 12/129（前 10%）</p>
            </article>
            <article>
              <h3>暨南大学</h3>
              <p className={styles.role}>商务英语专业</p>
              <p className={styles.date}>2019.09–2023.06</p>
              <p className={styles.grade}>GPA：4.07/5.0</p>
            </article>
          </div>
        </Section>

        <Section number="02" english="FEATURED PROJECT" title="项目经历">
          <article className={styles.project}>
            <div className={styles.projectHeading}>
              <h3>LegalTrace</h3>
              <span>非诉网核工作台</span>
            </div>
            <p className={styles.projectIntro}>面向法律尽调场景的 AI 辅助公开信息核查工具，提供自动检索、证据留痕、结构化分析与报告输出能力。</p>
            <div className={styles.projectDetails}>
              <Detail title="需求分析与产品规划">针对法律尽调中公开信息检索操作机械、证据保存与整理繁琐、核查底稿编制耗时等问题，确定产品核心功能及 V1 范围。采用 Chrome 插件与 Web 工作台结合的方案，由插件负责网页自动核查与证据留存，Web 工作台负责项目管理、AI 分析及报告生成。</Detail>
              <Detail title="核心功能设计">设计任务创建、自动查询、证据留存、AI 分析及报告导出的完整流程，实现中国执行信息公开网执行信息自动查询、分页证据、详情页 PDF 留存及中断后恢复，并支持 DOCX 核查报告、XLSX 清单和 ZIP 证据包导出。</Detail>
              <Detail title="AI 功能设计">考虑到法律核查对事实准确性及证据溯源的要求，将事实解析与生成式分析分离：通过规则提取案号、金额、日期等关键字段，由大模型基于提取结果生成分析草稿；设置人工确认、输出校验及事实变更检测，防止未经确认的分析内容进入正式报告。</Detail>
              <Detail title="开发与测试">负责需求拆解、功能取舍及产品验收，使用 Codex 辅助开发，根据测试结果持续调整交互流程与异常处理。产品已部署至 Vercel。</Detail>
            </div>
            <div className={styles.projectActions}>
              <a className={styles.primaryLink} href="/portfolio/legaltrace/">View Case Study</a>
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">Try Live Product</a>
            </div>
          </article>
        </Section>

        <Section number="03" english="EXPERIENCE" title="工作与实习经历">
          <div className={styles.experiences}>
            <article className={styles.experience}>
              <div className={styles.jobHeading}>
                <div><h3>比亚迪股份有限公司第十五事业部</h3><p className={styles.role}>制动器工厂｜项目管理</p></div>
                <p className={styles.date}>2023.08–2024.07</p>
              </div>
              <Detail title="项目统筹与进度管理">参与推进两款车型制动器项目，项目周期约 3–6 个月，负责组织项目评审、制定执行计划、跟踪关键节点及协调项目进度。</Detail>
              <Detail title="跨部门协同与风险管理">针对交付周期紧张、资源安排冲突等问题，协调技术、生产等相关人员调整执行安排，跟进问题处理进度及质量要求落实。</Detail>
            </article>
            <article className={styles.experience}>
              <div className={styles.jobHeading}>
                <div><h3>锦天城律师事务所</h3><p className={styles.role}>实习生</p></div>
                <p className={styles.date}>2026.05–2026.09</p>
              </div>
              <Detail title="尽职调查">参与法律尽职调查中的公开信息网络核查、核查底稿整理及材料归档，接触真实法律业务中的信息检索、事实核验和证据整理流程。</Detail>
              <Detail title="法律研究与文书撰写">梳理案件事实与证据材料，协助起草起诉状、答辩意见及证据目录；围绕争议焦点开展类案检索，归纳裁判观点并形成检索报告。</Detail>
            </article>
          </div>
        </Section>

        <Section number="04" english="SKILLS" title="专业技能">
          <div className={styles.skills}>
            <Detail title="产品能力">具备需求分析、功能规划、业务流程设计及测试验收经验；能够使用 Figma 绘制原型，借助 AI 工具开展竞品分析及 PRD 编写。</Detail>
            <Detail title="AI 应用">具备大模型 API 接入、Prompt 设计、结构化输出及人工审核流程的项目实践；熟悉 Codex 辅助开发流程，了解 Agent、Workflow、RAG、MCP 等基础概念。</Detail>
            <Detail title="数据分析">掌握 Python、SQL 基础数据分析能力。</Detail>
            <Detail title="语言能力">英语专业八级（优秀）、BEC Higher、CATTI 二级及三级笔译证书，可使用英语作为工作语言。</Detail>
          </div>
        </Section>

        <footer className={styles.footer}>
          <span>HUANG SHUXIN / CV</span>
          <div>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">LegalTrace Live Demo</a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
