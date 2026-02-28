import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, Package, User } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    company_name: "",
    phone: "",
    inn: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        company_name: profile.company_name || "",
        phone: profile.phone || "",
        inn: profile.inn || "",
      });
    }
  }, [profile]);

  const { data: orders } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSave = async () => {
    const { error } = await supabase.from("profiles").update(formData).eq("id", user.id);
    if (error) toast.error("Ошибка сохранения");
    else toast.success("Данные сохранены");
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-display font-bold mb-6">Личный кабинет</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><User className="w-4 h-4" /> Мои реквизиты</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">ФИО</Label>
                <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Компания</Label>
                <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Телефон</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">ИНН</Label>
                <Input value={formData.inn} onChange={(e) => setFormData({ ...formData, inn: e.target.value })} />
              </div>
              <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover">Сохранить</Button>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2"><Package className="w-4 h-4" /> История заказов</h2>
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="border rounded p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                      <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("ru-RU")}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="capitalize">{o.status}</span>
                      <span className="font-semibold">{Number(o.total).toLocaleString("ru-RU")} ₽</span>
                    </div>
                    <Button variant="ghost" size="sm" className="mt-2 text-xs w-full" onClick={() => toast.success("Счёт скачан (mock)")}>
                      <FileDown className="w-3 h-3 mr-1" /> Скачать счёт
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Заказов пока нет</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
