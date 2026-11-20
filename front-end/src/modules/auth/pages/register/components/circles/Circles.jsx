import "./circles.css";
import { useTranslation } from "react-i18next";

function Circles({ paginaAtual }) {
  const { t } = useTranslation();

  const circles = [1, 2, 3];
  const circlesDescription = [
    t("auth.register.circles.data"),
    t("auth.register.circles.profile"),
    t("auth.register.circles.preferences"),
  ];

  return (
    <div className="register__container__circles">
      {circles.map((valor) => {
        return (
          <div
            className={`register__content__circles ${paginaAtual === valor ? "register__subtitle__active" : valor < paginaAtual ? "register__subtitle__actived" : ""}`}
            key={valor}
          >
            <div
              className={`register__circle ${paginaAtual === valor ? "register__circle__active" : valor < paginaAtual ? "register__circle__actived" : ""}`}
            >
              {valor}
            </div>
            {`${circlesDescription[valor - 1]}`}
          </div>
        );
      })}
    </div>
  );
}

export default Circles;
