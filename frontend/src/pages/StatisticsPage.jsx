import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/useAuth";
import { getDashboardData } from "../api/dashboardApi";
import { formatCurrency } from "../utils/format";
import Icon from "../components/Icon";
import PieChart from "../components/PieChart";
import PeriodFilter from "../components/PeriodFilter";
import { defaultFilter } from "../utils/periodFilter";

export default function StatisticsPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    async function fetchData() {
      const data = await getDashboardData(token, filter);

      if (data.message) {
        setMessage(data.message);
        setDashboard(null);
      } else {
        setMessage("");
        setDashboard(data);
      }
    }

    fetchData();
  }, [token, filter]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilter((current) => ({ ...current }));
  };

  const handleReset = () => {
    setFilter(defaultFilter);
  };

  if (message) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Статистика</h1>
        </div>
        <Navbar />
        <p>{message}</p>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Статистика</h1>
        </div>
        <Navbar />
        <p>Завантаження...</p>
      </div>
    );
  }

  const { summary, expensesByCategory, budgets, goals, recommendations, settings } = dashboard;
  const currency = settings?.preferredCurrency || "UAH";

  return (
    <div className="page">
      <div className="page-header">
        <h1>Статистика</h1>
        <p className="page-subtitle">
          Загальна аналітика за період: витрати, дохід, баланс, категорії, прогрес цілей і спрацювання правил інтерпретації.
        </p>
      </div>
      <Navbar />

      <PeriodFilter
        value={filter}
        onChange={setFilter}
        onSubmit={handleSubmit}
        onReset={handleReset}
        title="Період аналізу"
      />

      <div className="content-grid">
        <section className="panel">
          <div className="panel-title">
            <Icon name="statistics" className="panel-title__icon" />
            <h2>Агрегати періоду</h2>
          </div>
          <div className="detail-list">
            <div><span>Сума доходів</span><strong>{formatCurrency(summary.totalIncome, currency)}</strong></div>
            <div><span>Сума витрат</span><strong>{formatCurrency(summary.totalExpense, currency)}</strong></div>
            <div><span>Баланс</span><strong>{formatCurrency(summary.balance, currency)}</strong></div>
            <div><span>Середні витрати за день</span><strong>{formatCurrency(summary.averageDailyExpense, currency)}</strong></div>
            <div><span>Максимальні витрати за день</span><strong>{formatCurrency(summary.maxDailyExpense, currency)}</strong></div>
            <div><span>Від’ємний баланс</span><strong>{summary.isNegativeBalance ? "Так" : "Ні"}</strong></div>
          </div>
        </section>

        <PieChart
          title="Співвідношення доходів і витрат"
          totalLabel="Баланс"
          totalValue={formatCurrency(summary.balance, currency)}
          emptyText="Для діаграми поки немає даних."
          data={[
            {
              label: "Доходи",
              value: summary.totalIncome,
              formattedValue: formatCurrency(summary.totalIncome, currency),
              color: "#3ddc97"
            },
            {
              label: "Витрати",
              value: summary.totalExpense,
              formattedValue: formatCurrency(summary.totalExpense, currency),
              color: "#ff5f7a"
            }
          ].filter((item) => item.value > 0)}
        />

        <PieChart
          title="Кругова діаграма витрат"
          totalLabel="Всього витрат"
          totalValue={formatCurrency(summary.totalExpense, currency)}
          emptyText="Витрат за обраний період поки немає."
          data={expensesByCategory.map((item) => ({
            label: item.category,
            value: item.amount,
            formattedValue: formatCurrency(item.amount, currency)
          }))}
        />

        <section className="panel">
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

        <section className="panel">
          <div className="panel-title">
            <Icon name="budget" className="panel-title__icon" />
            <h2>Контроль бюджетів</h2>
          </div>
          {budgets.length === 0 ? (
            <p className="helper-text">Ліміти не задані</p>
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
            <h2>Прогрес цілей</h2>
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
            <Icon name="spark" className="panel-title__icon" />
            <h2>Спрацювання правил інтерпретації</h2>
          </div>
          {recommendations?.length ? (
            <div className="recommendation-list">
              {recommendations.map((item, index) => (
                <article className="recommendation-card" key={`${item.type}-${index}`}>
                  <div className="recommendation-card__head">
                    <Icon name={item.icon || "spark"} className="recommendation-card__icon" />
                    <h3>{item.title}</h3>
                  </div>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="helper-text">Сигналів для рекомендацій поки немає.</p>
          )}
        </section>
      </div>
    </div>
  );
}
