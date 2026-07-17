/**
 * MOCK SUPABASE CLIENT
 * =====================================================================
 * Этот файл — заглушка, имитирующая API @supabase/supabase-js.
 * Реальный Supabase не используется. Все данные хранятся в localStorage.
 *
 * Цель: сохранить макет сайта работоспособным без бэкенда, чтобы
 * позже можно было подключить любую БД (Postgres, MySQL, MongoDB и т.д.)
 * и любой backend (Node/Express, Django, Laravel...) без изменения UI.
 *
 * Что имитируется:
 *   - supabase.auth.{signUp, signInWithPassword, signOut, getSession,
 *                    onAuthStateChange, updateUser, resetPasswordForEmail}
 *   - supabase.from(table).select/insert/update/delete + .eq/.in/.or/
 *     .order/.limit/.single (+ join-нотация "*, rel(col1, col2)")
 *   - supabase.rpc("has_role"|"admin_get_profiles", ...)
 *   - supabase.storage.from(bucket).{upload, getPublicUrl, remove}
 *     (файлы сохраняются как data URL в localStorage — только для демо)
 *
 * SQL-схема реальной БД лежит в /MOCK_SCHEMA.sql (корень проекта).
 * ===================================================================== */

// ---------- Seed data ----------
const SEED_CATEGORIES = [
  { id: "cat-measuring", name: "Измерительный инструмент", slug: "measuring", icon: "Ruler", description: "Штангенциркули, микрометры, нутромеры, индикаторы", parent_id: null },
  { id: "cat-consumables", name: "Расходные материалы", slug: "consumables", icon: "Disc", description: "Круги отрезные, шлифовальные, свёрла, фрезы", parent_id: null },
  { id: "cat-lubricants", name: "Смазочные материалы", slug: "lubricants", icon: "Droplets", description: "Масла, СОЖ, смазки промышленные", parent_id: null },
  { id: "cat-abrasives", name: "Абразивный инструмент", slug: "abrasives", icon: "Layers", description: "Бруски, шкурки, абразивные ленты", parent_id: null },
  { id: "cat-cutting", name: "Режущий инструмент", slug: "cutting", icon: "Scissors", description: "Резцы, пластины, метчики, плашки", parent_id: null },
  { id: "cat-tooling", name: "Оснастка", slug: "tooling", icon: "Wrench", description: "Патроны, цанги, оправки, тиски", parent_id: null },
];

const SEED_PRODUCTS = [
  { id: "p-shc-150", sku: "ШЦ-150", name: "Штангенциркуль ШЦ-I 0-150мм 0.05мм", brand: "ЧИЗ", description: "Штангенциркуль с двусторонним расположением губок для наружных и внутренних измерений и глубиномером.", price_retail: 1850, price_wholesale: 1480, stock_level: 45, category_id: "cat-measuring", technical_specs: { "ГОСТ": "166-89", "Диапазон измерений": "0-150 мм", "Материал": "Нержавеющая сталь", "Цена деления": "0.05 мм" }, image_url: null, images: [], is_popular: true },
  { id: "p-mk-25", sku: "МК-25", name: "Микрометр МК-25 0-25мм 0.01мм", brand: "ЧИЗ", description: "Микрометр гладкий для точных наружных измерений.", price_retail: 2400, price_wholesale: 1920, stock_level: 30, category_id: "cat-measuring", technical_specs: { "ГОСТ": "6507-90", "Диапазон измерений": "0-25 мм", "Материал": "Сталь закалённая", "Цена деления": "0.01 мм" }, image_url: null, images: [], is_popular: true },
  { id: "p-ko-125", sku: "КО-125", name: "Круг отрезной 125x1.0x22.23 A60", brand: "Luga", description: "Круг отрезной по металлу для УШМ.", price_retail: 45, price_wholesale: 32, stock_level: 500, category_id: "cat-consumables", technical_specs: { "Диаметр": "125 мм", "Зернистость": "A60", "Посадка": "22.23 мм", "Толщина": "1.0 мм" }, image_url: null, images: [], is_popular: true },
  { id: "p-sozh-5l", sku: "СОЖ-5L", name: "СОЖ Концентрат универсальный 5л", brand: "Fuchs", description: "Смазочно-охлаждающая жидкость для металлообработки.", price_retail: 3200, price_wholesale: 2560, stock_level: 20, category_id: "cat-lubricants", technical_specs: { "pH": "9.0-9.5", "Концентрация": "3-8%", "Объём": "5 л", "Тип": "Полусинтетическая" }, image_url: null, images: [], is_popular: false },
  { id: "p-ich-10", sku: "ИЧ-10", name: "Индикатор часового типа ИЧ-10 0-10мм 0.01мм", brand: "Микротех", description: "Индикатор часового типа для измерения линейных размеров.", price_retail: 1200, price_wholesale: 960, stock_level: 35, category_id: "cat-measuring", technical_specs: { "ГОСТ": "577-68", "Диапазон": "0-10 мм", "Ход стержня": "10 мм", "Цена деления": "0.01 мм" }, image_url: null, images: [], is_popular: false },
  { id: "p-rt-16", sku: "РТ-16", name: "Резец токарный проходной 16x16", brand: "Sandvik", description: "Резец токарный с механическим креплением пластины.", price_retail: 4800, price_wholesale: 3840, stock_level: 15, category_id: "cat-cutting", technical_specs: { "Материал": "Твёрдый сплав", "Пластина": "CNMG 120408", "Сечение державки": "16x16 мм", "Тип": "Проходной" }, image_url: null, images: [], is_popular: true },
  { id: "p-sv-10", sku: "СВ-10", name: "Сверло спиральное 10мм Р6М5", brand: "Dormer", description: "Сверло с цилиндрическим хвостовиком из быстрорежущей стали.", price_retail: 320, price_wholesale: 250, stock_level: 100, category_id: "cat-consumables", technical_specs: { "Диаметр": "10 мм", "Длина общая": "133 мм", "Длина рабочая": "87 мм", "Материал": "Р6М5" }, image_url: null, images: [], is_popular: false },
  { id: "p-shl-150", sku: "ШЛ-150", name: "Круг шлифовальный 150x20x32 25А", brand: "Tyrolit", description: "Шлифовальный круг для обработки стали.", price_retail: 680, price_wholesale: 544, stock_level: 40, category_id: "cat-abrasives", technical_specs: { "Диаметр": "150 мм", "Зернистость": "25А", "Посадка": "32 мм", "Ширина": "20 мм" }, image_url: null, images: [], is_popular: false },
];

