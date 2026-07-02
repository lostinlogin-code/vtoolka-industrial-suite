import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Building2, UserRound } from "lucide-react";

export default function UsersTab() {
  const [search, setSearch] = useState("");

  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await supabase.rpc("admin_get_profiles");
      return data ?? [];
    },
  });

  const filtered = (profiles ?? []).filter((p: any) => {
    const q = search.toLowerCase();
    return (
      (p.full_name || "").toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.company_name || "").toLowerCase().includes(q) ||
      (p.inn || "").includes(q)
    );
  });

  if (isLoading) {
    return <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск по имени, email, компании, ИНН..." className="pl-9" />
        </div>
        <span className="text-sm text-muted-foreground">{filtered.length} пользователей</span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Тип</TableHead>
              <TableHead>Имя / Компания</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>ИНН</TableHead>
              <TableHead>Регистрация</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p: any) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.is_b2b ? (
                    <Badge variant="outline" className="gap-1 text-xs"><Building2 className="w-3 h-3" /> B2B</Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1 text-xs"><UserRound className="w-3 h-3" /> B2C</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium">{p.full_name || "—"}</span>
                    {p.company_name && <p className="text-xs text-muted-foreground">{p.company_name}</p>}
                  </div>
                </TableCell>
                <TableCell className="text-sm">{p.email || "—"}</TableCell>
                <TableCell className="text-sm">{p.phone || "—"}</TableCell>
                <TableCell className="font-mono text-xs">{p.inn || "—"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString("ru-RU")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
