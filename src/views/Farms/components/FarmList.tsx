import React, { lazy } from 'react'
import isEmpty from 'lodash/isEmpty'
import { BunnyPoolWithValue } from '../../../bunny/lib/types'
import { ZERO } from '../../../bunny/utils'

const FarmCard = lazy(() => import('./FarmCard'))
const PageContent = lazy(() => import('../../../components/Page/PageContent'))

interface FarmListProps {
    pools: BunnyPoolWithValue[]
}

const FarmList: React.FC<FarmListProps> = ({ pools }) => {
    
    const getEngagedPoolListView = () => {
        return pools.filter(pool => pool.portfolio.gt(ZERO))
                    .map((pool, index) => {
                        return (
                            <div key={`farms-row-engaged-${index}`} className='row'>
                                <FarmCard pool={pool}/>
                            </div>
                        )
                    })
    }
    
    const getRemainPoolListView = () => {
        return pools.filter(pool => !pool.closed && pool.portfolio.lte(ZERO))
                    .map((pool, index) => {
                        return (
                            <div key={`farms-row-remain-${index}`} className='row'>
                                <FarmCard pool={pool}/>
                            </div>
                        )
                    })
    }
    
    if (isEmpty(pools)) return null
    const engagedPoolListView = getEngagedPoolListView()
    const remainPoolListView = getRemainPoolListView()
    
    return (
        <PageContent>
            <div className='farms-list-wrapper'>
                <div className='farms-list'>
                    
                    {!isEmpty(engagedPoolListView) && (
                        <div className='section staked'>
                            <span className='title'>{`Deposited Pools (${engagedPoolListView.length})`}</span>
                            {engagedPoolListView}
                        </div>
                    )}
                    
                    {!isEmpty(remainPoolListView) && (
                        <div className='section'>
                            <span className='title'>{`Active Pools (${remainPoolListView.length})`}</span>
                            {remainPoolListView}
                        </div>
                    )}
                </div>
            </div>
        </PageContent>
    )
}

export default FarmList
