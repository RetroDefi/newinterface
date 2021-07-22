import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { ArrowDown, Plus } from 'react-feather'
import queryString from 'query-string'
import { Card, CardContent, CardDivider } from '../../../components/Card'
import Button from '../../../components/Button'
import { BunnyZap, Swap } from '../../../bunny/lib/types'
import {
    EMPTY_ADDRESS,
    getZapItems,
    registerTokenToWallet,
    setupMATICNetwork,
    toBalanceFromDisplay,
    toDisplayBalanceComma,
    toFullDisplayBalance,
    zapApprove,
    zapTokenRoute,
    ZERO
} from '../../../bunny/utils'
import TokenInput from '../../../components/TokenInput'
import TokenSelect from '../../../components/TokenSelect'
import useBunny from '../../../hooks/useBunny'
import { useLocation } from 'react-router-dom'
import Back from '../../../components/Back'
import useFirebase from '../../../hooks/useFirebase'
import useZapTokenBalance from '../../../hooks/token/useZapTokenBalance'
import useZapTokenAllowance from '../../../hooks/token/useZapTokenAllowance'
import useTransactionAdder from '../../../hooks/transactions/useTransactionAdder'
import { Zaps } from '../../../bunny/lib/constants'
import { colorWhite } from '../../../colors'
import { ChainId } from '../../../connections/connectors'
import useActiveWeb3React from '../../../hooks/connections/useActiveWeb3React'
import useTrades from '../../../hooks/zap/useTrades'
import useModal from '../../../hooks/useModal'
import WalletProviderModal from '../../../components/WalletProviderModal'

interface ZapCardProps {
    swap: Swap
}

