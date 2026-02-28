import { Link } from "react-router-dom";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

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

  const price = isB2B ? price_wholesale : price_retail;

  return (
    <div className="group bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all animate-fade-in">
      <Link to={`/product/${id}`} className="block">
        <div className="aspect-square bg-secondary flex items-center justify-center p-6">
          {image_url ? (
            <img src={image_url} alt={name} className="max-h-full object-contain" />
          ) : (
            <Package className="w-16 h-16 text-muted-foreground/30" />
          )}
        </div>
      </Link>

      <div className="p-3">
        <span className="sku-badge">{sku}</span>
        <Link to={`/product/${id}`}>
          <h3 className="mt-2 text-sm font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors">{name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-1">{brand}</p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            {isB2B ? (
              <div>
                <span className="price-tag-wholesale">{price_wholesale.toLocaleString("ru-RU")} ₽</span>
                <span className="block text-xs text-muted-foreground line-through">{price_retail.toLocaleString("ru-RU")} ₽</span>
              </div>
            ) : (
              <span className="price-tag">{price_retail.toLocaleString("ru-RU")} ₽</span>
            )}
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 shrink-0 hover:bg-accent hover:text-accent-foreground hover:border-accent"
            onClick={() => addItem({ id, sku, name, brand, price, image_url })}
            disabled={stock_level <= 0}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>

        {stock_level > 0 ? (
          <span className="text-[10px] text-success mt-1 block">В наличии: {stock_level} шт.</span>
        ) : (
          <span className="text-[10px] text-destructive mt-1 block">Нет в наличии</span>
        )}
      </div>
    </div>
  );
}
