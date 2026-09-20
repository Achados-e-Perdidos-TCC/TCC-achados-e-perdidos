import './status.css'

import warningRed from '../../assets/icons/buscarObjetos/warning-red.svg';
import checkGreen from '../../assets/icons/buscarObjetos/check-green.svg';
import hourglassOrange from '../../assets/icons/buscarObjetos/hourglass-orange.svg';

function Status(objeto) {

    const objetoEncontrado = objeto.objeto;

    function verificaIconStatus(status) {
        if (status === 'PERDIDO') { return warningRed }
        if (status === 'ENCONTRADO') { return checkGreen }
        if (status === 'ANALISE') { return hourglassOrange }
    }

    function adicionaClassNameStatus(status) {
        if (status === 'PERDIDO') { return 'status__red' }
        if (status === 'ENCONTRADO') { return 'status__green' }
        if (status === 'ANALISE') { return 'status__orange' }
    }

    return (
        <div className='status__principal'>
            <div className={adicionaClassNameStatus(objetoEncontrado.status.trim().toUpperCase())} >

                <img className="image__principal" src={verificaIconStatus(objetoEncontrado.status.trim().toUpperCase())} />
                <span>{objetoEncontrado.status.trim().toUpperCase()}</span>

            </div>
        </div>
    )
}

export default Status;