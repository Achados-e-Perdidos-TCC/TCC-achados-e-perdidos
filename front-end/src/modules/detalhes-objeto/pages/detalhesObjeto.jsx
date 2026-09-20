import { useParams, NavLink } from 'react-router'; 

import './detalhesObjeto.css'; 

import objetos from '../../../modules/buscar-objetos/components/principalCards/objetos.json'; 

import houseGray from '../../../assets/icons/detalhesObjeto/house-gray.svg'; 
import arrowGray from '../../../assets/icons/detalhesObjeto/arrow-gray.svg'; 
import arrowBlue from '../../../assets/icons/detalhesObjeto/arrow-blue.svg'; 

import ImagesCard from '../components/imagesCard/ImagesCard.jsx'; 
import Detalhes from '../components/detalhes/Detalhes.jsx'; 

function detalhesObjeto(){

    const params = useParams(); 

    const objetoEncontrado = objetos.filter((objetos) => { if (objetos.id === Number(params.id)) { return objetos }} )

    return (
        <section className='detalhe__objetos'>

                <div className='caminho__voltar'>

                        <div className='caminho'>
                                <img className='house__gray' src={houseGray} />
                                <img src={arrowGray} />
                                <p className='caminho__text'>Buscar objetos / {objetoEncontrado[0].nome}</p>
                        </div>

                        <div className='voltar__buscar'>

                            <NavLink className='voltar__navlink' to='/buscar-objetos' end>
                                <img src={arrowBlue} />
                                <p className='voltar__text'> voltar para Buscar Objetos </p>
                            </NavLink>
                                
                        </div>
                </div>

                <div className='container__detalhes'>

                    <div className='esquerda'>
                        <ImagesCard objeto={objetoEncontrado} />
                    </div>

                    <div className='direita'>
                        <Detalhes objeto={objetoEncontrado} />
                    </div>

                </div>

        </section>
    )
}

export default detalhesObjeto;