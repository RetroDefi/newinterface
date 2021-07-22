import { BunnyZap, Swap } from '../../bunny/lib/types'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ETHER, getAmountsOutTokens, toFullDisplayBalance } from '../../bunny/utils'
import useBlock from '../useBlock'
import useBunny from '../useBunny'
import { WETH, WMATIC } from '../../bunny/lib/constants'

const routeMap: any = {
    // '0x831753DD7087CaC61aB5644b308642cc1c33Dc13': WMATIC
    '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6': WETH,
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174': WETH,
    '0xc2132D05D31c914a87C6611C10748AEb04B58e8F': WETH,
    '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063': WETH,
    '0xD6DF932A45C0f255f85145f286eA0b292B21C90B': WETH,
    '0x4C16f69302CcB511c5Fac682c7626B9eF0Dc126a': WETH,
    
    // sushi
    '0x4EaC4c4e9050464067D673102F8E24b2FccEB350': '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    '0x104592a158490a9228070E0A8e5343B499e125D0': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
}

/**
 * ignore LP
 */
const useTrades = (tokenIn: BunnyZap, tokenOut: BunnyZap, amount: any, swap: Swap = Swap.QuickSwap) => {
    const mountRef = useRef(false)
    
    const [tokenCount, setTokenCount] = useState('')
    const [exception, setException] = useState(undefined)
    const block = useBlock()
    
    const bunny = useBunny()
    
    const calculatesToken = useCallback(async () => {
        if (tokenIn && tokenOut && Number(amount) > 0) {
            if (tokenIn.name.includes('LP') || tokenOut.name.includes('LP')) return
            
            try {
                // MATIC > WMATIC or WMATIC > MATIC
                if (tokenIn.wrap.includes(tokenOut.name) || tokenIn.unwrap.includes(tokenOut.name)) {
                    setTokenCount(toFullDisplayBalance(ETHER.times(amount)))
                } else if (tokenIn.zapIn.includes(tokenOut.name)) {
                    // zapIn: MATIC -> other tokens
                    let path = makeRouterPath(tokenOut.address)
                    const outAmount = await getAmountsOutTokens(bunny, amount, path, swap)
                    setTokenCount(toFullDisplayBalance(outAmount, tokenOut.decimals[0]))
                } else if (tokenIn.zapOut.includes(tokenOut.name)) {
                    // zapOut: tokens -> MATIC
                    let path = makeRouterPath(tokenIn.address, true)
                    const outAmount = await getAmountsOutTokens(bunny, amount, path, swap)
                    setTokenCount(toFullDisplayBalance(outAmount, tokenOut.decimals[0]))
                } else { // tokens -> tokens
                    let path = makeRoutePath(tokenIn.address, tokenOut.address)
                    const outAmount = await getAmountsOutTokens(bunny, amount, path, swap)
                    setTokenCount(toFullDisplayBalance(outAmount, tokenOut.decimals[0]))
                }
                
                setException(null)
            } catch (ex) {
                setTokenCount('0')
                setException(ex)
            }
        } else {
            setTokenCount('0')
        }
    }, [bunny, tokenIn, tokenOut, amount, swap])
    
    useEffect(() => {
        calculatesToken()
    }, [calculatesToken, tokenIn, tokenOut, amount, block])
    
    useEffect(() => {
        mountRef.current = true
        return () => {
            mountRef.current = false
        }
    }, [mountRef])
    
    return [tokenCount, exception]
}

const makeRouterPath = (_to: string, zapOut: boolean = false): string[] => {
    const from = zapOut ? _to : WMATIC
    const to = zapOut ? WMATIC : _to
    
    if (routeMap[_to]) {
        return [from, routeMap[_to], to] // from, WMATIC, to
    } else {
        return [from, to]
    }
}

const makeRoutePath = (_from: string, _to: string): string[] => {
    let intermediate = routeMap[_from]
    if (!intermediate) {
        intermediate = routeMap[_to]
    }
    
    if (intermediate && (_from === WMATIC || _to === WMATIC)) {
        // [WETH, BUSD, VAI] or [VAI, BUSD, WETH]
        return [_from, intermediate, _to]
    } else if (intermediate && (_from === intermediate || _to === intermediate)) {
        // [VAI, BUSD] or [BUSD, VAI]
        return [_from, _to]
    } else if (intermediate && routeMap[_from] === routeMap[_to]) {
        // [VAI, DAI] or [VAI, USDC]
        return [_from, intermediate, _to]
    } else if (routeMap[_from] && routeMap[_to] && routeMap[_from] !== routeMap[_to]) {
        // routePairAddresses[xToken] = xRoute
        // [VAI, BUSD, WETH, xRoute, xToken]
        return [_from, routeMap[_from], WMATIC, routeMap[_to], _to]
    } else if (intermediate && routeMap[_from]) {
        // [VAI, BUSD, WETH, BUNNY]
        return [_from, routeMap[_from], WMATIC, _to]
    } else if (intermediate && routeMap[_to]) {
        // [BUNNY, WETH, BUSD, VAI]
        return [_from, WMATIC, routeMap[_to], _to]
    } else if (_from === WMATIC || _to === WMATIC) {
        return [_from, _to]
    } else {
        // [USDT, BUNNY] or [BUNNY, USDT]
        return [_from, WMATIC, _to]
    }
}

export default useTrades
