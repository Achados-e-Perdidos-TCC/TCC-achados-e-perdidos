import { useState } from 'react'; 
import { useOutletContext } from 'react-router'; 

import './preferences.css'; 

import bellBlue from '../../../../../../assets/icons/register/bell-blue.png'; 
import userBlue from '../../../../../../assets/icons/register/user-blue.png'; 
import emailBlue from '../../../../../../assets/icons/register/email-blue.png'; 
import arrowBlack from '../../../../../../assets/icons/register/arrow-black.png'
import arrowWhite from '../../../../../../assets/icons/register/arrow-white.png'
import infoBlue from '../../../../../../assets/icons/register/info-blue.png';

function Preferences({ proximaPagina }){

    const [foto, setFoto] = useState(); 
    const [ativo1, setAtivo1] = useState(false);
    const [ativo2, setAtivo2] = useState(false);
    const { tema } = useOutletContext();

    const preferenciasCards = [ 
            { img: bellBlue, titulo: 'notificações', mensagem: 'receba notificações importante sobre sua conta e seus objetos.'},
            { img: emailBlue, titulo: 'E-mails', mensagem: 'receba novidade e atualizações importantes por e-mail.'} 
    ]


    return (
        <div className='preferencias'>

                <div>
                    {preferenciasCards.map((valor) => {
                        return (
                            <div className='preferences__card'>
                                <div className='preferences__card__content'>
                                    <img className='preferences__image__card' src={valor.img}/>

                                    <div>
                                        <h3 className='preferences__card__title'>{valor.titulo}</h3>
                                        <p className='preferences__card__subtitle'>{valor.mensagem}</p>
                                    </div>
                                </div>

                                <div className={`preference__button ${ valor.titulo === 'notificações' && ativo1 ? "ativo1" : valor.titulo === 'E-mails' && ativo2 ? 'ativo2' : ''}`} onClick={() => valor.titulo === 'notificações' ? setAtivo1(!ativo1) : setAtivo2(!ativo2) } >
                                    <span />
                                </div>
                            </div>  
                        )
                    })}
                </div>

                <div className='register__container__info'>
                        <img className='info__image' src={infoBlue}  />
                        <p className='info__subtitle'>Você poderá alterar essas preferências a qualquer momento nas configurações do seu perfil.</p>
                </div>


            <div className='container__buttons'>
            
                <div className='register__button__voltar' onClick={() => { proximaPagina(2)}}>
                    {tema === 'light' ? <img className="perfil__arrow__black" src={arrowBlack} /> : <img className="perfil__arrow__black" src={arrowWhite} /> }
                    <p>Voltar</p>
                </div>

                <div className='register__button__continuar' onClick={() => { proximaPagina(4)}}>
                    <p>Criar minha conta</p>
                </div>
            
            </div>
        </div>
    )
}

export default Preferences;