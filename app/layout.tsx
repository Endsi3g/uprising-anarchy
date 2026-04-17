import { Inter, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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
        <TooltipProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </TooltipProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
