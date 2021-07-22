import React, { useCallback, useEffect, useState } from 'react'
import useBunny from '../../../hooks/useBunny'
import useBlock from '../../../hooks/useBlock'
import useActiveWeb3React from '../../../hooks/connections/useActiveWeb3React'
import { getPortfolioEvaluated, toDisplayBalanceComma } from '../../../bunny/utils'
import moment from 'moment'


const PortfolioChart: React.FC = () => {
    const bunny = useBunny()
    const block = useBlock()
    const { account } = useActiveWeb3React()
    
    const [currentItem, setCurrentItem] = useState(undefined as string)
    
    const handleCurrentPortfolio = useCallback(async () => {
        try {
            const evaluated = await getPortfolioEvaluated(bunny)
            setCurrentItem(toDisplayBalanceComma(evaluated))
        } catch (ex) {
            console.warn('usePortfolio::handleCurrentPortfolio', ex)
        }
    }, [bunny])
    
    useEffect(() => {
        if (bunny && account) {
            handleCurrentPortfolio()
        }
    }, [bunny, account, block, handleCurrentPortfolio])
    
    // const [inputState, setInputState] = useState(0)
    // const [progress, setProgress] = useState('0')
    //
    // const updateProgress = useCallback((value: string) => {
    //     setProgress(value)
    // }, [setProgress])
    //
    // const { portfolioItems, clearPortfolioCache } = usePortfolio(updateProgress)
    // const { width } = useWindowSize()
    //
    // const handleInputState = useCallback(async (index: number) => {
    //     setInputState(index)
    // }, [setInputState])
    //
    // const filteredItems = useMemo(() => {
    //     switch (inputState) {
    //         case 0:
    //         default:
    //             return portfolioItems
    //         case 1:
    //             return portfolioItems.filter(each => each.weekly)
    //         case 2:
    //             return portfolioItems.filter(each => each.monthly)
    //     }
    // }, [portfolioItems, inputState])
    //
    // const getLoading = () => {
    //     return (
    //         <div className='portfolio-loading graph'>
    //             <Loader/>
    //             <span className='progress-value'>{progress}%</span>
    //         </div>
    //     )
    // }
    //
    // return portfolioItems.length === 0 ? getLoading() : (
    //     <>
    //         <ChartView width={Math.min(width, isMobile ? width * 0.9 : 510)} height={isMobile ? 140 : 180}
    //                    data={filteredItems}/>
    //
    //         <div className='graph-scale-container'>
    //             <ButtonGroup initial={inputState} onActiveChanged={handleInputState}>
    //                 <Button text='1D' type='group'/>
    //                 <Button text='1W' type='group'/>
    //                 <Button text='1M' type='group'/>
    //             </ButtonGroup>
    //             <div className='clear-cache no-select clickable' onClick={clearPortfolioCache}>(clear cache)</div>
    //         </div>
    //     </>
    // )
    
    return (
        <div className='portfolio-current-value'>
            {!!currentItem && (
                <>
                    <span className='description'>{moment().format('MMM DD, YYYY')}</span>
                    <span className='value'>${currentItem}</span>
                </>
            )}
        </div>
    )
}

export default PortfolioChart
