import React from 'react'

import './LocalLoader.scss'
import { assetLogos } from '../../assets'

const LocalLoader: React.FC = () => {
    return (
        <div className='local-loader no-select'>
            <img src={assetLogos.logo} alt='loading-icon'/>
        </div>
    )
}

export default LocalLoader
