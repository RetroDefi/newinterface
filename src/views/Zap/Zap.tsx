import React, { useCallback, useEffect, useState } from 'react'
import { Page, PageContent, PageHeader } from '../../components/Page'
import ZapCard from './components/ZapCard'
import './Zap.scss'
import { Swap } from '../../bunny/lib/types'
import queryString from 'query-string'
import { useLocation } from 'react-router-dom'
import { supportedZaps } from '../../bunny/lib/constants'


const Zap: React.FC = () => {
    const [ selector, setSelector ] = useState(Swap.QuickSwap)
    
    const { search } = useLocation()
    
    const handleSelector = useCallback((_selector: Swap) => {
        setSelector(_selector);
    }, [setSelector])
    
    useEffect(() => {
        const queryMap = queryString.parse(search)
        if (queryMap.out) {
            const tokenOut = supportedZaps.find(zap => zap.address === queryMap.out)
            if (!tokenOut) {
                handleSelector(Swap.SushiSwap)
            }
        }
    }, [handleSelector])
    
    
    return (
        <Page>
            <PageHeader title='Zap helps token conversion'>
                <div>Zap uses {selector} *no extra fee</div>
            </PageHeader>

            <PageContent>
                <div className='zap-container'>
                    <div className='selector'>
                        <div className={`item no-select clickable ${selector === Swap.QuickSwap && 'active left'}`} onClick={() => handleSelector(Swap.QuickSwap)}>{Swap.QuickSwap}</div>
                        <div className={`item no-select clickable ${selector === Swap.SushiSwap && 'active right'}`} onClick={() => handleSelector(Swap.SushiSwap)}>{Swap.SushiSwap}</div>
                    </div>
                    
                    <ZapCard swap={selector}/>
                </div>
            </PageContent>
        </Page>
    )
}

export default Zap
