import { useCallback, useEffect, useRef, useState } from 'react'
import { BunnyPoolWithValue } from '../../bunny/lib/types'
import useBunny from '../useBunny'
import useBlock from '../useBlock'
import { getPool } from '../../bunny/utils'
import useDataAPY from '../data/useDataAPY'


const usePool = (identifier: string): BunnyPoolWithValue => {
    const mountRef = useRef(false)
    const [pool, setPool] = useState(undefined)
    
    const bunny = useBunny()
    const apyData = useDataAPY()
    const block = useBlock()
    
    const handlePool = useCallback(async () => {
        try {
            if (!apyData) return
            let result: BunnyPoolWithValue = await getPool(bunny, identifier, apyData)
            if (!mountRef.current) return
            setPool(result)
        } catch {
            console.error('handlePool')
        }
    }, [bunny, identifier, apyData])
    
    useEffect(() => {
        if (bunny) {
            handlePool()
        }
    }, [bunny, block, handlePool])
    
    useEffect(() => {
        mountRef.current = true
        return () => {
            mountRef.current = false
        }
    }, [mountRef])
    
    return pool
}

export default usePool
