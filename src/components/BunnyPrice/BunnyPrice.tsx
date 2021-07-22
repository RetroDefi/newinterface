import React from "react";
import { toDisplayBalance, ZERO } from "../../bunny/utils";
import { LinkBunnyTokenInfo } from "../../bunny/lib/constants";
import { assetTokens } from "../../assets/tokens";
import useBunnyPrice from "../../hooks/useBunnyPrice";
import "./BunnyPrice.scss";

const BunnyPrice: React.FC = () => {
  const priceBUNNY = useBunnyPrice();

  return (
    <div className="bunny-price no-select">
      {priceBUNNY.eq(ZERO) ? (
        <>
          <img src={assetTokens.polyBUNNY} alt="BUNNY Token" />
          <span className="unknown" role="img" aria-label="please wait">
            🐰🥕🚀
          </span>
        </>
      ) : (
        <>
          <img src={assetTokens.polyBUNNY} alt="BUNNY Token" />$
          {toDisplayBalance(priceBUNNY)}
        </>
      )}
    </div>
  );
};

export default BunnyPrice;
