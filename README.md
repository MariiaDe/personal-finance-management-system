# Система управління персональними фінансами

Вебзастосунок для обліку особистих фінансів із авторизацією, операціями, категоріями, бюджетами, цілями, статистикою, персональними рекомендаціями та симуляцією банківської інтеграції.

Репозиторій проєкту:
[MariiaDe/personal-finance-management-system](https://github.com/MariiaDe/personal-finance-management-system)

---

## Автор

- **Студент**: Денькович Марія Романівна
- **Група**: ФеІ-45
- **Керівник**: Монастирський Л. С.
- **Тип роботи**: дипломний / кваліфікаційний проєкт

---

## Загальна інформація

- **Тип проєкту**: вебзастосунок
- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express
- **База даних**: PostgreSQL
- **ORM**: Prisma
- **Авторизація**: JWT
- **Підхід до UI**: mobile-first
- **Теми інтерфейсу**: світла та темна

---

## Основний функціонал

- реєстрація та вхід користувача
- захищені маршрути через JWT
- керування категоріями доходів і витрат
- створення, перегляд, оновлення та видалення операцій
- створення бюджетів по категоріях
- створення фінансових цілей
- дашборд із короткою фінансовою аналітикою
- вибір періоду для дашборду
- сторінка статистики з вибором періоду
- кругові діаграми для статистики
- персональні рекомендації на основі транзакцій і бюджетів
- профіль користувача з налаштуванням валюти
- увімкнення та вимкнення персональних рекомендацій
- збереження періоду для рекомендацій
- перемикач світлої та темної теми
- симуляція підключення банку
- mock-синхронізація банківських операцій

---

## Технології та бібліотеки

### Backend

- `express`
- `cors`
- `dotenv`
- `bcrypt`
- `jsonwebtoken`
- `pg`
- `prisma`
- `@prisma/client`
- `nodemon`

### Frontend

- `react`
- `react-dom`
- `react-router-dom`
- `vite`
- `axios`
- `tailwindcss`
- `@tailwindcss/vite`
- `eslint`
- `@vitejs/plugin-react`

---

## Структура проєкту

```text
dyplom/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── utils/
│   └── package.json
├── .gitignore
└── README.md
```

---

## Основні backend-маршрути

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Categories

- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Transactions

- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`

### Budgets

- `GET /api/budgets`
- `POST /api/budgets`
- `PUT /api/budgets/:id`
- `DELETE /api/budgets/:id`

### Goals

- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `DELETE /api/goals/:id`

### Dashboard / Statistics

- `GET /api/dashboard`
- `GET /api/recommendations`

### Profile

- `GET /api/profile`
- `PUT /api/profile`

### Bank Simulation

- `GET /api/bank-accounts`
- `POST /api/bank-accounts`
- `POST /api/bank-accounts/:id/sync`
- `DELETE /api/bank-accounts/:id`

---

## Основні frontend-сторінки

- `LoginPage`
- `RegisterPage`
- `DashboardPage`
- `TransactionsPage`
- `CategoriesPage`
- `BudgetsPage`
- `GoalsPage`
- `StatisticsPage`
- `ProfilePage`

---

## Моделі бази даних

У проєкті використовуються такі основні сутності:

- `User`
- `Category`
- `Transaction`
- `Budget`
- `Goal`
- `BankAccount`

Особливості схеми:

- транзакція має тип `income` або `expense`
- джерело транзакції: `manual` або `bank`
- категорія має власну іконку
- користувач має налаштування валюти
- користувач має налаштування для рекомендацій

---

## Детальна інструкція запуску проєкту з репозиторію

### Крок 1. Встановити необхідні програми

Потрібно попередньо встановити:

1. [Git](https://git-scm.com/)
2. [Node.js](https://nodejs.org/)
3. [PostgreSQL](https://www.postgresql.org/)
4. За бажанням: `pgAdmin` для зручної роботи з базою даних

Після встановлення перевірити команди:

```bash
git --version
node -v
npm -v
```

Якщо команди спрацювали, середовище готове.

### Крок 2. Клонувати репозиторій

Відкрити термінал і виконати:

```bash
git clone https://github.com/MariiaDe/personal-finance-management-system.git
```

Потім перейти в папку проєкту:

```bash
cd personal-finance-management-system
```

### Крок 3. Встановити бібліотеки для backend

Перейти у папку backend:

```bash
cd backend
```

Встановити всі бібліотеки однією командою:

```bash
npm install
```

Ця команда встановить:

- `express`
- `cors`
- `dotenv`
- `bcrypt`
- `jsonwebtoken`
- `pg`
- `prisma`
- `@prisma/client`
- `nodemon`

Після завершення має з’явитися папка:

```text
backend/node_modules
```

### Крок 4. Встановити бібліотеки для frontend

Повернутися в корінь проєкту:

```bash
cd ..
```

Перейти у папку frontend:

```bash
cd frontend
```

Встановити всі бібліотеки:

```bash
npm install
```

Ця команда встановить:

- `react`
- `react-dom`
- `react-router-dom`
- `vite`
- `axios`
- `tailwindcss`
- `@tailwindcss/vite`
- `eslint`
- `@vitejs/plugin-react`

Після завершення має з’явитися папка:

```text
frontend/node_modules
```

### Крок 5. Створити базу даних PostgreSQL

Потрібно створити базу даних, наприклад:

```text
finance_db
```

SQL-команда:

```sql
CREATE DATABASE finance_db;
```

Якщо база створюється через `pgAdmin`, назва також має бути:

```text
finance_db
```

### Крок 6. Створити файл `.env` у backend

Потрібно створити файл:

```text
backend/.env
```

Приклад готового вмісту:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:3000/finance_db?schema=public"
JWT_SECRET=your_secret_key
```

Що треба замінити:

- `YOUR_PASSWORD` → ваш пароль від PostgreSQL
- `your_secret_key` → довільний секретний ключ для JWT

### Крок 7. Синхронізувати Prisma-схему з базою даних

Перейти в backend:

```bash
cd ../backend
```

Виконати:

```bash
npx prisma db push
```

Після цього виконати:

```bash
npx prisma generate
```

Ці команди:

- створять таблиці в базі даних
- синхронізують структуру БД
- згенерують Prisma Client

### Крок 8. Запустити backend

У папці `backend` виконати:

```bash
npm run dev
```

Очікуваний результат:

```text
Server running on http://localhost:5000
```

Backend має бути доступний за адресою:

```text
http://localhost:5000
```

### Крок 9. Запустити frontend

Відкрити **новий термінал**.

Перейти в папку frontend:

```bash
cd personal-finance-management-system/frontend
```

Або, якщо ви вже у корені проєкту:

```bash
cd frontend
```

Запустити:

```bash
npm run dev
```

Очікуваний результат:

```text
Local: http://localhost:5173
```

Frontend має відкриватися за адресою:

```text
http://localhost:5173
```

### Крок 10. Відкрити застосунок у браузері

Відкрити:

```text
http://localhost:5173
```

### Крок 11. Перше тестування системи

Після відкриття застосунку рекомендується:

1. перейти на сторінку реєстрації
2. створити нового користувача
3. увійти в систему
4. створити категорії
5. створити операції
6. створити бюджет
7. створити фінансову ціль
8. перевірити статистику
9. перевірити профіль
10. протестувати симуляцію банку

---

## Команди запуску в скороченому вигляді

### Backend

```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Короткий сценарій демонстрації для комісії

Рекомендований порядок показу:

1. реєстрація або вхід
2. дашборд
3. категорії
4. операції
5. бюджети
6. цілі
7. статистика з вибором періоду
8. профіль
9. симуляція банківської інтеграції

---

## Алгоритм персональних рекомендацій

Система аналізує фінансову поведінку користувача у кілька етапів:

1. вибір періоду та фільтрація транзакцій
2. нормалізація і валідація даних
3. обчислення агрегатів
4. визначення поведінкових індикаторів
5. застосування правил інтерпретації
6. генерація персональних рекомендацій

### Обчислювані агрегати

- сума доходів за період
- сума витрат за період
- баланс
- витрати за категоріями
- середні витрати за день
- максимальні витрати за день

### Приклади правил

- якщо витрати в категорії перевищили бюджет → ризик перевищення
- якщо витрати зростають → негативний тренд
- якщо одна категорія займає занадто велику частку витрат → дисбаланс
- якщо баланс від’ємний → витрати перевищують доходи

### Приклади рекомендацій

- перевищення бюджету по категорії
- зростання витрат у порівнянні з попереднім інтервалом
- надто велика частка однієї категорії у загальних витратах
- від’ємний баланс
- повільний прогрес до фінансової цілі

---

## Симуляція банку

У проєкті реалізовано демонстраційний сценарій банківської інтеграції:

- користувач додає банк у профілі
- зберігається mock-підключення
- при натисканні `Синхронізувати` створюються тестові банківські операції
- ці операції відображаються у дашборді, статистиці та списку операцій

Це зроблено для демонстрації майбутньої реальної інтеграції з API банку.

---

## Можливі проблеми

### Prisma Client не оновлюється через `EPERM`

Зупиніть backend і повторіть:

```bash
cd backend
npx prisma generate
npm run dev
```

### Помилка `500` на `/api/dashboard` або `/api/profile`

Переконайтесь, що виконані команди:

```bash
cd backend
npx prisma db push
npx prisma generate
```

### Frontend не бачить backend

Перевірте, що backend запущений на:

```text
http://localhost:5000
```

### Проблеми з підключенням до PostgreSQL

Перевірте:

- чи запущений PostgreSQL
- чи правильно вказаний `DATABASE_URL`
- чи існує база `finance_db`

---

## Що можна розширити далі

- реальна інтеграція з API банку
- рахунки: картка, готівка, заощадження
- перекази між рахунками
- додаткові графіки та діаграми
- експорт звітів
- розширені фільтри статистики

---

## Screenshots

