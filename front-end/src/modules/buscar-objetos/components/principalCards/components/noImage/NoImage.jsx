import './noImage.css'

import noPicture from '../../../../../../assets/icons/noImage/no-picture.svg';

function NoImage(){

    return(
        <div className='noImage'>
            <img className='principal__cards__noimage__card ' src={noPicture} />
        </div>
    )
}

export default NoImage; 