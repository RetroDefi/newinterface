import React from 'react'
import './Container.scss'


interface ContainerProps {
    children?: React.ReactNode,
    size?: 'sm' | 'md' | 'lg' | 'pg'
}

const Container: React.FC<ContainerProps> = ({ children, size = 'md' }) => {
    return (
        <div className={`container ${size}`}>{children}</div>
    )
}

export default Container