import './loading.css';

function Loading(){

    return(
        <div className='loading__container'>

            <div className='loading__content'>
                <div className='spinner'></div>

                <div className='loading__content__texts'>
                    <h1 className='loading__title'>Carregando seu perfil...</h1>
                    <p className='loading__subtitle'>Demorando demais? Tente recarregar a página.</p>
                </div>
            </div>

        </div>
    )
}

export default Loading;