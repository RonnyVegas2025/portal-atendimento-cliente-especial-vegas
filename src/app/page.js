"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Building2,
  Users,
  Ticket,
  MessageSquareMore,
  Clock3,
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
} from "lucide-react";

const companies = [
  { id: 1, nome: "Indústria Alfa", parceiro: "Canal Martins", contato: "RH - Juliana", cidade: "Campinas/SP", status: "Ativa" },
  { id: 2, nome: "Grupo Central", parceiro: "Canal Martins", contato: "RH - André", cidade: "Americana/SP", status: "Ativa" },
  { id: 3, nome: "Hospital Vida", parceiro: "Parceiro Prime", contato: "RH - Camila", cidade: "Piracicaba/SP", status: "VIP" },
  { id: 4, nome: "Logística Horizonte", parceiro: "Parceiro Prime", contato: "DP - Marcos", cidade: "Limeira/SP", status: "Ativa" }
];

const messages = [
  { id: 1, hora: "08:17", remetente: "Juliana RH", empresa: "Indústria Alfa", texto: "Preciso fazer a segunda via do cartão do Ronny", classificacao: "Segunda via", confianca: 94, status: "Triagem pendente", depto: "Cadastro" },
  { id: 2, hora: "08:42", remetente: "André RH", empresa: "Grupo Central", texto: "Incluir colaboradora nova para alimentação", classificacao: "Inclusão", confianca: 97, status: "Pré-chamado criado", depto: "Cadastro" },
  { id: 3, hora: "09:03", remetente: "Camila RH", empresa: "Hospital Vida", texto: "Funcionário sem conseguir usar o cartão no mercado", classificacao: "Dúvida operacional", confianca: 82, status: "Validar humano", depto: "Atendimento" },
  { id: 4, hora: "09:10", remetente: "Parceiro Prime", empresa: "Logística Horizonte", texto: "Cliente pediu urgência na alteração cadastral", classificacao: "Alteração cadastral", confianca: 91, status: "Triagem pendente", depto: "Cadastro" }
];

const tickets = [
  { id: "PVC-2026-000121", empresa: "Indústria Alfa", tipo: "Segunda via", funcionario: "Ronny Peterson", status: "Em andamento", depto: "Cadastro", responsavel: "Carol", aberto: "Hoje 08:18", sla: "4h restantes" },
  { id: "PVC-2026-000122", empresa: "Grupo Central", tipo: "Inclusão", funcionario: "Fernanda Lima", status: "Finalizado", depto: "Cadastro", responsavel: "Paula", aberto: "Hoje 08:43", sla: "Concluído" },
  { id: "PVC-2026-000123", empresa: "Hospital Vida", tipo: "Dúvida operacional", funcionario: "Não informado", status: "Aguardando", depto: "Atendimento", responsavel: "Leandro", aberto: "Hoje 09:05", sla: "1h atrasado" },
  { id: "PVC-2026-000124", empresa: "Logística Horizonte", tipo: "Alteração cadastral", funcionario: "João Vitor", status: "Aberto", depto: "Cadastro", responsavel: "-", aberto: "Hoje 09:11", sla: "6h restantes" }
];

const partnerTickets = tickets.filter((t) => ["Indústria Alfa", "Grupo Central"].includes(t.empresa));

const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "triagem", label: "Triagem IA", icon: MessageSquareMore },
  { key: "chamados", label: "Chamados", icon: Ticket },
  { key: "empresas", label: "Empresas", icon: Building2 },
  { key: "parceiro", label: "Portal Parceiro", icon: Users }
];

function Card({ children, className = "" }) {
  return <div className={`rounded-3xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</div>;
}

function Button({ children, variant = "solid", className = "", ...props }) {
  const styles =
    variant === "outline"
      ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
      : variant === "ghost"
      ? "bg-transparent text-slate-700 hover:bg-slate-100"
      : "bg-slate-900 text-white hover:bg-slate-800";
  return (
    <button className={`px-4 py-2 rounded-2xl text-sm font-medium transition ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 ${className}`}
      {...props}
    />
  );
}

function Badge({ children, className = "" }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>{children}</span>;
}

function StatCard({ title, value, hint, icon: Icon }) {
  return (
    <Card>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-3xl font-semibold mt-1 text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-2">{hint}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-100">
            <Icon className="w-5 h-5 text-slate-700" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ value }) {
  const map = {
    Aberto: "bg-slate-100 text-slate-700",
    "Em andamento": "bg-blue-100 text-blue-700",
    Finalizado: "bg-emerald-100 text-emerald-700",
    Aguardando: "bg-amber-100 text-amber-700",
    "Triagem pendente": "bg-violet-100 text-violet-700",
    "Pré-chamado criado": "bg-cyan-100 text-cyan-700",
    "Validar humano": "bg-rose-100 text-rose-700"
  };
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${map[value] || "bg-slate-100 text-slate-700"}`}>{value}</span>;
}

