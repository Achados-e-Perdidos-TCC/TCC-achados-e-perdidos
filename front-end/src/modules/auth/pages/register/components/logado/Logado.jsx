import logo from '../../../../../../assets/logo_iniciais.png';

function Logado(){

    return (
        <div className='register__container__form'>
            <img className="register__logo" src={logo} />

            <div>
                <h1 className="register__form__title" >Você já está logado</h1>
                <p className="register__form__subtitle">Sua conta está ativa. não é preciso criar uma nova conta.</p>
            </div>

            <div className='conta__criada'>
                <div className='success__button' onClick={() => {window.location.href = "/"}}>
                    <p className='success__link'> Ir para meu perfil </p>
                </div>

                <div  onClick={() => {window.location.href = "/"}}>
                    <p> Voltar para início</p>
                </div>
            </div>

                
        </div>
    )
}

export default Logado;