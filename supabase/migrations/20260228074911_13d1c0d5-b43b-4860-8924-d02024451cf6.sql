
-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  is_b2b BOOLEAN NOT NULL DEFAULT false,
  discount_tier INTEGER NOT NULL DEFAULT 0,
  phone TEXT,
  inn TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  price_retail NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_wholesale NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock_level INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  technical_specs JSONB DEFAULT '{}',
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

-- Product analogs
CREATE TABLE public.product_analogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  analog_sku TEXT NOT NULL,
  analog_name TEXT NOT NULL,
  analog_brand TEXT DEFAULT '',
  analog_price NUMERIC(10,2),
  notes TEXT DEFAULT ''
);
ALTER TABLE public.product_analogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Analogs are viewable by everyone" ON public.product_analogs FOR SELECT USING (true);

-- Orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_method TEXT DEFAULT 'СДЭК',
  delivery_address TEXT DEFAULT '',
  contact_name TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  product_name TEXT NOT NULL DEFAULT '',
  product_sku TEXT NOT NULL DEFAULT ''
);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.categories (name, slug, icon, description) VALUES
  ('Измерительный инструмент', 'measuring', 'Ruler', 'Штангенциркули, микрометры, нутромеры, индикаторы'),
  ('Расходные материалы', 'consumables', 'Disc', 'Круги отрезные, шлифовальные, свёрла, фрезы'),
  ('Смазочные материалы', 'lubricants', 'Droplets', 'Масла, СОЖ, смазки промышленные'),
  ('Абразивный инструмент', 'abrasives', 'Layers', 'Бруски, шкурки, абразивные ленты'),
  ('Режущий инструмент', 'cutting', 'Scissors', 'Резцы, пластины, метчики, плашки'),
  ('Оснастка', 'tooling', 'Wrench', 'Патроны, цанги, оправки, тиски');

-- Seed some products
INSERT INTO public.products (sku, name, brand, description, price_retail, price_wholesale, stock_level, category_id, technical_specs, is_popular) VALUES
  ('ШЦ-150', 'Штангенциркуль ШЦ-I 0-150мм 0.05мм', 'ЧИЗ', 'Штангенциркуль с двусторонним расположением губок для наружных и внутренних измерений и глубиномером.', 1850.00, 1480.00, 45, (SELECT id FROM public.categories WHERE slug='measuring'), '{"Диапазон измерений": "0-150 мм", "Цена деления": "0.05 мм", "Материал": "Нержавеющая сталь", "ГОСТ": "166-89"}', true),
  ('МК-25', 'Микрометр МК-25 0-25мм 0.01мм', 'ЧИЗ', 'Микрометр гладкий для точных наружных измерений.', 2400.00, 1920.00, 30, (SELECT id FROM public.categories WHERE slug='measuring'), '{"Диапазон измерений": "0-25 мм", "Цена деления": "0.01 мм", "Материал": "Сталь закалённая", "ГОСТ": "6507-90"}', true),
  ('КО-125', 'Круг отрезной 125x1.0x22.23 A60', 'Luga', 'Круг отрезной по металлу для УШМ.', 45.00, 32.00, 500, (SELECT id FROM public.categories WHERE slug='consumables'), '{"Диаметр": "125 мм", "Толщина": "1.0 мм", "Посадка": "22.23 мм", "Зернистость": "A60"}', true),
  ('СОЖ-5L', 'СОЖ Концентрат универсальный 5л', 'Fuchs', 'Смазочно-охлаждающая жидкость для металлообработки.', 3200.00, 2560.00, 20, (SELECT id FROM public.categories WHERE slug='lubricants'), '{"Объём": "5 л", "Тип": "Полусинтетическая", "Концентрация": "3-8%", "pH": "9.0-9.5"}', false),
  ('ИЧ-10', 'Индикатор часового типа ИЧ-10 0-10мм 0.01мм', 'Микротех', 'Индикатор часового типа для измерения линейных размеров.', 1200.00, 960.00, 35, (SELECT id FROM public.categories WHERE slug='measuring'), '{"Диапазон": "0-10 мм", "Цена деления": "0.01 мм", "Ход стержня": "10 мм", "ГОСТ": "577-68"}', false),
  ('РТ-16', 'Резец токарный проходной 16x16', 'Sandvik', 'Резец токарный с механическим креплением пластины.', 4800.00, 3840.00, 15, (SELECT id FROM public.categories WHERE slug='cutting'), '{"Сечение державки": "16x16 мм", "Тип": "Проходной", "Пластина": "CNMG 120408", "Материал": "Твёрдый сплав"}', true),
  ('СВ-10', 'Сверло спиральное 10мм Р6М5', 'Dormer', 'Сверло с цилиндрическим хвостовиком из быстрорежущей стали.', 320.00, 250.00, 100, (SELECT id FROM public.categories WHERE slug='consumables'), '{"Диаметр": "10 мм", "Длина общая": "133 мм", "Длина рабочая": "87 мм", "Материал": "Р6М5"}', false),
  ('ШЛ-150', 'Круг шлифовальный 150x20x32 25А', 'Tyrolit', 'Шлифовальный круг для обработки стали.', 680.00, 544.00, 40, (SELECT id FROM public.categories WHERE slug='abrasives'), '{"Диаметр": "150 мм", "Ширина": "20 мм", "Посадка": "32 мм", "Зернистость": "25А"}', false);

-- Seed product analogs
INSERT INTO public.product_analogs (product_id, analog_sku, analog_name, analog_brand, analog_price, notes) VALUES
  ((SELECT id FROM public.products WHERE sku='ШЦ-150'), 'Mitutoyo 530-312', 'Штангенциркуль 0-150мм', 'Mitutoyo', 8500.00, 'Японский аналог повышенной точности'),
  ((SELECT id FROM public.products WHERE sku='ШЦ-150'), 'Mahr 16ER', 'Штангенциркуль MarCal 150мм', 'Mahr', 6200.00, 'Немецкий аналог'),
  ((SELECT id FROM public.products WHERE sku='МК-25'), 'Mitutoyo 103-137', 'Микрометр 0-25мм', 'Mitutoyo', 12000.00, 'Японский аналог'),
  ((SELECT id FROM public.products WHERE sku='КО-125'), 'Norton 66252', 'Круг отрезной 125мм', 'Norton', 65.00, 'Импортный аналог');
