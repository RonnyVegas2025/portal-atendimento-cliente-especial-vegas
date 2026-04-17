"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import ProtectedPage from "@/components/ProtectedPage";
import { Card, Button, Input, Label, Select } from "@/components/UI";
import { supabase } from "@/lib/supabase";

function NovoAtendimentoContent() {
  const router = useRouter();

  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    company_id: "",
    requester_name: "",
    employee_name: "",
    type: "",
    description: ""
  });

  useEffect(() => {
    async function loadEmpresas() {
      const { data } = await supabase
        .from("companies")
        .select("id, trade_name");

      setEmpresas(data || []);
    }

    loadEmpresas();
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function salvar() {
    if (!form.company_id) {
      alert("Selecione a empresa");
      return;
    }

    if (!form.description) {
      alert("Descreva a solicitação");
      return;
    }

    await supabase.from("tickets").insert({
      company_id: form.company_id,
      requester_name: form.requester_name,
      employee_name: form.employee_name,
      description: form.description,
      type: form.type
    });

    router.push("/atendimentos");
  }

  return (
    <ProtectedPage allowedRoles={["gestor_master", "supervisor_adm", "atendimento"]}>
      <AppShell title="Novo Atendimento">
        <Card>
          <div className="p-5 grid gap-4">

            <div>
              <Label>Empresa</Label>
              <Select onChange={(e) => handleChange("company_id", e.target.value)}>
                <option value="">Selecione</option>
                {empresas.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.trade_name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Solicitante (RH)</Label>
              <Input
                placeholder="Ex: Maria do RH"
                onChange={(e) => handleChange("requester_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Funcionário</Label>
              <Input
                placeholder="Ex: Ronny Peterson"
                onChange={(e) => handleChange("employee_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Tipo de solicitação</Label>
              <Select onChange={(e) => handleChange("type", e.target.value)}>
                <option value="">Selecione</option>
                <option>Segunda via cartão</option>
                <option>Inclusão funcionário</option>
                <option>Exclusão funcionário</option>
                <option>Alteração cadastro</option>
                <option>Outros</option>
              </Select>
            </div>

            <div>
              <Label>Descrição</Label>
              <textarea
                className="w-full border rounded-xl p-3"
                placeholder="Descreva a solicitação recebida..."
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <Button onClick={salvar}>
              Salvar atendimento
            </Button>

          </div>
        </Card>
      </AppShell>
    </ProtectedPage>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NovoAtendimentoContent />
    </Suspense>
  );
}
