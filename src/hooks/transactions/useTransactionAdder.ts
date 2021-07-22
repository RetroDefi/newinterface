import { TransactionResponse } from '@ethersproject/abstract-provider'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../state'
import { useCallback } from 'react'
import { addTransaction } from '../../state/transactions/actions'
import useActiveWeb3React from '../connections/useActiveWeb3React'


const useTransactionAdder = () => {
    const { chainId, account } = useActiveWeb3React()
    const dispatch = useDispatch<AppDispatch>()
    
    return useCallback((
        response: TransactionResponse,
        { summary, approval }: { summary?: string; approval?: { tokenAddress: string; spender: string } } = {}
    ) => {
        if (!account) return
        if (!chainId) return
        
        const { hash } = response
        if (!hash) return
        
        dispatch(addTransaction({ hash, from: account, chainId, approval, summary }))
    }, [account, chainId, dispatch])
}

export default useTransactionAdder
