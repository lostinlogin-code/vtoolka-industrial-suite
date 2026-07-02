import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, Package } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Корзина пуста</h1>
          <p className="text-muted-foreground mb-6">Добавьте товары из каталога, чтобы оформить заказ</p>
          <Link to="/catalog">
            <Button className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
              Перейти в каталог <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">Корзина</span>
        </nav>
        <h1 className="text-2xl font-display font-bold mb-6">Корзина <span className="text-muted-foreground font-normal text-base">({totalItems} тов.)</span></h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:shadow-card transition-shadow">
                <Link to={`/product/${item.id}`} className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="max-h-full object-contain" />
                  ) : (
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground">Арт. {item.sku}</span>
                  <Link to={`/product/${item.id}`} className="block text-sm font-medium mt-0.5 truncate hover:text-accent transition-colors">{item.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
                <div className="flex items-center border border-border rounded-lg overflow-hidden shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-12 h-8 text-center text-sm p-0 border-0 focus-visible:ring-0 rounded-none"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right shrink-0 w-24">
                  <p className="font-display font-bold text-sm">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</p>
                  <p className="text-[10px] text-muted-foreground">{item.price.toLocaleString("ru-RU")} ₽/шт</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive" onClick={clearCart}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Очистить корзину
            </Button>
          </div>

          {/* Summary */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit lg:sticky lg:top-44">
            <h3 className="font-display font-bold mb-4">Итого по заказу</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Товаров:</span><span className="font-medium">{totalItems} шт.</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Сумма:</span><span className="font-medium">{totalPrice.toLocaleString("ru-RU")} ₽</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Доставка:</span><span className="text-success font-medium">Рассчитывается</span></div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-display font-bold">
                <span>К оплате:</span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
            <Button
              className="w-full mt-5 bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold h-11"
              onClick={() => navigate(user ? "/checkout" : "/auth")}
            >
              {user ? "Оформить заказ" : "Войти и оформить"} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">Нажимая «Оформить заказ», вы соглашаетесь с условиями обработки заказа</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
