import React from 'react'
import { isMobile } from 'react-device-detect'
import './TokenInput.scss'


interface InputProps {
    symbol: string
    error?: string
    onChange?: (e: React.FormEvent<HTMLInputElement>) => void
    onSelectMax?: () => void
    hideSymbol?: boolean
    value: string,
    disable?: boolean,
}

const TokenInput: React.FC<InputProps> = ({ symbol, error, onChange, onSelectMax, hideSymbol = false, value, disable = false, children }) => {
    return (
        <div className='token-input-wrapper'>
            {children}
            <input className={error ? 'token-input-error' : 'token-input'} placeholder={error ? error : '0'} value={value} onChange={onChange} disabled={disable}/>
            {!error && !hideSymbol && <span className='token-input-symbol no-select'>{isMobile && symbol.includes('LP') ? 'LP' : symbol}</span>}
            {!disable && <div className={`token-input-max no-select clickable ${hideSymbol && 'hide-symbol'}`} onClick={onSelectMax}>MAX</div>}
        </div>
    )
}

export default TokenInput
