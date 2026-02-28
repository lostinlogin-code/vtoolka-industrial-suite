import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Package, FileText, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { isB2B, user } = useAuth();
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

  if (isLoading) return <Layout><div className="container py-12 text-center text-muted-foreground">Загрузка...</div></Layout>;
  if (!product) return <Layout><div className="container py-12 text-center text-muted-foreground">Товар не найден</div></Layout>;

  const price = isB2B ? Number(product.price_wholesale) : Number(product.price_retail);
  const specs = (product.technical_specs && typeof product.technical_specs === "object" && !Array.isArray(product.technical_specs))
    ? product.technical_specs as Record<string, string>
    : {};

  const handleAdd = () => {
    addItem({
      id: product.id,
      sku: product.sku,
      name: product.name,
      brand: product.brand,
      price,
      image_url: product.image_url,
    }, qty);
    toast.success("Добавлено в корзину");
  };

  return (
    <Layout>
      <div className="container py-6">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <Link to="/catalog" className="hover:text-foreground">Каталог</Link>
          {product.categories && (
            <>
              <span className="mx-1">/</span>
              <Link to={`/catalog?category=${(product.categories as any).slug}`} className="hover:text-foreground">
                {(product.categories as any).name}
              </Link>
            </>
          )}
          <span className="mx-1">/</span>
          <span className="text-foreground">{product.sku}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center p-8">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="max-h-full object-contain" />
            ) : (
              <Package className="w-32 h-32 text-muted-foreground/20" />
            )}
          </div>

          {/* Info */}
          <div>
            <span className="sku-badge text-sm">Арт. {product.sku}</span>
            <h1 className="mt-3 text-2xl font-display font-bold">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Бренд: <span className="font-medium text-foreground">{product.brand}</span></p>

            {/* Price */}
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              {isB2B ? (
                <div>
                  <span className="text-xs text-muted-foreground">Оптовая цена:</span>
                  <p className="text-3xl font-display font-bold text-accent">{Number(product.price_wholesale).toLocaleString("ru-RU")} ₽</p>
                  <span className="text-sm text-muted-foreground line-through">{Number(product.price_retail).toLocaleString("ru-RU")} ₽ розница</span>
                </div>
              ) : (
                <div>
                  <span className="text-xs text-muted-foreground">Розничная цена:</span>
                  <p className="text-3xl font-display font-bold">{Number(product.price_retail).toLocaleString("ru-RU")} ₽</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={product.stock_level}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center bg-card"
                />
                <Button onClick={handleAdd} disabled={product.stock_level <= 0} className="flex-1 bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
                  <ShoppingCart className="w-4 h-4 mr-2" /> В корзину
                </Button>
              </div>

              {product.stock_level > 0 ? (
                <p className="text-xs text-success mt-2">✓ В наличии: {product.stock_level} шт.</p>
              ) : (
                <p className="text-xs text-destructive mt-2">Нет в наличии</p>
              )}

              {isB2B && (
                <Button variant="outline" className="w-full mt-3 text-sm" onClick={() => toast.success("Запрос КП отправлен!")}>
                  <FileText className="w-4 h-4 mr-2" /> Запросить коммерческое предложение
                </Button>
              )}
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
          <section className="mt-10">
            <h2 className="text-xl font-display font-bold mb-4">Технические характеристики</h2>
            <div className="bg-card border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(specs).map(([key, val], i) => (
                    <tr key={key} className={i % 2 === 0 ? "bg-secondary/50" : ""}>
                      <td className="px-4 py-2.5 text-muted-foreground font-medium w-1/3">{key}</td>
                      <td className="px-4 py-2.5 font-mono text-sm">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Analogs */}
        {analogs && analogs.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-display font-bold mb-4">Сравнение с аналогами</h2>
            <div className="bg-card border rounded-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Артикул</th>
                    <th className="px-4 py-3 text-left font-semibold">Название</th>
                    <th className="px-4 py-3 text-left font-semibold">Бренд</th>
                    <th className="px-4 py-3 text-right font-semibold">Цена</th>
                    <th className="px-4 py-3 text-left font-semibold">Примечание</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current product */}
                  <tr className="bg-accent/5 border-b">
                    <td className="px-4 py-2.5 font-mono font-semibold">{product.sku}</td>
                    <td className="px-4 py-2.5 font-medium">{product.name}</td>
                    <td className="px-4 py-2.5">{product.brand}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-accent">{price.toLocaleString("ru-RU")} ₽</td>
                    <td className="px-4 py-2.5 text-accent text-xs font-medium">← Наш товар</td>
                  </tr>
                  {analogs.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="px-4 py-2.5 font-mono text-muted-foreground">{a.analog_sku}</td>
                      <td className="px-4 py-2.5">{a.analog_name}</td>
                      <td className="px-4 py-2.5">{a.analog_brand}</td>
                      <td className="px-4 py-2.5 text-right">{a.analog_price ? `${Number(a.analog_price).toLocaleString("ru-RU")} ₽` : "—"}</td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
