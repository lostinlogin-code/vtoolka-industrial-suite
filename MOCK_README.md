# vtoolka.ru — макет без бэкенда

Проект переведён в режим **фронтенд-макета**. Supabase больше не используется —
все данные живут в `localStorage` браузера, чтобы позже подключить любую БД.

## Как это работает

- `src/integrations/supabase/client.ts` — mock-клиент, имитирующий API
  `@supabase/supabase-js`. Все страницы и хуки продолжают работать без правок.
- Поддерживаются: `from().select/insert/update/delete`, фильтры `eq/in/or`,
  `order/limit/single`, join-нотация `"*, categories(name)"`, `auth.*`,
  `storage.*`, `rpc('has_role')`, `rpc('admin_get_profiles')`.
- Загруженные картинки конвертируются в data URL и хранятся в localStorage
  (только для демо — на реальном сервере используйте S3/MinIO/nginx).

## Отладка в консоли браузера

```js
__mockDb.dump()                 // посмотреть все данные
__mockDb.reset()                // очистить БД и перезагрузить страницу
__mockDb.makeAdmin('you@x.ru')  // выдать роль admin (после регистрации)
```

## SQL-схема для реальной БД

Файл [`MOCK_SCHEMA.sql`](./MOCK_SCHEMA.sql) — готовая схема PostgreSQL
(таблицы, индексы, триггеры, enum ролей, seed категорий). Для MySQL/др.
адаптируйте типы: `uuid → char(36)`, `jsonb → json`,
`gen_random_uuid() → uuid()`, убрать `create extension`.

## План подключения к своему бэкенду

1. Реализовать REST/GraphQL API поверх своей БД (Node/Django/Laravel...).
2. Заменить `src/integrations/supabase/client.ts` на тонкий клиент
   вашего API (fetch/axios), сохранив ту же chainable-сигнатуру,
   ИЛИ переписать вызовы `supabase.from(...)` в страницах на прямые `fetch`.
3. Реализовать JWT/сессионную аутентификацию — обновить `AuthContext.tsx`.
4. Для загрузки изображений — endpoint `POST /upload` → сохранение в S3/диск.
5. RBAC: проверка ролей на сервере (middleware), клиенту достаточно вернуть
   флаг `is_admin` в профиле или в токене.

## Что осталось на фронте

- Весь UI (React/Vite/Tailwind), маршрутизация, состояние корзины,
  фильтры каталога, форматирование цен, разделение B2B/B2C,
  админ-панель, компоненты загрузки изображений.
- Валидации (email, телефон, ИНН) — в `src/pages/Auth.tsx`.
- Дизайн-система — `src/index.css` и `tailwind.config.ts`.
