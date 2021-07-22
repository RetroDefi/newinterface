import { AbstractConnector } from '@web3-react/abstract-connector'
import { injected, walletconnect } from './connectors'


export interface WalletInfo {
    connector?: AbstractConnector
    name: string
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
    Metamask: {
        connector: injected,
        name: 'Metamask'
    },
    TrustWallet: {
        connector: injected,
        name: 'TrustWallet'
    },
    MathWallet: {
        connector: injected,
        name: 'MathWallet'
    },
    WalletConnect: {
        connector: walletconnect,
        name: 'WalletConnect'
    }
}

export const NetworkContextName = 'NETWORK'
