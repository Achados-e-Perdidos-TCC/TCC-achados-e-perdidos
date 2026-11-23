import eletronicos from "../../assets/icons/categorias/eletronicos.svg";
import documentos from "../../assets/icons/categorias/documentos.svg";
import roupasAcessorios from "../../assets/icons/categorias/roupas-acessorios.svg";
import chaves from "../../assets/icons/categorias/chaves.svg";
import pets from "../../assets/icons/categorias/pets.svg";
import outros from "../../assets/icons/categorias/outros.svg";

const ICONES_POR_CATEGORIA = {
  eletronicos,
  documentos,
  "roupas e acessorios": roupasAcessorios,
  chaves,
  "animais de estimacao": pets,
  outros,
};

function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function obterIconeCategoria(nomeCategoria) {
  return ICONES_POR_CATEGORIA[normalizar(nomeCategoria)] ?? outros;
}
