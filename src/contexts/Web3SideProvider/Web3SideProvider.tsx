import React, { createContext } from "react";
import { Web3Provider } from "@ethersproject/providers";
import { MiniRpcProvider } from "../../connections/NetworkConnector";
import { ChainId, polyRPC } from "../../connections/connectors";

export interface Web3SideProviderContext {
  polygon?: Web3Provider;
}

export const Context = createContext<Web3SideProviderContext>({
  polygon: undefined
});

const polyLibrary = new Web3Provider(
  new MiniRpcProvider(ChainId.POLY, polyRPC) as any
);

const Web3SideProvider: React.FC = ({ children }) => {
  return (
    <Context.Provider value={{ polygon: polyLibrary }}>
      {children}
    </Context.Provider>
  );
};

export default Web3SideProvider;
