import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import Icon from "../components/Icon";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await registerUser(form);

    if (data.user) {
      navigate("/login");
      return;
    }

    setMessage(data.message || "Помилка реєстрації");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">
            <Icon name="profile" className="auth-card__icon-svg" />
          </div>
          <h1>Реєстрація</h1>
          <p>Створіть особистий профіль, щоб відстежувати витрати, доходи, бюджети та цілі в одному місці.</p>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Ім'я</span>
            <input
              type="text"
              placeholder="Ваше ім'я"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="name@email.com"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </label>

          <label className="field">
            <span>Пароль</span>
            <input
              type="password"
              placeholder="Створіть пароль"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>

          <button className="primary-button auth-button" type="submit">Зареєструватися</button>
        </form>

        {message ? <p className="helper-text auth-message">{message}</p> : null}

        <p className="auth-link">
          Уже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </div>
    </div>
  );
}
