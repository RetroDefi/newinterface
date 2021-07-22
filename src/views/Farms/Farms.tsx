import React, { lazy, Suspense } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import isEmpty from "lodash/isEmpty";
import { Page, PageHeader } from "./../../components/Page";
import usePools from "../../hooks/pools/usePools";
import FarmDetail from "./components/FarmDetail";
import { toDisplayBalanceComma, ZERO } from "../../bunny/utils";
import { assetIcons } from "../../assets/icons";
import { PARTNERS_LINK } from "../../bunny/lib/constants";
// import useDataPerf from '../../hooks/data/useDataPerf'
// import useDataTVL from '../../hooks/data/useDataTVL'
// import useDataMcap from '../../hooks/data/useDataMcap'
import LocalLoader from "../../components/LocalLoader";
import "./Farms.scss";

const FarmList = lazy(() => import("./components/FarmList"));

const Farms: React.FC = () => {
  const { path } = useRouteMatch();
  const { pools, total } = usePools();
  // const perfData = useDataPerf()
  // const mcapData = useDataMcap()
  const tvlData = ZERO; // useDataTVL()

  const getHeaderDescription = () => {
    return (
      <div className="farms-header">
        <div className="dashboard">
          <div className="stat tvl">
            <span className="value">
              $
              {toDisplayBalanceComma(
                total.eq(ZERO) ? tvlData : total,
                18,
                false
              )}
            </span>
            <span className="description">
              Total Deposited Value at RetroFarms
            </span>
          </div>
          {/*<div className='stat mcap'>*/}
          {/*    <span className='value'>${addComma(mcapData.toFixed(0))}</span>*/}
          {/*    <span className='description'>$BUNNY<br/>Market Cap</span>*/}
          {/*</div>*/}
          {/*<div className='stat perf'>*/}
          {/*    <span className='value'>${addComma(perfData.toFixed(0))}</span>*/}
          {/*    <span className='description'>Monthly Profits to<br/>$BUNNY lovers</span>*/}
          {/*</div>*/}
        </div>
        {/*<div className="partners">
          <div className="social-group">
            <img
              className="icon clickable no-select"
              src={assetIcons.discord}
              alt="discord"
              onClick={() => window.open(PARTNERS_LINK.discord, "_blank")}
            />

            <img
              className="icon clickable no-select"
              src={assetIcons.telegram}
              alt="telegram"
              onClick={() => window.open(PARTNERS_LINK.telegram, "_blank")}
            />

            <img
              className="icon clickable no-select"
              src={assetIcons.twitter}
              alt="twitter"
              onClick={() => window.open(PARTNERS_LINK.twitter, "_blank")}
            />
          </div>
              </div>*/}
      </div>
    );
  };

  const getFarmsRouted = () => {
    return (
      <>
        <Route exact path={path}>
          <PageHeader title="RetroDEFI QBERT Optimized Farms">
            {getHeaderDescription()}
          </PageHeader>
          <Suspense fallback={<LocalLoader />}>
            {!isEmpty(pools) ? <FarmList pools={pools} /> : <LocalLoader />}
          </Suspense>
        </Route>
        <Route path={`${path}/:identifier`}>
          <FarmDetail />
        </Route>
      </>
    );
  };

  return (
    <Switch>
      <Page>{getFarmsRouted()}</Page>
    </Switch>
  );
};

export default Farms;
