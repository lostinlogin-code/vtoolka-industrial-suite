import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, ShoppingCart, DollarSign, Users } from "lucide-react";

const COLORS = ["hsl(24, 95%, 50%)", "hsl(213, 56%, 24%)", "hsl(142, 72%, 35%)", "hsl(38, 92%, 50%)", "hsl(215, 15%, 40%)"];

export default function AnalyticsTab() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-analytics-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: topProducts } = useQuery({
    queryKey: ["admin-analytics-top-products"],
    queryFn: async () => {
      const { data } = await supabase.from("order_items").select("product_name, quantity, price");
      return data ?? [];
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin-analytics-profiles"],
    queryFn: async () => {
      const { data } = await supabase.rpc("admin_get_profiles");
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    );
  }

  const totalRevenue = orders?.reduce((s, o) => s + Number(o.total), 0) ?? 0;
  const totalOrders = orders?.length ?? 0;
  const b2bUsers = profiles?.filter((p: any) => p.is_b2b).length ?? 0;
  const b2cUsers = (profiles?.length ?? 0) - b2bUsers;

  // Sales by day (last 30 days)
  const salesByDay: Record<string, number> = {};
  orders?.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
    salesByDay[day] = (salesByDay[day] || 0) + Number(o.total);
  });
  const chartData = Object.entries(salesByDay).slice(-14).map(([date, total]) => ({ date, total }));

  // Top products
  const productMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  topProducts?.forEach((item: any) => {
    const key = item.product_name || "Unknown";
    if (!productMap[key]) productMap[key] = { name: key, qty: 0, revenue: 0 };
    productMap[key].qty += item.quantity;
    productMap[key].revenue += Number(item.price) * item.quantity;
  });
  const topList = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 10);

  const conversionData = [
    { name: "B2C", value: b2cUsers },
    { name: "B2B", value: b2bUsers },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard icon={<DollarSign className="w-5 h-5" />} label="Выручка" value={`${totalRevenue.toLocaleString("ru-RU")} ₽`} />
        <KPICard icon={<ShoppingCart className="w-5 h-5" />} label="Заказов" value={String(totalOrders)} />
        <KPICard icon={<Users className="w-5 h-5" />} label="Пользователей" value={String(profiles?.length ?? 0)} />
        <KPICard icon={<TrendingUp className="w-5 h-5" />} label="Ср. чек" value={`${totalOrders ? Math.round(totalRevenue / totalOrders).toLocaleString("ru-RU") : 0} ₽`} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sales chart */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">Продажи по дням</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => `${v.toLocaleString("ru-RU")} ₽`} />
              <Bar dataKey="total" fill="hsl(24, 95%, 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* B2B/B2C pie */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 text-sm">B2B / B2C</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={conversionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {conversionData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3 text-sm">Топ-10 товаров по выручке</h3>
        <div className="space-y-2">
          {topList.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm border-b last:border-0 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                <span className="truncate max-w-[300px]">{p.name}</span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{p.qty} шт.</span>
                <span className="font-semibold text-foreground">{p.revenue.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          ))}
          {topList.length === 0 && <p className="text-sm text-muted-foreground">Нет данных</p>}
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:shadow-card transition-shadow">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">{icon}</div>
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-xl font-bold font-display">{value}</p>
    </div>
  );
}
