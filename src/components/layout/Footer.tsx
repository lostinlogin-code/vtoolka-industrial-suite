import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, ArrowRight, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card/40 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* CTA strip */}
      <div className="relative border-b border-border">
        <div className="container py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="mono-label text-accent">/ Консультация</span>
            <h3 className="font-display font-bold text-xl mt-1">Нужна помощь в подборе инструмента?</h3>
            <p className="text-sm text-muted-foreground mt-1">Инженерная поддержка — подберём оптимальное решение под задачу</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:+78005553535" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-accent transition-colors">
              <Phone className="w-4 h-4" /> +7 (800) 555-35-35
            </a>
            <Link to="/contacts">
              <Button size="sm" className="ember-btn h-10 px-5 rounded-md uppercase tracking-widest text-xs">
                Связаться <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mt-5">
              Специализированный поставщик промышленного инструмента для предприятий металлообработки и машиностроения.
            </p>
            <div className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0 text-accent" /> г. Москва, ул. Промышленная, 42</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0 text-accent" /> Пн–Пт: 9:00–18:00</span>
              <a href="mailto:info@vtoolka.ru" className="flex items-center gap-2 hover:text-accent transition-colors"><Mail className="w-4 h-4 shrink-0 text-accent" /> info@vtoolka.ru</a>
            </div>
          </div>

          <div>
            <h4 className="mono-label mb-4">/ Каталог</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link to="/catalog?category=measuring" className="hover:text-accent transition-colors">Измерительный</Link>
              <Link to="/catalog?category=consumables" className="hover:text-accent transition-colors">Расходные материалы</Link>
              <Link to="/catalog?category=cutting" className="hover:text-accent transition-colors">Режущий инструмент</Link>
              <Link to="/catalog?category=lubricants" className="hover:text-accent transition-colors">Смазочные материалы</Link>
              <Link to="/catalog?category=abrasives" className="hover:text-accent transition-colors">Абразивный</Link>
            </div>
          </div>

          <div>
            <h4 className="mono-label mb-4">/ Информация</h4>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-accent transition-colors">О компании</Link>
              <Link to="/delivery" className="hover:text-accent transition-colors">Доставка и оплата</Link>
              <Link to="/b2b" className="hover:text-accent transition-colors">B2B партнёрам</Link>
              <Link to="/contacts" className="hover:text-accent transition-colors">Контакты</Link>
            </div>
          </div>

          <div>
            <h4 className="mono-label mb-4">/ Рассылка</h4>
            <p className="text-sm text-muted-foreground mb-3">Новинки и спецпредложения</p>
            <div className="flex gap-2">
              <Input placeholder="email@company.ru" className="bg-background border-border text-sm h-10" />
              <Button size="sm" className="ember-btn shrink-0 h-10 px-3">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 mono-label">
          <span>© 2026 vtoolka.ru — Precision Industrial</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-accent transition-colors">Политика</a>
            <a href="#" className="hover:text-accent transition-colors">Оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
