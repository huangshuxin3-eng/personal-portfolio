import type { ShotMeta } from "@/data/legaltrace";

/**
 * 真实产品截图外框。
 *
 * 刻意不加仿造的浏览器标题栏 —— 这几张本来就是在真实浏览器 / 真实产品里截的，
 * 再套一层假 chrome 反而是伪造。只做：发丝边框 + 统一阴影 + 按原始比例约束长宽。
 * 比例用图片原生 w/h，因此不会拉伸变形，也不需要任何滤镜。
 */
export default function Shot({
  shot,
  className = "",
  /** 首屏主视觉用 eager，其余 lazy */
  priority = false,
}: {
  shot: ShotMeta;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure
      className={`cs-shot ${className}`}
      style={{ aspectRatio: `${shot.w} / ${shot.h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.w}
        height={shot.h}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </figure>
  );
}
