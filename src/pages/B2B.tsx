import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Percent, FileText, Truck, Headphones as HeadphonesIcon, ArrowRight, Check, Building2, Package, Clock } from "lucide-react";

export default function B2B() {
  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">B2B партнёрам</span>
        </nav>

        {/* Hero */}
        <section className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 industrial-grid opacity-20" />
          <div className="relative max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">B2B</span>
            <h1 className="text-3xl md:text-4xl font-display font-bold mt-3">Специальные условия для оптовых покупателей</h1>
            <p className="mt-4 text-primary-foreground/70 leading-relaxed">
              Зарегистрируйтесь как B2B клиент и получите доступ к оптовым ценам, персональному менеджеру, расширенным условиям оплаты и бесплатной доставке.
            </p>
            <Link to="/auth" className="inline-block mt-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
                Зарегистрироваться <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Benefits */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Percent className="w-6 h-6" />, title: "Оптовые цены", desc: "Скидки до 30% от розничной цены на весь ассортимент" },
            { icon: <FileText className="w-6 h-6" />, title: "Работа по счёту", desc: "Безналичный расчёт, отсрочка платежа до 14 дней" },
            { icon: <Truck className="w-6 h-6" />, title: "Бесплатная доставка", desc: "Бесплатная доставка от 15 000 ₽ по всей России" },
            { icon: <HeadphonesIcon className="w-6 h-6" />, title: "Персональный менеджер", desc: "Выделенный специалист для вашей компании" },
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">{item.icon}</div>
              <h3 className="font-semibold text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-display font-bold mb-6">Как стать B2B партнёром</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "1", icon: <Building2 className="w-5 h-5" />, title: "Регистрация", desc: "Заполните форму регистрации, указав данные компании и ИНН" },
              { num: "2", icon: <Clock className="w-5 h-5" />, title: "Проверка", desc: "Менеджер проверит данные и активирует B2B-аккаунт в течение 1 рабочего дня" },
              { num: "3", icon: <Package className="w-5 h-5" />, title: "Закупки", desc: "Получите доступ к оптовым ценам и оформляйте заказы со скидкой" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{step.num}</div>
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">{step.icon}</div>
                </div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What you get */}
        <section className="bg-secondary industrial-grid border border-border rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-display font-bold mb-4">Что вы получаете</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Доступ к оптовым ценам на весь каталог",
              "Скидка до 30% от розничной стоимости",
              "Отсрочка платежа до 14 дней",
              "Персональный менеджер",
              "Приоритетная отгрузка",
              "Бесплатная доставка от 15 000 ₽",
              "Специальные условия на регулярные закупки",
              "Запрос коммерческого предложения в 1 клик",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-success/15 text-success flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-accent text-accent-foreground rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-display font-bold mb-2">Станьте B2B партнёром прямо сейчас</h2>
          <p className="text-accent-foreground/80 mb-6">Регистрация занимает 2 минуты — и вы получаете доступ к оптовым ценам</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              Зарегистрироваться <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
