const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function resolverUrlImagem(url) {
  if (!url) return "";

  // URLs absolutas, data URLs e previews locais já podem ser usadas diretamente.
  if (/^(https?:)?\/\//i.test(url) || /^(data|blob):/i.test(url)) {
    return url;
  }

  if (!API_BASE_URL) {
    return url;
  }

  try {
    // Como o backend devolve caminhos como /uploads/arquivo.jpg,
    // usamos a origem da API para que a imagem não seja procurada no Vite.
    return new URL(url, API_BASE_URL).toString();
  } catch {
    return url;
  }
}
