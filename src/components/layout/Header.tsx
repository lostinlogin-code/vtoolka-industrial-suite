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
import Logo from "@/components/layout/Logo";

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
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      {/* Top status bar */}
      <div className="border-b border-border/60 bg-card/50">
        <div className="container flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="mono-label flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              STATUS · Online
            </span>
            <a href="tel:+78005553535" className="hidden sm:flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors">
              <Phone className="w-3 h-3" /> +7 (800) 555-35-35
            </a>
            <span className="hidden md:inline mono-label">Пн–Пт · 09:00–18:00</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Link to="/delivery" className="hover:text-accent transition-colors">Доставка</Link>
            <Link to="/about" className="hover:text-accent transition-colors">О компании</Link>
            {isB2B && <Badge variant="outline" className="border-accent text-accent text-[10px] font-bold uppercase tracking-widest">B2B</Badge>}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex items-center gap-4 py-4">
        <Link to="/" className="flex items-center shrink-0" aria-label="vtoolka — на главную">
          <Logo />
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по артикулу, названию или бренду…"
              className="pl-11 pr-24 h-11 bg-card border-border text-sm focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent rounded-md"
            />
            <kbd className="hidden lg:inline-flex absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest text-muted-foreground border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-auto">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center shadow-ember">
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
            <Link to="/auth" className="ml-1">
              <Button size="sm" className="ember-btn text-xs uppercase tracking-widest h-9 px-4 rounded-md">Войти</Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden hover:bg-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden md:block border-t border-border/60 bg-card/30">
        <div className="container flex items-center gap-1 py-2 text-xs font-semibold uppercase tracking-wider overflow-x-auto">
          <Link
            to="/catalog"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              location.pathname === "/catalog" && !location.search
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" /> Все товары
          </Link>
          {categories?.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                isActiveCategory(cat.slug)
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <CatIcon name={cat.icon} className="w-3.5 h-3.5" />
              {cat.name}
            </Link>
          ))}
          <Link to="/b2b" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-md text-accent border border-accent/30 hover:bg-accent/10 transition-colors whitespace-nowrap">
            B2B партнёрам <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card animate-slide-down">
          <div className="container py-4 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по артикулу…" className="pl-11 h-11 bg-background border-border" />
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2">
              <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 p-3 rounded-md border border-border hover:border-accent/50 transition-colors">
                <Wrench className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Все товары</span>
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalog?category=${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-md border border-border hover:border-accent/50 transition-colors"
                >
                  <CatIcon name={cat.icon} className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-1">
              <Link to="/delivery" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">Доставка и оплата</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground">О компании</Link>
              <Link to="/b2b" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm text-accent font-semibold">B2B партнёрам</Link>
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
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-sm font-semibold text-accent">Войти / Регистрация</Link>
              )}
            </div>

            <a href="tel:+78005553535" className="flex items-center justify-center gap-2 p-3 rounded-md bg-accent text-accent-foreground text-sm font-semibold">
              <Phone className="w-4 h-4" /> +7 (800) 555-35-35
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
