import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Phone, Wrench, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { user, isB2B, signOut } = useAuth();
  const { totalItems } = useCart();
  const { isAdmin } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> +7 (800) 555-35-35</span>
            <span className="hidden sm:inline">Пн-Пт: 9:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/delivery" className="hover:underline">Доставка</Link>
            <Link to="/about" className="hover:underline">О компании</Link>
            {isB2B && <Badge variant="outline" className="border-accent text-accent text-[10px]">B2B</Badge>}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
            <Wrench className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <span className="font-display font-bold text-lg leading-none text-foreground">vtoolka</span>
            <span className="block text-[10px] text-muted-foreground leading-none">промышленный инструмент</span>
          </div>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по артикулу, названию или бренду..."
              className="pl-9 pr-4 bg-secondary border-0 focus-visible:ring-accent"
            />
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="icon" title="Админ-панель"><ShieldCheck className="w-5 h-5 text-accent" /></Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button variant="ghost" size="icon"><User className="w-5 h-5" /></Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="hidden sm:inline-flex text-xs">
                Выйти
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="text-xs">Войти</Button>
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Nav */}
      <nav className="hidden md:block border-t bg-card">
        <div className="container flex items-center gap-6 py-2 text-sm font-medium">
          <Link to="/catalog" className="text-foreground hover:text-accent transition-colors">Каталог</Link>
          <Link to="/catalog?category=measuring" className="text-muted-foreground hover:text-foreground transition-colors">Измерительный</Link>
          <Link to="/catalog?category=consumables" className="text-muted-foreground hover:text-foreground transition-colors">Расходники</Link>
          <Link to="/catalog?category=cutting" className="text-muted-foreground hover:text-foreground transition-colors">Режущий</Link>
          <Link to="/catalog?category=lubricants" className="text-muted-foreground hover:text-foreground transition-colors">Смазки</Link>
          <Link to="/b2b" className="text-accent hover:text-industrial-orange-hover transition-colors ml-auto">B2B партнёрам</Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-card p-4 animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск..." className="pl-9 bg-secondary border-0" />
            </div>
          </form>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="py-2 font-medium">Каталог</Link>
            <Link to="/delivery" onClick={() => setMobileMenuOpen(false)} className="py-2 text-muted-foreground">Доставка и оплата</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 text-muted-foreground">О компании</Link>
            <Link to="/b2b" onClick={() => setMobileMenuOpen(false)} className="py-2 text-accent">B2B партнёрам</Link>
            <Link to="/contacts" onClick={() => setMobileMenuOpen(false)} className="py-2 text-muted-foreground">Контакты</Link>
            {user && (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-muted-foreground">Личный кабинет</Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="py-2 text-muted-foreground">Мои заказы</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2 text-accent">Админ-панель</Link>
                )}
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="py-2 text-left text-muted-foreground">Выйти</button>
              </>
            )}
            {!user && (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="py-2 font-medium text-accent">Войти</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
