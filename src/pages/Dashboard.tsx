import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, User, Building2, LogOut, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает", color: "bg-warning/15 text-warning" },
  processing: { label: "В обработке", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Отправлен", color: "bg-accent/15 text-accent" },
  delivered: { label: "Доставлен", color: "bg-success/15 text-success" },
  cancelled: { label: "Отменён", color: "bg-destructive/15 text-destructive" },
};

export default function Dashboard() {
  const { user, profile, signOut, isB2B } = useAuth();
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

  if (!user) { navigate("/auth"); return null; }

  const handleSave = async () => {
    const { error } = await supabase.from("profiles").update(formData).eq("id", user.id);
    if (error) toast.error("Ошибка сохранения");
    else toast.success("Данные сохранены");
  };

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">Личный кабинет</span>
        </nav>

        {/* Header card */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center">
              {isB2B ? <Building2 className="w-7 h-7 text-accent-foreground" /> : <User className="w-7 h-7 text-accent-foreground" />}
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">{profile?.full_name || "Пользователь"}</h1>
              <p className="text-sm text-primary-foreground/60">
                {isB2B ? `B2B клиент${profile?.company_name ? ` · ${profile.company_name}` : ""}` : "Частный клиент"}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40">
            <LogOut className="w-4 h-4 mr-1" /> Выйти
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-semibold mb-5 flex items-center gap-2"><User className="w-4 h-4 text-muted-foreground" /> Мои реквизиты</h2>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">ФИО</Label>
                <Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="mt-1" />
              </div>
              {isB2B && (
                <>
                  <div>
                    <Label className="text-xs">Компания</Label>
                    <Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs">ИНН</Label>
                    <Input value={formData.inn} onChange={(e) => setFormData({ ...formData, inn: e.target.value })} className="mt-1" />
                  </div>
                </>
              )}
              <div>
                <Label className="text-xs">Телефон</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1" />
              </div>
              <Button onClick={handleSave} className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold mt-2">Сохранить изменения</Button>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold flex items-center gap-2"><Package className="w-4 h-4 text-muted-foreground" /> Последние заказы</h2>
              <Link to="/orders" className="text-xs text-accent hover:underline flex items-center gap-1">
                Все заказы <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {orders && orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 3).map((o) => {
                  const status = statusLabels[o.status] || { label: o.status, color: "bg-muted text-muted-foreground" };
                  return (
                    <div key={o.id} className="border border-border rounded-lg p-3 hover:shadow-card transition-shadow">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("ru-RU")}</span>
                        <span className="font-display font-bold">{Number(o.total).toLocaleString("ru-RU")} ₽</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Заказов пока нет</p>
                <Link to="/catalog" className="text-sm text-accent hover:underline mt-2 inline-block">Перейти в каталог</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
