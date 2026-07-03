import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Truck, CreditCard, Clock, Package, MapPin, Check, Warehouse, Building2 } from "lucide-react";

export default function Delivery() {
  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">Доставка и оплата</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Доставка и оплата</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">Мы отправляем заказы по всей России. Отгрузка со склада в Москве в день заказа (при оформлении до 15:00).</p>

        {/* Delivery methods */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-accent" /> Способы доставки</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { name: "СДЭК", desc: "Доставка до двери или пункта выдачи. 2-7 рабочих дней.", Icon: Package },
              { name: "ПЭК", desc: "Для крупногабаритных грузов. 3-10 рабочих дней.", Icon: Truck },
              { name: "Деловые Линии", desc: "Экономичная доставка по всей России.", Icon: Warehouse },
              { name: "Самовывоз", desc: "г. Москва, ул. Промышленная, 42. Пн-Пт 9:00-18:00.", Icon: Building2 },
            ].map((m, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                    <m.Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Free delivery banner */}
          <div className="mt-4 bg-accent/10 border border-accent/20 rounded-xl p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent text-accent-foreground flex items-center justify-center shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Бесплатная доставка при заказе от 15 000 ₽</p>
              <p className="text-xs text-muted-foreground">Действует для всех способов доставки, кроме самовывоза</p>
            </div>
          </div>
        </section>

        {/* Payment methods */}
        <section className="mb-8">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-accent" /> Способы оплаты</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Безналичный расчёт", desc: "Для юридических лиц. Оплата по счёту с НДС. Отсрочка платежа для B2B клиентов до 14 дней.", icon: <FileTextIcon /> },
              { title: "Банковская карта", desc: "Visa, MasterCard, МИР. Безопасная оплата онлайн через платёжный шлюз.", icon: <CreditCard className="w-5 h-5" /> },
              { title: "Наложенный платёж", desc: "Оплата при получении (СДЭК). Удобно для физических лиц.", icon: <Package className="w-5 h-5" /> },
            ].map((p, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-card transition-shadow">
                <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">{p.icon}</div>
                <h3 className="font-semibold text-sm mb-1.5">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-display font-bold mb-6">Как мы отгружаем</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { icon: <Clock className="w-5 h-5" />, title: "1. Оформление", desc: "Заказ через сайт или по телефону" },
              { icon: <Package className="w-5 h-5" />, title: "2. Комплектация", desc: "Собираем заказ на складе в Москве" },
              { icon: <Truck className="w-5 h-5" />, title: "3. Отгрузка", desc: "Передаём в транспортную компанию" },
              { icon: <MapPin className="w-5 h-5" />, title: "4. Доставка", desc: "Получаете заказ в вашем городе" },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center mx-auto mb-3">{step.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function FileTextIcon() {
  return <CreditCard className="w-5 h-5" />;
}
