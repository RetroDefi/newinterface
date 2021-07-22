import React, { useEffect, useState } from 'react'
import { CardIcon } from '../../../components/Card'
import { BunnyPoolWithValue, PoolTypes } from '../../../bunny/lib/types'
import { toDisplayBalanceComma } from '../../../bunny/utils'
import { useHistory } from 'react-router-dom'

interface FarmCardProps {
    pool: BunnyPoolWithValue
}

interface FarmCardOptions {
    isFlip: boolean
    isCakeMaximizer: boolean
    isMultiplexer: boolean
    isBoost: boolean
    isAPR: boolean
    isClosed?: boolean
}

const FarmCard: React.FC<FarmCardProps> = ({ pool }) => {
    const [poolOptions, setPoolOptions] = useState({ isFlip: false, isCakeMaximizer: false, isMultiplexer: false, isBoost: false, isAPR: false, isClosed: false } as FarmCardOptions)
    const history = useHistory()
    
    useEffect(() => {
        setPoolOptions({
            isFlip: pool.deposit.endsWith('LP'),
            isCakeMaximizer: pool.name.endsWith('CAKE Maximizer'),
            isMultiplexer: pool.name.endsWith('Multiplexer'),
            isBoost: pool.name.includes('polyBUNNY'),
            isAPR: pool.type === PoolTypes.Bunny || pool.type === PoolTypes.BunnyETH || pool.type === PoolTypes.BunnyStake,
            isClosed: pool.closed
        })
    }, [pool, setPoolOptions])
    
    const renderRate = () => {
        if (poolOptions.isClosed) {
            return <span className='description closed'>{pool.summary}</span>
        }
        
        return (
            poolOptions.isAPR ? (
                <>
                    <div className='apy'>
                        <div className='info-guide-for-manual-apy'>
                            <span>{pool.apy}%</span>
                        </div>
                    </div>
                    <span className='apr'>APR {pool.apr}%</span>
                    <span className='description'>{pool.summary}</span>
                </>
            ) : (
                <>
                    <span className='apy'>{pool.apy}%</span>
                    <span className='description'>{pool.summary}</span>
                </>
            )
        )
    }
    
    return (
        <div className={`farms-card-item clickable ${poolOptions.isBoost && !poolOptions.isClosed && 'boost'} ${poolOptions.isClosed && 'closed'}`} onClick={() => history.push(`/pool/${pool.path}`)}>
            <div className='icon'>
                <CardIcon src={pool.icon}/>
            </div>
            
            <div className='label'>
                <span>{pool.deposit}</span>
                {pool.swap && <span className={`swap ${pool.swap?.toLowerCase()}`}>{pool.swap}</span>}
            </div>
            
            <div className='rates'>
                {renderRate()}
            </div>
            <div className='details return'>
                <span className='label'>Earn</span>
                <span className='value'>{pool.earn}</span>
            </div>
            
            <div className='details balance'>
                <span className='label'>Balance</span>
                <span className='value'>${toDisplayBalanceComma(pool.portfolio)}</span>
            </div>
            
            <div className='details total'>
                <span className='label'>Total Deposit</span>
                <span className='value'>${toDisplayBalanceComma(pool.tvl)}</span>
            </div>
        
        </div>
    )
}

export default FarmCard
