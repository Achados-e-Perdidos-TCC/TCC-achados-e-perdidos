function objetosAprovados(objetos, primaryFilters){

    const filtrosAprovados = {}
    const categorias = ['OBJETO', 'LOCALIZAÇÃO', 'CATEGORIA', 'PERÍODO'];

    categorias.map((valorCategorias) => {

        if (!primaryFilters[valorCategorias]) { return }

        if (valorCategorias === 'LOCALIZAÇÃO') {

            const termosBusca = primaryFilters[valorCategorias].toUpperCase().split(' ');
            const cidadeObjeto = objetos.cidade.toUpperCase();
            const enderecoObjeto = objetos.endereco.toUpperCase();

            // every funciona igual o filter, a diferenca é que o filter retorna um novo array, o every retorna um boolean
            const objetosEncontrados = termosBusca.every((valorEncontrados) => {
                return cidadeObjeto.includes(valorEncontrados) || enderecoObjeto.includes(valorEncontrados);
            });

            filtrosAprovados[valorCategorias] = objetosEncontrados

        } else if (valorCategorias === 'CATEGORIA') {

            const termosBusca = primaryFilters[valorCategorias].toUpperCase();
            const nomeDoObjeto = objetos.categoria.toUpperCase();

            if (nomeDoObjeto.includes(termosBusca)) { filtrosAprovados[valorCategorias] = false }
            if (nomeDoObjeto.includes(termosBusca)) { filtrosAprovados[valorCategorias] = true }

        } else if (valorCategorias === 'OBJETO'){

            const termosBusca = primaryFilters[valorCategorias].toUpperCase().split(' ');
            const nomeDoObjeto = objetos.nome.toUpperCase();

            
            const objetosEncontrados = termosBusca.every((valorEncontrados) => {
                return nomeDoObjeto.includes(valorEncontrados);
            })
            
            filtrosAprovados[valorCategorias] = objetosEncontrados

        } else {

            // montar logica de periodo após req ao banco estiver funcionando
            
            // const termosBusca = primaryFilters[valorCategorias].toUpperCase();
            // const nomeDoObjeto = objetos.dataOcorrencia.toUpperCase();

            // const objetosEncontrados = termosBusca.every((valorEncontrados) => {
            //     return nomeDoObjeto.includes(valorEncontrados);
            // })

            // Aprovados[valorCategorias] = objetosEncontrados
        }

    });

    return filtrosAprovados
}

function filtros(objetos, primaryFilters, secondaryFilters) {
        
    const resultadoFiltros = objetosAprovados(objetos, primaryFilters); 
    
    const aprovados = []
    const preenchidos = []
    
    for (let camposPreenchidos in primaryFilters) { 
        if (primaryFilters[camposPreenchidos]) { preenchidos.push(camposPreenchidos) };
    }
    
    for (let ResultadosAprovados in resultadoFiltros) { 
        if (resultadoFiltros[ResultadosAprovados]) { aprovados.push(ResultadosAprovados) }; 
    }
    
    // if a quantidade de objetos preenchidos for a mesma de objetos aprovados, então ele filtra
    // se não tiver nenhum preenchido nem aprovado ele filtra pelos secondaryFilters direto
    if (preenchidos.length === aprovados.length) {
        
        if (!secondaryFilters || secondaryFilters === 'TODOS') { return (objetos) }

        if (objetos.status === secondaryFilters.slice(0, 7)) { return (objetos) }

        if (objetos.status === secondaryFilters.slice(0, 10)) { return (objetos) }

        // logica dos mais recentes e relevantes
    }
}

export default filtros;