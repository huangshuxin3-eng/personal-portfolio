/**
 * LegalTrace Case Study — 内容数据层
 *
 * 这里是 `/portfolio/legaltrace` 六屏的全部文案、流程节点与真实外链。
 * 目的：把文字从 JSX 里抽出来，改文案不需要动组件结构。
 *
 * 约束（来自作品集要求）：
 * - 文案以确认稿为准，不自行改写产品能力；
 * - 不编造效率数字 / 测试数量 / 用户数量；
 * - 只有真实存在的链接才写进来。
 */

/* ═══════════════ 真实外链 ═══════════════ */

export const LINKS = {
  /** Web 工作台线上地址 */
  live: "https://legal-web-verification-workbench.vercel.app/",
  /** 开源仓库 */
  github: "https://github.com/huangshuxin3-eng/legal-web-verification-workbench",
  /** 网页核查助手 External Beta Release 页（不直接指向 ZIP） */
  extensionBeta:
    "https://github.com/huangshuxin3-eng/legal-web-verification-workbench/releases/tag/v8.1.0-beta",
} as const;

/* ═══════════════ 截图资源 ═══════════════ */

export interface ShotMeta {
  src: string;
  /** 原始像素宽（用于 aspect-ratio，避免图片变形） */
  w: number;
  /** 原始像素高 */
  h: number;
  alt: string;
}

/**
 * 全部来自 nonlit-workbench 仓库 `docs/images/`，
 * 保持产品原始黑 / 白 / 中性灰，未套任何渐变滤镜。
 * `extensionPanel` 是 `extension.png` 右侧面板的裁切（仅 crop，未调色）。
 */
export const SHOTS = {
  workbench: {
    src: "/legaltrace/workbench.png",
    w: 2555,
    h: 1263,
    alt: "LegalTrace Web 工作台的任务列表界面，含核查对象、核查事项、数据来源、证据留痕与状态列",
  },
  extension: {
    src: "/legaltrace/extension.png",
    w: 1729,
    h: 910,
    alt: "网页核查助手运行在中国执行信息公开网页面右侧的真实截图",
  },
  extensionPanel: {
    src: "/legaltrace/extension-panel.png",
    w: 527,
    h: 868,
    alt: "网页核查助手侧栏面板：项目、核查任务、当前核查、自动核查与状态说明",
  },
  landing: {
    src: "/legaltrace/landing.png",
    w: 2558,
    h: 1263,
    alt: "LegalTrace 官网首页：让法律核查更高效，让每项结论有据可查",
  },
} satisfies Record<string, ShotMeta>;

/* ═══════════════ 01 / CASE HERO ═══════════════ */

export interface CaseHero {
  eyebrow: string;
  meta: string;
  title: string;
  titleZh: string;
  lead: string;
  /** BEFORE：中间四步是真正被重复消耗的动作，highlight 为 electric */
  before: { t: string; hot?: boolean }[];
  after: string[];
  foot: string[];
}

export const HERO: CaseHero = {
  eyebrow: "HUANG SHUXIN / SELECTED WORK 01",
  meta: "AI PRODUCT · LEGALTECH · 2026",
  title: "LegalTrace",
  titleZh: "让公开信息核查少一点重复劳动",
  /** Narrative Density Pass：由一句话定位扩为「定位 + 两端分工」，让首次接触者一次读懂产品形态 */
  lead: "LegalTrace 是一套面向律师的公开信息核查工作流工具。网页核查助手负责执行查询与证据留痕，Web 工作台继续完成结果整理、人工复核和成果生成。",
  before: [
    { t: "查询" },
    { t: "点开详情", hot: true },
    { t: "保存", hot: true },
    { t: "命名", hot: true },
    { t: "归档", hot: true },
    { t: "整理表格" },
    { t: "撰写报告" },
  ],
  after: ["创建任务", "自动核查与留痕", "整理复核", "智能分析", "成果"],
  foot: ["WEB WORKBENCH + CHROME EXTENSION", "PRODUCTION · EXTERNAL BETA"],
};

/* ═══════════════ 02 / PROBLEM + SCOPE ═══════════════ */

