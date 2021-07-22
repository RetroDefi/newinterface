import { singletonHook } from 'react-singleton-hook'
import { useEffect, useState } from 'react'
import { getBunnyPrice, ZERO } from '../bunny/utils'
import useBunny from './useBunny'
import useActiveWeb3React from './connections/useActiveWeb3React'


const init = ZERO

const useBunnyPriceImpl = () => {
    const [priceBUNNY, setPriceBUNNY] = useState(ZERO)
    
    const { active } = useActiveWeb3React()
    const bunny = useBunny()
    
    useEffect(() => {
        const interval = setInterval(async () => {
            if (bunny && active) {
                getBunnyPrice(bunny).then(price => {
                    setPriceBUNNY(price)
                })
            }
        }, 3000)
        
        if (bunny && active) {
            getBunnyPrice(bunny).then(price => {
                setPriceBUNNY(price)
            })
        }
        
        return () => clearInterval(interval)
    }, [bunny, active, setPriceBUNNY])
    
    return priceBUNNY
}

const useBunnyPrice = singletonHook(init, useBunnyPriceImpl)
export default useBunnyPrice
