import React from 'react'
import PopupItem from './components/PopupItem'
import useActivePopups from '../../hooks/popup/useActivePopups'
import './Popups.scss'


const Popups: React.FC = () => {
    const activePopups = useActivePopups()
    
    return (
        <div className='popups-wrapper no-select'>
            {activePopups.map(item => (
                <PopupItem key={item.key} content={item.content} popKey={item.key} removeAfterMs={item.removeAfterMs}/>
            ))}
        </div>
    )
}

export default Popups
