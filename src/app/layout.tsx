import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WCTI - 世界杯球迷人格测试',
  description: '你是哪种球迷？玄学毒奶？豪门信徒？熬夜战神？',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}