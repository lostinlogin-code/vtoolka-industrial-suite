import { Link } from "react-router-dom";
import { Wrench, Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      {/* CTA strip */}
      <div className="border-b border-primary-foreground/10">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-lg">Нужна консультация по подбору инструмента?</h3>
            <p className="text-sm text-primary-foreground/60 mt-1">Наши специалисты помогут выбрать оптимальное решение для ваших задач</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:+78005553535" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
              <Phone className="w-4 h-4" /> +7 (800) 555-35-35
            </a>
            <Link to="/contacts">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover font-semibold">
                Связаться <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Wrench className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-lg">vtoolka</span>
            </div>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-sm">
              Специализированный поставщик промышленного инструмента. Измерительный инструмент, расходные материалы, смазки и оснастка для предприятий металлообработки и машиностроения.
            </p>
            <div className="mt-4 space-y-2 text-sm text-primary-foreground/60">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" /> г. Москва, ул. Промышленная, 42</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4 shrink-0" /> Пн-Пт: 9:00 - 18:00, Сб-Вс: выходной</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-primary-foreground/40">Каталог</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link to="/catalog?category=measuring" className="hover:text-accent transition-colors">Измерительный инструмент</Link>
              <Link to="/catalog?category=consumables" className="hover:text-accent transition-colors">Расходные материалы</Link>
              <Link to="/catalog?category=cutting" className="hover:text-accent transition-colors">Режущий инструмент</Link>
              <Link to="/catalog?category=lubricants" className="hover:text-accent transition-colors">Смазочные материалы</Link>
              <Link to="/catalog?category=abrasives" className="hover:text-accent transition-colors">Абразивный инструмент</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-primary-foreground/40">Информация</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link to="/about" className="hover:text-accent transition-colors">О компании</Link>
              <Link to="/delivery" className="hover:text-accent transition-colors">Доставка и оплата</Link>
              <Link to="/b2b" className="hover:text-accent transition-colors">B2B партнёрам</Link>
              <Link to="/contacts" className="hover:text-accent transition-colors">Контакты</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-xs uppercase tracking-wider text-primary-foreground/40">Рассылка</h4>
            <p className="text-sm text-primary-foreground/60 mb-3">Новости о поступлениях и спецпредложениях</p>
            <div className="flex gap-2">
              <Input placeholder="email@company.ru" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 text-sm h-9" />
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover shrink-0 px-3">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
          <span>© 2026 vtoolka.ru — Все права защищены</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-primary-foreground/70 transition-colors">Договор оферты</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
