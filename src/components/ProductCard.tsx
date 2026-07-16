import { Link } from "react-router-dom";
import { ShoppingCart, Package, Check, ArrowUpRight } from "lucide-react";
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
    <div className="group bento-tile flex flex-col animate-fade-in">
      <Link to={`/product/${id}`} className="block relative">
        <div className="aspect-square bg-secondary/60 flex items-center justify-center p-6 overflow-hidden border-b border-border">
          {image_url ? (
            <img src={image_url} alt={name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <Package className="w-16 h-16 text-muted-foreground/20" strokeWidth={1} />
          )}
        </div>

        {/* Stock badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-mono text-[9px] tracking-[0.15em] uppercase backdrop-blur-md ${
          inStock ? "bg-success/15 text-success border border-success/30" : "bg-destructive/15 text-destructive border border-destructive/30"
        }`}>
          <span className={`w-1 h-1 rounded-full ${inStock ? "bg-success" : "bg-destructive"}`} />
          {inStock ? "In stock" : "Out"}
        </span>

        <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <span className="mono-label">Арт · {sku}</span>
        <Link to={`/product/${id}`} className="flex-1 mt-2">
          <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-accent transition-colors">{name}</h3>
        </Link>
        <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">{brand}</p>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {isB2B ? (
              <div>
                <span className="price-tag-wholesale text-base">{price_wholesale.toLocaleString("ru-RU")} ₽</span>
                <span className="block text-[11px] text-muted-foreground line-through mt-0.5">{price_retail.toLocaleString("ru-RU")} ₽</span>
              </div>
            ) : (
              <span className="price-tag text-base">{price_retail.toLocaleString("ru-RU")} ₽</span>
            )}
          </div>
          <Button
            size="icon"
            className={`h-9 w-9 shrink-0 rounded-md transition-all ${
              added
                ? "bg-success hover:bg-success text-white scale-110"
                : "bg-secondary border border-border hover:bg-accent hover:text-accent-foreground hover:border-accent text-foreground"
            }`}
            onClick={handleAdd}
            disabled={!inStock}
          >
            {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </Button>
        </div>

        {inStock && (
          <span className="mono-label mt-2">Остаток · {stock_level} шт</span>
        )}
      </div>
    </div>
  );
}
