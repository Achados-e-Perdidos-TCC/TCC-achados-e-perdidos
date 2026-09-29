import { useState } from 'react';
import './dropdown.css';

function Dropdown({id, placeholder, options, arrow, close, change }){

    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null); 

    function alternarDropdown(){
        setDropdownVisible(() => {
            return !dropdownVisible ? true : false
        }); 
    }

    function alternarOption(value){
        setSelectedOption(value);
    }

    // evento.currentTarget = dropdown inteiro
    // evento.relatedTarget = elemento que recebeu foco depois 
    function fecharDropdown(evento) {
        // Se o elemento que recebeu o foco ainda estiver dentro do dropdown
        if (!evento.currentTarget.contains(evento.relatedTarget)) {
            setDropdownVisible(false);
        }
    }

    const dropdownContent = (
        <div className='dropdown__content'>

            {options.map((value) => ( 

                <div key={''} className='dropdown__itens' onClick={() => {alternarOption(value.nome), change('CATEGORIA', value.nome)}}>
                       <p> {value.nome } </p>
                </div>
                
            ))}

        </div>
    )

    // tabIndex={-1} = serve para permitir que a <div> participe do sistema de foco
    return (
            <div className={'arrow__icon'}  tabIndex={-1} onBlur={fecharDropdown} >

                <button id={id} className="input__filter button__filter" onClick={alternarDropdown} type='button'> 
                    <span className={!selectedOption ? 'category' : ''}> {selectedOption || placeholder} </span>
                </button>

                {!dropdownVisible ? <img className='arrow' onClick={alternarDropdown} src={arrow} alt="" /> : <img className='arrow up' onClick={alternarDropdown} src={arrow} alt="" /> }
                <img className='x'  onClick={() => {alternarOption(null), change('CATEGORIA', '')}}  src={close} alt="" />

                {dropdownVisible && dropdownContent }
            </div>         
    )
}

export default Dropdown;