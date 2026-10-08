# ProductShop

Fullstack-проект интернет-магазина с каталогом товаров, корзиной, избранным, заказами и личным кабинетом.

## Стек

| Frontend | Backend |
| --- | --- |
| React 19, TypeScript, Vite | Node.js, JavaScript, Express |
| Redux Toolkit, RTK Query | PostgreSQL, драйвер pg |
| React Router 7, SCSS Modules | JWT, bcrypt, Multer |

## Что реализовано

* Регистрация и вход, авторизация запросов через JWT.
* Каталог и карточки товаров.
* Корзина с изменением количества и избранное.
* Создание и просмотр заказов, редактирование профиля.
* Административные маршруты для пользователей, товаров и заказов с проверкой роли.
* Загрузка изображений товаров на backend.

## Локальная настройка

```bash
git clone https://github.com/CrutoiChell/ProductShop.git
cd ProductShop
```

Backend ожидает PostgreSQL и файл `Backend/.env`:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=productshop
DB_USER=<database-user>
DB_PASSWORD=<database-password>
JWT_SECRET=<long-random-secret>
```

SQL-схема и миграции пока не добавлены. Перед запуском требуется подготовить таблицы, соответствующие запросам в `Backend/Controllers`. Поэтому текущий репозиторий не обеспечивает запуск с нуля одной командой.

После подготовки базы:

```bash
cd Backend
npm install
npm start
```

В другом терминале:

```bash
cd Frontend
npm install
npm run dev
```

Backend слушает порт `5000`. Во frontend адрес API и изображений пока задан как `http://localhost:5000`; при развёртывании его нужно изменить.

## Ограничения и дальнейшая работа

* Выбор способа оплаты сохраняется в заказе; интеграции с платёжным шлюзом нет.
* Используется один JWT, отдельного refresh-token механизма нет.
* Требуется добавить SQL-миграции, примеры окружения и автоматические тесты.
* Перед публичным развёртыванием необходимо усилить валидацию, ограничить поля обновления профиля и исключить хеши паролей из ответов API.

Команды проверки frontend: `npm run lint` и `npm run build`.
