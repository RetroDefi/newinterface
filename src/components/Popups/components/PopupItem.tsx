import React, { useCallback, useEffect } from 'react'
import { animated, useSpring } from 'react-spring'
import { X } from 'react-feather'
import { PopupContent } from '../../../state/application/actions'
import useRemovePopup from '../../../hooks/popup/useRemovePopup'
import TransactionPopup from './TransactionPopup'


interface PopupItemProps {
    removeAfterMs: number | null
    content: PopupContent
    popKey: string
}

const PopupItem: React.FC<PopupItemProps> = ({ removeAfterMs, content, popKey }) => {
    const removePopup = useRemovePopup()
    const removeThisPopup = useCallback(() => removePopup(popKey), [popKey, removePopup])
    
    useEffect(() => {
        if (removeAfterMs === null) return undefined
        
        const timeout = setTimeout(() => removeThisPopup(), removeAfterMs)
        return () => clearTimeout(timeout)
    }, [removeAfterMs, removeThisPopup])
    
    const faderStyle = useSpring({
        from: { width: '100%' },
        to: { width: '0%' },
        config: { duration: removeAfterMs ?? undefined }
    })
    
    return (
        <div className='popup'>
            <X className='popup-close clickable' size={18} onClick={removeThisPopup}/>
            <TransactionPopup hash={content.txn.hash} success={content.txn.success} summary={content.txn.summary}/>
            {removeAfterMs !== null ? <animated.div className='popup-fader' style={faderStyle}/> : null}
        </div>
    )
}

export default PopupItem
