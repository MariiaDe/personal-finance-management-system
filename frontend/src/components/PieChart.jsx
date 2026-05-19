const DEFAULT_COLORS = [
  "#8dc1ff",
  "#7d4dff",
  "#b448ff",
  "#3ddc97",
  "#ff8f5c",
  "#ff5f7a"
];

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y
  ].join(" ");
}

export default function PieChart({
  title,
  data,
  totalLabel,
  totalValue,
  emptyText = "Даних поки немає"
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const prepared = total > 0
    ? data.map((item, index) => ({
        ...item,
        color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        share: (item.value / total) * 100
      }))
    : [];

  let currentAngle = 0;

  return (
    <section className="panel">
      <div className="panel-title">
        <h2>{title}</h2>
      </div>

      {prepared.length === 0 ? (
        <p className="helper-text">{emptyText}</p>
      ) : (
        <div className="chart-card">
          <div className="donut-chart">
            <svg viewBox="0 0 120 120" className="donut-chart__svg" aria-hidden="true">
              <circle className="donut-chart__track" cx="60" cy="60" r="42" />
              {prepared.map((item) => {
                const startAngle = currentAngle;
                const endAngle = currentAngle + (item.share / 100) * 360;
                currentAngle = endAngle;

                return (
                  <path
                    key={item.label}
                    d={describeArc(60, 60, 42, startAngle, endAngle)}
                    className="donut-chart__slice"
                    style={{ stroke: item.color }}
                  />
                );
              })}
            </svg>

            <div className="donut-chart__center">
              <span>{totalLabel}</span>
              <strong>{totalValue}</strong>
            </div>
          </div>

          <div className="chart-legend">
            {prepared.map((item) => (
              <div className="chart-legend__item" key={item.label}>
                <span
                  className="chart-legend__dot"
                  style={{ backgroundColor: item.color }}
                />
                <div className="chart-legend__text">
                  <strong>{item.label}</strong>
                  <span>{item.formattedValue}</span>
                </div>
                <span className="chart-legend__share">{item.share.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