const SEED_ANALOGS = [
  { id: "a1", product_id: "p-shc-150", analog_sku: "Mitutoyo 530-312", analog_name: "Штангенциркуль 0-150мм", analog_brand: "Mitutoyo", analog_price: 8500, notes: "Японский аналог повышенной точности" },
  { id: "a2", product_id: "p-shc-150", analog_sku: "Mahr 16ER", analog_name: "Штангенциркуль MarCal 150мм", analog_brand: "Mahr", analog_price: 6200, notes: "Немецкий аналог" },
  { id: "a3", product_id: "p-mk-25", analog_sku: "Mitutoyo 103-137", analog_name: "Микрометр 0-25мм", analog_brand: "Mitutoyo", analog_price: 12000, notes: "Японский аналог" },
  { id: "a4", product_id: "p-ko-125", analog_sku: "Norton 66252", analog_name: "Круг отрезной 125мм", analog_brand: "Norton", analog_price: 65, notes: "Импортный аналог" },
];

// ---------- Persistent store ----------
const STORAGE_KEY = "vtoolka_mock_db_v1";
const AUTH_KEY = "vtoolka_mock_auth_v1";
const STORAGE_FILES_KEY = "vtoolka_mock_files_v1";

type Row = Record<string, any>;
type Store = Record<string, Row[]>;

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seed: Store = {
    categories: [...SEED_CATEGORIES].map(c => ({ ...c, created_at: new Date().toISOString() })),
    products: [...SEED_PRODUCTS].map(p => ({ ...p, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })),
    product_analogs: [...SEED_ANALOGS],
    orders: [],
    order_items: [],
    profiles: [],
    user_roles: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

let store: Store = typeof window !== "undefined" ? loadStore() : {} as Store;
function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {} }

function uid() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : Math.random().toString(36).slice(2) + Date.now();
}

// ---------- Query builder ----------
type Op = "select" | "insert" | "update" | "delete";

class QB implements PromiseLike<{ data: any; error: any }> {
  private op: Op = "select";
  private filters: Array<(r: Row) => boolean> = [];
  private orderKey?: string;
  private orderAsc = true;
  private limitN?: number;
  private isSingle = false;
  private selectStr = "*";
  private payload: any;
  private returnAfterWrite = false;

  constructor(private table: string) {}

  select(str = "*") { this.selectStr = str; this.returnAfterWrite = true; return this; }
  insert(payload: any) { this.op = "insert"; this.payload = payload; return this; }
  update(payload: any) { this.op = "update"; this.payload = payload; return this; }
  delete() { this.op = "delete"; return this; }

