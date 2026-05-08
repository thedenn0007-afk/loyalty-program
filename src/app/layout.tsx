import type { Metadata } from "next";
import "./globals.css";
import { DemoStateProvider } from "@/providers/demo-state-provider";

export const metadata: Metadata = {
  title: "Loyalty Ecosystem Demo",
  description: "Premium frontend-only restaurant loyalty ecosystem demo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DemoStateProvider>{children}</DemoStateProvider>
      </body>
    </html>
  );
}
