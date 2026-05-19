import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import {
  createTransaction,
  deleteTransaction,
  getTransactions
} from "../api/transactionApi";
import { getCategories } from "../api/categoryApi";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";

export default function TransactionsPage() {
  const { token } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    amount: "",
    description: "",
    date: "",
    categoryId: "",
    type: "expense"
  });

  useEffect(() => {
    async function fetchData() {
      const transactionsData = await getTransactions(token);
      const categoriesData = await getCategories(token);

      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    }

    fetchData();
  }, [token]);

  const filteredCategories = categories.filter((item) => item.type === form.type);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = await createTransaction(token, {
      ...form,
      amount: Number(form.amount),
      categoryId: Number(form.categoryId)
    });

    if (data.transaction) {
      setMessage("Операцію створено");
      setForm({
        amount: "",
        description: "",
        date: "",
        categoryId: "",
        type: "expense"
      });

      const transactionsData = await getTransactions(token);
      const categoriesData = await getCategories(token);

      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      return;
    }

    setMessage(data.message || "Помилка створення");
  };

  const handleDelete = async (id) => {
    await deleteTransaction(token, id);

    const transactionsData = await getTransactions(token);
    const categoriesData = await getCategories(token);

    setTransactions(Array.isArray(transactionsData) ? transactionsData : []);
    setCategories(Array.isArray(categoriesData) ? categoriesData : []);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Операції</h1>
        <p className="page-subtitle">Додавайте доходи та витрати, прив'язуйте їх до категорій та відстежуйте історію змін по балансу.</p>
      </div>
      <Navbar />

      <section className="panel">
        <div className="panel-title">
          <Icon name="transactions" className="panel-title__icon" />
          <h2>Нова операція</h2>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <div className="content-grid">
            <label className="field">
              <span>Сума</span>
              <input
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(event) => setForm({ ...form, amount: event.target.value })}
              />
            </label>

            <label className="field">
              <span>Дата</span>
              <input
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </label>
          </div>

          <label className="field">
            <span>Опис</span>
            <input
              type="text"
              placeholder="Наприклад, Покупка продуктів"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>

          <div className="content-grid">
            <label className="field">
              <span>Тип операції</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({
                    ...form,
                    type: event.target.value,
                    categoryId: ""
                  })
                }
              >
                <option value="expense">Витрата</option>
                <option value="income">Дохід</option>
              </select>
            </label>

            <label className="field">
              <span>Категорія</span>
              <select
                value={form.categoryId}
                onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              >
                <option value="">Оберіть категорію</option>
                {filteredCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button className="primary-button" type="submit">Додати операцію</button>
        </form>

        {message ? <p className="helper-text">{message}</p> : null}
      </section>

      <section className="content-grid">
        {transactions.length === 0 ? (
          <p className="helper-text">Операцій поки немає</p>
        ) : (
          transactions.map((item) => (
            <article className="panel entity-card" key={item.id}>
              <div className="panel-title">
                <div className="entity-card__icon">
                  <Icon
                    name={item.category?.icon || (item.type === "income" ? "wallet" : "transactions")}
                    className="panel-title__icon"
                  />
                </div>
                <div>
                  <h2>{item.description}</h2>
                  <p className="helper-text">{item.category?.name}</p>
                </div>
              </div>

              <div className="detail-list">
                <div><span>Сума</span><strong>{item.amount}</strong></div>
                <div><span>Тип</span><strong>{item.type}</strong></div>
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
