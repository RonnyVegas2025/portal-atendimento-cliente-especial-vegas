"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Card, Button, Input, EmptyState } from "@/components/UI";
import { supabase } from "@/lib/supabase";
import { formatDateTime, onlyDigits } from "@/lib/format";
export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState([]); const [busca, setBusca] = useState(""); const [loading, setLoading] = useState(true); const [erro, setErro] = useState("");
  async function carregarEmpresas() {
    if (!supabase) { setErro("Supabase não configurado nas variáveis de ambiente."); setLoading(false); return; }
    setLoading(true); setErro("");
    const { data, error } = await supabase.from("companies").select("id, trade_name, legal_name, cnpj, city, state, status, contact_name, created_at").order("trade_name", { ascending: true });
    if (error) { setErro(error.message); setEmpresas([]); } else { setEmpresas(data || []); }
    setLoading(false);
  }
  useEffect(() => { carregarEmpresas(); }, []);
  const empresasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim(); const digits = onlyDigits(busca); if (!termo) return empresas;
    return empresas.filter((empresa) => { const nome = (empresa.trade_name || "").toLowerCase(); const razao = (empresa.legal_name || "").toLowerCase(); const cnpj = onlyDigits(empresa.cnpj || ""); return nome.includes(termo) || razao.includes(termo) || (digits && cnpj.includes(digits)); });
  }, [empresas, busca]);
  return (<AppShell title="Empresas" subtitle="Busque por nome ou CNPJ antes de abrir o atendimento."><Card><div className="p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between"><Input placeholder="Buscar empresa por nome ou CNPJ" value={busca} onChange={(e) => setBusca(e.target.value)} className="md:max-w-xl" /><div className="flex gap-2"><Button variant="outline" onClick={carregarEmpresas}>Atualizar</Button><Link href="/empresas/nova"><Button>Nova empresa</Button></Link></div></div></Card>{erro ? <Card className="mt-4"><div className="p-4 text-sm text-red-600">{erro}</div></Card> : null}{loading ? <Card className="mt-4"><div className="p-4 text-sm text-slate-500">Carregando empresas...</div></Card> : empresasFiltradas.length === 0 ? <div className="mt-4"><EmptyState title="Nenhuma empresa encontrada" description="Se não achou a empresa, faça o cadastro e depois abra o atendimento." /></div> : <div className="grid gap-4 mt-4">{empresasFiltradas.map((empresa) => (<Card key={empresa.id}><div className="p-5 flex flex-col lg:flex-row gap-4 justify-between"><div><p className="text-lg font-semibold text-slate-900">{empresa.trade_name || empresa.legal_name}</p><p className="text-sm text-slate-500 mt-1">CNPJ: {empresa.cnpj || "-"} • {empresa.city || "-"} / {empresa.state || "-"}</p><p className="text-sm text-slate-500 mt-1">Contato: {empresa.contact_name || "-"} • Status: {empresa.status || "-"}</p><p className="text-xs text-slate-400 mt-2">Cadastro: {formatDateTime(empresa.created_at)}</p></div><div className="flex gap-2 items-start"><Link href={`/atendimentos/novo?companyId=${empresa.id}`}><Button>Abrir atendimento</Button></Link><Link href={`/empresas/nova?companyId=${empresa.id}`}><Button variant="outline">Editar</Button></Link></div></div></Card>))}</div>}</AppShell>);
}

