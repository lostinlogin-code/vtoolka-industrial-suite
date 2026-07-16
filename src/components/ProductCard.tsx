import { Link } from "react-router-dom";
import { ShoppingCart, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  sku: string;
  name: string;
  brand: string;
  price_retail: number;
  price_wholesale: number;
  stock_level: number;
  image_url?: string | null;
}

export default function ProductCard({ id, sku, name, brand, price_retail, price_wholesale, stock_level, image_url }: ProductCardProps) {
  const { isB2B } = useAuth();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const price = isB2B ? price_wholesale : price_retail;
  const inStock = stock_level > 0;

  const handleAdd = () => {
    addItem({ id, sku, name, brand, price, image_url });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-card-hover hover:border-accent/40 transition-all duration-200 animate-fade-in flex flex-col">
      <Link to={`/product/${id}`} className="block relative">
        <div className="aspect-square bg-secondary flex items-center justify-center p-6 overflow-hidden">
          {image_url ? (
            <img src={image_url} alt={name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <Package className="w-16 h-16 text-muted-foreground/30" />
          )}
        </div>
        {/* Индикатор наличия — аккуратный, поверх изображения */}
        {inStock ? (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-medium backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-success" /> В наличии
          </span>
        ) : (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium backdrop-blur-sm">
            Нет в наличии
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {/* Артикул — на видном месте, серым неброским шрифтом */}
        <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground">Арт. {sku}</span>
        <Link to={`/product/${id}`} className="flex-1">
          <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">{name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">{brand}</p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {isB2B ? (
              <div>
                <span className="price-tag-wholesale text-base">{price_wholesale.toLocaleString("ru-RU")} ₽</span>
                <span className="block text-xs text-muted-foreground line-through mt-0.5">{price_retail.toLocaleString("ru-RU")} ₽</span>
              </div>
            ) : (
              <span className="price-tag text-base">{price_retail.toLocaleString("ru-RU")} ₽</span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className={`h-9 w-9 shrink-0 transition-all ${
              added
                ? "bg-success border-success text-success-foreground scale-110"
                : "hover:bg-accent hover:text-accent-foreground hover:border-accent"
            }`}
            onClick={handleAdd}
            disabled={!inStock}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </Button>
        </div>

        {inStock && (
          <span className="text-[10px] text-muted-foreground mt-2 block">
            Остаток: {stock_level} шт.
          </span>
        )}
      </div>
    </div>
  );
}
