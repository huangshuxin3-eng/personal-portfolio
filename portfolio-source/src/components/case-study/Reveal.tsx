"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * 一次性滚动进场：元素进入视口后淡入 + 轻微上移，之后不再触发。
 *
 * - 只用 IntersectionObserver + CSS transition，不引入动画库；
 * - 系统开启 prefers-reduced-motion 时，globals.css 里 .reveal 会被强制为静态；
 * - 不支持 IntersectionObserver 时直接显示，避免内容永远不可见。
 */
export default function Reveal({
  children,
  /** 错峰延迟（ms），用于列表 stagger */
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal${shown ? " is-in" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
