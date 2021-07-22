import React from 'react'
import { useHistory } from 'react-router-dom'
import './TextLink.scss'


export interface TextLinkProps {
    href?: string,
    to?: string,
}

const TextLink: React.FC<TextLinkProps> = ({ children, href, to }) => {
    const history = useHistory()
    
    const handleClick = () => {
        if (to) {
            history.push(to)
        } else if (href) {
            window.open(href, '_blank')
        }
    }
    
    return (
        <span className='text-link clickable' onClick={handleClick}>
            {children}
        </span>
    )
}

export default TextLink