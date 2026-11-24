export function parseData(texto) {
  if (!texto) return null;

  const [ano, mes, dia] = texto.slice(0, 10).split("-").map(Number);

  if (!ano || !mes || !dia) return null;

  return new Date(ano, mes - 1, dia);
}

export const ehTipo = (objeto, tipo) =>
  objeto.status?.trim().toUpperCase() === tipo;

export function nomeDoDia(indice, locale) {
  return new Date(2024, 0, 7 + indice).toLocaleDateString(locale, {
    weekday: "long",
  });
}

export function topPor(objetos, extrair, limite = 4) {
  const mapa = new Map();

  objetos.forEach((objeto) => {
    const chave = extrair(objeto);
    if (!chave) return;

    mapa.set(chave, (mapa.get(chave) || 0) + 1);
  });

  return [...mapa.entries()]
    .map(([rotulo, valor]) => ({ rotulo, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, limite);
}
export function insights(objetos) {
  const dias = Array(7).fill(0);
  const horas = Array(24).fill(0);

  objetos.forEach((objeto) => {
    const data = parseData(objeto.data?.data);
    if (data) dias[data.getDay()]++;

    const hora = parseInt(objeto.data?.hora?.slice(0, 2), 10);
    if (!Number.isNaN(hora)) horas[hora]++;
  });

  const indiceDoMaior = (lista) => {
    const maior = Math.max(...lista);
    return maior > 0 ? lista.indexOf(maior) : null;
  };

  return { diaSemana: indiceDoMaior(dias), hora: indiceDoMaior(horas) };
}