  eq(col: string, val: any) { this.filters.push(r => r[col] === val); return this; }
  neq(col: string, val: any) { this.filters.push(r => r[col] !== val); return this; }
  in(col: string, vals: any[]) { this.filters.push(r => vals.includes(r[col])); return this; }
  or(expr: string) {
    const parts = expr.split(",").map(p => {
      const [col, , ...rest] = p.split(".");
      const val = rest.join(".").replace(/^%|%$/g, "").toLowerCase();
      return (r: Row) => String(r[col] ?? "").toLowerCase().includes(val);
    });
    this.filters.push(r => parts.some(fn => fn(r)));
    return this;
  }
  order(col: string, opts: { ascending?: boolean } = {}) {
    this.orderKey = col; this.orderAsc = opts.ascending !== false; return this;
  }
  limit(n: number) { this.limitN = n; return this; }
  single() { this.isSingle = true; return this; }
  maybeSingle() { this.isSingle = true; return this; }

  private hydrate(rows: Row[]): Row[] {
    const joinMatches = Array.from(this.selectStr.matchAll(/(\w+)\s*\(([^)]*)\)/g));
    if (joinMatches.length === 0) return rows;
    return rows.map(r => {
      const copy = { ...r };
      for (const m of joinMatches) {
        const relTable = m[1];
        const cols = m[2].split(",").map(c => c.trim()).filter(Boolean);
        const fk = relTable.replace(/s$/, "") + "_id";
        const rel = store[relTable]?.find(x => x.id === r[fk]);
        copy[relTable] = rel
          ? Object.fromEntries(cols.length ? cols.map(c => [c, rel[c]]) : Object.entries(rel))
          : null;
      }
      return copy;
    });
  }

  private exec(): { data: any; error: any } {
    if (!store[this.table]) store[this.table] = [];
    const rows = store[this.table];

    if (this.op === "insert") {
      const items = (Array.isArray(this.payload) ? this.payload : [this.payload]).map(it => ({
        id: it.id ?? uid(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...it,
      }));
      store[this.table] = [...rows, ...items];
      persist();
      const hyd = this.hydrate(items);
      return { data: this.isSingle ? hyd[0] ?? null : hyd, error: null };
    }

    if (this.op === "update") {
      const updated: Row[] = [];
      store[this.table] = rows.map(r => {
        if (this.filters.every(f => f(r))) {
          const nr = { ...r, ...this.payload, updated_at: new Date().toISOString() };
          updated.push(nr);
          return nr;
        }
        return r;
      });
      persist();
      const hyd = this.hydrate(updated);
      return { data: this.isSingle ? hyd[0] ?? null : hyd, error: null };
    }

    if (this.op === "delete") {
      store[this.table] = rows.filter(r => !this.filters.every(f => f(r)));
      persist();
      return { data: null, error: null };
    }

    // select
    let result = rows.filter(r => this.filters.every(f => f(r)));
    if (this.orderKey) {
      const k = this.orderKey; const asc = this.orderAsc;
      result = [...result].sort((a, b) => {
        const av = a[k], bv = b[k];
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (asc ? 1 : -1);
      });
    }
    if (this.limitN) result = result.slice(0, this.limitN);
    const hyd = this.hydrate(result);
    return { data: this.isSingle ? hyd[0] ?? null : hyd, error: null };
  }

  then<TR1 = any, TR2 = never>(
    onfulfilled?: ((v: { data: any; error: any }) => TR1 | PromiseLike<TR1>) | null,
    onrejected?: ((r: any) => TR2 | PromiseLike<TR2>) | null,
  ): PromiseLike<TR1 | TR2> {
    return Promise.resolve(this.exec()).then(onfulfilled as any, onrejected as any);
  }
}

// ---------- Mock Auth ----------
type MockUser = { id: string; email: string };
type MockSession = { user: MockUser } | null;

const authListeners = new Set<(event: string, session: MockSession) => void>();

function loadAuth(): { session: MockSession; passwords: Record<string, string> } {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { session: null, passwords: {} };
}
let authState = typeof window !== "undefined" ? loadAuth() : { session: null, passwords: {} };
function persistAuth() { try { localStorage.setItem(AUTH_KEY, JSON.stringify(authState)); } catch {} }
function emitAuth(event: string) { authListeners.forEach(cb => cb(event, authState.session)); }

