import React from 'react'
import { useHistory } from 'react-router-dom'
import { ArrowLeft } from 'react-feather'
import { colorWhite } from '../../colors'
import './Back.scss'


interface BackProps {
    replace?: string
    label?: string
}

const Back: React.FC<BackProps> = ({ replace, label }) => {
    const history = useHistory()
    
    return (
        <div className='back-button clickable no-select' onClick={() => {
            if (replace) {
                history.replace(replace)
            } else {
                history.goBack()
            }
        }}>
            <div className='arrow'>
                <ArrowLeft size={24} color={colorWhite}/>
            </div>
            {label ? label : 'BACK'}
        </div>
    )
}

export default Back
