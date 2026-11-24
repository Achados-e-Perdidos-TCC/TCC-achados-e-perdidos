function BarList({ itens }) {
  const maximo = Math.max(...itens.map((i) => i.valor), 1);

  return (
    <ul className="barlist">
      {itens.map((item) => (
        <li
          key={item.rotulo}
          className={`barlist__item ${item.destaque ? "barlist__item--me" : ""}`}
        >
          <div className="barlist__top">
            <span className="barlist__label">
              {item.icone && <img src={item.icone} alt="" />}
              {item.rotulo}
              {item.tag && <em className="barlist__tag">{item.tag}</em>}
            </span>

            <strong>{item.valor}</strong>
          </div>

          <div className="barlist__track">
            <span style={{ width: `${(item.valor / maximo) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default BarList;
