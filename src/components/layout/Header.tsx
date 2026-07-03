import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, ShoppingCart, User, Menu, X, Phone, Wrench, ShieldCheck, ChevronRight,
  Ruler, Disc, Droplets, Layers, Scissors, LogOut, LayoutGrid, Package,
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
  const Icon = (name && categoryIconMap[name]) || Package;
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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60">
      {/* Utility bar */}
      <div className="border-b border-border/60">
        <div className="container flex items-center justify-between h-8 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <a href="tel:+78005553535" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
              <Phone className="w-3 h-3" /> +7 (800) 555-35-35
            </a>
            <span className="hidden sm:inline">Пн–Пт · 9:00–18:00 МСК</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/delivery" className="hover:text-foreground transition-colors">Доставка</Link>
            <Link to="/b2b" className="hover:text-foreground transition-colors">Для бизнеса</Link>
            <Link to="/contacts" className="hidden sm:inline hover:text-foreground transition-colors">Контакты</Link>
            {isB2B && <Badge variant="outline" className="border-accent/50 text-accent text-[10px] h-4 px-1.5">B2B</Badge>}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="container flex items-center gap-6 h-16">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-9 h-9 rounded-lg bg-foreground text-background flex items-center justify-center transition-transform group-hover:scale-105">
            <Wrench className="w-4.5 h-4.5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-lg tracking-tight">vtoolka</span>
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-0.5">industrial tools</span>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Артикул, название или бренд"
              className="pl-11 pr-24 h-10 bg-secondary/60 border-transparent rounded-full text-sm focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-transparent focus-visible:bg-background"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-3 rounded-full bg-foreground text-background text-xs font-medium hover:bg-foreground/90 transition-colors"
            >
              Найти
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="ghost" size="icon" title="Админ-панель" className="rounded-full h-9 w-9">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="icon" title="Личный кабинет" className="rounded-full h-9 w-9">
                  <User className="w-4.5 h-4.5" />
                </Button>
              </Link>
              <Button
                variant="ghost" size="icon" onClick={signOut} title="Выйти"
                className="hidden sm:inline-flex rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4.5 h-4.5" />
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="rounded-full text-sm h-9 px-4 gap-1.5">
                <User className="w-4 h-4" /> Войти
              </Button>
            </Link>
          )}

          <Link to="/cart">
            <Button
              variant="default" size="sm"
              className="relative rounded-full h-9 px-4 gap-2 bg-foreground text-background hover:bg-foreground/90"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Корзина</span>
              {totalItems > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost" size="icon"
            className="md:hidden rounded-full h-9 w-9 ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:block border-t border-border/60">
        <div className="container flex items-center gap-1 h-11 text-sm overflow-x-auto scrollbar-none">
          <Link
            to="/catalog"
            className={`flex items-center gap-1.5 px-3 h-8 rounded-full transition-colors whitespace-nowrap font-medium ${
              location.pathname === "/catalog" && !location.search
                ? "bg-foreground text-background"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Каталог
          </Link>
          <span className="w-px h-4 bg-border mx-1" />
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className={`flex items-center gap-1.5 px-3 h-8 rounded-full transition-colors whitespace-nowrap ${
                isActiveCategory(cat.slug)
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <CatIcon name={cat.icon} className="w-3.5 h-3.5" />
              {cat.name}
            </Link>
          ))}
          <Link
            to="/b2b"
            className="ml-auto flex items-center gap-1 px-3 h-8 rounded-full text-accent hover:bg-accent/10 transition-colors whitespace-nowrap font-medium text-sm"
          >
            B2B партнёрам <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background animate-slide-down">
          <div className="container py-4 space-y-5">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по артикулу"
                  className="pl-11 h-11 bg-secondary/60 border-transparent rounded-full"
                />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2">
              <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:bg-secondary transition-colors">
                <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Каталог</span>
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id} to={`/catalog?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
                >
                  <CatIcon name={cat.icon} className="w-4 h-4 text-muted-foreground" />
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

            <a href="tel:+78005553535" className="flex items-center justify-center gap-2 p-3 rounded-xl bg-foreground text-background text-sm font-medium">
              <Phone className="w-4 h-4" /> +7 (800) 555-35-35
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
