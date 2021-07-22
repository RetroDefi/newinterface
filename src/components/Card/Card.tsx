import React from 'react'
import './Card.scss'


interface CardProps {
    children?: React.ReactNode
    height?: number
    highlight?: boolean
    pattern?: boolean
    badge?: React.ReactNode
    overlay?: string
}

const Card: React.FC<CardProps> = ({
    children,
    height = 0,
    highlight = false,
    pattern = false,
    badge = undefined
}) => {
    return (
        <div className={`card ${highlight ? 'highlight' : ''} ${pattern ? 'pattern' : ''}`}
             style={{ height: height === 0 ? 'auto' : `${height}px` }}>
            {badge && <div className='badge'>{badge}</div>}
            {children}
        </div>
    )
}

export default Card
