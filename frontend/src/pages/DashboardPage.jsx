import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getDashboardData } from "../api/dashboardApi";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import { formatCurrency } from "../utils/format";
import PeriodFilter, { defaultFilter } from "../components/PeriodFilter";

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    async function loadDashboard() {
      const data = await getDashboardData(token, filter);

      if (data.message) {
        setMessage(data.message);
        setDashboard(null);
      } else {
        setMessage("");
        setDashboard(data);
      }
    }

    loadDashboard();
  }, [token, filter]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setFilter((current) => ({ ...current }));
  };

  const handleFilterReset = () => {
    setFilter(defaultFilter);
  };

  if (message) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Дашборд</h1>
        </div>
        <Navbar />
        <p>{message}</p>
        <button className="secondary-button" onClick={logout}>Вийти</button>
      </div>
    );
  }

  if (!dashboard) {
    return <p>Завантаження...</p>;
  }

  const {
    summary,
    recentTransactions,
    budgets,
    goals,
    expensesByCategory,
    recommendations,
    settings
  } = dashboard;
  const currency = settings?.preferredCurrency || "UAH";

  return (
    <div className="page">
      <div className="page-header">
        <h1>Дашборд</h1>
        <p className="page-subtitle">
          Короткий огляд фінансового стану: баланс, доходи, витрати, бюджети, цілі та сигнали, які вимагають уваги.
        </p>
      </div>
      <Navbar />
      <button className="secondary-button page-action" onClick={logout}>Вийти</button>

      <PeriodFilter
        value={filter}
        onChange={setFilter}
        onSubmit={handleFilterSubmit}
        onReset={handleFilterReset}
        title="Період дашборду"
      />

      <section className="hero-balance">
        <span>Загальний баланс</span>
        <strong>{formatCurrency(summary.balance, currency)}</strong>
      </section>

      <section className="stats-pair">
        <article className="metric-card metric-card--expense">
          <span>Витрати</span>
          <strong>{formatCurrency(summary.totalExpense, currency)}</strong>
        </article>
        <article className="metric-card metric-card--income">
          <span>Доходи</span>
          <strong>{formatCurrency(summary.totalIncome, currency)}</strong>
        </article>
      </section>

      <section className="content-grid">
        <section className="panel">
          <div className="panel-title">
            <Icon name="statistics" className="panel-title__icon" />
            <h2>Ключові показники</h2>
          </div>
          <div className="detail-list">
            <div><span>Кількість транзакцій</span><strong>{summary.transactionCount}</strong></div>
            <div><span>Бюджети</span><strong>{summary.budgetCount}</strong></div>
            <div><span>Цілі</span><strong>{summary.goalCount}</strong></div>
            <div><span>Середні витрати за день</span><strong>{formatCurrency(summary.averageDailyExpense, currency)}</strong></div>
            <div><span>Максимальні витрати за день</span><strong>{formatCurrency(summary.maxDailyExpense, currency)}</strong></div>
            <div><span>Борг / дефіцит</span><strong>{formatCurrency(summary.debtAmount, currency)}</strong></div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Icon name="spark" className="panel-title__icon" />
            <h2>Рекомендації</h2>
          </div>
          <div className="recommendation-list">
            {recommendations?.length ? (
              recommendations.map((item, index) => (
                <article className="recommendation-card" key={`${item.type}-${index}`}>
                  <div className="recommendation-card__head">
                    <Icon name={item.icon || "spark"} className="recommendation-card__icon" />
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.message}</p>
                </article>
              ))
            ) : (
              <p className="helper-text">Рекомендації з’являться після накопичення аналітики.</p>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Icon name="transactions" className="panel-title__icon" />
            <h2>Останні операції</h2>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="helper-text">Операцій поки немає</p>
          ) : (
            <ul className="entity-list">
              {recentTransactions.map((item) => (
                <li key={item.id}>
                  <span>{item.description}</span>
                  <strong>{formatCurrency(item.amount, currency)}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-title">
            <Icon name="budget" className="panel-title__icon" />
            <h2>Бюджети</h2>
          </div>
          {budgets.length === 0 ? (
            <p className="helper-text">Бюджетів поки немає</p>
          ) : (
            <ul className="entity-list">
              {budgets.map((item) => (
                <li key={item.id}>
                  <span>{item.category?.name} • {item.month}/{item.year}</span>
                  <strong>{formatCurrency(item.amountLimit, currency)}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-title">
            <Icon name="goals" className="panel-title__icon" />
            <h2>Цілі</h2>
          </div>
          {goals.length === 0 ? (
            <p className="helper-text">Цілей поки немає</p>
          ) : (
            <ul className="entity-list">
              {goals.map((item) => (
                <li key={item.id}>
                  <span>{item.title}</span>
                  <strong>{item.progress}%</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel panel--wide">
          <div className="panel-title">
            <Icon name="categories" className="panel-title__icon" />
            <h2>Витрати по категоріях</h2>
          </div>
          {expensesByCategory.length === 0 ? (
            <p className="helper-text">Витрат за період поки немає</p>
          ) : (
            <ul className="category-progress-list">
              {expensesByCategory.map((item, index) => {
                const share = summary.totalExpense > 0 ? (item.amount / summary.totalExpense) * 100 : 0;
                return (
                  <li key={index}>
                    <div className="category-progress-list__row">
                      <span>{item.category}</span>
                      <strong>{formatCurrency(item.amount, currency)}</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${Math.min(share, 100)}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </section>
    </div>
  );
}