function Sidebar({ current, setCurrent, mobileOpen, setMobileOpen }) {
  return (
    <>
      <div className="hidden md:flex w-72 border-r border-slate-200 bg-white p-4 flex-col gap-3">
        <div className="px-3 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vegas Card</p>
          <h1 className="text-xl font-semibold text-slate-900 mt-1">Portal Parceiros Vegas</h1>
          <p className="text-sm text-slate-500 mt-2">Demo navegável do sistema de atendimento.</p>
        </div>
        <div className="grid gap-1">
          {nav.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setCurrent(key)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${current === key ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-80 bg-white p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-2 py-3">
              <h2 className="font-semibold">Portal Parceiros Vegas</h2>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid gap-1 mt-4">
              {nav.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrent(key);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${current === key ? "bg-slate-900 text-white" : "hover:bg-slate-100 text-slate-700"}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Header({ title, subtitle, setMobileOpen }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        <button className="md:hidden rounded-2xl border border-slate-300 bg-white p-2" onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <Badge className="bg-emerald-100 text-emerald-700">Demo</Badge>
        <Badge className="bg-slate-100 text-slate-700">Admin + Parceiro</Badge>
      </div>
    </div>
  );
}

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Chamados abertos" value="18" hint="6 novos hoje" icon={Ticket} />
        <StatCard title="Mensagens em triagem" value="11" hint="IA já classificou 9" icon={MessageSquareMore} />
        <StatCard title="Tempo médio" value="2h14" hint="até finalização" icon={Clock3} />
        <StatCard title="Empresas especiais" value="42" hint="7 com alto volume" icon={Building2} />
      </div>

      <div className="grid xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <div className="p-5 border-b border-slate-200"><h3 className="text-base font-semibold">Fila rápida de atendimento</h3></div>
          <div className="p-5 space-y-3">
            {tickets.slice(0, 4).map((t) => (
              <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900">{t.id}</p>
                    <StatusBadge value={t.status} />
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{t.empresa} • {t.tipo} • {t.funcionario}</p>
                  <p className="text-xs text-slate-500 mt-1">Depto: {t.depto} • Responsável: {t.responsavel}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500">{t.sla}</span>
                  <Button>Abrir</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="p-5 border-b border-slate-200"><h3 className="text-base font-semibold">Gargalos do dia</h3></div>
          <div className="p-5 space-y-3">
            {[
              ["Cadastro", "7 chamados"],
              ["Atendimento", "3 aguardando retorno"],
              ["Financeiro", "1 pendência"]
            ].map(([label, val]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">{val}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function TriagemPage() {
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input placeholder="Buscar mensagem, empresa ou remetente" className="pl-9" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2 inline" />Filtrar</Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {messages.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="p-5">
                <div className="flex flex-col xl:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-slate-100 text-slate-700">{m.hora}</Badge>
                      <StatusBadge value={m.status} />
                      <Badge className="bg-blue-100 text-blue-700">{m.classificacao}</Badge>
                      <Badge className="bg-emerald-100 text-emerald-700">Confiança {m.confianca}%</Badge>
                    </div>
                    <p className="font-medium text-slate-900">{m.empresa} • {m.remetente}</p>
                    <p className="text-sm text-slate-600">“{m.texto}”</p>
                    <p className="text-xs text-slate-500">Sugestão IA: encaminhar para <b>{m.depto}</b> e solicitar complemento se faltar CPF ou matrícula.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row xl:flex-col gap-2 xl:w-56">
                    <Button>Criar chamado</Button>
                    <Button variant="outline">Validar dados</Button>
                    <Button variant="ghost">Descartar</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TicketsPage() {
  const [tab, setTab] = useState("todos");
  const filtered = useMemo(() => (tab === "todos" ? tickets : tickets.filter((t) => t.status === tab)), [tab]);
  const tabs = ["todos", "Aberto", "Em andamento", "Aguardando", "Finalizado"];

  return (
    <div className="space-y-4">
      <Card>
        <div className="p-4 flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className={`px-4 py-2 rounded-2xl text-sm ${tab === item ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {item === "todos" ? "Todos" : item}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input placeholder="Buscar protocolo ou empresa" className="pl-9" />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-slate-500 border-b border-slate-200 bg-slate-50">
          <div className="col-span-3">Protocolo / Empresa</div>
          <div className="col-span-2">Tipo</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Departamento</div>
          <div className="col-span-2">Responsável</div>
          <div className="col-span-1"></div>
        </div>
        {filtered.map((t) => (
          <div key={t.id} className="grid grid-cols-12 px-4 py-4 items-center border-b border-slate-100 text-sm">
            <div className="col-span-12 md:col-span-3 mb-2 md:mb-0">
              <p className="font-medium text-slate-900">{t.id}</p>
              <p className="text-slate-500 text-xs">{t.empresa}</p>
            </div>
            <div className="col-span-6 md:col-span-2 text-slate-700">{t.tipo}</div>
            <div className="col-span-6 md:col-span-2"><StatusBadge value={t.status} /></div>
            <div className="col-span-6 md:col-span-2 text-slate-700">{t.depto}</div>
            <div className="col-span-6 md:col-span-2 text-slate-700">{t.responsavel}</div>
            <div className="col-span-12 md:col-span-1 flex justify-end"><button className="p-2 rounded-2xl hover:bg-slate-100"><ChevronRight className="w-4 h-4" /></button></div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function CompaniesPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {companies.map((c) => (
        <Card key={c.id}>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">{c.nome}</p>
                <p className="text-sm text-slate-500 mt-1">{c.cidade}</p>
              </div>
              <Badge className={c.status === "VIP" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}>{c.status}</Badge>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-slate-600">
              <p><span className="text-slate-400">Parceiro:</span> {c.parceiro}</p>
              <p><span className="text-slate-400">Contato:</span> {c.contato}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button>Ver chamados</Button>
              <Button variant="outline">Editar</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function PartnerPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="p-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <p className="text-sm text-slate-300">Painel do parceiro</p>
            <h3 className="text-2xl font-semibold mt-1">Canal Martins</h3>
            <p className="text-sm text-slate-300 mt-2">Visão simplificada para abrir e acompanhar chamados da sua carteira.</p>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-slate-100">Abrir novo chamado</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Empresas da carteira" value="2" hint="Indústria Alfa e Grupo Central" icon={Building2} />
        <StatCard title="Chamados em aberto" value="3" hint="1 exige retorno" icon={AlertCircle} />
        <StatCard title="Chamados finalizados" value="12" hint="últimos 30 dias" icon={CheckCircle2} />
      </div>

      <Card>
        <div className="p-5 border-b border-slate-200"><h3 className="text-base font-semibold">Meus chamados</h3></div>
        <div className="p-5 space-y-3">
          {partnerTickets.map((t) => (
            <div key={t.id} className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-slate-900">{t.id}</p>
                  <StatusBadge value={t.status} />
                </div>
                <p className="text-sm text-slate-600 mt-1">{t.empresa} • {t.tipo}</p>
                <p className="text-xs text-slate-500 mt-1">Abertura: {t.aberto}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-100 text-slate-700">{t.sla}</Badge>
                <Button variant="outline">Detalhes</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function HomePage() {
  const [current, setCurrent] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const screens = {
    dashboard: {
      title: "Dashboard administrativo",
      subtitle: "Visão geral da operação, gargalos e produtividade do atendimento.",
      component: <DashboardPage />
    },
    triagem: {
      title: "Triagem de mensagens com IA",
      subtitle: "Mensagens recebidas, leitura automática e sugestão antes do atendente assumir.",
      component: <TriagemPage />
    },
    chamados: {
      title: "Gestão de chamados",
      subtitle: "Protocolos, responsáveis, departamentos e SLA em um só lugar.",
      component: <TicketsPage />
    },
    empresas: {
      title: "Empresas especiais",
      subtitle: "Base de clientes já cadastrada para acelerar identificação e abertura de demanda.",
      component: <CompaniesPage />
    },
    parceiro: {
      title: "Portal do parceiro",
      subtitle: "Visão web simplificada para o parceiro acompanhar a carteira e abrir solicitações.",
      component: <PartnerPage />
    }
  };

  const active = screens[current];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar current={current} setCurrent={setCurrent} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-4 md:p-8">
          <Header title={active.title} subtitle={active.subtitle} setMobileOpen={setMobileOpen} />
          <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {active.component}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

