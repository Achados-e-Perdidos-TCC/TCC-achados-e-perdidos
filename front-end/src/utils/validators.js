// Validacoes reutilizaveis (ex: formularios)

export function objetoVazio(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    } //hasOwnProperty = se tiver algo dentro do obj, retorna true
  }

  return true;
}
