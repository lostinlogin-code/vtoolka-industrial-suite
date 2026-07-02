import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Building2, Users, MapPin, Award, Wrench, Truck, Shield, Target, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">О компании</span>
        </nav>

        {/* Hero */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 industrial-grid opacity-20" />
          <div className="relative max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">О компании</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-3">vtoolka — промышленный инструмент для бизнеса</h1>
            <p className="mt-4 text-primary-foreground/70 leading-relaxed">
              Специализированный поставщик промышленного инструмента для предприятий металлообработки, машиностроения и других отраслей промышленности.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Building2 className="w-6 h-6" />, title: "15+ лет", desc: "на рынке промышленного инструмента" },
            { icon: <Users className="w-6 h-6" />, title: "500+", desc: "постоянных B2B клиентов" },
            { icon: <MapPin className="w-6 h-6" />, title: "Вся Россия", desc: "доставка в любой регион" },
            { icon: <Award className="w-6 h-6" />, title: "100%", desc: "сертифицированная продукция" },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 text-center hover:shadow-card transition-shadow">
              <div className="mx-auto w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-3">{item.icon}</div>
              <h3 className="font-display font-bold text-2xl">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* Story */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-display font-bold mb-4">Наша история</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-3 leading-relaxed">
            <p>Компания «vtoolka» работает с 2010 года и за это время зарекомендовала себя как надёжный партнёр для более чем 500 предприятий по всей России. Мы специализируемся на поставках измерительного инструмента, расходных материалов, смазок и оснастки для производства.</p>
            <p>Прямые контракты с ведущими производителями позволяют нам предлагать конкурентные цены и гарантировать оригинальность продукции. Наш склад в Москве обеспечивает быструю отгрузку — в день заказа.</p>
          </div>
        </section>

        {/* Values */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Wrench className="w-6 h-6" />, title: "Профессионализм", desc: "Глубокая экспертиза в подборе инструмента для любых производственных задач" },
            { icon: <Truck className="w-6 h-6" />, title: "Надёжность", desc: "Собственный склад, отгрузка в день заказа, доставка по всей России" },
            { icon: <Shield className="w-6 h-6" />, title: "Гарантия", desc: "Сертифицированная продукция от официальных поставщиков" },
          ].map((v, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">{v.icon}</div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-8 text-center">
          <Target className="w-10 h-10 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold mb-2">Готовы сотрудничать?</h2>
          <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">Свяжитесь с нами или зарегистрируйтесь как B2B партнёр, чтобы получить доступ к оптовым ценам</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/b2b">
              <button className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                B2B партнёрам <ArrowRight className="w-4 h-4 ml-1 inline" />
              </button>
            </Link>
            <Link to="/contacts">
              <button className="bg-transparent border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
                Контакты
              </button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
