import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    contact_name: profile?.full_name || "",
    contact_phone: profile?.phone || "",
    contact_email: profile?.email || user?.email || "",
    delivery_method: "СДЭК",
    delivery_address: "",
    notes: "",
  });

  if (!user) { navigate("/auth"); return null; }
  if (items.length === 0) { navigate("/cart"); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user.id,
        total: totalPrice,
        ...form,
      }).select().single();
      if (error) throw error;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.name,
        product_sku: item.sku,
      }));
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      toast.success("Заказ оформлен!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Ошибка оформления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-2xl py-6">
        <h1 className="text-2xl font-display font-bold mb-6">Оформление заказа</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold">Контактные данные</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label className="text-xs">Имя</Label><Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required /></div>
              <div><Label className="text-xs">Телефон</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} required /></div>
            </div>
            <div><Label className="text-xs">Email</Label><Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required /></div>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="font-semibold">Доставка</h2>
            <div>
              <Label className="text-xs">Способ доставки</Label>
              <Select value={form.delivery_method} onValueChange={(v) => setForm({ ...form, delivery_method: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="СДЭК">СДЭК</SelectItem>
                  <SelectItem value="ПЭК">ПЭК</SelectItem>
                  <SelectItem value="Деловые Линии">Деловые Линии</SelectItem>
                  <SelectItem value="Самовывоз">Самовывоз (Москва)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Адрес доставки</Label><Input value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} placeholder="Город, улица, дом" /></div>
            <div><Label className="text-xs">Комментарий</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Дополнительная информация" /></div>
          </div>

          {/* Summary */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Ваш заказ</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                  <span>{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between text-lg font-display font-bold">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold text-base py-6">
            {loading ? "Оформление..." : "Подтвердить заказ"}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
