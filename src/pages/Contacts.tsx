import Layout from "@/components/layout/Layout";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Contacts() {
  return (
    <Layout>
      <div className="container py-8">
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-foreground">Главная</a><span className="mx-1">/</span><span className="text-foreground">Контакты</span>
        </nav>
        <h1 className="text-3xl font-display font-bold mb-6">Контакты</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { icon: <Phone className="w-5 h-5" />, title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатный звонок по России" },
              { icon: <Mail className="w-5 h-5" />, title: "Email", value: "info@vtoolka.ru", sub: "Ответим в течение 2 часов" },
              { icon: <MapPin className="w-5 h-5" />, title: "Адрес", value: "г. Москва, ул. Промышленная, 42", sub: "Склад и офис" },
              { icon: <Clock className="w-5 h-5" />, title: "Режим работы", value: "Пн-Пт: 9:00 - 18:00", sub: "Сб-Вс: выходной" },
            ].map((item, i) => (
              <div key={i} className="bg-card border rounded-lg p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-accent/10 text-accent flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-sm">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-secondary rounded-lg flex items-center justify-center min-h-[300px] text-muted-foreground text-sm">
            Карта (placeholder)
          </div>
        </div>
      </div>
    </Layout>
  );
}
