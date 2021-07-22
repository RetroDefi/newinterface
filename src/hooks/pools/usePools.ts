import { useCallback, useEffect, useRef, useState } from 'react'
import { BunnyPoolWithValue } from '../../bunny/lib/types'
import { BigNumber, getPools, toDisplayBalance, ZERO } from '../../bunny/utils'
import useBunny from '../useBunny'
import useBlock from '../useBlock'
import { STORAGE_KEY_TVL_DATA } from '../../bunny/lib/constants'
import { ChainId } from '../../connections/connectors'
import useDebounce from '../useDebounce'
import useDataAPY from '../data/useDataAPY'


const usePools = () => {
    const mountRef = useRef(false)
    
    const [bscPools, setBSCPools] = useState([] as BunnyPoolWithValue[])
    const [bscTotal, setBSCTotal] = useState(ZERO)
    
    const bunny = useBunny()
    const apyData = useDataAPY()
    const block = useBlock()
    
    const mergedPools = useDebounce([...bscPools], 500)
    const mergedTotal = useDebounce(bscTotal, 500)
    
    const handlePools = useCallback(async () => {
        try {
            if (!apyData) return
    
            const [resultBSC] = await Promise.all([getPools(bunny, ChainId.POLY, apyData)])
            const totalTVL = resultBSC.reduce<BigNumber>((tvl, pool) => tvl.plus(pool.tvl), ZERO)
            
            if (!mountRef.current) return
            setBSCPools(resultBSC)
    
            if (totalTVL.gt(ZERO)) {
                setBSCTotal(totalTVL)
            }
        } catch {
            console.error('handlePools')
        }
    }, [bunny, setBSCPools, setBSCTotal, apyData])
    
    useEffect(() => {
        if (bunny) {
            handlePools()
        }
    }, [bunny, block, handlePools])
    
    
    useEffect(() => {
        if (mergedTotal.isZero()) {
            localStorage.setItem(STORAGE_KEY_TVL_DATA, toDisplayBalance(mergedTotal, 18))
        }
    }, [mergedTotal])
    
    useEffect(() => {
        mountRef.current = true
        return () => {
            mountRef.current = false
        }
    }, [mountRef])
    
    return { pools: mergedPools, total: mergedTotal }
}

export default usePools
