import { useCallback, useEffect, useRef, useState } from 'react'
import { getTokenAllowance, ZERO } from '../../bunny/utils'
import useBunny from '../useBunny'
import useBlock from '../useBlock'
import { BunnyZap, Swap } from '../../bunny/lib/types'
import { Zaps } from '../../bunny/lib/constants'


const useZapTokenAllowance = (zap: BunnyZap, swap: Swap = Swap.QuickSwap) => {
    const mountRef = useRef(false)
    const [allowance, setAllowance] = useState(ZERO)
    
    const bunny = useBunny()
    const block = useBlock()
    
    const fetchAllowance = useCallback(async () => {
        const allowance = await getTokenAllowance(bunny, zap.address, Zaps[swap])
        
        if (!mountRef.current) return
        setAllowance(allowance)
    }, [bunny, zap, mountRef, swap])
    
    useEffect(() => {
        if (bunny && zap) {
            fetchAllowance()
        }
    }, [bunny, block, zap, setAllowance, fetchAllowance])
    
    useEffect(() => {
        mountRef.current = true
        return () => {
            mountRef.current = false
        }
    }, [mountRef])
    
    return allowance
}

export default useZapTokenAllowance
