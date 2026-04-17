"use client";

import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";

export default function Page() {
  return (
    <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
      <AppShell title="Dashboard">
        <div className="p-4">
          Sistema com login ativo 🚀
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
