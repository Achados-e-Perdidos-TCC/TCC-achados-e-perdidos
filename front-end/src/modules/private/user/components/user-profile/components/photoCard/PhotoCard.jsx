import { useEffect} from 'react'; 
import { useOutletContext } from 'react-router'; 

import { loadAvatar } from '../../../../../private.service.js';

import './photoCard.css'; 

import userBlue from '../../../../../../../assets/icons/register/user-blue.png'; 
import calendarGray from '../../../../../../../assets/icons/userArea/calendar-gray.png';
import pencilBlack from '../../../../../../../assets/icons/userArea/pencil-black.png';  
import pencilWhite from '../../../../../../../assets/icons/userArea/pencil-white.png';

function PhotoCard({ userInfos, photo, setPhoto, avatar,  setAvatar, setError}){

    const {tema} = useOutletContext(); 

    useEffect(() => {
            async function findAvatar() {

            if (!userInfos.avatarUrl) { return }

            try {
                const avatarUrl = await loadAvatar(userInfos.avatarUrl);

                setAvatar(avatarUrl);

            } catch (error) {
                setError(true); 
            }
        }

        findAvatar();
    }, [userInfos.avatarUrl]); 

    function formattedDate(){
        const months = ['Janeiro', 'Fevereiro', 'marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

        const formattedMonth =  months[userInfos.createdAt.slice(5, 7) - 1];
        const formattedYear = userInfos.createdAt.slice(0, 4); 
        
        return `${formattedMonth} de ${formattedYear}`; 
    }

    function formattedNameMobile(){

        let initialName = userInfos.name; 

        if(userInfos.name.includes(' ')){ initialName = `${userInfos.name.split(' ')[0]} ${userInfos.name.split(' ')[1]}` }

        return initialName
    }
    
    return (
        <div className='user__profile__photo__container'>
                <div className='user__profile__photo__content'>
                    {!photo ? <img className={!avatar ? 'user__sem__foto' : 'user__com__foto'} src={!avatar ? userBlue : avatar}/> : 
                     <img className={!photo ? 'user__sem__foto' : 'user__com__foto'} src={!photo ? userBlue : URL.createObjectURL(photo)} />}

                    <div className='user__profile__texts__content'>
                        <h1 className='user__profile__name user__no__responsive' >{userInfos.name}</h1>
                        <p className='user__profile__email user__no__responsive'>{userInfos.email}</p>

                        <h1 className='user__profile__name user__responsive' >{formattedNameMobile()}</h1>
                        <p className='user__profile__email user__responsive'>{(`${userInfos.email}...`).length > 27 ? `${userInfos.email.slice(0, 27)}...` : userInfos.email}</p>

                        <div className='user__profile__photo__calendar__content'>
                            <img className='user__profile__calendar' src={calendarGray} />
                            <p>Membro desde {formattedDate()}</p>
                        </div>
                    </div>
                </div>

                <div className='user__profile__edit__photo__container'>

                    <div className='user__profile__edit__photo__content'>
                        <img className='user__profile__pencil' src={tema === 'light' ? pencilBlack : pencilWhite} />
                        <label htmlFor="uploadimage" className='user__profile__photo__upload'>Editar foto</label>
                        <input id='uploadimage' type="file" accept='.jpg,.png' onChange={(event) => { setPhoto(event.target.files[0])}} hidden />
                    </div>

                </div>
            </div>
    )
}

export default PhotoCard