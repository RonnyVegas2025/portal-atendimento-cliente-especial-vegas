"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import { Card } from "@/components/UI";
import { supabase } from "@/lib/supabase";

export default function Page() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("tickets").select("*");
      setDados(data || []);
    }
    load();
  }, []);

  return (
    <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
      <AppShell title="Atendimentos">
        <div className="grid gap-4">
          {dados.map((d) => (
            <Card key={d.id}>
              <div className="p-4">{d.description}</div>
            </Card>
          ))}
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
