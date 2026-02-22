import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "EFS Web Viewer",
  description: "EVE fitting share viewer"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#0b1020", color: "#f4f4f4" }}>{children}</body>
    </html>
  );
}
