import { useState } from 'react'; 
import { IMaskInput } from 'react-imask';

import cidadesBrasil from '../../../../../../../utils/json/cidade-estados.json';

import './formInfos.css';

function FormInfos({ inputState, inputCityState, inputEmailState, setInputNameState, inputNameState, inputTelephoneState, setInputCityState, 
setInputEmailState, setInputTelephoneState, setInputState }){

    const [cidadesFiltradas, setCidadesFiltradas] = useState([]); 
    
    const todasAsCidades = [];
    cidadesBrasil.estados.forEach((estado) => { estado.cidades.forEach((cidade) => { todasAsCidades.push({
        cidade: cidade,
        estado: estado.sigla
    })})});

    function buscarCidades(valor) {
        setInputCityState(valor);

        if (valor.trim() === '') {
            setCidadesFiltradas([]);
            return;
        }

        const resultado = todasAsCidades.filter((cidade) => {
            const mesmaCidade = cidade.cidade.toLowerCase().startsWith(valor.toLowerCase());

            const mesmoEstado = inputState ? cidade.estado === inputState : true;

            return mesmaCidade && mesmoEstado;   
        });

        setCidadesFiltradas(resultado);
    }

    return (
        <div className='user__profile__inputs__container'>
            <div>
                <label className="user__profile__label" htmlFor="nome"> Nome </label>
                <div>
                    <input id='nome' className='user__profile__input' type="text" value={inputNameState} onChange={(e) => {setInputNameState(e.target.value)}} />
                </div>
            </div>

            <div>
                <label className="user__profile__label" htmlFor="email"> E-mail </label>
                <div>
                    <input id='email' className='user__profile__input' type="email" value={inputEmailState} onChange={(e) => {setInputEmailState(e.target.value)}} />
                </div>
            </div>

            <div className='user__profile__phone__city'>

                <div className='user__profile__input__phone'>
                    <label className="user__profile__label" htmlFor="telefone"> Telefone </label>
                    <div>
                        <IMaskInput id='telefone' className='user__profile__input' mask={"(00) 00000-0000"} value={inputTelephoneState} 
                        placeholder='(00) 00000-0000' onAccept={(value) => setInputTelephoneState(value)}/>
                    </div>
                </div>

                <div className='user__profile__input__city'>
                    <label className="user__profile__label" htmlFor="cidade"> Cidade </label>
                    <div>
                        <input id='cidade' className='user__profile__input' type="text" onChange={(e) => {buscarCidades(e.target.value)}} value={inputCityState} />

                        <select value={inputState}  className="user__profile__estado"  onChange={(event) => setInputState(event.target.value)}>
                            <option value=""> UF </option>

                            {cidadesBrasil.estados.map((estado) => (
                                <option key={estado.sigla} value={estado.sigla}>
                                    {estado.sigla}
                                </option>
                            ))}
                        </select>
                    </div>

                    {cidadesFiltradas.length > 0 ? (
                    <div className="user__profile__container__sugestoes">

                        {cidadesFiltradas.map((cidade) => (

                            <div className="user__profile__cidades__sugestoes" key={`${cidade.cidade}-${cidade.estado}`} onClick={() => { setInputCityState(cidade.cidade); setInputState(cidade.estado); setCidadesFiltradas([]) }}>
                                <span>{cidade.cidade} </span>
                            </div>
                        ))}
                    </div> ) : ''}
                </div>

            </div>
        </div>
    )
}

export default FormInfos; 