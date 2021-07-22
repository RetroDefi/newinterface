import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { X } from 'react-feather'
import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import { getPolyScanAddressLink, isRecentTransaction, sortByNewTransactions } from '../../bunny/utils'
import useActiveWeb3React from '../../hooks/connections/useActiveWeb3React'
import { colorWhite } from '../../colors'
import useAllTransactions from '../../hooks/transactions/useAllTransactions'
import { clearAllTransactions } from '../../state/transactions/actions'
import TransactionListItem from './components/TransactionListItem'
import './AccountModal.scss'
import Portfolio from "../../views/Portfolio";


const AccountModal: React.FC<ModalProps> = ({ onDismiss }) => {
    const { account, chainId, deactivate } = useActiveWeb3React()
    const allTransactions = useAllTransactions()
    const dispatch = useDispatch()
    
    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isRecentTransaction).sort(sortByNewTransactions)
    }, [allTransactions])
    
    const confirmed = sortedRecentTransactions.filter(tx => tx.receipt).map(tx => tx.hash)
    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
    
    const handleBscScanClick = useCallback(() => {
        onDismiss!()
        window.open(getPolyScanAddressLink(account), '_blank')
    }, [account, onDismiss])
    
    const handleSignOutClick = useCallback(() => {
        onDismiss!()
        deactivate()
    }, [onDismiss, deactivate])
    
    const clearAllTransactionsCallback = useCallback(() => {
        if (chainId) dispatch(clearAllTransactions({ chainId }))
    }, [dispatch, chainId])
    
    const getTransactionListView = (transactions: string[]) => {
        return transactions.map((hash, i) => <TransactionListItem key={`${hash}_${i}`} hash={hash}/>)
    }
    
    return (
        <Modal>
            <div className='account-modal'>
                <div className='header no-select'>
                    <span/>
                    <div className='close clickable' onClick={onDismiss}>
                        <X color={colorWhite} size={24}/>
                    </div>
                </div>

                <Portfolio />
                
                <div className='transactions'>
                    <div className='title'>
                        {!!pending.length || !!confirmed.length ? (
                            <>
                                <span className='description no-select'>Recent Transactions</span>
                                <div className='clear-all no-select clickable' onClick={clearAllTransactionsCallback}>(clear all)</div>
                            </>
                        ) : (
                             <span className='description no-select'>Your transactions will appear here</span>
                         )}
                    </div>
                    <div className='transaction-list-item-wrapper'>
                        {getTransactionListView(pending)}
                        {getTransactionListView(confirmed)}
                    </div>
                </div>
                
                <div className='actions no-select'>
                    <Button text='View on PolyScan' onClick={handleBscScanClick}/>
                    <Button text='Sign out' onClick={handleSignOutClick}/>
                </div>
            </div>
        </Modal>
    )
}

export default AccountModal
