import React, { lazy, Suspense, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { PageContent } from '../../../components/Page'
import usePool from '../../../hooks/pools/usePool'

import LocalLoader from '../../../components/LocalLoader'
import { supportedPools } from '../../../bunny/lib/constants'
import { BunnyPoolWithValue } from '../../../bunny/lib/types'

const PoolDetail = lazy(() => import('./PoolDetail'))

const FarmDetail: React.FC = () => {
    const history = useHistory()
    // @ts-ignore
    const { identifier } = useParams()
    const _name = supportedPools.find(_pool => _pool.path === identifier)?.name
    const pool: BunnyPoolWithValue = usePool(_name)
    
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    
    useEffect(() => {
        if (pool === null) {
            history.replace('/')
        }
    }, [pool, history])
    
    return (
        <PageContent>
            <Suspense fallback={<LocalLoader/>}>
                <div className={`farm-detail-wrapper`}>
                    {pool ?
                     <PoolDetail pool={pool}/>
                     : <LocalLoader/>}
                </div>
            </Suspense>
        </PageContent>
    )
}

export default FarmDetail
