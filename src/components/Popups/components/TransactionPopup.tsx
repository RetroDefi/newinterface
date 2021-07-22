import React from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import TextLink from '../../TextLink'
import { getPolyScanTxLink, shortenTransaction } from '../../../bunny/utils'
import { colorBunnyDark, colorMint } from '../../../colors'
import useActiveWeb3React from '../../../hooks/connections/useActiveWeb3React'

interface TransactionPopupProps {
    hash: string
    success?: boolean
    summary?: string
}

const TransactionPopup: React.FC<TransactionPopupProps> = ({ hash, success, summary }) => {
    const { chainId } = useActiveWeb3React()
    
    return (
        <div className='tx-popup'>
            <div className='tx-popup-icon'>
                {success ? <CheckCircle color={colorMint} size={24}/> : <AlertCircle color={colorBunnyDark} size={24}/>}
            </div>
            <div className='tx-popup-info'>
                <span className='hash'>{summary ?? shortenTransaction(hash)}</span>
                {chainId && <TextLink href={getPolyScanTxLink(hash)}>View on PolyScan</TextLink>}
            </div>
        </div>
    )
}

export default TransactionPopup
