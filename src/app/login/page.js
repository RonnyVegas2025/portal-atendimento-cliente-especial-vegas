"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Button, Input, Label } from "@/components/UI";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, profile, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user && profile) {
      router.replace("/");
    }
  }, [user, profile, loading, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSubmitting(true);

    try {
      await signIn(email, password);
      router.replace("/");
    } catch (error) {
      setErro(error.message || "Não foi possível entrar.");
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vegas Card</p>
          <h1 className="text-2xl font-semibold mt-2">Entrar no Portal</h1>
          <p className="text-sm text-slate-500 mt-2">
            Use seu e-mail e senha cadastrados no Supabase Auth.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div>
              <Label>E-mail</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <Label>Senha</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {erro ? <p className="text-sm text-red-600">{erro}</p> : null}

            <Button type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
