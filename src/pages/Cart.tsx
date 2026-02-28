import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold mb-2">Корзина пуста</h1>
          <p className="text-muted-foreground mb-6">Добавьте товары из каталога</p>
          <Link to="/catalog">
            <Button className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover">
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
        <h1 className="text-2xl font-display font-bold mb-6">Корзина ({totalItems})</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-card border rounded-lg p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded flex items-center justify-center shrink-0">
                  <ShoppingCart className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="sku-badge">{item.sku}</span>
                  <Link to={`/product/${item.id}`} className="block text-sm font-medium mt-1 truncate hover:text-accent">{item.name}</Link>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <Input
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                    className="w-12 h-7 text-center text-sm p-0"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">{(item.price * item.quantity).toLocaleString("ru-RU")} ₽</p>
                  <p className="text-[10px] text-muted-foreground">{item.price.toLocaleString("ru-RU")} ₽/шт</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-card border rounded-lg p-6 h-fit sticky top-24">
            <h3 className="font-semibold mb-4">Итого</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Товаров:</span><span>{totalItems} шт.</span></div>
              <div className="flex justify-between border-t pt-2 text-lg font-display font-bold">
                <span>Сумма:</span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
            </div>
            <Button
              className="w-full mt-4 bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold"
              onClick={() => {
                if (!user) {
                  navigate("/auth");
                } else {
                  navigate("/checkout");
                }
              }}
            >
              Оформить заказ
            </Button>
            <Button variant="ghost" className="w-full mt-2 text-xs text-muted-foreground" onClick={clearCart}>
              Очистить корзину
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
