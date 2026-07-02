import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Package, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", categorySlug, searchQuery],
    queryFn: async () => {
      let query = supabase.from("products").select("*, categories(slug, name)");
      if (categorySlug) {
        const cat = categories?.find((c) => c.slug === categorySlug);
        if (cat) query = query.eq("category_id", cat.id);
      }
      if (searchQuery) {
        query = query.or(`sku.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      const { data } = await query;
      return data ?? [];
    },
    enabled: categorySlug ? !!categories : true,
  });

  const brands = useMemo(
    () => [...new Set(products?.map((p) => p.brand).filter(Boolean) ?? [])] as string[],
    [products],
  );

  const hasActiveFilters = brandFilter !== "all" || inStockOnly || priceMin !== "" || priceMax !== "" || localSearch !== "";

  const resetFilters = () => {
    setBrandFilter("all");
    setInStockOnly(false);
    setPriceMin("");
    setPriceMax("");
    setLocalSearch("");
  };

  const filteredProducts = products
    ?.filter((p) => {
      if (brandFilter !== "all" && p.brand !== brandFilter) return false;
      if (inStockOnly && p.stock_level <= 0) return false;
      const price = Number(p.price_retail);
      if (priceMin && price < Number(priceMin)) return false;
      if (priceMax && price > Number(priceMax)) return false;
      if (localSearch && !searchQuery) {
        const q = localSearch.toLowerCase();
        return (
          p.sku.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price_retail) - Number(b.price_retail);
      if (sortBy === "price_desc") return Number(b.price_retail) - Number(a.price_retail);
      return a.name.localeCompare(b.name, "ru");
    });

  const currentCategory = categories?.find((c) => c.slug === categorySlug);

  const FilterPanel = () => (
    <div className="space-y-1">
      {/* Кнопка сброса */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="w-full justify-start text-muted-foreground hover:text-destructive mb-2"
        >
          <X className="w-3.5 h-3.5 mr-1" /> Сбросить все фильтры
        </Button>
      )}

      <Accordion type="multiple" defaultValue={["brands", "price", "stock"]} className="w-full">
        {/* Бренды */}
        <AccordionItem value="brands" className="border-border">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Бренд
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="space-y-2">
              <button
                onClick={() => setBrandFilter("all")}
                className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                  brandFilter === "all" ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                Все бренды
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => setBrandFilter(b)}
                  className={`block w-full text-left text-sm py-1 px-2 rounded transition-colors ${
                    brandFilter === b ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-secondary/50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Цена */}
        <AccordionItem value="price" className="border-border">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Цена
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="от 0"
                className="h-9 text-sm"
              />
              <span className="text-muted-foreground text-xs">—</span>
              <Input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="до ∞"
                className="h-9 text-sm"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Наличие */}
        <AccordionItem value="stock" className="border-b border-border">
          <AccordionTrigger className="text-sm font-semibold py-3 hover:no-underline">
            Наличие
          </AccordionTrigger>
          <AccordionContent className="pt-1">
            <div className="flex items-center gap-2 py-1">
              <Checkbox
                id="inStock"
                checked={inStockOnly}
                onCheckedChange={(v) => setInStockOnly(v === true)}
              />
              <Label htmlFor="inStock" className="text-sm text-muted-foreground cursor-pointer">
                Только в наличии
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <Layout>
      <div className="container py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground">Главная</Link>
          <span className="mx-1">/</span>
          <span className="text-foreground">
            {currentCategory ? currentCategory.name : "Каталог"}
          </span>
        </nav>

        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">
              {currentCategory ? currentCategory.name : searchQuery ? `Результаты: «${searchQuery}»` : "Каталог товаров"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredProducts?.length ?? 0} товаров
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-1" /> Фильтры
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] text-sm">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">По названию</SelectItem>
                <SelectItem value="price_asc">Цена ↑</SelectItem>
                <SelectItem value="price_desc">Цена ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-card border border-border rounded-xl p-4 sticky top-44">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="pl-9 text-sm"
                />
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filters */}
          {mobileFiltersOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setMobileFiltersOpen(false)}>
              <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-card p-4 overflow-y-auto animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Фильтры</h2>
                  <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder="Поиск..."
                    className="pl-9 text-sm"
                  />
                </div>
                <FilterPanel />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">Товары не найдены</p>
                <p className="text-sm text-muted-foreground mt-1">Попробуйте изменить параметры поиска или фильтры</p>
                {hasActiveFilters && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>
                    <X className="w-3.5 h-3.5 mr-1" /> Сбросить все фильтры
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
