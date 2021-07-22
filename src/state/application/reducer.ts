import { createReducer, nanoid } from '@reduxjs/toolkit'
import { addPopup, hideTopAlert, PopupContent, removePopup, selectChain, showTopAlert, TopAlertContent } from './actions'
import { ChainId } from '../../connections/connectors'


type PopupList = Array<{ key: string; show: boolean; content: PopupContent; removeAfterMs: number | null }>
type TopAlert = { content: TopAlertContent; removeAfterMs: number | null }

export interface ApplicationState {
    popupList: PopupList
    topAlert: TopAlert
    chainId: ChainId
}

const initialState: ApplicationState = {
    popupList: [],
    topAlert: null,
    chainId: null
}

export default createReducer(initialState, builder => builder
    .addCase(addPopup, (state, { payload: { content, key, removeAfterMs = 15000 } }) => {
        state.popupList = (key ? state.popupList.filter(popup => popup.key !== key) : state.popupList).concat([
            {
                key: key || nanoid(),
                show: true,
                content,
                removeAfterMs
            }
        ])
    })
    .addCase(removePopup, (state, { payload: { key } }) => {
        state.popupList.forEach(p => {
            if (p.key === key) {
                p.show = false
            }
        })
    })
    .addCase(showTopAlert, (state, { payload: { content, removeAfterMs = 10000 } }) => {
        state.topAlert = {
            content,
            removeAfterMs
        }
    })
    .addCase(hideTopAlert, (state) => {
        state.topAlert = null
    })
    .addCase(selectChain, (state, { payload: { chainId } }) => {
        state.chainId = chainId
    })
)
