import cidadesBrasil from "../json/cidade-estados.json";

const nomesEstados = new Map(
  cidadesBrasil.estados.map((estado) => [estado.sigla.toUpperCase(), estado.nome])
);

export function obterNomeCompletoEstado(sigla) {
  if (!sigla) return "";

  const valor = String(sigla).trim();
  return nomesEstados.get(valor.toUpperCase()) || valor;
}

export function formatarLocalizacao(localizacao) {
  if (!localizacao || typeof localizacao !== "object") return "";

  const cidade = String(localizacao.cidade ?? "").trim();
  const estado = obterNomeCompletoEstado(localizacao.estado);
  const endereco = String(localizacao.endereco ?? "").trim();

  const cidadeEstado = [estado, cidade].filter(Boolean).join(" - ");

  return [cidadeEstado, endereco].filter(Boolean).join(", ");
}
