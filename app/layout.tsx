import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/components/AppStateProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zakat Calculator — Connect, Calculate, Give",
  description:
    "A privacy-first zakat calculator that connects to your real accounts via Plaid. No data stored. All calculations client-side.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
