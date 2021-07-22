import React, { ReactNode, useCallback, useMemo } from 'react'
import { Loader } from 'react-feather'
import useModal from '../../hooks/useModal'
import WalletProviderModal from '../WalletProviderModal'
import AccountModal from '../AccountModal/AccountModal'
import { isRecentTransaction, shortenAddress, sortByNewTransactions } from '../../bunny/utils'
import Button from '../Button'
import useAllTransactions from '../../hooks/transactions/useAllTransactions'
import useActiveWeb3React from '../../hooks/connections/useActiveWeb3React'
import { networkShortName } from '../../connections/connectors'
import { colorWhite } from '../../colors'
import './AccountButton.scss'


const AccountButton: React.FC = () => {
    const [onPresentAccountModal] = useModal(<AccountModal/>)
    const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)
    
    const { account, chainId } = useActiveWeb3React()
    const allTransactions = useAllTransactions()
    
    const sortedRecentTransactions = useMemo(() => {
        const txs = Object.values(allTransactions)
        return txs.filter(isRecentTransaction).sort(sortByNewTransactions)
    }, [allTransactions])
    
    const pending = sortedRecentTransactions.filter(tx => !tx.receipt).map(tx => tx.hash)
    const hasPendingTransactions = !!pending.length
    
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])
    
    const getAccountButton = (): ReactNode => {
        if (account) {
            if (hasPendingTransactions) {
                return (
                    <>
                        <Button onClick={onPresentAccountModal} text={`${pending.length} Pending`} noWrap={true} type='primary'/>
                        <div className='pending-loader-wrapper'>
                            <Loader className='pending-loader' color={colorWhite} size={24}/>
                        </div>
                    </>
                )
            } else {
                return <Button onClick={onPresentAccountModal} text={shortenAddress(account)} noWrap={true} type='primary'/>
            }
        } else {
            return <Button onClick={handleUnlockClick} text="Connect Wallet" noWrap={true} type='primary'/>
        }
    }
    
    return (
        <div className='account-button no-select'>
            <span className='chain-name'>{networkShortName(chainId)}</span>
            {getAccountButton()}
        </div>
    )
}

export default AccountButton
