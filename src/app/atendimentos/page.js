"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Card, Button, EmptyState } from "@/components/UI";
import { supabase } from "@/lib/supabase";
import { formatDateTime } from "@/lib/format";
export default function AtendimentosPage() {
  const [tickets, setTickets] = useState([]); const [loading, setLoading] = useState(true); const [erro, setErro] = useState("");
  async function carregarTickets() { if (!supabase) { setErro("Supabase não configurado."); setLoading(false); return; } setLoading(true); const { data, error } = await supabase.from("tickets").select("id, protocol, description, status, requester_name, employee_name, opened_at, companies:company_id (trade_name, cnpj)").order("opened_at", { ascending: false }); if (error) { setErro(error.message); setTickets([]); } else { setTickets(data || []); setErro(""); } setLoading(false); }
  useEffect(() => { carregarTickets(); }, []);
  return (<AppShell title="Atendimentos" subtitle="Lista inicial dos chamados abertos no sistema."><div className="flex justify-end mb-4"><Link href="/atendimentos/novo"><Button>Novo atendimento</Button></Link></div>{erro ? <Card><div className="p-4 text-sm text-red-600">{erro}</div></Card> : loading ? <Card><div className="p-4 text-sm text-slate-500">Carregando atendimentos...</div></Card> : tickets.length === 0 ? <EmptyState title="Nenhum atendimento cadastrado" description="Comece criando um novo atendimento vinculado a uma empresa." /> : <div className="grid gap-4">{tickets.map((ticket) => (<Card key={ticket.id}><div className="p-5 flex flex-col lg:flex-row gap-4 justify-between"><div><p className="text-lg font-semibold text-slate-900">{ticket.protocol || "-"}</p><p className="text-sm text-slate-500 mt-1">Empresa: {ticket.companies?.trade_name || "-"} • CNPJ: {ticket.companies?.cnpj || "-"}</p><p className="text-sm text-slate-500 mt-1">Solicitante: {ticket.requester_name || "-"} • Funcionário: {ticket.employee_name || "-"}</p><p className="text-sm text-slate-600 mt-2">{ticket.description || "-"}</p></div><div className="text-sm text-slate-500"><p>Status: {ticket.status || "-"}</p><p className="mt-2">Abertura: {formatDateTime(ticket.opened_at)}</p></div></div></Card>))}</div>}</AppShell>);
}

