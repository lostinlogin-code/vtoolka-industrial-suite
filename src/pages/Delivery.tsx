import Layout from "@/components/layout/Layout";
import { Truck, CreditCard, Clock, Package } from "lucide-react";

export default function Delivery() {
  return (
    <Layout>
      <div className="container py-8">
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-foreground">Главная</a><span className="mx-1">/</span><span className="text-foreground">Доставка и оплата</span>
        </nav>
        <h1 className="text-3xl font-display font-bold mb-6">Доставка и оплата</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-accent" /> Способы доставки</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="border-b pb-3"><strong className="text-foreground">СДЭК</strong> — доставка до двери или пункта выдачи. 2-7 рабочих дней.</div>
              <div className="border-b pb-3"><strong className="text-foreground">ПЭК</strong> — для крупногабаритных грузов. 3-10 рабочих дней.</div>
              <div className="border-b pb-3"><strong className="text-foreground">Деловые Линии</strong> — экономичная доставка по всей России.</div>
              <div><strong className="text-foreground">Самовывоз</strong> — г. Москва, ул. Промышленная, 42. Пн-Пт 9:00-18:00.</div>
            </div>
            <div className="mt-4 p-3 bg-accent/10 rounded text-sm text-accent font-medium">
              🎁 Бесплатная доставка при заказе от 15 000 ₽
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-accent" /> Способы оплаты</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="border-b pb-3"><strong className="text-foreground">Безналичный расчёт</strong> — для юридических лиц. Оплата по счёту.</div>
              <div className="border-b pb-3"><strong className="text-foreground">Банковская карта</strong> — Visa, MasterCard, МИР.</div>
              <div><strong className="text-foreground">Наложенный платёж</strong> — оплата при получении (СДЭК).</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
