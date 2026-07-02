import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, FileText, ArrowRight, Check, Truck, Shield, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { isB2B } = useAuth();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, categories(name, slug)").eq("id", id!).single();
      return data;
    },
    enabled: !!id,
  });

  const { data: analogs } = useQuery({
    queryKey: ["analogs", id],
    queryFn: async () => {
      const { data } = await supabase.from("product_analogs").select("*").eq("product_id", id!);
      return data ?? [];
    },
    enabled: !!id,
  });

  if (isLoading) return (
    <Layout>
      <div className="container py-6">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </Layout>
  );
  if (!product) return <Layout><div className="container py-12 text-center text-muted-foreground">Товар не найден</div></Layout>;

  const price = isB2B ? Number(product.price_wholesale) : Number(product.price_retail);
  const specs = (product.technical_specs && typeof product.technical_specs === "object" && !Array.isArray(product.technical_specs))
    ? product.technical_specs as Record<string, string>
    : {};
  const inStock = product.stock_level > 0;

  const handleAdd = () => {
    addItem({ id: product.id, sku: product.sku, name: product.name, brand: product.brand, price, image_url: product.image_url }, qty);
    toast.success("Добавлено в корзину");
  };

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">Главная</Link>
          <span>/</span>
          <Link to="/catalog" className="hover:text-foreground transition-colors">Каталог</Link>
          {product.categories && (
            <>
              <span>/</span>
              <Link to={`/catalog?category=${(product.categories as any).slug}`} className="hover:text-foreground transition-colors">
                {(product.categories as any).name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground font-mono">{product.sku}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-card border border-border rounded-xl aspect-square flex items-center justify-center p-10 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="max-h-full object-contain" />
            ) : (
              <Package className="w-32 h-32 text-muted-foreground/20" />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground bg-secondary px-2.5 py-1 rounded">Арт. {product.sku}</span>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> В наличии: {product.stock_level} шт.
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                  Нет в наличии
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold leading-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">Бренд: <span className="font-medium text-foreground">{product.brand}</span></p>

            {/* Price block */}
            <div className="mt-6 p-5 bg-card border border-border rounded-xl">
              {isB2B ? (
                <div className="flex items-end gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Оптовая цена</span>
                    <p className="text-3xl font-display font-bold text-accent">{Number(product.price_wholesale).toLocaleString("ru-RU")} ₽</p>
                  </div>
                  <div className="pb-1">
                    <span className="text-sm text-muted-foreground line-through">{Number(product.price_retail).toLocaleString("ru-RU")} ₽</span>
                    <p className="text-xs text-success font-medium">Выгода {Math.round((1 - Number(product.price_wholesale) / Number(product.price_retail)) * 100)}%</p>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Розничная цена</span>
                  <p className="text-3xl font-display font-bold">{Number(product.price_retail).toLocaleString("ru-RU")} ₽</p>
                </div>
              )}

              <div className="mt-5 flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none hover:bg-secondary" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="w-3.5 h-3.5" />
                  </Button>
                  <span className="w-12 text-center font-mono text-sm font-medium">{qty}</span>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-none hover:bg-secondary" onClick={() => setQty(qty + 1)}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <Button onClick={handleAdd} disabled={!inStock} className="flex-1 bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold h-10">
                  <ShoppingCart className="w-4 h-4 mr-2" /> В корзину
                </Button>
              </div>

              {isB2B && (
                <Button variant="outline" className="w-full mt-3 text-sm border-border hover:bg-secondary" onClick={() => toast.success("Запрос КП отправлен!")}>
                  <FileText className="w-4 h-4 mr-2" /> Запросить коммерческое предложение
                </Button>
              )}
            </div>

            {/* Quick info badges */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-1.5 p-3 bg-card border border-border rounded-lg text-center">
                <Truck className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Доставка по РФ</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-card border border-border rounded-lg text-center">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Гарантия качества</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 p-3 bg-card border border-border rounded-lg text-center">
                <Check className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Сертификат</span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h3 className="font-semibold text-sm mb-2">Описание</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Technical specs */}
        {Object.keys(specs).length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-display font-bold mb-4">Технические характеристики</h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-secondary/50" : ""}>
                      <td className="px-5 py-3 text-muted-foreground font-medium w-1/3 border-b border-border last:border-0">{key}</td>
                      <td className="px-5 py-3 font-mono text-sm border-b border-border last:border-0">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Analogs */}
        {analogs && analogs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-display font-bold mb-4">Сравнение с аналогами</h2>
            <div className="hidden md:block bg-card border border-border rounded-xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-5 py-3 text-left font-semibold">Артикул</th>
                    <th className="px-5 py-3 text-left font-semibold">Название</th>
                    <th className="px-5 py-3 text-left font-semibold">Бренд</th>
                    <th className="px-5 py-3 text-right font-semibold">Цена</th>
                    <th className="px-5 py-3 text-left font-semibold">Примечание</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-accent/5 border-b border-border">
                    <td className="px-5 py-3 font-mono font-semibold">{product.sku}</td>
                    <td className="px-5 py-3 font-medium">{product.name}</td>
                    <td className="px-5 py-3">{product.brand}</td>
                    <td className="px-5 py-3 text-right font-semibold text-accent">{price.toLocaleString("ru-RU")} ₽</td>
                    <td className="px-5 py-3 text-accent text-xs font-medium">← Наш товар</td>
                  </tr>
                  {analogs.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-mono text-muted-foreground">{a.analog_sku}</td>
                      <td className="px-5 py-3">{a.analog_name}</td>
                      <td className="px-5 py-3">{a.analog_brand}</td>
                      <td className="px-5 py-3 text-right">{a.analog_price ? `${Number(a.analog_price).toLocaleString("ru-RU")} ₽` : "—"}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{a.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{product.sku}</span>
                <p className="font-medium text-sm mt-2">{product.name}</p>
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <p className="font-semibold text-accent mt-1">{price.toLocaleString("ru-RU")} ₽</p>
                <span className="text-accent text-xs font-medium">← Наш товар</span>
              </div>
              {analogs.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-xl p-4">
                  <span className="font-mono text-xs text-muted-foreground">{a.analog_sku}</span>
                  <p className="text-sm mt-1">{a.analog_name}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{a.analog_brand}</span>
                    <span className="text-sm font-medium">{a.analog_price ? `${Number(a.analog_price).toLocaleString("ru-RU")} ₽` : "—"}</span>
                  </div>
                  {a.notes && <p className="text-xs text-muted-foreground mt-1">{a.notes}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