export interface CaseProblem {
  title: string[];
  meta: string;
  /** 标题下的解释段：说明「耗时发生在查询之后」，为下方流程建立阅读前提 */
  lead: string;
  /** 两端压低视觉权重，中间四步放大 */
  steps: { idx: string; t: string; big?: boolean }[];
  recordsHead: { k: string; n: string };
  records: string[];
  recordActs: string;
  recordsNote: string[];
  insight: { k: string; before: string; em: string; after: string };
  bridge: { t: string; on?: boolean }[];
  /** 紧接 bridge、落在 WHY ZXGK FIRST? 之前的取舍说明：解释 V1 为什么先做窄 */
  beforeScope: string;
  scope: {
    k: string;
    lead: string;
    rest: string;
    flow: string[];
    close: string;
  };
}

export const PROBLEM: CaseProblem = {
  title: ["真正低效的，不是搜索，", "而是搜索之后"],
  meta: "核心人工流程",
  lead: "查询本身并不复杂。真正耗时的是查询之后：每出现一条结果，都要继续打开详情、保存页面、命名归档，再把信息重新整理进表格和报告。",
  steps: [
    { idx: "01", t: "查询主体" },
    { idx: "02", t: "查看结果列表" },
    { idx: "03", t: "保存结果列表", big: true },
    { idx: "04", t: "逐条打开案件详情", big: true },
    { idx: "05", t: "保存详情 PDF", big: true },
    { idx: "06", t: "命名 / 归档", big: true },
    { idx: "07", t: "整理 Excel" },
    { idx: "08", t: "写报告" },
  ],
  recordsHead: { k: "重复动作", n: "× N" },
  records: ["CASE 01", "CASE 02", "CASE 03", "CASE 04"],
  recordActs: "打开 · 保存 · 命名 · 归档",
  recordsNote: ["同一条路径重复 N 次", "每一次都经过人工命名与归档"],
  insight: {
    k: "INSIGHT",
    before: "大量时间被消耗在",
    em: "重复操作",
    after: "，而不是专业判断上。",
  },
  bridge: [
    { t: "重复劳动" },
    { t: "想验证一个足够完整的流程" },
    { t: "先选择中国执行信息公开网", on: true },
  ],
  beforeScope:
    "因此 V1 没有先追求覆盖更多网站。我需要先确认：如果把一条完整的核查流程自动化，是否真的能减少这些重复操作。",
  scope: {
    k: "为什么先选择中国执行信息公开网？",
    lead: "律师核查会涉及多个公开数据源。",
    rest: "V1 没有先追求「接更多网站」，而是先选择一条足够完整的流程。",
    flow: ["查询", "分页", "详情", "留痕", "整理", "复核", "交付"],
    close: "先把一条高频核查流程真正跑通，再决定复制到哪些数据源。",
  },
};

/* ═══════════════ 03 / SOLUTION ═══════════════ */

export interface CaseSolution {
  title: string;
  meta: string;
  /** 标题下的解释段：交代「两类工作」以及为什么因此拆成两端 */
  lead: string;
  web: { name: string; meta: string };
  helper: { name: string; meta: string };
  /** 两端之间的真实关系（本轮由 SAME EVIDENCE 改为中文；同时用作承接线文案） */
  handLabel: string;
  workflow: string[];
  close: { before: string; em: string; after: string };
}

export const SOLUTION: CaseSolution = {
  title: "两个端，把一次核查连起来",
  meta: "网页工作台与浏览器扩展",
  lead: "核查过程中有两类工作：一类必须发生在公开网站上，另一类发生在项目整理与交付阶段。因此我把产品拆成网页核查助手和 Web 工作台，让同一条核查任务在两个环境之间连续流转。",
  web: { name: "网页工作台", meta: "任务 · 结果 · 复核 · 智能分析 · 报告" },
  helper: {
    name: "网页核查助手",
    meta: "查询 · 分页 · 详情 · PDF 留痕",
  },
  handLabel: "证据留痕 → 工作台复核",
  workflow: [
    "创建任务",
    "自动核查",
    "PDF 证据",
    "结构化整理",
    "人工复核",
    "智能分析草稿",
    "成果交付",
  ],
  close: {
    before: "我真正想自动化的，不只是把数据取回来，而是把一次核查",
    em: "变成可以继续复核和交付的成果",
    after: "。",
  },
};

