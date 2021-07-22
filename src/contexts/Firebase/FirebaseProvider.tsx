import React, { createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/firebase-analytics'
import 'firebase/firestore'


const app = firebase.initializeApp({
    apiKey: "AIzaSyCsjJ58KWfpkrE-DZJNT8ydWx_UfENMxL4",
    authDomain: "bunny-polygon.firebaseapp.com",
    projectId: "bunny-polygon",
    storageBucket: "bunny-polygon.appspot.com",
    messagingSenderId: "939405906302",
    appId: "1:939405906302:web:734a5595aa3cb89b1fe32f",
    measurementId: "G-GC56C84J3T"
})
firebase.analytics()

export interface FirebaseContext {
    app?: firebase.app.App
    uid?: string
}

export const Context = createContext<FirebaseContext>({ app: undefined, uid: undefined })

const FirebaseProvider: React.FC = ({ children }) => {
    return <Context.Provider value={{ app: app }}>{children}</Context.Provider>
}

export default FirebaseProvider
