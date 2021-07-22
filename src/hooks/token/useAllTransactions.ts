import { useSelector } from 'react-redux'
import { AppState } from '../../state'
import useActiveWeb3React from '../connections/useActiveWeb3React'


const useAllTransactions = () => {
    const { chainId } = useActiveWeb3React()
    
    const state = useSelector<AppState, AppState['transactions']>(state => state.transactions)
    return chainId ? state[chainId] ?? {} : {}
}

export default useAllTransactions
