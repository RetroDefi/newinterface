import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './NetworkConnector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const rpcs = [
    // 'https://rpc-mainnet.matic.network',
    'https://rpc-mainnet.matic.quiknode.pro',
    // 'https://rpc-mainnet.maticvigil.com',
    'https://matic-mainnet.chainstacklabs.com',
    'https://matic-mainnet-archive-rpc.bwarelabs.com'
]

export const lclRPC = 'http://localhost:8545'   //
const NETWORK_URL = window.dev ? lclRPC : rpcs[Math.floor(Math.random() * rpcs.length)]

export const polyRPC = NETWORK_URL
export const bscRPC = 'https://bsc-dataseed.binance.org/'
export const ethRPC = 'https://eth-mainnet.alchemyapi.io/v2/sxa0uNj_vZ1OiGwkROwUOWCXNQFeM0qI'

export const NETWORK_CHAIN_ID = window.dev ? 31337 : 137

export interface IChainInfo {
    chainId: string
    chainName: string
    rpcUrl: string
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    },
    blockExplorerUrl: string
}

export const ChainInfo: Record<number, IChainInfo> = {
    1: {
        chainId: '0x1',
        chainName: 'ETH Mainnet',
        rpcUrl: ethRPC,
        nativeCurrency: {
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18
        },
        blockExplorerUrl: 'https://etherscan.io'
    },
    56: {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        rpcUrl: bscRPC,
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BSC',
            decimals: 18
        },
        blockExplorerUrl: 'https://bscscan.com'
    },
    137: {
        chainId: '0x89',
        chainName: 'Polygon Mainnet',
        rpcUrl: polyRPC,
        nativeCurrency: {
            name: 'MATIC Coin',
            symbol: 'POLYGON',
            decimals: 18
        },
        blockExplorerUrl: 'https://polygonscan.com/'
    },
    31337: {
        chainId: '0x7a69',
        chainName: 'Local BSC',
        rpcUrl: lclRPC,
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'LCL',
            decimals: 18
        },
        blockExplorerUrl: 'https://bscscan.com'
    },
}

export enum ChainId {
    ETH = 1,
    BSC = 56,
    POLY = 137,
    LCL = 31337
}

export const networkShortName = (chainId: number) => {
    const info = ChainInfo[chainId]
    return info ? info.nativeCurrency.symbol : 'Unknown'
}

export const network = new NetworkConnector({
    urls: {
        1: ethRPC,
        56: bscRPC,
        137: polyRPC,
        31337: lclRPC
    },
    defaultChainId: NETWORK_CHAIN_ID
})

export const injected = new InjectedConnector({
    supportedChainIds: [1, 56, 137, 31337]
})

export const walletconnect = new WalletConnectConnector({
    rpc: { [NETWORK_CHAIN_ID]: NETWORK_URL },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: 3000
})
