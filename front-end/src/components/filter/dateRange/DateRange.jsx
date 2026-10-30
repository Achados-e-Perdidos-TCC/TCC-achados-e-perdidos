import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./dateRange.css";

function DateRange({ placeholder, arrow, close, change }) {
  const [data, setData] = useState([null, null]);
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [dataInicial, dataFinal] = data;

  // Converte Date para YYYY-MM-DD sem problemas de fuso horário.
  function formatarData(data) {
    if (!data) return "";

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
  }

  function atualizarPeriodo(novasDatas) {
    setData(novasDatas);

    const [inicio, fim] = novasDatas;

    change("DATA_INICIAL", formatarData(inicio));
    change("DATA_FINAL", formatarData(fim));
  }

  function limparPeriodo() {
    setData([null, null]);

    change("DATA_INICIAL", "");
    change("DATA_FINAL", "");
  }

  return (
    <div className="input__filter calendar">
      <DatePicker
        className="date"
        selectsRange
        startDate={dataInicial}
        endDate={dataFinal}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        onChange={atualizarPeriodo}
        minDate={new Date(2026, 0, 1)}
        onCalendarOpen={() => setCalendarVisible(true)}
        onCalendarClose={() => setCalendarVisible(false)}
      />

      <img
        className={calendarVisible ? "arrow up" : "arrow"}
        src={arrow}
        alt=""
      />

      <img
        className="x"
        onClick={limparPeriodo}
        src={close}
        alt="Limpar período"
      />
    </div>
  );
}

export default DateRange;
