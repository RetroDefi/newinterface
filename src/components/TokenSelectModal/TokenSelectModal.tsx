import React, { ReactNode } from 'react'
import { X } from 'react-feather'
import Modal from '../Modal'
import { BunnyZap } from '../../bunny/lib/types'
import { colorWhite } from '../../colors'
import './TokenSelectModal.scss'


export interface TokenSelectModalProps {
    candidates: BunnyZap[]
    handleSelect?: (selected: BunnyZap) => void
    onDismiss?: () => void
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({ candidates, handleSelect, onDismiss }) => {
    const renderListItems = (): ReactNode => {
        const getItemView = (item: BunnyZap): ReactNode => {
            if (item.virtual) {
                return (
                    <>
                        <div className='list-item-icons'>
                            {item.icons[0] && <img src={item.icons[0]} alt={item.name}/>}
                        </div>
                        <span className='list-item-symbol'>{item.symbols[0]}</span>
                        
                        <span className='list-item-virtual-divider'>+</span>
                        
                        <div className='list-item-icons'>
                            {item.icons[1] && <img src={item.icons[1]} alt={item.name}/>}
                        </div>
                        <span className='list-item-symbol'>{item.symbols[1]}</span>
                    </>
                )
            } else {
                return (
                    <>
                        <div className='list-item-icons'>
                            {item.icons[0] && <img src={item.icons[0]} alt={item.name}/>}
                            {item.icons[1] && <img src={item.icons[1]} alt={item.name}/>}
                        </div>
                        <span className='list-item-symbol'>{item.name}</span>
                    </>
                )
            }
        }
        
        return candidates.map((item: BunnyZap) => {
            return (
                <div className='list-item no-select clickable' key={item.name} onClick={() => {
                    handleSelect(item)
                    onDismiss()
                }}>
                    {getItemView(item)}
                </div>
            )
        })
    }
    
    return (
        <Modal type='small'>
            <div className='token-select-modal no-select'>
                <div className='header'>
                    <span>Select a token</span>
                    
                    <div className='close clickable' onClick={onDismiss}>
                        <X size={24} color={colorWhite}/>
                    </div>
                </div>
                
                <div className='list'>
                    {renderListItems()}
                </div>
            </div>
        </Modal>
    )
}

export default TokenSelectModal
