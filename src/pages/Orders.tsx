import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Ожидает", color: "bg-warning/15 text-warning" },
  processing: { label: "В обработке", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "Отправлен", color: "bg-accent/15 text-accent" },
  delivered: { label: "Доставлен", color: "bg-success/15 text-success" },
  cancelled: { label: "Отменён", color: "bg-destructive/15 text-destructive" },
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  if (!user) { navigate("/auth"); return null; }

  const { data: orders, isLoading } = useQuery({
    queryKey: ["user-orders", user.id],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ["user-order-items", user.id],
    queryFn: async () => {
      if (!orders?.length) return [];
      const ids = orders.map((o) => o.id);
      const { data } = await supabase.from("order_items").select("*").in("order_id", ids);
      return data ?? [];
    },
    enabled: !!orders?.length,
  });

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <Link to="/dashboard" className="hover:text-foreground">Личный кабинет</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">Заказы</span>
        </nav>

        <h1 className="text-2xl font-display font-bold mb-6">История заказов</h1>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <div className="flex justify-between mb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const items = orderItems?.filter((i) => i.order_id === order.id) ?? [];
              const status = statusLabels[order.status] || { label: order.status, color: "bg-muted text-muted-foreground" };
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-card transition-shadow">
                  <button
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">#{order.id.slice(0, 8)}</span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${status.color}`}>{status.label}</span>
                      <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold">{Number(order.total).toLocaleString("ru-RU")} ₽</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border p-4 bg-secondary/20 animate-fade-in">
                      <div className="grid sm:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground text-xs uppercase tracking-wider">Доставка</span>
                          <p className="mt-1 font-medium">{order.delivery_method || "—"}</p>
                          <p className="text-muted-foreground text-xs">{order.delivery_address || "—"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-xs uppercase tracking-wider">Контакт</span>
                          <p className="mt-1 font-medium">{order.contact_name}</p>
                          <p className="text-muted-foreground text-xs">{order.contact_phone}</p>
                        </div>
                      </div>

                      {items.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Товары</span>
                          {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-sm py-1.5 border-b border-border last:border-0">
                              <div className="flex-1 min-w-0">
                                <span className="font-mono text-xs text-muted-foreground mr-2">{item.product_sku}</span>
                                <Link to={`/product/${item.product_id}`} className="hover:text-accent transition-colors">{item.product_name}</Link>
                              </div>
                              <div className="text-right shrink-0 ml-4">
                                <span className="text-muted-foreground">{item.quantity} × {Number(item.price).toLocaleString("ru-RU")} ₽</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {order.notes && <p className="text-xs text-muted-foreground mt-3">Комментарий: {order.notes}</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Заказов пока нет</p>
            <p className="text-sm text-muted-foreground mt-1">Оформите первый заказ из каталога</p>
            <Link to="/catalog" className="inline-flex items-center gap-1 text-accent hover:underline text-sm mt-4 font-medium">
              Перейти в каталог <ChevronUp className="w-3.5 h-3.5 rotate-90" />
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
