import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Clock, Award, Ruler, Disc, Droplets, Layers, Scissors, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";

const categoryIcons: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-7 h-7" />,
  Disc: <Disc className="w-7 h-7" />,
  Droplets: <Droplets className="w-7 h-7" />,
  Layers: <Layers className="w-7 h-7" />,
  Scissors: <Scissors className="w-7 h-7" />,
  Wrench: <Wrench className="w-7 h-7" />,
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
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
        </div>
        <div className="relative container py-20 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-accent mb-4">
              Промышленный инструмент
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground leading-tight tracking-tight">
              Профессиональный инструмент для бизнеса
            </h1>
            <p className="mt-6 text-primary-foreground/70 text-base md:text-lg leading-relaxed max-w-xl">
              Измерительный инструмент, расходные материалы, смазки и оснастка. Прямые поставки от производителей. Оптовые цены для B2B.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/catalog">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold text-base h-12 px-8 shadow-md">
                  Перейти в каталог <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/b2b">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/60 font-semibold text-base h-12 px-8">
                  B2B партнёрам
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories — сетка с hover-подъёмом */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold">Категории товаров</h2>
            <p className="text-sm text-muted-foreground mt-1">Выберите раздел, чтобы начать подбор</p>
          </div>
          <Link to="/catalog" className="text-sm text-accent hover:underline flex items-center gap-1 shrink-0">
            Весь каталог <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="group bg-card border border-border rounded-xl p-5 text-center hover:border-accent hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
            >
              <div className="mx-auto w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                {categoryIcons[cat.icon || "Wrench"]}
              </div>
              <h3 className="mt-4 text-sm font-medium leading-tight">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular products */}
      <section className="container py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold">Популярные товары</h2>
            <p className="text-sm text-muted-foreground mt-1">Хиты продаж для профессионалов</p>
          </div>
          <Link to="/catalog" className="text-sm text-accent hover:underline flex items-center gap-1 shrink-0">
            Все товары <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularProducts?.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-secondary industrial-grid border-y border-border">
        <div className="container py-14">
          <h2 className="text-2xl font-display font-bold mb-8 text-center">Почему выбирают нас</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: "Доставка по всей России", desc: "СДЭК, ПЭК, деловые линии. Бесплатно от 15 000 ₽" },
              { icon: <Shield className="w-6 h-6" />, title: "Гарантия качества", desc: "Сертифицированная продукция. Гарантия от производителя" },
              { icon: <Clock className="w-6 h-6" />, title: "Быстрая отгрузка", desc: "Отправляем в день заказа. Склад в Москве" },
              { icon: <Award className="w-6 h-6" />, title: "Оптовые цены", desc: "Специальные условия для B2B. Скидки до 30%" },
            ].map((a, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-card">
                <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                  {a.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1.5">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
