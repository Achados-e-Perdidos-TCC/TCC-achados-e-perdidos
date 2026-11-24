import request from "../../../../../lib/api/api.js";
import { ENDPOINTS } from "../../../../../lib/api/endpoints.js";

const TAMANHO_AMOSTRA = 200;

function buscar(params) {
  const query = new URLSearchParams(params).toString();

  return request(`${ENDPOINTS.item.search}?${query}`, { method: "GET" });
}

async function total(filtros = {}) {
  const data = await buscar({ ...filtros, page: "0", size: "1" });

  return Number(data?.totalElements ?? 0);
}

export async function panoramaDaPlataforma(cidade) {
  const [perdidos, encontrados, amostra, perdidosCidade, encontradosCidade] =
    await Promise.all([
      total({ type: "PERDIDO" }),
      total({ type: "ENCONTRADO" }),
      buscar({
        page: "0",
        size: String(TAMANHO_AMOSTRA),
        sort: "createdAt,desc",
      }),
      cidade ? total({ type: "PERDIDO", cidade }) : 0,
      cidade ? total({ type: "ENCONTRADO", cidade }) : 0,
    ]);

  return {
    perdidos,
    encontrados,
    amostra: Array.isArray(amostra?.content) ? amostra.content : [],
    cidade: {
      nome: cidade,
      perdidos: perdidosCidade,
      encontrados: encontradosCidade,
    },
  };
}
