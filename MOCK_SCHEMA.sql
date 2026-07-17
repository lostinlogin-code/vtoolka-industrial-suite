-- =====================================================================
-- vtoolka.ru — SQL схема БД (PostgreSQL)
-- =====================================================================
-- Файл описывает структуру, которую использует фронтенд-макет.
-- Совместимо с любым Postgres 13+. Для MySQL/др. потребуется адаптация
-- типов (uuid -> char(36), jsonb -> json, gen_random_uuid() -> uuid()).
--
-- Разделы:
--   1. Расширения и типы
--   2. Таблицы
--   3. Индексы
--   4. Триггеры (updated_at)
--   5. Опционально: RLS + функции (если используете Supabase/Postgres)
-- =====================================================================

-- 1. РАСШИРЕНИЯ И ТИПЫ ------------------------------------------------
create extension if not exists "pgcrypto";  -- для gen_random_uuid()

do $$ begin
  create type app_role as enum ('admin', 'moderator', 'user');
exception when duplicate_object then null; end $$;


-- 2. ТАБЛИЦЫ ----------------------------------------------------------

-- 2.1 Категории товаров
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text,                    -- имя иконки Lucide
  description text,
  parent_id   uuid references categories(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- 2.2 Профили пользователей (связка с системой аутентификации)
--    В реальном проекте id ссылается на users.id вашей auth-таблицы.
create table if not exists profiles (
  id             uuid primary key,
  email          text unique,
  full_name      text,
  phone          text,
  company_name   text,
  inn            text,                 -- ИНН (10 или 12 цифр) для B2B
  legal_address  text,
  is_b2b         boolean not null default false,
  discount_tier  integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 2.3 Роли пользователей (RBAC).
--    Держать в отдельной таблице (не в profiles) — защита от privilege escalation.
create table if not exists user_roles (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references profiles(id) on delete cascade,
  role     app_role not null,
  unique (user_id, role)
);

-- 2.4 Товары
create table if not exists products (
  id               uuid primary key default gen_random_uuid(),
  sku              text not null unique,
  name             text not null,
  brand            text not null default '',
  description      text,
  price_retail     numeric(12,2) not null default 0,   -- розничная цена (B2C)
  price_wholesale  numeric(12,2) not null default 0,   -- оптовая цена (B2B)
  stock_level      integer not null default 0,
  category_id      uuid references categories(id) on delete set null,
  technical_specs  jsonb default '{}'::jsonb,          -- {"ГОСТ": "...", "Диаметр": "..."}
  image_url        text,                               -- основное фото
  images           text[] default '{}',                -- галерея (URL)
  is_popular       boolean default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 2.5 Аналоги товара (сравнение с конкурентами — USP)
create table if not exists product_analogs (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references products(id) on delete cascade,
  analog_sku    text not null,
  analog_name   text not null,
  analog_brand  text default '',
  analog_price  numeric(12,2),
  notes         text
);

-- 2.6 Заказы
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  status            text not null default 'pending',
    -- pending | processing | shipped | delivered | cancelled
  total             numeric(12,2) not null default 0,
  delivery_method   text default 'СДЭК',
  delivery_address  text default '',
  contact_name      text default '',
  contact_phone     text default '',
  contact_email     text default '',
  notes             text default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- 2.7 Позиции заказа
create table if not exists order_items (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid not null references products(id),
  quantity      integer not null default 1,
  price         numeric(12,2) not null default 0,   -- цена на момент покупки
  product_name  text not null default '',           -- денормализация: имя на момент покупки
  product_sku   text not null default ''
);


-- 3. ИНДЕКСЫ ----------------------------------------------------------
create index if not exists idx_products_category  on products(category_id);
create index if not exists idx_products_sku       on products(sku);
create index if not exists idx_products_popular   on products(is_popular) where is_popular = true;
create index if not exists idx_orders_user        on orders(user_id);
create index if not exists idx_orders_status      on orders(status);
create index if not exists idx_order_items_order  on order_items(order_id);
create index if not exists idx_analogs_product    on product_analogs(product_id);
create index if not exists idx_user_roles_user    on user_roles(user_id);


-- 4. ТРИГГЕРЫ (auto-update updated_at) --------------------------------
create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();


-- 5. RBAC-хелпер (только для Postgres/Supabase) -----------------------
-- Функция для проверки роли без рекурсивных RLS-циклов.
create or replace function has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from user_roles
    where user_id = _user_id and role = _role
  );
$$;


-- 6. SEED-ДАННЫЕ ------------------------------------------------------
insert into categories (name, slug, icon, description) values
  ('Измерительный инструмент', 'measuring',   'Ruler',    'Штангенциркули, микрометры, нутромеры'),
  ('Расходные материалы',      'consumables', 'Disc',     'Круги отрезные, свёрла, фрезы'),
  ('Смазочные материалы',      'lubricants',  'Droplets', 'Масла, СОЖ, смазки промышленные'),
  ('Абразивный инструмент',    'abrasives',   'Layers',   'Бруски, шкурки, ленты'),
  ('Режущий инструмент',       'cutting',     'Scissors', 'Резцы, пластины, метчики'),
  ('Оснастка',                 'tooling',     'Wrench',   'Патроны, цанги, тиски')
on conflict (slug) do nothing;

-- Пример товара:
-- insert into products (sku, name, brand, description, price_retail, price_wholesale, stock_level, category_id, technical_specs, is_popular)
-- values ('ШЦ-150', 'Штангенциркуль ШЦ-I 0-150мм', 'ЧИЗ', '...', 1850, 1480, 45,
--   (select id from categories where slug='measuring'),
--   '{"ГОСТ":"166-89","Диапазон":"0-150 мм"}'::jsonb, true);
