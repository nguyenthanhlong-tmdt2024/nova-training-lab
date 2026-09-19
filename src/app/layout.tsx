import type { Metadata, Viewport } from "next";
import "../../assets/css/styles.css";

export const metadata: Metadata = {
  title: "NOVA TRAINING LAB | Stronger Every Round",
  description:
    "NOVA TRAINING LAB – hệ thống tập luyện đa bộ môn, coaching theo mục tiêu và Recovery để tiến bộ bền vững qua từng buổi tập.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/assets/images/favicon-32.png",
    apple: "/assets/images/favicon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101C2C",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
