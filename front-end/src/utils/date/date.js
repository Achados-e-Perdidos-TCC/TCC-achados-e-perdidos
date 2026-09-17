const date = new Date()

//  Intl = API nativa do JavaScript usada para formatar datas e horários de acordo com uma determinada localização (en-CA = canada (formato YYYY,MM,DD))
function formatarData(data) {

    return new Intl.DateTimeFormat("en-CA", { 

        timeZone: "America/Sao_Paulo" 

    }).format(data); // .format realiza a formatacão de fato, sem .format é retornado um obj
}

function hoje(){ return formatarData(date) }

function ontem(){
    const dataOntem = new Date();

    const diaAnterior = dataOntem.getDate() - 1;
    dataOntem.setDate(diaAnterior); 

    return formatarData(dataOntem);
}


export { hoje, ontem }