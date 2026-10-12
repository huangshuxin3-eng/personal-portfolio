"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./demo.module.css";

export default function DemoPlayer() {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [fullscreenError, setFullscreenError] = useState(false);

  useEffect(() => {
    // A failed metadata request can finish before React attaches event handlers.
    const media = video.current;
    if (media && (media.error || media.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)) {
      setError(true);
    }
  }, []);

  async function fullscreen() {
    if (!video.current) return;
    try {
      await video.current.requestFullscreen();
      setFullscreenError(false);
    } catch {
      setFullscreenError(true);
    }
  }

  return (
    <>
      <div className={styles.player}>
        <video ref={video} controls playsInline preload="metadata" poster="/demo/LegalTrace-demo-poster.jpg"
          aria-label="LegalTrace 真实操作演示" onError={() => setError(true)} onLoadedData={() => setError(false)}>
          <source src="/demo/LegalTrace-demo-web.mp4" type="video/mp4" onError={() => setError(true)} />
          当前浏览器无法播放此视频。请使用支持 MP4 的浏览器。
        </video>
      </div>
      <div className={styles.playerBar}>
        <span>LEGALTRACE / REAL WORKFLOW</span>
        <button type="button" onClick={fullscreen}>全屏播放</button>
      </div>
      {error && <p className={styles.message} role="alert">视频暂时无法加载。<button type="button" onClick={() => { setError(false); video.current?.load(); }}>重新加载</button></p>}
      {fullscreenError && <p className={styles.message} role="status">可尝试使用播放器右下角的全屏按钮。</p>}
    </>
  );
}
