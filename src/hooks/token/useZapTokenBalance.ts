import { useCallback, useEffect, useRef, useState } from 'react'
import { BigNumber, getTokenBalance, ZERO } from '../../bunny/utils'
import useBunny from '../useBunny'
import useBlock from '../useBlock'
import { BunnyZap, Swap } from '../../bunny/lib/types'
import { supportedSushiZaps, supportedZaps } from '../../bunny/lib/constants'


const useZapTokenBalance = (zap: BunnyZap, swap: Swap = Swap.QuickSwap) => {
    const mountRef = useRef(false)
    const [balance, setBalance] = useState(ZERO)
    const [subBalances, setSubBalances] = useState([ZERO, ZERO] as BigNumber[])
    
    const bunny = useBunny()
    const block = useBlock()
    
    const fetchBalance = useCallback(async () => {
        if (zap.virtual) {
            const proms = zap.symbols.map(symbol => {
                const zapList = swap === Swap.SushiSwap ? supportedSushiZaps : supportedZaps
                const subToken = zapList.find(each => each.name === symbol)
                return getTokenBalance(bunny, subToken.address)
            })
            const subBalances = await Promise.all(proms)
            
            if (!mountRef.current) return
            setSubBalances(subBalances)
        } else {
            const balance = await getTokenBalance(bunny, zap.address)
            if (!mountRef.current) return
            setBalance(balance)
        }
    }, [bunny, zap, mountRef, swap])

    useEffect(() => {
        if (bunny && zap) {
            setBalance(ZERO)
        }
    }, [bunny, setBalance, zap])
    useEffect(() => {
        if (bunny && zap) {
            fetchBalance()
        }
    }, [bunny, block, zap, setBalance, setSubBalances, fetchBalance])
    
    useEffect(() => {
        mountRef.current = true
        return () => {
            mountRef.current = false
        }
    }, [mountRef])
    
    return [balance, ...subBalances]
}

export default useZapTokenBalance
