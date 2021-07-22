import React, { createContext, useEffect, useState } from 'react'
import useActiveWeb3React from '../../hooks/connections/useActiveWeb3React'
import Bunny from '../../bunny'
import useFirebase from '../../hooks/useFirebase'
import useSideWeb3 from '../../hooks/connections/useSideWeb3'
import { shortenAddress } from '../../bunny/utils'


export interface BunnyContext {
    bunny?: Bunny
}

export const Context = createContext<BunnyContext>({ bunny: undefined })

const BunnyProvider: React.FC = ({ children }) => {
    const [bunny, setBunny] = useState<any>()
    
    const { account, library } = useActiveWeb3React()
    const { polygon } = useSideWeb3()
    const firebase = useFirebase()
    
    useEffect(() => {
        if (!library) return
        
        setBunny(new Bunny(account, library, polygon))
    }, [library, account, polygon])
    
    useEffect(() => {
        if (account) {
            firebase.analytics().setUserId(shortenAddress(account), { global: true })
        }
    }, [account, firebase])
    
    return <Context.Provider value={{ bunny: bunny }}>{children}</Context.Provider>
}

export default BunnyProvider
