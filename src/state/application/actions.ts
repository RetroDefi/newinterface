import { createAction } from '@reduxjs/toolkit'
import { ChainId } from '../../connections/connectors'


/**
 * TxPopup
 * */
export type PopupContent = {
    txn: {
        hash: string
        success: boolean
        summary?: string
    }
}

export const addPopup = createAction<{ key?: string; removeAfterMs?: number | null; content: PopupContent }>('app/addPopup')
export const removePopup = createAction<{ key: string }>('app/removePopup')

/**
 * TopAlert
 * */
export type TopAlertContent = {
    message: string
    link?: string
    external?: boolean
}

export const showTopAlert = createAction<{ removeAfterMs?: number | null; content: TopAlertContent }>('app/showTopAlert')
export const hideTopAlert = createAction('app/hideTopAlert')

/**
 * ChainSelector
 * */

export const selectChain = createAction<{ chainId: ChainId }>('app/selectChain')
