"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import { Card, Button, Input, Label, Select } from "@/components/UI";
import { supabase } from "@/lib/supabase";
import { formatCNPJ, onlyDigits } from "@/lib/format";

const initialState = {
  legal_name: "",
  trade_name: "",
  cnpj: "",
  city: "",
  state: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  status: "active"
};

function NovaEmpresaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId");

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function carregarEmpresa() {
      if (!companyId || !supabase) return;

      const { data, error } = await supabase
        .from("companies")
        .select("id, legal_name, trade_name, cnpj, city, state, contact_name, contact_phone, contact_email, status")
        .eq("id", companyId)
        .single();

      if (!error && data) {
        setForm({
          legal_name: data.legal_name || "",
          trade_name: data.trade_name || "",
          cnpj: data.cnpj || "",
          city: data.city || "",
          state: data.state || "",
          contact_name: data.contact_name || "",
          contact_phone: data.contact_phone || "",
          contact_email: data.contact_email || "",
          status: data.status || "active"
        });
      }
    }

    carregarEmpresa();
  }, [companyId]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!supabase) {
      setErro("Supabase não configurado.");
      return;
    }

    if (!form.trade_name.trim()) {
      setErro("Informe o nome da empresa.");
      return;
    }

    setLoading(true);

    const payload = {
      legal_name: form.legal_name.trim() || null,
      trade_name: form.trade_name.trim(),
      cnpj: onlyDigits(form.cnpj) || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      contact_name: form.contact_name.trim() || null,
      contact_phone: form.contact_phone.trim() || null,
      contact_email: form.contact_email.trim() || null,
      status: form.status
    };

    let response;
    if (companyId) {
      response = await supabase
        .from("companies")
        .update(payload)
        .eq("id", companyId)
        .select("id")
        .single();
    } else {
      response = await supabase
        .from("companies")
        .insert(payload)
        .select("id")
        .single();
    }

    if (response.error) {
      setErro(response.error.message);
    } else {
      setSucesso(companyId ? "Empresa atualizada com sucesso." : "Empresa cadastrada com sucesso.");
      setTimeout(() => router.push("/empresas"), 900);
    }

    setLoading(false);
  }

  return (
    <AppShell title={companyId ? "Editar empresa" : "Nova empresa"} subtitle="Cadastre a empresa para localizar rápido no atendimento.">
      <Card>
        <form onSubmit={handleSubmit} className="p-5 grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Nome fantasia / Empresa</Label>
            <Input value={form.trade_name} onChange={(e) => handleChange("trade_name", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>Razão social</Label>
            <Input value={form.legal_name} onChange={(e) => handleChange("legal_name", e.target.value)} />
          </div>

          <div>
            <Label>CNPJ</Label>
            <Input
              value={form.cnpj}
              onChange={(e) => handleChange("cnpj", formatCNPJ(e.target.value))}
              placeholder="00.000.000/0000-00"
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
              <option value="active">Ativa</option>
              <option value="inactive">Inativa</option>
            </Select>
          </div>

          <div>
            <Label>Cidade</Label>
            <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
          </div>

          <div>
            <Label>Estado</Label>
            <Input value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
          </div>

          <div>
            <Label>Contato principal</Label>
            <Input value={form.contact_name} onChange={(e) => handleChange("contact_name", e.target.value)} />
          </div>

          <div>
            <Label>Telefone contato</Label>
            <Input value={form.contact_phone} onChange={(e) => handleChange("contact_phone", e.target.value)} />
          </div>

          <div className="md:col-span-2">
            <Label>E-mail contato</Label>
            <Input type="email" value={form.contact_email} onChange={(e) => handleChange("contact_email", e.target.value)} />
          </div>

          {erro ? <p className="md:col-span-2 text-sm text-red-600">{erro}</p> : null}
          {sucesso ? <p className="md:col-span-2 text-sm text-emerald-600">{sucesso}</p> : null}

          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : companyId ? "Atualizar empresa" : "Salvar empresa"}
            </Button>
            <Button type="button" variant="outline" onClick={() => history.back()}>
              Voltar
            </Button>
          </div>
        </form>
      </Card>
    </AppShell>
  );
}

export default function NovaEmpresaPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-500">Carregando...</div>}>
      <NovaEmpresaContent />
    </Suspense>
  );
}
