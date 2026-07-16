import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Truck, ShieldCheck, Zap, Award, Package, Ruler, Disc, Droplets, Layers, Scissors, Wrench, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";

const categoryIcons: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="w-6 h-6" />,
  Disc: <Disc className="w-6 h-6" />,
  Droplets: <Droplets className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  Scissors: <Scissors className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
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
      {/* HERO — bento first tile */}
      <section className="relative border-b border-border overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-70 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Hero content */}
            <div className="lg:col-span-8 bento-tile corner-marks p-8 md:p-12 flex flex-col justify-between min-h-[460px] relative bg-gradient-to-br from-card via-card to-secondary/40">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-accent/30 bg-accent/5 rounded-sm mb-8">
                  <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
                  <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-accent">Official Distributor · 2026</span>
                </div>

                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[0.95] tracking-tight text-balance">
                  Промышленный<br />
                  инструмент<br />
                  <span className="text-accent">для точных задач</span>
                </h1>

                <p className="mt-6 text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl border-l-2 border-accent/50 pl-5">
                  Измерительный инструмент, оснастка и расходные материалы. Прямые поставки от производителей, оптовые цены для B2B, отгрузка в день заказа.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/catalog">
                  <Button size="lg" className="ember-btn h-12 px-7 rounded-md uppercase tracking-widest text-xs shadow-ember">
                    Перейти в каталог <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/b2b">
                  <Button size="lg" variant="outline" className="h-12 px-7 rounded-md border-border hover:border-accent hover:text-accent bg-transparent uppercase tracking-widest text-xs">
                    B2B партнёрам
                  </Button>
                </Link>
                <div className="ml-auto hidden md:flex items-center gap-6 font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
                  <span>REF · VT-2026</span>
                  <span>ISO · 9001</span>
                </div>
              </div>
            </div>

            {/* Side bento tiles */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="bento-tile p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all" />
                <div className="relative">
                  <span className="mono-label">01 · Каталог</span>
                  <div className="mt-3 font-display text-3xl font-extrabold">50 000+</div>
                  <div className="text-xs text-muted-foreground mt-1">артикулов на складе</div>
                </div>
                <Package className="relative w-5 h-5 text-accent self-end" />
              </div>

              <div className="bento-tile p-6 flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all" />
                <div className="relative">
                  <span className="mono-label">02 · Отгрузка</span>
                  <div className="mt-3 font-display text-3xl font-extrabold">24ч</div>
                  <div className="text-xs text-muted-foreground mt-1">в день заказа со склада в Москве</div>
                </div>
                <Zap className="relative w-5 h-5 text-accent self-end" />
              </div>

              <Link to="/b2b" className="col-span-2 lg:col-span-1 bento-tile p-6 relative overflow-hidden group bg-gradient-to-br from-accent/20 via-card to-card">
                <div className="mono-label text-accent">B2B Спецусловия</div>
                <div className="mt-2 font-display text-lg font-bold leading-tight">
                  Оптовые цены<br />и отсрочка платежа
                </div>
                <ArrowUpRight className="absolute top-6 right-6 w-5 h-5 text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES — bento grid */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="mono-label">/ 01 — Категории</span>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold tracking-tight">Что вам подобрать</h2>
          </div>
          <Link to="/catalog" className="hidden sm:flex items-center gap-2 mono-label hover:text-accent transition-colors">
            Весь каталог <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories?.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className={`bento-tile group p-5 flex flex-col justify-between min-h-[160px] ${i === 0 ? "md:col-span-2 md:row-span-1" : ""}`}
            >
              <div className="w-11 h-11 rounded-md border border-border bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:border-accent/50 transition-colors">
                {categoryIcons[cat.icon || "Wrench"]}
              </div>
              <div className="mt-6">
                <span className="mono-label">0{i + 1}</span>
                <h3 className="mt-1 text-sm font-semibold leading-tight group-hover:text-accent transition-colors">{cat.name}</h3>
              </div>
              <ArrowUpRight className="absolute top-5 right-5 w-4 h-4 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="border-y border-border bg-card/30">
        <div className="container py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="mono-label flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" /> / 02 — Хиты продаж
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold tracking-tight">Популярные позиции</h2>
              <p className="text-sm text-muted-foreground mt-2">Проверенные решения для профессионалов</p>
            </div>
            <Link to="/catalog" className="hidden sm:flex items-center gap-2 mono-label hover:text-accent transition-colors">
              Все товары <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularProducts?.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* ADVANTAGES — bento */}
      <section className="container py-16">
        <div className="mb-8">
          <span className="mono-label">/ 03 — Преимущества</span>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-extrabold tracking-tight">Почему vtoolka</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { icon: <Truck className="w-5 h-5" />, title: "Доставка по РФ", desc: "СДЭК, ПЭК, Деловые линии. Бесплатно от 15 000 ₽", tag: "01" },
            { icon: <ShieldCheck className="w-5 h-5" />, title: "Гарантия качества", desc: "Сертифицированная продукция, гарантия производителя", tag: "02" },
            { icon: <Zap className="w-5 h-5" />, title: "Быстрая отгрузка", desc: "В день заказа со склада в Москве", tag: "03" },
            { icon: <Award className="w-5 h-5" />, title: "Оптовые цены", desc: "Специальные условия для B2B, скидки до 30%", tag: "04" },
          ].map((a) => (
            <div key={a.tag} className="bento-tile p-6 flex flex-col gap-4 min-h-[180px]">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/30 text-accent flex items-center justify-center">
                  {a.icon}
                </div>
                <span className="mono-label">{a.tag}</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-base">{a.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="container pb-20">
        <div className="bento-tile corner-marks relative overflow-hidden p-8 md:p-12 bg-gradient-to-br from-card via-secondary/30 to-card">
          <div className="absolute inset-0 industrial-grid opacity-40 pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="mono-label text-accent">/ Готовы к сотрудничеству</span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl font-extrabold tracking-tight text-balance">
                Оснастим ваше предприятие под ключ
              </h2>
              <p className="mt-4 text-muted-foreground max-w-md">
                Индивидуальные условия, персональный менеджер, техническая поддержка. Составим спецификацию под ваши задачи.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:justify-end gap-3">
              <Link to="/b2b">
                <Button size="lg" className="ember-btn h-12 px-7 rounded-md uppercase tracking-widest text-xs w-full sm:w-auto">
                  Стать партнёром <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contacts">
                <Button size="lg" variant="outline" className="h-12 px-7 rounded-md border-border bg-transparent uppercase tracking-widest text-xs w-full sm:w-auto">
                  Связаться
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
