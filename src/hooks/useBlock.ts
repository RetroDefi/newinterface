import { singletonHook } from 'react-singleton-hook'
import { useCallback, useEffect, useState } from 'react'
import useDebounce from './useDebounce'
import useSideWeb3 from './connections/useSideWeb3'

const init = 0

const useBlockImpl = () => {
    const { polygon } = useSideWeb3()
    const [polygonBlock, setPolygonBlock] = useState(0)
    
    const latestBlock = useDebounce(polygonBlock, 500)
    
    const handleBlocks = useCallback(async () => {
        setPolygonBlock(await polygon.getBlockNumber())
    }, [polygon, setPolygonBlock])
    
    useEffect(() => {
        if (!polygon) return
    
        const interval = setInterval(async () => {
            if (!polygon) return
            await handleBlocks()
        }, 5000)
    
        handleBlocks()
        return () => clearInterval(interval)
    }, [polygon, handleBlocks])

    return latestBlock
}

const useBlock = singletonHook(init, useBlockImpl)
export default useBlock
