import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, ShoppingCart, User, Menu, X, Phone, Wrench, ShieldCheck, ChevronRight,
  Ruler, Disc, Droplets, Layers, Scissors, Package,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type IconType = ComponentType<{ className?: string }>;

const categoryIconMap: Record<string, IconType> = {
  Ruler, Disc, Droplets, Layers, Scissors, Wrench, Package,
};

const CatIcon = ({ name, className }: { name?: string | null; className?: string }) => {
  const Icon = (name && categoryIconMap[name]) || Wrench;
  return <Icon className={className} />;
};

export default function Header() {
  const { user, isB2B, signOut } = useAuth();
  const { totalItems } = useCart();
  const { isAdmin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const isActiveCategory = (slug: string) => location.search === `?category=${slug}`;

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <a href="tel:+78005553535" className="flex items-center gap-1.5 hover:text-accent transition-colors">
              <Phone className="w-3 h-3" /> +7 (800) 555-35-35
            </a>
            <span className="hidden sm:inline text-primary-foreground/70">Пн-Пт: 9:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/delivery" className="hover:text-accent transition-colors">Доставка</Link>
            <Link to="/about" className="hover:text-accent transition-colors">О компании</Link>
            {isB2B && <Badge variant="outline" className="border-accent text-accent text-[10px] font-semibold">B2B</Badge>}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center shadow-sm">
            <Wrench className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <span className="font-display font-bold text-lg leading-none text-foreground">vtoolka</span>
            <span className="block text-[10px] text-muted-foreground leading-none mt-0.5">промышленный инструмент</span>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по артикулу, названию или бренду..."
              className="pl-11 pr-4 h-11 bg-secondary border border-border text-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-1">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="icon" title="Админ-панель" className="hover:bg-secondary">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" className="hover:bg-secondary">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="hidden sm:inline-flex text-xs hover:bg-secondary">
                Выйти
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="text-xs border-border hover:bg-secondary">Войти</Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden hover:bg-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden md:block border-t border-border bg-card">
        <div className="container flex items-center gap-1 py-2 text-sm font-medium overflow-x-auto">
          <Link
            to="/catalog"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              location.pathname === "/catalog" && !location.search
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <Wrench className="w-4 h-4" /> Все товары
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                isActiveCategory(cat.slug)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <CatIcon name={cat.icon} className="w-4 h-4" />
              {cat.name}
            </Link>
          ))}
          <Link to="/b2b" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-accent hover:bg-accent/10 transition-colors whitespace-nowrap font-semibold">
            B2B партнёрам <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по артикулу..." className="pl-11 h-11 bg-secondary border-border" />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2">
              <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary transition-colors">
                <Wrench className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Все товары</span>
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  <CatIcon name={cat.icon} className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-1">
              <Link to="/delivery" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">Доставка и оплата</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">О компании</Link>
              <Link to="/b2b" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-accent font-medium">B2B партнёрам</Link>
              <Link to="/contacts" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">Контакты</Link>
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">Личный кабинет</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">Мои заказы</Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-accent font-medium">Админ-панель</Link>
                  )}
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block w-full text-left py-2.5 text-sm text-muted-foreground hover:text-foreground">Выйти</button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-medium text-accent">Войти / Регистрация</Link>
              )}
            </div>

            <a href="tel:+78005553535" className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              <Phone className="w-4 h-4" /> +7 (800) 555-35-35
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
