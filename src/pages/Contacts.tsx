import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Contacts() {
  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">Контакты</span>
        </nav>

        <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Контакты</h1>
        <p className="text-muted-foreground mb-6">Свяжитесь с нами — поможем подобрать инструмент и ответим на все вопросы</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact cards */}
          <div className="space-y-4">
            {[
              { icon: <Phone className="w-5 h-5" />, title: "Телефон", value: "+7 (800) 555-35-35", sub: "Бесплатный звонок по России", href: "tel:+78005553535" },
              { icon: <Mail className="w-5 h-5" />, title: "Email", value: "info@vtoolka.ru", sub: "Ответим в течение 2 часов", href: "mailto:info@vtoolka.ru" },
              { icon: <MapPin className="w-5 h-5" />, title: "Адрес склада и офиса", value: "г. Москва, ул. Промышленная, 42", sub: "Самовывоз: Пн-Пт 9:00-18:00" },
              { icon: <Clock className="w-5 h-5" />, title: "Режим работы", value: "Пн-Пт: 9:00 - 18:00", sub: "Сб-Вс: выходной" },
            ].map((item, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 hover:shadow-card transition-shadow">
                <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-muted-foreground">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-base font-medium hover:text-accent transition-colors">{item.value}</a>
                  ) : (
                    <p className="text-base font-medium">{item.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact form */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display font-bold mb-1 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-accent" /> Обратная связь</h2>
            <p className="text-sm text-muted-foreground mb-5">Заполните форму, и мы свяжемся с вами в ближайшее время</p>
            <form
              onSubmit={(e) => { e.preventDefault(); toast.success("Сообщение отправлено! Мы свяжемся с вами в ближайшее время."); (e.target as HTMLFormElement).reset(); }}
              className="space-y-3"
            >
              <div>
                <Label className="text-xs">Ваше имя *</Label>
                <Input required placeholder="Иван Иванов" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Телефон *</Label>
                  <Input required placeholder="+7 (XXX) XXX-XX-XX" className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input type="email" placeholder="email@company.ru" className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="text-xs">Сообщение *</Label>
                <Textarea required placeholder="Опишите, какой инструмент вас интересует..." rows={4} className="mt-1" />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
                Отправить сообщение
              </Button>
            </form>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-6 bg-card border border-border rounded-xl overflow-hidden">
          <div className="h-64 bg-secondary industrial-grid flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">г. Москва, ул. Промышленная, 42</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Интерактивная карта</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