const mockAuth = {
  async getSession() {
    return { data: { session: authState.session }, error: null };
  },
  async getUser() {
    return { data: { user: authState.session?.user ?? null }, error: null };
  },
  onAuthStateChange(cb: (event: string, session: MockSession) => void) {
    authListeners.add(cb);
    // Fire initial
    setTimeout(() => cb("INITIAL_SESSION", authState.session), 0);
    return { data: { subscription: { unsubscribe: () => authListeners.delete(cb) } } };
  },
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const profile = store.profiles?.find(p => p.email === email);
    if (!profile) return { data: { session: null, user: null }, error: new Error("Пользователь не найден") };
    if (authState.passwords[email] !== password) {
      return { data: { session: null, user: null }, error: new Error("Неверный пароль") };
    }
    authState.session = { user: { id: profile.id, email } };
    persistAuth();
    emitAuth("SIGNED_IN");
    return { data: { session: authState.session, user: authState.session.user }, error: null };
  },
  async signUp({ email, password, options }: { email: string; password: string; options?: { data?: any } }) {
    if (store.profiles?.some(p => p.email === email)) {
      return { data: { user: null, session: null }, error: new Error("Пользователь уже существует") };
    }
    const id = uid();
    const meta = options?.data ?? {};
    if (!store.profiles) store.profiles = [];
    store.profiles.push({
      id,
      email,
      full_name: meta.full_name ?? "",
      phone: meta.phone ?? null,
      company_name: meta.company_name ?? null,
      inn: meta.inn ?? null,
      is_b2b: !!meta.is_b2b,
      legal_address: meta.legal_address ?? null,
      discount_tier: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    persist();
    authState.passwords[email] = password;
    authState.session = { user: { id, email } };
    persistAuth();
    emitAuth("SIGNED_IN");
    return { data: { user: { id, email }, session: authState.session }, error: null };
  },
  async signOut() {
    authState.session = null;
    persistAuth();
    emitAuth("SIGNED_OUT");
    return { error: null };
  },
  async updateUser(payload: { password?: string }) {
    if (!authState.session) return { data: { user: null }, error: new Error("Нет сессии") };
    if (payload.password) authState.passwords[authState.session.user.email] = payload.password;
    persistAuth();
    return { data: { user: authState.session.user }, error: null };
  },
  async resetPasswordForEmail(_email: string, _opts?: any) {
    // no-op mock — просто успех
    return { data: {}, error: null };
  },
};

// ---------- Mock Storage ----------
function loadFiles(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_FILES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}
let files = typeof window !== "undefined" ? loadFiles() : {};
function persistFiles() { try { localStorage.setItem(STORAGE_FILES_KEY, JSON.stringify(files)); } catch {} }

const mockStorage = {
  from(bucket: string) {
    return {
      async upload(path: string, file: File) {
        const key = `${bucket}/${path}`;
        const dataUrl: string = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        files[key] = dataUrl;
        persistFiles();
        return { data: { path }, error: null };
      },
      getPublicUrl(path: string) {
        const key = `${bucket}/${path}`;
        return { data: { publicUrl: files[key] ?? `mock://${key}` } };
      },
      async remove(paths: string[]) {
        for (const p of paths) delete files[`${bucket}/${p}`];
        persistFiles();
        return { data: null, error: null };
      },
    };
  },
};

// ---------- RPC ----------
async function rpc(name: string, params?: any) {
  if (name === "has_role") {
    const uid = params?._user_id;
    const role = params?._role;
    const found = store.user_roles?.some(r => r.user_id === uid && r.role === role);
    return { data: !!found, error: null };
  }
  if (name === "admin_get_profiles") {
    return { data: store.profiles ?? [], error: null };
  }
  return { data: null, error: new Error(`RPC ${name} not implemented in mock`) };
}

// ---------- Exported client ----------
export const supabase = {
  from(table: string) { return new QB(table); },
  auth: mockAuth,
  storage: mockStorage,
  rpc,
} as any;

// ---------- Dev helpers (в консоли браузера) ----------
if (typeof window !== "undefined") {
  (window as any).__mockDb = {
    dump: () => store,
    reset: () => { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(AUTH_KEY); localStorage.removeItem(STORAGE_FILES_KEY); location.reload(); },
    makeAdmin: (email: string) => {
      const p = store.profiles?.find(x => x.email === email);
      if (!p) return console.warn("no user");
      if (!store.user_roles) store.user_roles = [];
      if (!store.user_roles.some(r => r.user_id === p.id && r.role === "admin")) {
        store.user_roles.push({ id: uid(), user_id: p.id, role: "admin" });
        persist();
      }
      console.log("admin granted to", email);
    },
  };
}
