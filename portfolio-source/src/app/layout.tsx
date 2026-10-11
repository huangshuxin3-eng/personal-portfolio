import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "HUANG SHUXIN — AI Product Portfolio",
  description:
    "Huang Shuxin · AI Product Manager / AI Product Operations. 个人作品集：简历、AI 产品作品集与工作台演示。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="font-vars">
      <body className="paper-noise font-display antialiased">{children}</body>
    </html>
  );
}
