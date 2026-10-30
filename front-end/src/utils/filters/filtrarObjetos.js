function filtros(objeto, primaryFilters, secondaryFilters) {
  // Filtro por nome do objeto
  const nomeObjeto = objeto.nome?.toUpperCase() || "";
  const buscaObjeto = primaryFilters.OBJETO?.toUpperCase() || "";

  const objetoAprovado =
    !buscaObjeto ||
    buscaObjeto.split(" ").every((termo) => nomeObjeto.includes(termo));

  // Filtro por localização
  const cidadeObjeto = objeto.localizacao?.cidade?.toUpperCase() || "";
  const enderecoObjeto = objeto.localizacao?.endereco?.toUpperCase() || "";
  const buscaLocalizacao = primaryFilters.LOCALIZAÇÃO?.toUpperCase() || "";

  const localizacaoAprovada =
    !buscaLocalizacao ||
    buscaLocalizacao
      .split(" ")
      .every(
        (termo) =>
          cidadeObjeto.includes(termo) || enderecoObjeto.includes(termo),
      );

  // Filtro por categoria
  const categoriaObjeto = objeto.categoria?.toUpperCase() || "";
  const buscaCategoria = primaryFilters.CATEGORIA?.toUpperCase() || "";

  const categoriaAprovada =
    !buscaCategoria || categoriaObjeto.includes(buscaCategoria);

  // Filtro por período
  const dataObjeto = objeto.data?.data?.trim() || "";

  const dataInicial = primaryFilters.DATA_INICIAL || "";
  const dataFinal = primaryFilters.DATA_FINAL || "";

  // Se apenas a data inicial estiver preenchida,
  // considera somente aquele dia.
  const dataLimite = dataFinal || dataInicial;

  const periodoAprovado =
    !dataInicial || (dataObjeto >= dataInicial && dataObjeto <= dataLimite);

  // Todos os filtros principais precisam ser aprovados
  const filtrosPrincipaisAprovados =
    objetoAprovado &&
    localizacaoAprovada &&
    categoriaAprovada &&
    periodoAprovado;

  if (!filtrosPrincipaisAprovados) {
    return false;
  }

  // Filtro secundário (status)
  if (!secondaryFilters || secondaryFilters === "TODOS") {
    return true;
  }

  if (
    objeto.status === secondaryFilters.slice(0, 7) ||
    objeto.status === secondaryFilters.slice(0, 10)
  ) {
    return true;
  }

  return false;
}

export default filtros;
