import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import { getCategories } from "../api/categoryApi";
import { createBudget, deleteBudget, getBudgets } from "../api/budgetApi";

export default function BudgetsPage() {
  const { token } = useAuth();

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    amountLimit: "",
    month: "",
    year: "",
    categoryId: ""
  });

  useEffect(() => {
    async function fetchData() {
      const budgetsData = await getBudgets(token);
      const categoriesData = await getCategories(token);

      setBudgets(Array.isArray(budgetsData) ? budgetsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    }

    fetchData();
  }, [token]);

  const expenseCategories = categories.filter((item) => item.type === "expense");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = await createBudget(token, {
      amountLimit: Number(form.amountLimit),
      month: Number(form.month),
      year: Number(form.year),
      categoryId: Number(form.categoryId)
    });

    if (data.budget) {
      setMessage("Бюджет створено");
      setForm({
        amountLimit: "",
        month: "",
        year: "",
        categoryId: ""
      });

      const updated = await getBudgets(token);
      setBudgets(Array.isArray(updated) ? updated : []);
    } else {
      setMessage(data.message || "Помилка створення");
    }
  };

  const handleDelete = async (id) => {
    await deleteBudget(token, id);
    const updated = await getBudgets(token);
    setBudgets(Array.isArray(updated) ? updated : []);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Бюджети</h1>
        <p className="page-subtitle">Плануйте місячні ліміти по категоріях, щоб система могла відстежувати перевищення і будувати персональні рекомендації.</p>
      </div>
      <Navbar />

      <section className="panel">
        <div className="panel-title">
          <Icon name="budget" className="panel-title__icon" />
          <h2>Новий бюджет</h2>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Ліміт</span>
            <input
              type="number"
              placeholder="5000"
              value={form.amountLimit}
              onChange={(event) => setForm({ ...form, amountLimit: event.target.value })}
            />
          </label>

          <div className="content-grid">
            <label className="field">
              <span>Місяць</span>
              <input
                type="number"
                placeholder="5"
                value={form.month}
                onChange={(event) => setForm({ ...form, month: event.target.value })}
              />
            </label>

            <label className="field">
              <span>Рік</span>
              <input
                type="number"
                placeholder="2026"
                value={form.year}
                onChange={(event) => setForm({ ...form, year: event.target.value })}
              />
            </label>
          </div>

          <label className="field">
            <span>Категорія</span>
            <select
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
            >
              <option value="">Оберіть категорію</option>
              {expenseCategories.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <button className="primary-button" type="submit">Додати бюджет</button>
        </form>

        {message ? <p className="helper-text">{message}</p> : null}
      </section>

      <section className="content-grid">
        {budgets.length === 0 ? (
          <p className="helper-text">Бюджетів поки немає</p>
        ) : (
          budgets.map((item) => (
            <article className="panel" key={item.id}>
              <div className="panel-title">
                <Icon name="budget" className="panel-title__icon" />
                <h2>{item.category?.name}</h2>
              </div>
              <div className="detail-list">
                <div><span>Ліміт</span><strong>{item.amountLimit}</strong></div>
                <div><span>Період</span><strong>{item.month}/{item.year}</strong></div>
              </div>
              <button className="secondary-button" type="button" onClick={() => handleDelete(item.id)}>
                Видалити
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
