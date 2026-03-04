import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ShieldCheck, Package, FolderTree, ClipboardList, BarChart3, Users } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import UsersTab from "@/components/admin/UsersTab";

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, isLoading } = useAdmin();
  const navigate = useNavigate();

  if (!user) { navigate("/auth"); return null; }
  if (isLoading) return <Layout><div className="container py-12 text-center text-muted-foreground">Загрузка...</div></Layout>;
  if (!isAdmin) return (
    <Layout><div className="container py-12 text-center">
      <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h1 className="text-xl font-bold mb-2">Доступ запрещён</h1>
      <p className="text-muted-foreground">У вас нет прав администратора.</p>
    </div></Layout>
  );

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-accent" /> Админ-панель
        </h1>
        <Tabs defaultValue="products">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="products" className="gap-1"><Package className="w-4 h-4" /> Товары</TabsTrigger>
            <TabsTrigger value="categories" className="gap-1"><FolderTree className="w-4 h-4" /> Категории</TabsTrigger>
            <TabsTrigger value="orders" className="gap-1"><ClipboardList className="w-4 h-4" /> Заказы</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1"><BarChart3 className="w-4 h-4" /> Аналитика</TabsTrigger>
            <TabsTrigger value="users" className="gap-1"><Users className="w-4 h-4" /> Пользователи</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsTab /></TabsContent>
          <TabsContent value="categories"><CategoriesTab /></TabsContent>
          <TabsContent value="orders"><OrdersTab /></TabsContent>
          <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
          <TabsContent value="users"><UsersTab /></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

// ─── Products Tab ───────────────────────────
function ProductsTab() {
  const queryClient = useQueryClient();
  const [editProduct, setEditProduct] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("Товар удалён"); },
    onError: () => toast.error("Ошибка удаления"),
  });

  const saveMutation = useMutation({
    mutationFn: async (product: any) => {
      // Set image_url to first image if available
      const images = product.images || [];
      const toSave = { ...product, image_url: images[0] || product.image_url || null };

      if (toSave.id) {
        const { error } = await supabase.from("products").update(toSave).eq("id", toSave.id);
        if (error) throw error;
      } else {
        const { id, ...rest } = toSave;
        const { error } = await supabase.from("products").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      setDialogOpen(false);
      setEditProduct(null);
      toast.success("Сохранено");
    },
    onError: (e) => toast.error("Ошибка: " + e.message),
  });

  const openNew = () => {
    setEditProduct({ sku: "", name: "", brand: "", description: "", price_retail: 0, price_wholesale: 0, stock_level: 0, category_id: null, images: [], image_url: null });
    setDialogOpen(true);
  };

  const openEdit = (p: any) => {
    setEditProduct({ ...p, images: p.images || (p.image_url ? [p.image_url] : []) });
    setDialogOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{products?.length ?? 0} товаров</p>
        <Button onClick={openNew} className="bg-accent text-accent-foreground hover:bg-industrial-orange-hover gap-1">
          <Plus className="w-4 h-4" /> Добавить товар
        </Button>
      </div>
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Фото</TableHead>
              <TableHead>Артикул</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>Бренд</TableHead>
              <TableHead className="text-right">Розн.</TableHead>
              <TableHead className="text-right">Опт.</TableHead>
              <TableHead className="text-right">Остаток</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                <TableCell className="max-w-[200px] truncate">{p.name}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell className="text-right">{Number(p.price_retail).toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell className="text-right">{Number(p.price_wholesale).toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell className="text-right">{p.stock_level}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editProduct?.id ? "Редактировать товар" : "Новый товар"}</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm product={editProduct} categories={categories ?? []} onSave={(p) => saveMutation.mutate(p)} saving={saveMutation.isPending} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProductForm({ product, categories, onSave, saving }: { product: any; categories: any[]; onSave: (p: any) => void; saving: boolean }) {
  const [form, setForm] = useState(product);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><Label className="text-xs">Артикул (SKU)</Label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} /></div>
        <div><Label className="text-xs">Бренд</Label><Input value={form.brand} onChange={(e) => set("brand", e.target.value)} /></div>
      </div>
      <div><Label className="text-xs">Название</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
      <div><Label className="text-xs">Описание</Label><Textarea value={form.description || ""} onChange={(e) => set("description", e.target.value)} rows={3} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label className="text-xs">Розн. цена</Label><Input type="number" value={form.price_retail} onChange={(e) => set("price_retail", +e.target.value)} /></div>
        <div><Label className="text-xs">Опт. цена</Label><Input type="number" value={form.price_wholesale} onChange={(e) => set("price_wholesale", +e.target.value)} /></div>
        <div><Label className="text-xs">Остаток</Label><Input type="number" value={form.stock_level} onChange={(e) => set("stock_level", +e.target.value)} /></div>
      </div>
      <div>
        <Label className="text-xs">Категория</Label>
        <Select value={form.category_id || ""} onValueChange={(v) => set("category_id", v || null)}>
          <SelectTrigger><SelectValue placeholder="Выберите категорию" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Image uploader */}
      <div>
        <Label className="text-xs mb-2 block">Изображения товара</Label>
        <ImageUploader images={form.images || []} onChange={(imgs) => set("images", imgs)} />
      </div>

      <Button onClick={() => onSave(form)} disabled={saving || !form.sku || !form.name} className="w-full bg-accent text-accent-foreground hover:bg-industrial-orange-hover">
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}

// ─── Categories Tab ─────────────────────────
function CategoriesTab() {
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("*").order("name");
      return data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("Категория удалена"); },
    onError: () => toast.error("Ошибка удаления"),
  });

  return (
    <div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Иконка</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="font-mono text-xs">{c.slug}</TableCell>
                <TableCell className="text-xs">{c.icon}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMutation.mutate(c.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Orders Tab ─────────────────────────────
function OrdersTab() {
  const queryClient = useQueryClient();
  const { data: orders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const statusMap: Record<string, string> = {
    pending: "Новый", processing: "В обработке", shipped: "Отправлен", completed: "Завершён", cancelled: "Отменён",
  };

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-orders"] }); toast.success("Статус обновлён"); },
    onError: () => toast.error("Ошибка"),
  });

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">{orders?.length ?? 0} заказов</p>
      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead>Статус</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">#{o.id.slice(0, 8)}</TableCell>
                <TableCell className="text-xs">{new Date(o.created_at).toLocaleDateString("ru-RU")}</TableCell>
                <TableCell>{o.contact_name || "—"}</TableCell>
                <TableCell className="text-xs">{o.contact_phone || "—"}</TableCell>
                <TableCell className="text-right font-semibold">{Number(o.total).toLocaleString("ru-RU")} ₽</TableCell>
                <TableCell>
                  <Select value={o.status} onValueChange={(v) => updateStatus.mutate({ id: o.id, status: v })}>
                    <SelectTrigger className="h-8 text-xs w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusMap).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
