import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { load, save } from "redux-localstorage-simple";
import application from "./application/reducer";
import transactions from "./transactions/reducer";

type MergedState = {
  transactions: {
    [key: string]: any;
  };
};

const PERSISTED_KEYS: string[] = ["transactions"];
const loadedState = load({
  states: PERSISTED_KEYS,
  disableWarnings: true
}) as MergedState;

const store = configureStore({
  reducer: {
    application,
    transactions
  },
  middleware: [
    ...getDefaultMiddleware({ thunk: false }),
    save({ states: PERSISTED_KEYS })
  ],
  preloadedState: loadedState
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
