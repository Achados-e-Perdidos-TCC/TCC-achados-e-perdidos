import './circles.css';

function Circles({ paginaAtual }){

    const circles = [ 1, 2, 3, ]
    const circlesDescription = ['Seus dados', 'Seu perfil', 'Preferências']

    return (
        <div className='register__container__circles'>
            {circles.map((valor) => {
                        return (
                                <div className={`register__content__circles ${paginaAtual === valor ? 'register__subtitle__active' : valor < paginaAtual  ? 'register__subtitle__actived' : ''}`} key={valor}>
                                    <div className={`register__circle ${paginaAtual === valor ? 'register__circle__active' : valor < paginaAtual  ? 'register__circle__actived' : ''}` }>
                                        {valor}
                                    </div>
                                    {`${circlesDescription[valor - 1]}`}
                                </div>
                        )
            })}
        </div>
    )
}

export default Circles;

