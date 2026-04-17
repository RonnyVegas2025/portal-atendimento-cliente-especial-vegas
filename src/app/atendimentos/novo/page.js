"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import { Card, Button, Input } from "@/components/UI";
import { supabase } from "@/lib/supabase";

function NovoAtendimentoContent() {
  const router = useRouter();
  const [desc, setDesc] = useState("");

  async function salvar() {
    await supabase.from("tickets").insert({
      description: desc
    });

    router.push("/atendimentos");
  }

  return (
    <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
      <AppShell title="Novo Atendimento">
        <Card>
          <div className="p-4">
            <Input value={desc} onChange={(e) => setDesc(e.target.value)} />
            <Button onClick={salvar}>Salvar</Button>
          </div>
        </Card>
      </AppShell>
    </ProtectedPage>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NovoAtendimentoContent />
    </Suspense>
  );
}