/* ═══════════════ 04 / RULES + AI（结构冻结） ═══════════════ */

export interface RuleRow {
  mark: "✕" | "✓";
  t: string;
  ok?: boolean;
}

export interface RuleCard {
  n: string;
  /** 只有第一张卡展示 "执行金额：—" 这一行 */
  t?: string;
  rows?: RuleRow[];
  body: string;
}

export interface CaseRules {
  title: string[];
  meta: string;
  /** 标题下的解释段：说明「自动化提效」为什么必然牵出事实边界问题 */
  lead: string;
  cards: RuleCard[];
  ai: {
    eyebrow: string;
    /** 标题分三段：l1 / l2 白字，em 用黄色强调 */
    title: { l1: string; l2: string; em: string };
    pipeline: { t: string; x: string }[];
    /** pipeline 下方的一句话分工说明（渲染在深色主卡内） */
    note: string;
    roles: { dt: string; dd: string }[];
  };
  close: { before: string; em: string; after: string };
}

export const RULES: CaseRules = {
  title: ["自动化可以提效，", "但不能越过事实边界"],
  meta: "事实规则与人工智能",
  lead: "自动化开始处理核查结果以后，一个新的问题出现了：系统可以减少重复操作，但不能为了方便整理而改变事实含义。这也直接决定了 AI 在 LegalTrace 里的职责边界。",
  cards: [
    {
      n: "01 / 空白 ≠ 零 ≠ 无",
      t: "执行金额：—",
      rows: [
        { mark: "✕", t: "0 元" },
        { mark: "✕", t: "无执行金额" },
        { mark: "✓", t: "保持为空", ok: true },
      ],
      body: "页面没有公示，就不替用户解释。",
    },
    {
      n: "02 / 相似 ≠ 相同",
      body: "相同案号、相似字段或重复主体，不代表可以自动合并原始记录。",
    },
    {
      n: "03 / 结果与证据对应",
      body: "整理后的结果仍然要能回到对应的原始 PDF 证据。",
    },
  ],
  ai: {
    eyebrow: "处理流程 / 各环节的职责",
    /** 标题分三段：前两行白字，FACTS. 用黄色强调 */
    title: { l1: "人工智能", l2: "不应决定", em: "事实。" },
    pipeline: [
      { t: "原始 PDF 证据", x: "原始资料" },
      { t: "程序提取基础信息", x: "按固定规则" },
      { t: "结构化结果", x: "可复核" },
      { t: "智能分析草稿", x: "整理" },
      { t: "人工复核", x: "专业判断" },
      { t: "最终报告", x: "成果交付" },
    ],
    note: "案号、法院、金额和日期等基础信息，先由程序按固定规则提取和整理。人工智能只处理整理后的结果，生成分析草稿；最终 AI 分析是否进入报告，由律师确认。",
    roles: [
      { dt: "系统 / 事实", dd: "案号 / 法院 / 金额 / 日期 / 数量" },
      { dt: "人工智能 / 整理", dd: "概览 / 重点事项 / 核实建议" },
      { dt: "律师 / 判断", dd: "编辑 / 确认 / 专业判断" },
    ],
  },
  /** 本轮明确保留，不改动 */
  close: { before: "不是哪里都加 AI，而是", em: "判断哪一步适合交给 AI", after: "。" },
};

/* ═══════════════ 05 / EXECUTION ═══════════════ */

export interface CaseExecution {
  title: string;
  meta: string;
  /** 标题下的解释段：说明「为什么继续做到可运行」，而不停在原型 */
  lead: string;
  /** 第一视觉层级：产品已经真实运行（三张状态卡比成果文件更先被读到） */
  status: { k: string; v: string; d: string; href?: string }[];
  /** 第二视觉层级：一次核查产生的成果物（含本轮修正 extension.zip → 网核成果.zip） */
  filesLabel: string;
  /** folder / deliverables 之间的过渡句：把「跑了什么文件」收束为「交付了什么成果」 */
  filesNote: string;
  files: string[];
  deliverableLabel: string;
  deliverables: { t: string; s: string }[];
  close: string;
  tech: string;
}

