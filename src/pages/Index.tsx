import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Clock, Award, Ruler, Disc, Droplets, Layers, Scissors, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";

const categoryIcons: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-8 h-8" />,
  Disc: <Disc className="w-8 h-8" />,
  Droplets: <Droplets className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Scissors: <Scissors className="w-8 h-8" />,
  Wrench: <Wrench className="w-8 h-8" />,
};

export default function Index() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const { data: popularProducts } = useQuery({
    queryKey: ["popular-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("is_popular", true).limit(4);
      return data ?? [];
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/80" />
        </div>
        <div className="relative container py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-primary-foreground leading-tight">
              Профессиональный инструмент для бизнеса
            </h1>
            <p className="mt-4 text-primary-foreground/80 text-base md:text-lg leading-relaxed">
              Измерительный инструмент, расходные материалы, смазки и оснастка. Прямые поставки от производителей. Оптовые цены для B2B.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalog">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
                  Перейти в каталог <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/b2b">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  B2B партнёрам
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="text-2xl font-display font-bold mb-6">Категории товаров</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="group bg-card border rounded-lg p-4 text-center hover:border-accent hover:shadow-md transition-all"
            >
              <div className="mx-auto w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                {categoryIcons[cat.icon || "Wrench"]}
              </div>
              <h3 className="mt-3 text-xs font-medium leading-tight">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold">Популярные товары</h2>
          <Link to="/catalog" className="text-sm text-accent hover:underline flex items-center gap-1">
            Все товары <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularProducts?.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-secondary industrial-grid">
        <div className="container py-12">
          <h2 className="text-2xl font-display font-bold mb-8 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: "Доставка по всей России", desc: "СДЭК, ПЭК, деловые линии. Бесплатно от 15 000 ₽" },
              { icon: <Shield className="w-6 h-6" />, title: "Гарантия качества", desc: "Сертифицированная продукция. Гарантия от производителя" },
              { icon: <Clock className="w-6 h-6" />, title: "Быстрая отгрузка", desc: "Отправляем в день заказа. Склад в Москве" },
              { icon: <Award className="w-6 h-6" />, title: "Оптовые цены", desc: "Специальные условия для B2B. Скидки до 30%" },
            ].map((a, i) => (
              <div key={i} className="bg-card rounded-lg p-5 border">
                <div className="w-10 h-10 rounded bg-accent/10 text-accent flex items-center justify-center mb-3">
                  {a.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
