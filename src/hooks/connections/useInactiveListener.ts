import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'
import { injected } from '../../connections/connectors'


const useInactiveListener = (suppress = false) => {
    const { active, error, activate } = useWeb3React() // specifically using useWeb3React because of what this hook does
    
    useEffect(() => {
        const { ethereum } = window
        
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = () => {
                // eat errors
                activate(injected, undefined, true).catch(error => {
                    console.error('Failed to activate after chain changed', error)
                })
            }
            
            const handleAccountsChanged = (accounts: string[]) => {
                if (accounts.length > 0) {
                    // eat errors
                    activate(injected, undefined, true).catch(error => {
                        console.error('Failed to activate after accounts changed', error)
                    })
                }
            }
            
            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)
            
            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                }
            }
        }
        return undefined
    }, [active, error, suppress, activate])
}

export default useInactiveListener
