import React from 'react'
import './Card.scss'


interface CardDividerProps {
    padding?: number
}

const CardDivider: React.FC<CardDividerProps> = ({ padding }) => (
    <div className='card-divider'/>
)

export default CardDivider
