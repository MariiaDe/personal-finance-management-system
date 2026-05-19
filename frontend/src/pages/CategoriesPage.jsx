import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import {
  getCategories,
  createCategory,
  deleteCategory
} from "../api/categoryApi";

const iconOptions = ["categories", "wallet", "budget", "goals", "statistics", "spark", "bank", "transactions"];

export default function CategoriesPage() {
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "expense",
    icon: "categories"
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getCategories(token);
      setCategories(Array.isArray(data) ? data : []);
    }

    fetchData();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await createCategory(token, form);

    if (data.category) {
      setMessage("Категорію створено");
      setForm({
        name: "",
        type: "expense",
        icon: "categories"
      });

      const updated = await getCategories(token);
      setCategories(Array.isArray(updated) ? updated : []);
      return;
    }

    setMessage(data.message || "Помилка створення");
  };

  const handleDelete = async (id) => {
    await deleteCategory(token, id);
    const updated = await getCategories(token);
    setCategories(Array.isArray(updated) ? updated : []);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Категорії</h1>
        <p className="page-subtitle">Керуйте категоріями доходів і витрат, підбирайте для них іконки та будуйте більш наочну аналітику.</p>
      </div>
      <Navbar />

      <section className="panel">
        <div className="panel-title">
          <Icon name="categories" className="panel-title__icon" />
          <h2>Нова категорія</h2>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Назва категорії</span>
            <input
              type="text"
              placeholder="Наприклад, Продукти"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>

          <div className="content-grid">
            <label className="field">
              <span>Тип категорії</span>
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
              >
                <option value="expense">Витрата</option>
                <option value="income">Дохід</option>
              </select>
            </label>

            <label className="field">
              <span>Іконка</span>
              <select
                value={form.icon}
                onChange={(event) => setForm({ ...form, icon: event.target.value })}
              >
                {iconOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button className="primary-button" type="submit">Додати категорію</button>
        </form>

        {message ? <p className="helper-text">{message}</p> : null}
      </section>

      <section className="content-grid">
        {categories.length === 0 ? (
          <p className="helper-text">Категорій поки немає</p>
        ) : (
          categories.map((item) => (
            <article className="panel entity-card" key={item.id}>
              <div className="panel-title">
                <div className="entity-card__icon">
                  <Icon name={item.icon || (item.type === "income" ? "wallet" : "categories")} className="panel-title__icon" />
                </div>
                <div>
                  <h2>{item.name}</h2>
                  <p className="helper-text">Тип: {item.type === "income" ? "Дохід" : "Витрата"}</p>
                </div>
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
