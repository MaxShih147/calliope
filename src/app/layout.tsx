import type { Metadata } from "next";
import { Source_Serif_4, Instrument_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calliope",
  description:
    "A quiet space to shape your words. Personal English speaking practice for professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${instrumentSans.variable} ${greatVibes.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-rule">
          <div className="mx-auto max-w-[720px] px-6 py-8 text-center">
            <p className="font-serif text-[11px] italic text-stone-400 tracking-wide">
              Calliope — muse of eloquence
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
