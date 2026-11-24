const RAIO = 15.9155;

function DonutChart({ perdidos, encontrados, labels }) {
  const total = perdidos + encontrados;

  const pEncontrados = total ? (encontrados / total) * 100 : 0;
  const pPerdidos = total ? (perdidos / total) * 100 : 0;

  return (
    <div className="donut">
      <div className="donut__chart">
        <svg
          className="donut__svg"
          viewBox="0 0 36 36"
          role="img"
          aria-label={`${labels.lost}: ${perdidos}. ${labels.found}: ${encontrados}.`}
        >
          <circle className="donut__track" cx="18" cy="18" r={RAIO} />

          {encontrados > 0 && (
            <circle
              className="donut__seg donut__seg--found"
              cx="18"
              cy="18"
              r={RAIO}
              strokeDasharray={`${pEncontrados} ${100 - pEncontrados}`}
              strokeDashoffset="25"
            />
          )}

          {perdidos > 0 && (
            <circle
              className="donut__seg donut__seg--lost"
              cx="18"
              cy="18"
              r={RAIO}
              strokeDasharray={`${pPerdidos} ${100 - pPerdidos}`}
              strokeDashoffset={25 - pEncontrados}
            />
          )}
        </svg>

        <div className="donut__center">
          <strong>{total}</strong>
          <span>{labels.total}</span>
        </div>
      </div>

      <ul className="donut__legend">
        <li>
          <span className="donut__dot donut__dot--lost" />
          {labels.lost} <strong>{perdidos}</strong>
        </li>
        <li>
          <span className="donut__dot donut__dot--found" />
          {labels.found} <strong>{encontrados}</strong>
        </li>
      </ul>
    </div>
  );
}

export default DonutChart;
