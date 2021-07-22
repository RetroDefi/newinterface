import React from 'react'
import { useHistory } from 'react-router-dom'
import { Check } from 'react-feather'
import { colorMint } from '../../colors'
import './Button.scss'


export interface ButtonProps {
    disabled?: boolean,
    href?: string,
    to?: string,
    onClick?: () => void,
    text?: string,
    subtext?: string,
    active?: boolean,
    collapsed?: boolean,
    noWrap?: boolean,
    checked?: boolean,
    type?: 'default' | 'primary' | 'secondary' | 'transparent' | 'check' | 'group'
}

const Button: React.FC<ButtonProps> = ({
    disabled,
    href, to, onClick,
    text, subtext,
    active, collapsed, noWrap,
    checked,
    type = 'default'
}) => {
    const history = useHistory()
    
    const handleClick = () => {
        if (to) {
            history.push(to)
        } else if (href) {
            window.open(href, '_blank')
        } else if (onClick) {
            onClick()
        }
    }
    
    const buttonClassName = () => {
        return [
            'bunny-button', type, 'clickable no-select',
            active ? 'active' : '',
            disabled ? 'disabled' : '',
            collapsed ? 'collapsed' : '',
            noWrap ? 'no-wrap' : '',
            type === 'check' && checked ? 'check-on' : '',
            type === 'check' && !checked ? 'check-off' : ''
        ].filter(each => each.length > 0).join(' ')
    }
    
    return (
        <div className={buttonClassName()} onClick={handleClick}>
            <div className='content'>
                {text}
                <div className='subtext'>{subtext}</div>
            </div>
            
            { type === 'check' && checked && (
                <Check color={colorMint}/>
            )}
        </div>
    )
}

export default Button
