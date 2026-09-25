import './circles.css';

function Circles({ paginaAtual }){

    const circles = [ 1, 2, 3, ]
    const circlesDescription = [ 'Seus dados', 'Seu perfil', 'Preferências']

    return (
        <div className='register__container__circles'>
            {circles.map((valor) => {
                        return (
                                <div className={paginaAtual === valor ? 'register__subtitle__active register__content__circles' : 'register__content__circles'} key={valor}>
                                    <div className={paginaAtual === valor ? 'register__circle__active register__circle' : 'register__circle'}>
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

