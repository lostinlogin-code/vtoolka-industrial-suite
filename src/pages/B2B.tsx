import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Percent, FileText, Truck, HeadphonesIcon, ArrowRight } from "lucide-react";

export default function B2B() {
  return (
    <Layout>
      <div className="container py-8">
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-foreground">Главная</a><span className="mx-1">/</span><span className="text-foreground">B2B партнёрам</span>
        </nav>
        <h1 className="text-3xl font-display font-bold mb-2">B2B партнёрам</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Специальные условия для оптовых покупателей. Зарегистрируйтесь как B2B клиент и получите доступ к оптовым ценам, персональному менеджеру и расширенным условиям оплаты.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Percent className="w-6 h-6" />, title: "Оптовые цены", desc: "Скидки до 30% от розничной цены" },
            { icon: <FileText className="w-6 h-6" />, title: "Работа по счёту", desc: "Безналичный расчёт, отсрочка платежа" },
            { icon: <Truck className="w-6 h-6" />, title: "Доставка бесплатно", desc: "Бесплатная доставка от 15 000 ₽" },
            { icon: <HeadphonesIcon className="w-6 h-6" />, title: "Персональный менеджер", desc: "Выделенный специалист для вашей компании" },
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5">
              <div className="w-10 h-10 rounded bg-accent/10 text-accent flex items-center justify-center mb-3">{item.icon}</div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-primary text-primary-foreground rounded-lg p-8 text-center">
          <h2 className="text-2xl font-display font-bold mb-2">Станьте B2B партнёром</h2>
          <p className="text-primary-foreground/80 mb-6">Зарегистрируйтесь и получите доступ к оптовым ценам прямо сейчас</p>
          <Link to="/auth">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
              Зарегистрироваться <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
