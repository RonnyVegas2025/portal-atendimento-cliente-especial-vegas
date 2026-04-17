"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/AppShell";
import { Card, StatCard } from "@/components/UI";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { profile } = useAuth();

  return (
    <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
      <AppShell title="Dashboard" subtitle="Versão com login, sessão e perfil de acesso.">
        <div className="grid md:grid-cols-3 gap-4">
          <StatCard title="Perfil logado" value={profile?.role || "-"} hint="Controle de acesso ativo." />
          <StatCard title="Fluxo principal" value="Buscar empresa" hint="Primeiro localiza a empresa, depois abre o atendimento." />
          <StatCard title="Status do sistema" value="Protegido" hint="Acesso exige login." />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 mt-6">
          <Card>
            <div className="p-5">
              <h3 className="text-lg font-semibold">1. Buscar empresa</h3>
              <p className="text-sm text-slate-500 mt-2">Localize a empresa por nome ou CNPJ antes de abrir um atendimento.</p>
              <Link href="/empresas" className="inline-block mt-4 px-4 py-2 rounded-2xl bg-slate-900 text-white text-sm font-medium">
                Ir para empresas
              </Link>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <h3 className="text-lg font-semibold">2. Cadastrar empresa</h3>
              <p className="text-sm text-slate-500 mt-2">Se a empresa ainda não estiver na base, faça o cadastro direto no sistema.</p>
              <Link href="/empresas/nova" className="inline-block mt-4 px-4 py-2 rounded-2xl bg-slate-900 text-white text-sm font-medium">
                Nova empresa
              </Link>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <h3 className="text-lg font-semibold">3. Abrir atendimento</h3>
              <p className="text-sm text-slate-500 mt-2">Gere um protocolo e acompanhe o andamento do atendimento.</p>
              <Link href="/atendimentos/novo" className="inline-block mt-4 px-4 py-2 rounded-2xl bg-slate-900 text-white text-sm font-medium">
                Novo atendimento
              </Link>
            </div>
          </Card>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
