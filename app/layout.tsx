import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Uprising Anarchy — Agency OS",
  description: "Plateforme de prospection et Agency OS pour Uprising Studio MTL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={cn("h-full", "antialiased", playfair.variable, "font-sans", inter.variable)}>
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
