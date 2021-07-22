import React, { lazy, Suspense, useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from "react-router-dom";
import { SingletonHooksContainer } from "react-singleton-hook";
import { Provider } from "react-redux";

import { createWeb3ReactRoot, Web3ReactProvider } from "@web3-react/core";
import { NetworkContextName } from "./connections";
import getLibrary from "./connections/getLibrary";

import FirebaseProvider from "./contexts/Firebase";
import BunnyProvider from "./contexts/BunnyProvider";
import ModalsProvider from "./contexts/Modals";

import Web3ReactManager from "./components/Web3ReactManager";
import Popups from "./components/Popups";
import TopAlert from "./components/TopAlert/TopAlert";

import TransactionUpdater from "./state/transactions/updater";
import Web3SideProvider from "./contexts/Web3SideProvider";
import DataProvider from "./contexts/DataProvider";
import store from "./state";
import Background from "./body/background";
import BgImg from "./assets/background/bg-all.jpg";

const TopBar = lazy(() => import("./components/TopBar"));
const MobileMenu = lazy(() => import("./components/MobileMenu"));
const Earn = lazy(() => import("./views/Farms"));
const Zap = lazy(() => import("./views/Zap"));

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

if ("ethereum" in window) {
  (window.ethereum as any).autoRefreshOnNetworkChange = false;
}

const Web3Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ProviderNetwork getLibrary={getLibrary}>
        <Web3SideProvider>
          <Web3ReactManager>{children}</Web3ReactManager>
        </Web3SideProvider>
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

const Providers: React.FC = ({ children }) => {
  return (
    <FirebaseProvider>
      <DataProvider>
        <Provider store={store}>
          <Web3Providers>
            <TransactionUpdater />
            <BunnyProvider>
              <ModalsProvider>{children}</ModalsProvider>
            </BunnyProvider>
          </Web3Providers>
        </Provider>
      </DataProvider>
    </FirebaseProvider>
  );
};

const App: React.FC = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const handleDismissMobileMenu = useCallback(() => setMobileMenu(false), [
    setMobileMenu
  ]);
  const handlePresentMobileMenu = useCallback(() => setMobileMenu(true), [
    setMobileMenu
  ]);

  return (
    <div className="app-background">
      <div className="App">
        <main className="app preload">
          <Background />
          <Providers>
            <Suspense fallback={<div />}>
              <Router>
                <TopAlert />
                <TopBar onPresentMobileMenu={handlePresentMobileMenu} />
                <MobileMenu
                  onDismiss={handleDismissMobileMenu}
                  visible={mobileMenu}
                />

                <Switch>
                  {/*<Route path='/presale' component={Auction}/>*/}
                  <Route path="/zap" component={Zap} />
                  <Route path="/earn" component={Earn} />

                  <Route path="*">
                    <Redirect to="/earn" />
                  </Route>
                </Switch>
              </Router>
            </Suspense>

            <Popups />
            <SingletonHooksContainer />
          </Providers>
        </main>
      </div>
    </div>
  );
};

export default App;
