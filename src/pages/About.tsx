import Layout from "@/components/layout/Layout";
import { Building2, Users, MapPin, Award } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <div className="container py-8">
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-foreground">Главная</a><span className="mx-1">/</span><span className="text-foreground">О компании</span>
        </nav>
        <h1 className="text-3xl font-display font-bold mb-6">О компании vtoolka</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
          <p className="text-base leading-relaxed">
            Компания «vtoolka» — специализированный поставщик промышленного инструмента для предприятий металлообработки, машиностроения и других отраслей промышленности. Мы работаем с 2010 года и за это время зарекомендовали себя как надёжный партнёр для более чем 500 предприятий по всей России.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { icon: <Building2 className="w-6 h-6" />, title: "15+ лет", desc: "на рынке промышленного инструмента" },
            { icon: <Users className="w-6 h-6" />, title: "500+", desc: "постоянных B2B клиентов" },
            { icon: <MapPin className="w-6 h-6" />, title: "Вся Россия", desc: "доставка в любой регион" },
            { icon: <Award className="w-6 h-6" />, title: "100%", desc: "сертифицированная продукция" },
          ].map((item, i) => (
            <div key={i} className="bg-card border rounded-lg p-5 text-center">
              <div className="mx-auto w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">{item.icon}</div>
              <h3 className="font-display font-bold text-xl">{item.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
