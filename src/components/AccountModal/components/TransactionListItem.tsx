import React from 'react'
import { AlertCircle, CheckCircle, Loader } from 'react-feather'
import useAllTransactions from '../../../hooks/transactions/useAllTransactions'
import useActiveWeb3React from '../../../hooks/connections/useActiveWeb3React'
import { colorBunnyDark, colorMint } from '../../../colors'
import { getPolyScanTxLink, shortenTransaction } from '../../../bunny/utils'
import TextLink from '../../TextLink'


interface TransactionListItemProps {
    hash: string
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ hash }) => {
    const { chainId } = useActiveWeb3React()
    const allTransactions = useAllTransactions()
    
    const tx = allTransactions?.[hash]
    const summary = tx?.summary
    const pending = !tx?.receipt
    const success = !pending && tx && (tx.receipt?.status === 1 || typeof tx.receipt?.status === 'undefined')
    
    const getStatusIconView = () => {
        if (pending) {
            return <Loader className='pending-loader' size={18}/>
        } else if (success) {
            return <CheckCircle color={colorMint} size={18}/>
        } else {
            return <AlertCircle color={colorBunnyDark} size={18}/>
        }
    }
    
    if (!chainId) return null
    
    return (
        <div className='transaction-list-item'>
            <TextLink href={getPolyScanTxLink(hash)}>{summary ?? shortenTransaction(hash)}</TextLink>
            <div className='no-select'>{getStatusIconView()}</div>
        </div>
    )
}

export default TransactionListItem
