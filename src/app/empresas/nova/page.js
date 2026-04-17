"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
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

      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .single();

      if (data) setForm(data);
    }

    carregarEmpresa();
  }, [companyId]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!form.trade_name) {
      setErro("Informe o nome da empresa.");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      cnpj: onlyDigits(form.cnpj)
    };

    let response;

    if (companyId) {
      response = await supabase.from("companies").update(payload).eq("id", companyId);
    } else {
      response = await supabase.from("companies").insert(payload);
    }

    if (response.error) {
      setErro(response.error.message);
    } else {
      setSucesso("Salvo com sucesso!");
      setTimeout(() => router.push("/empresas"), 1000);
    }

    setLoading(false);
  }

  return (
    <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
      <AppShell title="Empresa">
        <Card>
          <form onSubmit={handleSubmit} className="p-5 grid gap-4">
            <Label>Nome</Label>
            <Input value={form.trade_name} onChange={(e) => handleChange("trade_name", e.target.value)} />

            <Label>CNPJ</Label>
            <Input value={form.cnpj} onChange={(e) => handleChange("cnpj", formatCNPJ(e.target.value))} />

            <Button type="submit">
              {loading ? "Salvando..." : "Salvar"}
            </Button>

            {erro && <p className="text-red-600">{erro}</p>}
            {sucesso && <p className="text-green-600">{sucesso}</p>}
          </form>
        </Card>
      </AppShell>
    </ProtectedPage>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NovaEmpresaContent />
    </Suspense>
  );
}
