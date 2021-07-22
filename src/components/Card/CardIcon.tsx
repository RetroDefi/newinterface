import React from 'react'


interface CardIconProps {
    src?: string,
}

const CardIcon: React.FC<CardIconProps> = ({ src }) => (
    <div className='card-icon no-select'>
        <img src={src} alt='icon'/>
    </div>
)

export default CardIcon