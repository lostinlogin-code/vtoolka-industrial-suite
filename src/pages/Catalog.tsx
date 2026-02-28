import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

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
        query = query.or(`sku.ilike.%${searchQuery}%,name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
      }
      const { data } = await query;
      return data ?? [];
    },
    enabled: categorySlug ? !!categories : true,
  });

  const brands = [...new Set(products?.map((p) => p.brand).filter(Boolean) ?? [])] as string[];

  const filteredProducts = products
    ?.filter((p) => {
      if (brandFilter !== "all" && p.brand !== brandFilter) return false;
      if (localSearch && !searchQuery) {
        const q = localSearch.toLowerCase();
        return p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price_retail) - Number(b.price_retail);
      if (sortBy === "price_desc") return Number(b.price_retail) - Number(a.price_retail);
      return a.name.localeCompare(b.name, "ru");
    });

  const currentCategory = categories?.find((c) => c.slug === categorySlug);

  return (
    <Layout>
      <div className="container py-6">
        {/* Breadcrumbs */}
        <nav className="text-xs text-muted-foreground mb-4">
          <a href="/" className="hover:text-foreground">Главная</a>
          <span className="mx-1">/</span>
          <span className="text-foreground">
            {currentCategory ? currentCategory.name : "Каталог"}
          </span>
        </nav>

        <h1 className="text-2xl font-display font-bold mb-6">
          {currentCategory ? currentCategory.name : searchQuery ? `Результаты: «${searchQuery}»` : "Каталог товаров"}
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-secondary rounded-lg">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Фильтр по артикулу, названию..."
              className="pl-9 bg-card border-0 text-sm"
            />
          </div>
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-[160px] bg-card border-0 text-sm">
              <SlidersHorizontal className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Бренд" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все бренды</SelectItem>
              {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-card border-0 text-sm">
              <SelectValue placeholder="Сортировка" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">По названию</SelectItem>
              <SelectItem value="price_asc">Цена ↑</SelectItem>
              <SelectItem value="price_desc">Цена ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-secondary" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-secondary rounded w-16" />
                  <div className="h-4 bg-secondary rounded w-full" />
                  <div className="h-4 bg-secondary rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">Товары не найдены</p>
            <p className="text-sm mt-1">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
