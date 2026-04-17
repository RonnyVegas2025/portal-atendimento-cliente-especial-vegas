"use client";
import ProtectedPage from "@/components/ProtectedPage";
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
 return (
  <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
    <AppShell title="Empresas" subtitle="Busque por nome ou CNPJ antes de abrir o atendimento.">
      ...conteúdo atual...
    </AppShell>
  </ProtectedPage>
);

