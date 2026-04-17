# Portal Parceiros Vegas - V1

Versão 1 prática do sistema, sem triagem IA, com foco em:
- Buscar empresa no banco
- Cadastrar nova empresa
- Abrir atendimento
- Listar atendimentos

## Rodar localmente
```bash
npm install
npm run dev
```

## Variáveis de ambiente
Crie `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Rotas
- `/`
- `/empresas`
- `/empresas/nova`
- `/atendimentos`
- `/atendimentos/novo`
