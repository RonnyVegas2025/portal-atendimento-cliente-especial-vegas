"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Card } from "@/components/UI";

export default function ProtectedPage({ children, allowedRoles = [] }) {
  const { loading } = useRequireAuth(allowedRoles);

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <div className="p-6 text-sm text-slate-500">Carregando acesso...</div>
        </Card>
      </div>
    );
  }

  return children;
}
