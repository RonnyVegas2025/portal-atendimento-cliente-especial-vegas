"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Ticket, PlusCircle, Search, LayoutDashboard } from "lucide-react";
const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/empresas", label: "Empresas", icon: Building2 },
  { href: "/empresas/nova", label: "Nova Empresa", icon: PlusCircle },
  { href: "/atendimentos", label: "Atendimentos", icon: Ticket },
  { href: "/atendimentos/novo", label: "Novo Atendimento", icon: Search }
];
export default function AppShell({ title, subtitle, children }) {
  const pathname = usePathname();
  return (<div className="min-h-screen bg-slate-50"><div className="flex min-h-screen"><aside className="hidden md:flex w-72 border-r border-slate-200 bg-white p-5 flex-col"><div className="mb-6"><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vegas Card</p><h1 className="text-xl font-semibold mt-1">Portal Parceiros Vegas</h1><p className="text-sm text-slate-500 mt-2">Versão 1 operacional</p></div><nav className="grid gap-1">{links.map(({ href, label, icon: Icon }) => { const active = pathname === href; return (<Link key={href} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"}`}><Icon className="w-4 h-4" />{label}</Link>); })}</nav></aside><main className="flex-1 p-4 md:p-8"><header className="mb-6"><h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{title}</h2>{subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}</header>{children}</main></div></div>);
}

