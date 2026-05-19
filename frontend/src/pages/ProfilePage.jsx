import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Icon from "../components/Icon";
import { useAuth } from "../context/useAuth";
import { getProfile, updateProfile } from "../api/profileApi";
import { getRecommendations } from "../api/recommendationApi";
import {
  createBankAccount,
  deleteBankAccount,
  getBankAccounts,
  syncBankAccount
} from "../api/bankAccountApi";

const defaultRecommendationSettings = {
  recommendationPeriod: "month",
  recommendationFrom: "",
  recommendationTo: ""
};

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [message, setMessage] = useState("");
  const [bankMessage, setBankMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    preferredCurrency: "UAH",
    recommendationsEnabled: true,
    ...defaultRecommendationSettings
  });
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountName: "",
    iban: "",
    accountNumber: ""
  });

  useEffect(() => {
    async function fetchData() {
      const [profileData, recommendationData, bankAccountsData] = await Promise.all([
        getProfile(token),
        getRecommendations(token),
        getBankAccounts(token)
      ]);

      setProfile(profileData);
      setForm({
        name: profileData.name || "",
        preferredCurrency: profileData.preferredCurrency || "UAH",
        recommendationsEnabled: profileData.recommendationsEnabled ?? true,
        recommendationPeriod: profileData.recommendationPeriod || "month",
        recommendationFrom: profileData.recommendationFrom ? new Date(profileData.recommendationFrom).toISOString().slice(0, 10) : "",
        recommendationTo: profileData.recommendationTo ? new Date(profileData.recommendationTo).toISOString().slice(0, 10) : ""
      });
      setRecommendations(recommendationData.recommendations || []);
      setBankAccounts(Array.isArray(bankAccountsData) ? bankAccountsData : []);
    }

    fetchData();
  }, [token]);

  const refreshBanks = async () => {
    const data = await getBankAccounts(token);
    setBankAccounts(Array.isArray(data) ? data : []);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      recommendationFrom: form.recommendationPeriod === "custom" ? form.recommendationFrom || null : null,
      recommendationTo: form.recommendationPeriod === "custom" ? form.recommendationTo || null : null
    };

    const data = await updateProfile(token, payload);

    if (data.user) {
      setProfile(data.user);
      setMessage("Профіль оновлено");
      const recommendationData = await getRecommendations(token);
      setRecommendations(recommendationData.recommendations || []);
    } else {
      setMessage(data.message || "Помилка оновлення");
    }
  };

  const handleBankSubmit = async (event) => {
    event.preventDefault();

    const data = await createBankAccount(token, bankForm);

    if (data.bankAccount) {
      setBankMessage("Банк додано до симуляції");
      setBankForm({
        bankName: "",
        accountName: "",
        iban: "",
        accountNumber: ""
      });
      await refreshBanks();
      return;
    }

    setBankMessage(data.message || "Не вдалося додати банк");
  };

  const handleBankDelete = async (id) => {
    await deleteBankAccount(token, id);
    await refreshBanks();
  };

  const handleBankSync = async (id) => {
    const data = await syncBankAccount(token, id);
    setBankMessage(
      data.message
        ? `${data.message}. Імпортовано операцій: ${data.importedCount || 0}`
        : "Синхронізацію завершено"
    );
  };

  if (!profile) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Профіль</h1>
        </div>
        <Navbar />
        <p>Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Профіль</h1>
        <p className="page-subtitle">
          Керуйте особистими даними, валютою, рекомендаціями та симуляцією банківських підключень.
        </p>
      </div>
      <Navbar />

      <div className="content-grid">
        <section className="panel">
          <div className="panel-title">
            <Icon name="profile" className="panel-title__icon" />
            <h2>Основні дані</h2>
          </div>

          <form className="stack-form" onSubmit={handleSubmit}>
            <label className="field">
              <span>Ім'я</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input type="email" value={profile.email} disabled />
            </label>

            <label className="field">
              <span>Основна валюта</span>
              <select
                value={form.preferredCurrency}
                onChange={(event) =>
                  setForm({ ...form, preferredCurrency: event.target.value })
                }
              >
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </label>

            <label className="switch">
              <input
                type="checkbox"
                checked={form.recommendationsEnabled}
                onChange={(event) =>
                  setForm({
                    ...form,
                    recommendationsEnabled: event.target.checked
                  })
                }
              />
              <span>Увімкнути персональні рекомендації</span>
            </label>

            <div className="content-grid">
              <label className="field">
                <span>Період рекомендацій</span>
                <select
                  value={form.recommendationPeriod}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      recommendationPeriod: event.target.value
                    })
                  }
                >
                  <option value="month">Місяць</option>
                  <option value="year">Рік</option>
                  <option value="week">Тиждень</option>
                  <option value="day">День</option>
                  <option value="all">Весь час</option>
                  <option value="custom">Власний діапазон</option>
                </select>
              </label>

              {form.recommendationPeriod === "custom" ? (
                <>
                  <label className="field">
                    <span>З дати</span>
                    <input
                      type="date"
                      value={form.recommendationFrom}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          recommendationFrom: event.target.value
                        })
                      }
                    />
                  </label>

                  <label className="field">
                    <span>По дату</span>
                    <input
                      type="date"
                      value={form.recommendationTo}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          recommendationTo: event.target.value
                        })
                      }
                    />
                  </label>
                </>
              ) : null}
            </div>

            <button className="primary-button" type="submit">Зберегти профіль</button>
            {message ? <p className="helper-text">{message}</p> : null}
          </form>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Icon name="spark" className="panel-title__icon" />
            <h2>Персональні рекомендації</h2>
          </div>

          <div className="recommendation-note">
            <p>
              Алгоритм відбирає транзакції за періодом, перевіряє коректність даних, обчислює агрегати, визначає поведінкові індикатори та формує конкретні рекомендації.
            </p>
          </div>

          <div className="recommendation-list">
            {form.recommendationsEnabled ? (
              recommendations.length > 0 ? (
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
                <p className="helper-text">Рекомендації з’являться після накопичення більшої кількості даних.</p>
              )
            ) : (
              <p className="helper-text">Рекомендації вимкнено в налаштуваннях профілю.</p>
            )}
          </div>
        </section>

        <section className="panel panel--wide">
          <div className="panel-title">
            <Icon name="bank" className="panel-title__icon" />
            <h2>Банківські підключення</h2>
          </div>

          <form className="stack-form" onSubmit={handleBankSubmit}>
            <div className="content-grid">
              <label className="field">
                <span>Назва банку</span>
                <input
                  type="text"
                  value={bankForm.bankName}
                  onChange={(event) => setBankForm({ ...bankForm, bankName: event.target.value })}
                  placeholder="Наприклад, Monobank"
                />
              </label>

              <label className="field">
                <span>Назва рахунку</span>
                <input
                  type="text"
                  value={bankForm.accountName}
                  onChange={(event) => setBankForm({ ...bankForm, accountName: event.target.value })}
                  placeholder="Основна картка"
                />
              </label>
            </div>

            <div className="content-grid">
              <label className="field">
                <span>IBAN</span>
                <input
                  type="text"
                  value={bankForm.iban}
                  onChange={(event) => setBankForm({ ...bankForm, iban: event.target.value })}
                  placeholder="UA..."
                />
              </label>

              <label className="field">
                <span>Номер рахунку</span>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(event) => setBankForm({ ...bankForm, accountNumber: event.target.value })}
                  placeholder="**** 1234"
                />
              </label>
            </div>

            <button className="secondary-button" type="submit">Додати банк</button>
            {bankMessage ? <p className="helper-text">{bankMessage}</p> : null}
          </form>

          <div className="content-grid bank-grid">
            {bankAccounts.length === 0 ? (
              <p className="helper-text">Підключених банків поки немає</p>
            ) : (
              bankAccounts.map((item) => (
                <article className="panel entity-card" key={item.id}>
                  <div className="panel-title">
                    <div className="entity-card__icon">
                      <Icon name="bank" className="panel-title__icon" />
                    </div>
                    <div>
                      <h2>{item.bankName}</h2>
                      <p className="helper-text">{item.accountName || "Без назви рахунку"}</p>
                    </div>
                  </div>

                  <div className="detail-list">
                    <div><span>IBAN</span><strong>{item.iban || "Не вказано"}</strong></div>
                    <div><span>Рахунок</span><strong>{item.accountNumber || "Не вказано"}</strong></div>
                  </div>

                  <div className="button-row">
                    <button className="primary-button" type="button" onClick={() => handleBankSync(item.id)}>
                      <Icon name="sync" className="nav-link__icon" />
                      <span>Синхронізувати</span>
                    </button>
                    <button className="secondary-button" type="button" onClick={() => handleBankDelete(item.id)}>
                      Видалити
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
