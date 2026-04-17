"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import { Card } from "@/components/UI";
import { supabase } from "@/lib/supabase";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("users_profile")
        .select("id, full_name, email, role, active")
        .order("full_name", { ascending: true });

      if (error) {
        setErro(error.message);
      } else {
        setUsuarios(data || []);
      }
    }

    carregar();
  }, []);

  return (
    <ProtectedPage allowedRoles={["gestor_master"]}>
      <AppShell title="Usuários" subtitle="Visão inicial dos usuários cadastrados e seus perfis.">
        {erro ? (
          <Card>
            <div className="p-4 text-sm text-red-600">{erro}</div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {usuarios.map((user) => (
              <Card key={user.id}>
                <div className="p-5">
                  <p className="font-semibold text-slate-900">{user.full_name}</p>
                  <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    Perfil: {user.role} • Ativo: {user.active ? "Sim" : "Não"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </AppShell>
    </ProtectedPage>
  );
}
