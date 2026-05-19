import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import { createGoal, deleteGoal, getGoals } from "../api/goalApi";

export default function GoalsPage() {
  const { token } = useAuth();

  const [goals, setGoals] = useState([]);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
    deadline: ""
  });

  useEffect(() => {
    async function fetchData() {
      const data = await getGoals(token);
      setGoals(Array.isArray(data) ? data : []);
    }

    fetchData();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = await createGoal(token, {
      title: form.title,
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount || 0),
      deadline: form.deadline || null
    });

    if (data.goal) {
      setMessage("Ціль створено");
      setForm({
        title: "",
        targetAmount: "",
        savedAmount: "",
        deadline: ""
      });

      const updated = await getGoals(token);
      setGoals(Array.isArray(updated) ? updated : []);
      return;
    }

    setMessage(data.message || "Помилка створення");
  };

  const handleDelete = async (id) => {
    await deleteGoal(token, id);
    const updated = await getGoals(token);
    setGoals(Array.isArray(updated) ? updated : []);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Цілі</h1>
        <p className="page-subtitle">Зберігайте фінансові цілі в одному місці, відстежуйте прогрес та оцінюйте, яка сума вже накопичена.</p>
      </div>
      <Navbar />

      <section className="panel">
        <div className="panel-title">
          <Icon name="goals" className="panel-title__icon" />
          <h2>Нова ціль</h2>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Назва цілі</span>
            <input
              type="text"
              placeholder="Наприклад, Новий ноутбук"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>

          <div className="content-grid">
            <label className="field">
              <span>Цільова сума</span>
              <input
                type="number"
                placeholder="50000"
                value={form.targetAmount}
                onChange={(event) => setForm({ ...form, targetAmount: event.target.value })}
              />
            </label>

            <label className="field">
              <span>Накопичено</span>
              <input
                type="number"
                placeholder="10000"
                value={form.savedAmount}
                onChange={(event) => setForm({ ...form, savedAmount: event.target.value })}
              />
            </label>
          </div>

          <label className="field">
            <span>Дедлайн</span>
            <input
              type="date"
              value={form.deadline}
              onChange={(event) => setForm({ ...form, deadline: event.target.value })}
            />
          </label>

          <button className="primary-button" type="submit">Додати ціль</button>
        </form>

        {message ? <p className="helper-text">{message}</p> : null}
      </section>

      <section className="content-grid">
        {goals.length === 0 ? (
          <p className="helper-text">Цілей поки немає</p>
        ) : (
          goals.map((item) => {
            const progress = item.targetAmount > 0
              ? Math.min(100, Math.round((item.savedAmount / item.targetAmount) * 100))
              : 0;

            return (
              <article className="panel entity-card" key={item.id}>
                <div className="panel-title">
                  <div className="entity-card__icon">
                    <Icon name="goals" className="panel-title__icon" />
                  </div>
                  <div>
                    <h2>{item.title}</h2>
                    <p className="helper-text">{item.savedAmount} / {item.targetAmount}</p>
                  </div>
                </div>

                <div className="detail-list">
                  <div><span>Статус</span><strong>{item.status}</strong></div>
                  <div><span>Прогрес</span><strong>{progress}%</strong></div>
                </div>

                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>

                <button className="secondary-button" type="button" onClick={() => handleDelete(item.id)}>
                  Видалити
                </button>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
