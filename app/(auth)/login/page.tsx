"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Form side */}
      <div className="flex-1 flex flex-col justify-center px-8 max-w-md">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">U</span>
            </div>
            <span className="font-semibold text-foreground">Uprising Anarchy</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Accédez à votre espace de prospection
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium">Courriel</Label>
            <Input
              id="email"
              type="email"
              placeholder="vous@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-9 text-sm"
            />
          </div>
          <Button className="w-full h-9 text-sm">Se connecter</Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-primary hover:underline">Créer un compte</Link>
        </p>
      </div>

      {/* Visual side */}
      <div className="flex-1 bg-foreground flex flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="relative z-10 text-center">
          <p className="text-2xl font-bold text-background leading-tight mb-3">
            Prospectez.<br />Convertissez.<br />Domininez.
          </p>
          <p className="text-sm text-background/60 max-w-xs">
            L&apos;outil de prospection taillé pour les agences qui livrent des résultats réels.
          </p>
        </div>
      </div>
    </div>
  );
}
