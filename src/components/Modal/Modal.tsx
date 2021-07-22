import React from 'react'
import './Modal.scss'


export interface ModalProps {
    onDismiss?: () => void
    type?: 'default' | 'small'
}

const Modal: React.FC<ModalProps> = ({
    children,
    type = 'default'
}) => {
    
    return (
        <div className={`bunny-modal-wrapper ${type}`}>
            <div className='bunny-modal'>{children}</div>
        </div>
    )
}

export default Modal
