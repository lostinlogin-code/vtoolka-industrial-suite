import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Truck, CreditCard, User, ArrowLeft } from "lucide-react";

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
      <div className="container max-w-3xl py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <Link to="/cart" className="hover:text-foreground">Корзина</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">Оформление</span>
        </nav>
        <h1 className="text-2xl font-display font-bold mb-6">Оформление заказа</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Contacts */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</div>
              <h2 className="font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Контактные данные</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label className="text-xs">Имя *</Label><Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required className="mt-1" /></div>
              <div><Label className="text-xs">Телефон *</Label><Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} required className="mt-1" /></div>
            </div>
            <div className="mt-3"><Label className="text-xs">Email *</Label><Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required className="mt-1" /></div>
          </div>

          {/* Step 2: Delivery */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</div>
              <h2 className="font-semibold flex items-center gap-2"><Truck className="w-4 h-4" /> Доставка</h2>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Способ доставки</Label>
                <Select value={form.delivery_method} onValueChange={(v) => setForm({ ...form, delivery_method: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="СДЭК">СДЭК — до двери или пункта выдачи</SelectItem>
                    <SelectItem value="ПЭК">ПЭК — для крупногабаритных грузов</SelectItem>
                    <SelectItem value="Деловые Линии">Деловые Линии — экономичная доставка</SelectItem>
                    <SelectItem value="Самовывоз">Самовывоз (Москва)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Адрес доставки</Label><Input value={form.delivery_address} onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} placeholder="Город, улица, дом, офис" className="mt-1" /></div>
              <div><Label className="text-xs">Комментарий к заказу</Label><Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Удобное время доставки, доп. информация" className="mt-1" /></div>
            </div>
          </div>

          {/* Step 3: Summary */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</div>
              <h2 className="font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4" /> Ваш заказ</h2>
            </div>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground mr-2">{item.sku}</span>
                    <span className="truncate">{item.name}</span>
                    <span className="text-muted-foreground"> × {item.quantity}</span>
                  </div>
                  <span className="font-medium shrink-0 ml-4">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                </div>
              ))}
              <div className="flex justify-between text-lg font-display font-bold pt-3 border-t border-border">
                <span>Итого:</span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/cart" className="flex-1">
              <Button variant="outline" className="w-full h-12 border-border hover:bg-secondary">
                <ArrowLeft className="w-4 h-4 mr-2" /> Назад в корзину
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-[2] bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold text-base h-12">
              {loading ? "Оформление..." : "Подтвердить заказ"} <Check className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
