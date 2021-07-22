import React, { useCallback, useContext } from 'react'
import { Context as ModalsContext } from '../contexts/Modals'


const useModal = (modal: React.ReactNode) => {
    const { onDismiss, onPresent } = useContext(ModalsContext)
    
    const handlePresent = useCallback(() => {
        onPresent(modal)
    }, [modal, onPresent])
    
    return [handlePresent, onDismiss]
}

export default useModal
