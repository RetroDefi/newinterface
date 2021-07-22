// https://firestore.googleapis.com/v1/projects/bunny-polygon/databases/(default)/documents/apy_data?pageSize=100

import React, { createContext, useCallback, useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import { BunnyPoolAPY } from '../../bunny/lib/types'
import { CloudEndpoint, STORAGE_KEY_APY_DATA, STORAGE_KEY_MCAP_DATA, STORAGE_KEY_PERF_DATA, STORAGE_KEY_TVL_DATA } from '../../bunny/lib/constants'
import axios, { AxiosResponse } from 'axios'


export interface APYDataContext {
    apyData?: Record<string, BunnyPoolAPY>
    perfData?: number
    mcapData?: number
    tvlData?: number
}

export const Context = createContext<APYDataContext>({ apyData: undefined })

const DataProvider: React.FC = ({ children }) => {
    const [apyData, setAPYData] = useState<Record<string, BunnyPoolAPY>>(undefined)
    const [perfData, setPerfData] = useState<number>(0)
    const [mcapData, setMcapData] = useState<number>(0)
    const [tvlData, setTVLData] = useState<number>(0)
    
    const fetchMetrics = useCallback(async () => {
        try {
            const response: AxiosResponse = await axios({ method: 'GET', url: `${CloudEndpoint}/api-bunnyData` })
            if (response?.data?.apy) {
                localStorage.setItem(STORAGE_KEY_APY_DATA, JSON.stringify(response.data.apy))
                setAPYData(response.data.apy)
            }
            
            if (response?.data?.perf) {
                localStorage.setItem(STORAGE_KEY_PERF_DATA, JSON.stringify(response.data.perf))
                setPerfData(response.data.perf)
            }
            
            if (response?.data?.mcap) {
                localStorage.setItem(STORAGE_KEY_MCAP_DATA, JSON.stringify(response.data.mcap))
                setMcapData(response.data.mcap)
            }
            
            if (response?.data?.tvl) {
                localStorage.setItem(STORAGE_KEY_TVL_DATA, JSON.stringify(response.data.tvl))
                setTVLData(response.data.tvl)
            }
        } catch {
            fetchMetrics()
        }
    }, [setAPYData, setPerfData, setMcapData, setTVLData])
    
    useEffect(() => {
        const interval = setInterval(async () => {
            fetchMetrics()
        }, 300000)
        
        const cachedAPYData = JSON.parse(localStorage.getItem(STORAGE_KEY_APY_DATA)) ?? {}
        if (!isEmpty(cachedAPYData)) setAPYData(cachedAPYData)
        
        const cachedPerfData = parseFloat(localStorage.getItem(STORAGE_KEY_PERF_DATA) ?? '0')
        if (cachedPerfData !== 0 && !isNaN(cachedPerfData)) setPerfData(cachedPerfData)
        
        const cachedMcapData = parseFloat(localStorage.getItem(STORAGE_KEY_MCAP_DATA) ?? '0')
        if (cachedMcapData !== 0 && !isNaN(cachedMcapData)) setMcapData(cachedMcapData)
        
        const cachedTVLData = parseFloat(localStorage.getItem(STORAGE_KEY_TVL_DATA) ?? '0')
        if (cachedTVLData !== 0 && !isNaN(cachedTVLData)) setTVLData(cachedTVLData)
        
        fetchMetrics()
        return () => clearInterval(interval)
    }, [fetchMetrics])
    
    return <Context.Provider value={{
        apyData: apyData,
        perfData: perfData,
        mcapData: mcapData,
        tvlData: tvlData
    }}>{children}</Context.Provider>
}

export default DataProvider