export const EXECUTION: CaseExecution = {
  title: "它不是一个停在原型里的项目",
  meta: "SHIPPED · RUNNING",
  lead: "我不想把 LegalTrace 停在一个可演示的交互原型，所以继续把网页核查、数据保存、AI 分析和成果生成真正接起来，并部署到可使用的环境中。",
  status: [
    {
      k: "已上线",
      v: "正式运行",
      d: "网页工作台已部署到正式运行环境。",
      href: LINKS.live,
    },
    {
      k: "可安装",
      v: "公开测试版",
      d: "网页核查助手已通过 GitHub 发布页提供公开测试版。",
      href: LINKS.extensionBeta,
    },
    {
      k: "可继续",
      v: "中断后继续核查",
      d: "核查中断后可以继续，并避免重复生成已经完成的证据留痕。",
    },
  ],
  filesLabel: "一次核查产生的成果",
  filesNote:
    "一次核查最终可以分别生成 DOCX 报告，以及包含 Excel 核查清单和对应证据文件的成果包。",
  files: ["核查报告.docx", "核查清单.xlsx", "网核成果.zip", "证据文件/"],
  deliverableLabel: "交付成果",
  deliverables: [
    { t: "DOCX 核查报告", s: "成稿核查报告" },
    { t: "XLSX 核查清单", s: "结构化整理清单" },
    { t: "PDF 证据", s: "原始留痕证据" },
    { t: "ZIP 成果包", s: "打包交付物" },
  ],
  close: "从创建任务，到核查、整理、人工确认和成果生成，已经可以完整走通。",
  tech: "技术实现：Next.js · TypeScript · Supabase · Chrome 扩展（MV3）· 可配置人工智能",
};

/* ═══════════════ 06 / REFLECTION ═══════════════ */

export interface CaseReflection {
  eyebrow: string;
  meta: string;
  title: string;
  evolution: string[];
  /**
   * 大字转折：S06 唯一的视觉锚点。
   * 本轮替换了旧的「AI 产品设计不只是哪里可以加 AI」观点 —— 只保留最有分量的一句做大字，
   * 其余解释文字下沉为中号段落，避免把留白高潮变成整段长文。
   */
  pivot: { before: string; em: string; after: string };
  /** 中号解释段：交代 pivot 那句结论是怎么一步步得出来的 */
  explain: string[];
  small: string;
  /** 三个真实外链做成可点击，替代原来的纯文本 metadata */
  links: { t: string; href: string }[];
  next: { t: string; href: string };
}

export const REFLECTION: CaseReflection = {
  eyebrow: "项目反思",
  meta: "实际收获与认识",
  title: "最开始，我只是想少截图、少命名、少保存几次文件",
  evolution: [
    "减少重复操作",
    "什么可以交给程序？",
    "什么不能被系统解释？",
    "哪一步适合 AI？",
    "哪些判断必须留给律师？",
  ],
  pivot: {
    before: "但真正做下去以后，我发现问题不只在",
    em: "“少点几次鼠标”",
    after: "。",
  },
  explain: [
    "当系统开始自动整理结果时，我必须决定哪些事实可以由程序处理，哪些信息不能被系统解释；当 AI 进入流程以后，又要继续划清模型与律师之间的边界。",
    "所以 LegalTrace 最后从一个减少截图和文件整理的工具，变成了一套从核查执行、证据留痕到人工复核和成果交付的工作流。",
  ],
  small:
    "接下来，我更想验证真实律师在真实任务里是否愿意长期使用它，以及哪些自动化真正能节省时间，而不是继续增加功能。",
  links: [
    { t: "LIVE PRODUCT", href: LINKS.live },
    { t: "GITHUB", href: LINKS.github },
    { t: "EXTENSION BETA", href: LINKS.extensionBeta },
  ],
  next: { t: "next project", href: "/" },
};
