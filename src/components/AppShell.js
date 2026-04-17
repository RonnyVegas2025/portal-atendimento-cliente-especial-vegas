"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Ticket,
  PlusCircle,
  Search,
  LayoutDashboard,
  LogOut,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

function getLinksByRole(role) {
  const common = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/empresas", label: "Empresas", icon: Building2 },
    { href: "/empresas/nova", label: "Nova Empresa", icon: PlusCircle },
    { href: "/atendimentos", label: "Atendimentos", icon: Ticket },
    { href: "/atendimentos/novo", label: "Novo Atendimento", icon: Search }
  ];

  if (role === "gestor_master") {
    return [...common, { href: "/usuarios", label: "Usuários", icon: Users }];
  }

  return common;
}

export default function AppShell({ title, subtitle, children }) {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const links = getLinksByRole(profile?.role);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden md:flex w-72 border-r border-slate-200 bg-white p-5 flex-col">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vegas Card</p>
            <h1 className="text-xl font-semibold mt-1">Portal Parceiros Vegas</h1>
            <p className="text-sm text-slate-500 mt-2">Acesso controlado por perfil</p>
          </div>

          <div className="mb-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">{profile?.full_name || "-"}</p>
            <p className="text-xs text-slate-500 mt-1">{profile?.email || "-"}</p>
            <p className="text-xs text-slate-500 mt-1">Perfil: {profile?.role || "-"}</p>
          </div>

          <nav className="grid gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6">
            <button
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <header className="mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{title}</h2>
            {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
