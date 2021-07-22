import React, { ReactNode } from 'react'
import { ChevronDown } from 'react-feather'
import useModal from '../../hooks/useModal'
import TokenSelectModal from '../TokenSelectModal'
import { BunnyZap } from '../../bunny/lib/types'
import { colorWhite } from '../../colors'
import './TokenSelect.scss'


interface TokenSelectProps {
    selected?: BunnyZap
    candidates: BunnyZap[]
    handleSelect: (selected: BunnyZap) => void
}

const TokenSelect: React.FC<TokenSelectProps> = ({ selected, candidates, handleSelect }) => {
    const [onPresentTokenSelectModal] = useModal(<TokenSelectModal candidates={candidates} handleSelect={handleSelect}/>)
    
    const getSelectedItemView = (): ReactNode => {
        if (!selected) return <span className='token-select-placeholder'>Select a token</span>
        
        if (selected.virtual) {
            return (
                <>
                    <div className='token-select-icons'>
                        {selected.icons[0] && <img src={selected.icons[0]} alt={selected.name}/>}
                    </div>
                    <span className='token-select-symbol'>{selected.symbols[0]}</span>
                    
                    <span className='token-select-virtual-divider'>+</span>
                    
                    <div className='token-select-icons'>
                        {selected.icons[1] && <img src={selected.icons[1]} alt={selected.name}/>}
                    </div>
                    <span className='token-select-symbol'>{selected.symbols[1]}</span>
                </>
            )
        } else {
            return (
                <>
                    <div className='token-select-icons'>
                        {selected.icons[0] && <img src={selected.icons[0]} alt={selected.name}/>}
                        {selected.icons[1] && <img src={selected.icons[1]} alt={selected.name}/>}
                    </div>
                    <span className='token-select-symbol'>{selected.name}</span>
                </>
            )
        }
    }
    
    return (
        <div className={`token-select-wrapper ${selected && 'selected'} no-select clickable`} onClick={onPresentTokenSelectModal}>
            <div className='token-select-info'>
                {getSelectedItemView()}
            </div>
            <ChevronDown className='token-select-arrow' color={colorWhite} size={20}/>
        </div>
    )
}

export default TokenSelect
