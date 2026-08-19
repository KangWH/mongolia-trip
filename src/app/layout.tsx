import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
});

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: "몽골 2026 · 8.23–8.28",
  description:
    "울란바토르, 세미고비, 테를지 일자별 일정. 인천에서 울란바토르로 가 부산으로 돌아온다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${sans.variable} ${serif.variable} antialiased`}>
      <body className="bg-cream font-sans text-ink">{children}</body>
    </html>
  );
}
