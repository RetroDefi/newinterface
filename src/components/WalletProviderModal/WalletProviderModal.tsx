import React, { useEffect } from 'react'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { UnsupportedChainIdError } from '@web3-react/core'
import { X } from 'react-feather'
import { SUPPORTED_WALLETS, WalletInfo } from '../../connections'
import Modal, { ModalProps } from '../Modal'
import WalletProviderCard from './components/WalletProviderCard'
import TextLink from '../TextLink'
import { POLY_GUIDE, setupMATICNetwork } from '../../bunny/utils'

import useActiveWeb3React from '../../hooks/connections/useActiveWeb3React'
import { assetWallets } from '../../assets/wallets'
import { colorWhite } from '../../colors'
import './WalletProviderModal.scss'


const WalletProviderModal: React.FC<ModalProps> = ({ onDismiss }) => {
    const { account, activate } = useActiveWeb3React()
    
    useEffect(() => {
        if (account) {
            onDismiss()
        }
    }, [account, onDismiss])
    
    const tryActivation = async (connector: AbstractConnector | undefined) => {
        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
            connector.walletConnectProvider = undefined
        }
        
        connector && activate(connector, undefined, true).catch(async (error) => {
            if (error instanceof UnsupportedChainIdError) {
                if (await setupMATICNetwork()) {
                    await activate(connector)
                } else {
                    alert('Unsupported Network')
                }
            }
        })
    }
    
    return (
        <Modal>
            <div className='wallet-provider-modal no-select'>
                <div className='close clickable' onClick={onDismiss}>
                    <X size={24} color={colorWhite}/>
                </div>
                
                <div className='title'>
                    <span>Connect Wallet</span>
                    <div className='description'>
                        <p>
                            Please connect your wallet with <TextLink href={POLY_GUIDE}>Polygon Network</TextLink>
                        </p>
                    </div>
                </div>
                
                <div className='wallets'>
                    {Object.keys(SUPPORTED_WALLETS).map(key => {
                        const wallet: WalletInfo = SUPPORTED_WALLETS[key]
                        return <WalletProviderCard key={key} icon={assetWallets[key]} title={wallet.name}
                                                   onConnect={() => tryActivation(wallet.connector)}/>
                    })}
                </div>
            </div>
        </Modal>
    )
}

export default WalletProviderModal
