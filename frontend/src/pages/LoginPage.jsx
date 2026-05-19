import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../context/useAuth";
import Icon from "../components/Icon";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await loginUser(form);

    if (data.token) {
      login(data.token);
      navigate("/dashboard");
      return;
    }

    setMessage(data.message || "Помилка входу");
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__icon">
            <Icon name="wallet" className="auth-card__icon-svg" />
          </div>
          <h1>Вхід</h1>
          <p>Увійдіть до фінансового кабінету, щоб переглядати баланс, бюджети, цілі та персональні рекомендації.</p>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
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
              placeholder="Введіть пароль"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
          </label>

          <button className="primary-button auth-button" type="submit">Увійти</button>
        </form>

        {message ? <p className="helper-text auth-message">{message}</p> : null}

        <p className="auth-link">
          Немає акаунта? <Link to="/register">Створити профіль</Link>
        </p>
      </div>
    </div>
  );
}