const ZapCard: React.FC<ZapCardProps> = ({ swap = Swap.QuickSwap }) => {
    const { search } = useLocation()
    
    const [hasAllowance, setHasAllowance] = useState(false)
    const [requestedTx, setRequestedTx] = useState(false)
    const [val, setVal] = useState('')
    const [tokenInDecimal, setTokenInDecimal] = useState(18)

    const [tokenInList, setTokenInList] = useState([] as BunnyZap[])
    const [tokenIn, setTokenIn] = useState(undefined as BunnyZap)
    
    const [tokenOutList, setTokenOutList] = useState([] as BunnyZap[])
    const [tokenOut, setTokenOut] = useState(undefined as BunnyZap)
    
    const { chainId } = useActiveWeb3React()
    const [onPresentWalletProviderModal] = useModal(<WalletProviderModal/>)
    
    const firebase = useFirebase()
    const bunny = useBunny()
    const tokenAllowance = useZapTokenAllowance(tokenIn, swap)
    const [tokenInBalance] = useZapTokenBalance(tokenIn, swap)
    const [tokenOutBalance, subTokenOutBalance0, subTokenOutBalance1] = useZapTokenBalance(tokenOut, swap)
    const [convertedTokenCount, tradeException] = useTrades(tokenIn, tokenOut, toBalanceFromDisplay(val, tokenInDecimal), swap)
    const addTransaction = useTransactionAdder()
    
    const handleUnlockClick = useCallback(() => {
        onPresentWalletProviderModal()
    }, [onPresentWalletProviderModal])
    
    useEffect(() => {
        const zapItems = getZapItems(undefined, swap)
        
        const defaultTokenIn = zapItems.find(zap => zap.name === 'MATIC')
        const defaultTokenOut = zapItems.find(zap => zap.name === (swap === Swap.QuickSwap ? 'polyBUNNY' : 'ETH'))
        const defaultTokenDecimal = zapItems.find(zap => zap.name === 'MATIC').decimals[0]
        
        setTokenIn(defaultTokenIn)
        setTokenInList(zapItems)
        setTokenInDecimal(defaultTokenDecimal)
        setVal('')
        
        const queryMap = queryString.parse(search)
        if (queryMap.out) {
            const queryTokenOut = zapItems.find(zap => zap.address === queryMap.out)
            if (queryTokenOut) {
                setTokenOut(queryTokenOut)
            } else {
                setTokenOut(defaultTokenOut)
            }
        } else {
            setTokenOut(defaultTokenOut)
        }
    }, [search, setTokenIn, setTokenInList, swap])
    
    useEffect(() => {
        if (tokenIn) {
            setTokenOutList(getZapItems(tokenIn, swap))
        } else {
            setTokenOutList([])
        }
    }, [tokenIn, setTokenOutList, swap])
    
    useEffect(() => {
        setHasAllowance(tokenAllowance.gt(ZERO))
    }, [tokenAllowance, setHasAllowance])
    
    
    const checkMetaMask = () => {
        return !!bunny ? bunny.contracts.library.provider.isMetaMask : false
    }
    
    const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        setVal(e.currentTarget.value)
    }, [setVal])
    
    const handleSelectTokenIn = useCallback((selected: BunnyZap) => {
        setTokenIn(selected)
        setTokenInDecimal(selected.decimals[0])

        if (tokenOut && ![...selected.zapIn, ...selected.zapInToken, ...selected.zapOut].includes(tokenOut.name)) {
            setTokenOut(undefined)
        }
    }, [tokenOut, setTokenIn, setTokenOut])
    
    const handleSelectTokenOut = useCallback((selected: BunnyZap) => {
        setTokenOut(selected)
    }, [setTokenOut])
    
    const handleSelectMax = useCallback(() => {
        setVal(toFullDisplayBalance(tokenInBalance, tokenInDecimal))
    }, [tokenInBalance, setVal, tokenInDecimal])
    
    const executeApprove = async () => {
        if (!tokenIn) return
        
        setRequestedTx(true)
        const response = await zapApprove(bunny, tokenIn, swap)
        if (response) {
            addTransaction(response, {
                summary: 'Approve ' + tokenIn.name,
                approval: { tokenAddress: tokenIn.address, spender: Zaps[swap] }
            })
        }
        setRequestedTx(false)
    }
    
    const executeZap = async () => {
        if (!tokenIn || !tokenOut) return
        
        firebase.analytics().logEvent('zap', { in: tokenIn.name, out: tokenOut.name, value: val })
        
        setRequestedTx(true)
        const response = await zapTokenRoute(bunny, tokenIn, tokenOut, val, swap)
        if (response) {
            addTransaction(response)
        }
        setRequestedTx(false)
        setVal('')
    }
    
    const getTokenOutBalanceView = (): ReactNode => {
        if (!tokenOut) return <span className='value'>{toDisplayBalanceComma(ZERO)}</span>
        
        if (tokenOut.virtual) {
            return <span className='value'>{toDisplayBalanceComma(subTokenOutBalance0, tokenOut.decimals[0])} {tokenOut.symbols[0]} + {toDisplayBalanceComma(subTokenOutBalance1, tokenOut.decimals[1])} {tokenOut.symbols[1]}</span>
        } else {
            return <span className='value'>{toDisplayBalanceComma(tokenOutBalance, tokenOut.decimals[0])} {tokenOut.name}</span>
        }
    }
    
    const getActionView = (): ReactNode => {
        const getActionButton = (): ReactNode => {
            if (!bunny || !bunny.account) {
                return (
                    <Button disabled={requestedTx} text='Connect Wallet' type='default' onClick={handleUnlockClick}/>
                )
            }
            
            if (chainId !== ChainId.POLY && chainId !== ChainId.LCL) {
                return <Button disabled={requestedTx} text='Please switch to POLYGON' type='default' onClick={async () => {
                    await setupMATICNetwork()
                    window.location.reload()
                }}/>
            }
            
            const name = tokenIn ? tokenIn.name : ''
            if (!hasAllowance) {
                return <Button disabled={requestedTx} onClick={executeApprove} text={`Approve ${name}`} type='secondary'/>
            } else {
                return <Button disabled={requestedTx || !val} onClick={executeZap} text='Zap' type='secondary'/>
            }
        }
        
        return (
            <CardContent>
                <div className='zap-control-action-wrapper'>
                    {getActionButton()}
                </div>
            </CardContent>
        )
    }
    
    return (
        <div className='zap-wrapper'>
            <div className='zap-control-wrapper'>
                <Card>
                    <div className='zap-control-header'>
                        {search && <Back/>}
                    </div>
                    
                    <CardContent>
                        <div className='zap-control-input-wrapper'>
                            <div className='token-select'>
                                <TokenSelect selected={tokenIn} candidates={tokenInList} handleSelect={handleSelectTokenIn}/>
                                {tokenIn && tokenIn.address && tokenIn.address !== EMPTY_ADDRESS && checkMetaMask() && (
                                    <div className='wallet-register' onClick={() => registerTokenToWallet(bunny, tokenIn.name, tokenIn.address)}>
                                        <Plus color={colorWhite} size={20}/>
                                    </div>
                                )}
                            </div>
                            
                            <div className='token-input'>
                                <TokenInput value={val} symbol={''}
                                            hideSymbol={true} onChange={handleChange} onSelectMax={handleSelectMax}/>
                            </div>
                            
                            <div className='balance'>
                                <span className='label'>BALANCE:</span>
                                {tokenIn ? (
                                    <span className='value'>{toDisplayBalanceComma(tokenInBalance, tokenIn.decimals[0])} {tokenIn.name}</span>
                                ) : (
                                     <span className='value'>{toDisplayBalanceComma(ZERO)}</span>
                                 )}
                            </div>
                        </div>
                    </CardContent>
                    
                    <ArrowDown className='zap-direction-arrow no-select' size={24} color={colorWhite}/>
                    
                    <CardContent>
                        <div className='zap-control-input-wrapper'>
                            <div className='token-select'>
                                <TokenSelect selected={tokenOut} candidates={tokenOutList} handleSelect={handleSelectTokenOut}/>
                                {tokenOut && tokenOut.address && tokenOut.address !== EMPTY_ADDRESS && checkMetaMask() && (
                                    <div className='wallet-register' onClick={() => registerTokenToWallet(bunny, tokenOut.name, tokenOut.address)}>
                                        <Plus color={colorWhite} size={20}/>
                                    </div>
                                )}
                            </div>
    
                            {
                                tradeException === null && (!(tokenIn?.name.includes('LP') || tokenOut?.name.includes('LP'))) &&
                                <div className='token-input'>
                                    <TokenInput value={convertedTokenCount} symbol={''} hideSymbol={true} disable>
                                        <div className='to no-select'>to (estimated)</div>
                                    </TokenInput>
                                </div>
                            }
                            
                            <div className='balance'>
                                <span className='label'>BALANCE:</span>
                                {getTokenOutBalanceView()}
                            </div>
                        </div>
                    </CardContent>
                    
                    <CardDivider padding={50}/>
                    {getActionView()}
                </Card>
            </div>
        </div>
    )
}

export default ZapCard
