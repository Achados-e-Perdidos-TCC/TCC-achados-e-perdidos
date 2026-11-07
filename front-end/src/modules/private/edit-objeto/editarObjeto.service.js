import request from "../../../lib/api/api.js";
import { ENDPOINTS } from "../../../lib/api/endpoints.js";
import { imageUpload } from "../../auth/auth.service.js";

export async function atualizarObjeto(id, {
  title,
  categoryId,
  estado,
  cidade,
  bairro,
  data,
  horario,
  descricao,
  caracteristicas,
  fotosExistentes,
  fotosNovas,
}) {
  const imageUrls = [...fotosExistentes];

  // Envia as novas fotografias para o servidor.
  for (const foto of fotosNovas) {
    const imagemEnviada = await imageUpload(foto.arquivo);

    if (!imagemEnviada?.url) {
      throw new Error("Não foi possível enviar uma fotografia.");
    }

    imageUrls.push(imagemEnviada.url);
  }

  // Organiza os dados no formato esperado pelo backend.
  const payload = {
    title: title.trim(),
    categoryId,
    description: descricao.trim(),
    shortDescription: caracteristicas.trim(),
    estado,
    cidade,
    bairro,
    eventDate: `${data}T${horario}:00`,
    imageUrls,
  };

  // Atualiza o objeto cadastrado.
  return await request(ENDPOINTS.item.update(id), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
export async function excluirObjeto(id) {
  return await request(ENDPOINTS.item.remove(id), {
    method: "DELETE",
  });
}