import { Link } from "react-router-dom";
import { Wrench, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
                <Wrench className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-display font-bold text-lg">vtoolka</span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Спецмагазин промышленного инструмента. Измерительный, расходные материалы, смазки и оснастка для производства.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Каталог</h4>
            <div className="flex flex-col gap-1.5 text-sm text-primary-foreground/70">
              <Link to="/catalog?category=measuring" className="hover:text-primary-foreground transition-colors">Измерительный инструмент</Link>
              <Link to="/catalog?category=consumables" className="hover:text-primary-foreground transition-colors">Расходные материалы</Link>
              <Link to="/catalog?category=cutting" className="hover:text-primary-foreground transition-colors">Режущий инструмент</Link>
              <Link to="/catalog?category=lubricants" className="hover:text-primary-foreground transition-colors">Смазочные материалы</Link>
              <Link to="/catalog?category=abrasives" className="hover:text-primary-foreground transition-colors">Абразивный инструмент</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Информация</h4>
            <div className="flex flex-col gap-1.5 text-sm text-primary-foreground/70">
              <Link to="/about" className="hover:text-primary-foreground transition-colors">О компании</Link>
              <Link to="/delivery" className="hover:text-primary-foreground transition-colors">Доставка и оплата</Link>
              <Link to="/b2b" className="hover:text-primary-foreground transition-colors">B2B партнёрам</Link>
              <Link to="/contacts" className="hover:text-primary-foreground transition-colors">Контакты</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Контакты</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +7 (800) 555-35-35</span>
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@vtoolka.ru</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> г. Москва, ул. Промышленная, 42</span>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50">
          © 2026 vtoolka.ru — Все права защищены
        </div>
      </div>
    </footer>
  );
}
