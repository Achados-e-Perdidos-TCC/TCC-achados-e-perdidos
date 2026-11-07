import request from "../../lib/api/api.js";
import { ENDPOINTS } from "../../lib/api/endpoints.js";
import { imageUpload } from "../auth/auth.service.js";

export async function cadastrarObjeto({
    title,
    type,
    categoryId,
    estado,
    cidade,
    bairro,
    data,
    horario,
    descricao,
    caracteristicas,
    fotos,
}) {
    const imageUrls = [];

    // Envia cada imagem e guarda a URL retornada pela API.
    for (const foto of fotos) {
        const imagemEnviada = await imageUpload(foto);
        imageUrls.push(imagemEnviada.url);
    }

    // Organiza os dados no formato esperado pelo backend.
    const payload = {
        title,
        type,
        categoryId,
        description: descricao,
        shortDescription: caracteristicas?.trim() || null,
        eventDate: `${data}T${horario}:00`,
        estado,
        cidade,
        bairro,
        imageUrls,
    };

    // Cadastra o objeto após concluir os uploads.
    return await request(ENDPOINTS.item.register, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}