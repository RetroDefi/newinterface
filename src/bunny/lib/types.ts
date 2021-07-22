import { LineData, UTCTimestamp } from 'lightweight-charts'
import BigNumber from 'bignumber.js'
import { Contract } from '@ethersproject/contracts'

export enum AuctionOpts {
    Swap = 0, Callback
}

export interface Auction {
    id: number
    name: string
    deadline: number
    swapRatio: number
    allocation: BigNumber
    capacity: BigNumber
    engaged: BigNumber
    token: string
    tokenRemain: BigNumber
    tokenSupply: BigNumber
    archived: boolean
    beneficiary: string
    option: AuctionOpts
    
    // values
    open?: number
    tokenSymbol?: string
    tokenDecimals?: number
    tokenContract?: Contract
    accountEngaged?: BigNumber
    accountClaimed?: boolean
}

export interface Token {
    icon: string
    name: string
    address: string
}

export interface PairToken extends Token {
    lp: string  // TODO
}

export enum PoolTypes {
    Bunny = 'bunny',
    BunnyETH = 'BunnyETH',
    BunnyStake = 'bunnyStake',
    BunnyToBunny = 'bunnyToBunny',
    CakeStake = 'cakeStake',
    FlipToFlip = 'flipToFlip',
    FlipToCake = 'flipToCake',
    Venus = 'venus',
    Compensate = 'compensate'
}

export interface BunnyPool {
    icon: string
    name: string
    address: string
    token: string
    deposit: string
    earn: string
    summary: string
    description: string
    exchange: string
    type: PoolTypes
    chainId: number
    relay?: string
    relayToken?: string
    path?: string
    closed?: boolean
    swap: string
}

export interface BunnyPoolAPY {
    apr?: string
    aprPool?: string
    aprBunny?: string
    aprSwap?: string
    apy?: string
    apyPool?: string
    apyPoolComp?: string
    apyPoolBorrow?: string
    apyPoolBunny?: string
    apyBunny?: string
    apySwap?: string
}

export interface BunnyPoolValue extends BunnyPoolAPY {
    balance: BigNumber
    principal: BigNumber
    available: BigNumber
    tvl: BigNumber
    utilized: BigNumber
    liquidity: BigNumber
    pBASE: BigNumber
    pBUNNY: BigNumber
    portfolio: BigNumber
    depositedAt?: number
    feeDuration?: number
    feePercentage?: number
    
    // compensation
    compTokens?: string[];
    compPendings?: BigNumber[];
}

export interface BunnyPoolWithValue extends BunnyPool, BunnyPoolValue {
}

export interface BunnyZap {
    name: string
    icons: string[]
    symbols: string[]
    address: string
    virtual: boolean
    zapIn: string[]
    zapInToken: string[]
    zapOut: string[]
    wrap: string[]
    unwrap: string[]
    index: number
    decimals: number[]
    swap?: string
}

export interface PortfolioItem extends LineData {
    block: number
    timestamp: number
    weekly: boolean
    monthly: boolean
    time: UTCTimestamp
    value: number
}

export enum Swap {
    QuickSwap = 'QuickSwap',
    SushiSwap = 'SushiSwap'
}