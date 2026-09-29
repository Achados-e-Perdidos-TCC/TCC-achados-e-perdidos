import { useState } from 'react'; 
import { useOutletContext } from 'react-router'; 

import './perfil.css'; 

import userBlue from '../../../../../../assets/icons/register/user-blue.png'; 
import uploadBlue from '../../../../../../assets/icons/register/upload-blue.png'; 
import skipGray from '../../../../../../assets/icons/register/skip-Gray.png'; 
import arrowBlack from '../../../../../../assets/icons/register/arrow-black.png'
import arrowWhite from '../../../../../../assets/icons/register/arrow-white.png'

function Perfil({ proximaPagina, error, setInput }){

    const [foto, setFoto] = useState(''); 
    const { tema } = useOutletContext();

    async function continuarCriacaoConta(){
        error(null)
        if (!foto) {return error('Adicione uma foto para continuar ou clique em “Pular por enquanto”.')}

        setInput((valorAntigo) => ({...valorAntigo, avatarUrl: foto }))

        return proximaPagina(3)
    }

    function pularProximaPagina(){
        error(null)
        setInput((valorAntigo) => ({...valorAntigo, avatarUrl: '' }));

        return proximaPagina(3); 
    }

    return (
        <div className='perfil'>
            <div className='register__container__foto'>
                <img className={!foto ? 'sem__foto' : 'com__foto'} src={!foto ? userBlue : URL.createObjectURL(foto)} />

                <div>
                    <p className='register__foto__title'>Adicionar foto</p>
                    <span className='register__foto__subtitle'> JPG ou PNG • recomendado até 5 MB </span>
                </div>
            </div>

            <div className='register__upload'>

                <div className='register__upload__container'>
                    <img className='upload__image' src={uploadBlue} />

                    <div>
                        <h4 className='register__upload__title'>Selecione uma imagem do seu dispositivo</h4>
                        <p className='register__upload__subtitle'>Ou arraste e solte aqui</p>
                    </div>
                </div>

                <div className='register__selecionar__imagem'>
                    {foto ? (<p className='upload__image__label no__responsive' onClick={() => { setFoto('') }}> Excluir imagem </p>) 
                    : (<label htmlFor="uploadimage" className='upload__image__label no__responsive'>Selecionar imagem</label>)}

                    <input id='uploadimage' type="file" accept='.jpg,.png' onChange={(event) => { setFoto(event.target.files[0])}} hidden />
                </div>
            </div>

            {foto ? (<p className='upload__image__label register__responsive' onClick={() => { setFoto('') }}> Excluir imagem </p>) 
            : (<label htmlFor="uploadimage" className='upload__image__label register__responsive'>Selecionar imagem</label>)}

            <div className='register__perfil__skip' onClick={() => { pularProximaPagina() }}>
                <img src={skipGray}  />
                <p>Pular por enquanto</p>
            </div>

            <div className='container__buttons'>

                <div className='register__button__voltar' onClick={() => { proximaPagina(1); error(null)}}>
                    {tema === 'light' ? <img className="perfil__arrow__black" src={arrowBlack} /> : <img className="perfil__arrow__black" src={arrowWhite} /> }
                    <p>Voltar</p>
                </div>

                <div className='register__button__continuar' onClick={() => { continuarCriacaoConta() }}>
                    <img className="perfil__arrow__white" src={arrowWhite}/>
                    <p>Continuar</p>
                </div>

            </div>
        </div>
    )
}

export default Perfil;