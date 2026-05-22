export default function PeriodFilter({
  value,
  onChange,
  onSubmit,
  onReset,
  title = "Період аналізу"
}) {
  return (
    <section className="panel panel--wide">
      <div className="panel-title">
        <h2>{title}</h2>
      </div>

      <form className="stack-form" onSubmit={onSubmit}>
        <div className="statistics-filter-grid">
          <label className="field">
            <span>Період</span>
            <select
              value={value.period}
              onChange={(event) =>
                onChange({
                  ...value,
                  period: event.target.value,
                  from: event.target.value === "custom" ? value.from : "",
                  to: event.target.value === "custom" ? value.to : ""
                })
              }
            >
              <option value="day">День</option>
              <option value="week">Тиждень</option>
              <option value="month">Місяць</option>
              <option value="year">Рік</option>
              <option value="all">Весь час</option>
              <option value="custom">Власний діапазон</option>
            </select>
          </label>

          {value.period === "custom" ? (
            <>
              <label className="field">
                <span>З дати</span>
                <input
                  type="date"
                  value={value.from}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      from: event.target.value
                    })
                  }
                />
              </label>

              <label className="field">
                <span>По дату</span>
                <input
                  type="date"
                  value={value.to}
                  onChange={(event) =>
                    onChange({
                      ...value,
                      to: event.target.value
                    })
                  }
                />
              </label>
            </>
          ) : null}
        </div>

        <div className="button-row">
          <button className="primary-button" type="submit">
            Застосувати
          </button>
          <button className="secondary-button" type="button" onClick={onReset}>
            Скинути
          </button>
        </div>
      </form>
    </section>
  );
}
