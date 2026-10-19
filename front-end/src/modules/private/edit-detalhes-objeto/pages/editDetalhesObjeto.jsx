import { useState } from 'react';
import { useParams, NavLink, useOutletContext } from 'react-router'; 

import './editDetalhesObjeto.css'; 

import objetos from '../../../buscar-objetos/components/principalCards/objetos.json'; 

import houseGray from '../../../../assets/icons/detalhesObjeto/house-gray.svg'; 
import arrowGray from '../../../../assets/icons/detalhesObjeto/arrow-gray.svg'; 
import arrowBlue from '../../../../assets/icons/detalhesObjeto/arrow-blue.svg'; 
import pencil from '../../../../assets/icons/userArea/pencil-white.png';
import xBlack from '../../../../assets/icons/detalhesObjeto/x-black.svg';  
import xWhite from '../../../../assets/icons/detalhesObjeto/x-white.png';  

import ImagesCard from '../components/editImagesCard/ImagesCard.jsx'; 
import Detalhes from '../components/editDetalhes/Detalhes.jsx'; 

function EditdetalhesObjeto(){

    const [edit, setEdit] = useState(false);
    const params = useParams(); 
    const {tema} = useOutletContext()

    const objetoEncontrado = objetos.filter((objetos) => { if (objetos.id === Number(params.id)) { return objetos }} )

    function editarInformacoes(){
        setEdit(true)


    }

    return (
        <section className='detalhe__objetos'>

                <div className='caminho__voltar'>

                        <div className='caminho'>
                                <img className='house__gray' src={houseGray} />
                                <img src={arrowGray} />
                                <p className='caminho__text'>Buscar objetos / {objetoEncontrado[0].nome}</p>
                        </div>

                        <div className='voltar__buscar'>

                            <NavLink className='voltar__navlink' to='/user-area' end>
                                <img src={arrowBlue} />
                                <p className='voltar__text'> voltar para área do usuario </p>
                            </NavLink>
                                
                        </div>
                </div>

                <div className='container__detalhes'>

                    <div className='esquerda'>
                        <ImagesCard objeto={objetoEncontrado} edit={edit}/>
                    </div>

                    <div className='direita'>
                        <Detalhes objeto={objetoEncontrado} edit={edit}/>
                    </div>

                </div>

                <div className='container__botoes'>
                    <div className='botao__azul' onClick={() => { editarInformacoes() }}> 
                        <div className='botoes'>
                            <img src={pencil}/>
                            <p>editar informações do objeto</p>
                        </div>
                    </ div>

                    <div className='botao__default' onClick={() => { window.location.reload() }}>
                        <div className='botoes'>
                            {tema === 'light' ? <img src={xBlack}/> : <img className='x__white' src={xWhite}/>}
                            <p>Cancelar alterações</p>
                        </div>
                    </div>
                </div>

        </section>
    )
}

export default EditdetalhesObjeto;